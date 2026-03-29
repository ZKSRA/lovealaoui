import { env, hasSupabasePublicConfig } from "./env";

function assertPublicConfig() {
  if (!hasSupabasePublicConfig) {
    throw new Error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
  }
}

const authHeaders = () => ({
  apikey: env.supabaseAnonKey,
  "Content-Type": "application/json",
});

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
  };
};

export type AuthResult = {
  session: AuthSession | null;
  user: AuthSession["user"] | null;
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

async function parseAuthResponse(response: Response): Promise<AuthResult> {
  const data = (await response.json().catch(() => null)) as AuthResult | null;

  if (!response.ok || !data) {
    return {
      session: null,
      user: null,
      error: { message: data?.error?.message ?? `Supabase auth request failed (${response.status})` },
    };
  }

  return data;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  assertPublicConfig();

  try {
    const response = await fetchWithTimeout(`${env.supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        Authorization: `Bearer ${env.supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    return parseAuthResponse(response);
  } catch {
    return { session: null, user: null, error: { message: "Supabase signup request timed out or failed" } };
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  assertPublicConfig();

  try {
    const response = await fetchWithTimeout(`${env.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        Authorization: `Bearer ${env.supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    return parseAuthResponse(response);
  } catch {
    return { session: null, user: null, error: { message: "Supabase login request timed out or failed" } };
  }
}

export async function getUserByAccessToken(accessToken: string) {
  assertPublicConfig();

  try {
    const response = await fetchWithTimeout(`${env.supabaseUrl}/auth/v1/user`, {
      headers: {
        ...authHeaders(),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return null;
    return response.json();
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
        ...authHeaders(),
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
