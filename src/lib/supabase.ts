import { createClient, type Session, type User } from "@supabase/supabase-js";
import { env, hasSupabasePublicConfig } from "./env";

function assertPublicConfig() {
  if (!hasSupabasePublicConfig()) {
    throw new Error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
  }
}

type AppUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: AppUser;
};

export type AuthResult = {
  session: AuthSession | null;
  user: AppUser | null;
  error?: { message?: string };
};

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("supabase_timeout"), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function createSupabaseAuthClient() {
  assertPublicConfig();

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetchWithTimeout(String(input), init ?? {}),
    },
  });
}

function normalizeUser(user: User | null): AppUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? undefined,
  };
}

function normalizeSession(session: Session | null): AuthSession | null {
  if (!session) return null;

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: {
      id: session.user.id,
      email: session.user.email ?? undefined,
    },
  };
}

function normalizeAuthResult(params: {
  session: Session | null;
  user: User | null;
  error: { message?: string } | null;
}): AuthResult {
  return {
    session: normalizeSession(params.session),
    user: normalizeUser(params.user),
    error: params.error ? { message: params.error.message } : undefined,
  };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.signUp({ email, password });

    return normalizeAuthResult({
      session: data.session,
      user: data.user,
      error,
    });
  } catch {
    return { session: null, user: null, error: { message: "Supabase signup request timed out or failed" } };
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    return normalizeAuthResult({
      session: data.session,
      user: data.user,
      error,
    });
  } catch {
    return { session: null, user: null, error: { message: "Supabase login request timed out or failed" } };
  }
}

export async function getUserByAccessToken(accessToken: string) {
  try {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.getUser(accessToken);

    if (error) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function logout(accessToken: string) {
  assertPublicConfig();
  await fetchWithTimeout(
    `${env.supabaseUrl}/auth/v1/logout`,
    {
      method: "POST",
      headers: {
        apikey: env.supabaseAnonKey,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
    8000,
  ).catch(() => null);
}

const serviceHeaders = () => {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    apikey: env.supabaseServiceRoleKey,
    Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };
};

export async function hasPurchase(userId: string, productSlug: string) {
  assertPublicConfig();
  const query = new URLSearchParams({
    select: "id",
    user_id: `eq.${userId}`,
    product_slug: `eq.${productSlug}`,
    limit: "1",
  });

  const response = await fetchWithTimeout(`${env.supabaseUrl}/rest/v1/purchases?${query.toString()}`, {
    headers: serviceHeaders(),
  }).catch(() => null);

  if (!response?.ok) return false;

  const rows = (await response.json().catch(() => [])) as Array<{ id: string }>;
  return rows.length > 0;
}

export async function upsertPurchase(params: {
  userId: string;
  productSlug: string;
  stripeSessionId: string;
  amountTotal: number;
  currency: string;
}) {
  assertPublicConfig();
  const response = await fetchWithTimeout(`${env.supabaseUrl}/rest/v1/purchases`, {
    method: "POST",
    headers: {
      ...serviceHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: params.userId,
      product_slug: params.productSlug,
      stripe_session_id: params.stripeSessionId,
      amount_total: params.amountTotal,
      currency: params.currency,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    throw new Error("Failed to upsert purchase record.");
  }
}
