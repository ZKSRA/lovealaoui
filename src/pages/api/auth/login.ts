import type { APIRoute } from "astro";
import { setAuthCookies } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/env";
import { getSafeNextPath, withQuery } from "@/lib/navigation";
import { loginWithEmail, type AuthResult } from "@/lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ redirect, url }) => {
  const next = getSafeNextPath(url.searchParams.get("next"));
  return redirect(withQuery("/login", { next }));
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(String(formData.get("next") ?? "/my-deck"));
  const redirectToLogin = (error: string) => redirect(withQuery("/login", { error, next }));

  if (!email || !password) {
    return redirectToLogin("missing_fields");
  }

  if (!hasSupabasePublicConfig()) {
    console.error("[login] missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
    return redirectToLogin("missing_supabase_config");
  }

  let result: AuthResult;
  try {
    result = await loginWithEmail(email, password);
  } catch (error) {
    console.error("[login] unexpected login error", error);
    return redirectToLogin("login_unavailable");
  }

  const message = result.error?.message?.toLowerCase() ?? "";
  if (message.includes("email not confirmed") || message.includes("email_not_confirmed")) {
    return redirectToLogin("email_not_confirmed");
  }

  if (result.error || !result.session) {
    console.error("[login] login_failed", result.error?.message ?? "missing_session");
    return redirectToLogin("login_failed");
  }

  setAuthCookies(cookies, result.session);
  return redirect(next);
};
