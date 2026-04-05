import type { APIRoute } from "astro";
import { setAuthCookies } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/env";
import { getSafeNextPath, withQuery } from "@/lib/navigation";
import { signUpWithEmail, type AuthResult } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(String(formData.get("next") ?? "/my-deck"));
  const redirectToSignup = (params: { error?: string; notice?: string }) =>
    redirect(withQuery("/signup", { ...params, next }));

  if (!email || !password) {
    return redirectToSignup({ error: "missing_fields" });
  }

  if (!hasSupabasePublicConfig()) {
    console.error("[signup] missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
    return redirectToSignup({ error: "missing_supabase_config" });
  }

  let result: AuthResult;
  try {
    result = await signUpWithEmail(email, password);
  } catch (error) {
    console.error("[signup] unexpected signup error", error);
    return redirectToSignup({ error: "signup_unavailable" });
  }

  if (result.session) {
    setAuthCookies(cookies, result.session);
    return redirect(next);
  }

  // Supabase can return `user` with no `session` when email confirmation is required.
  if (result.user) {
    return redirectToSignup({ notice: "check_email" });
  }

  if (result.error) {
    console.error("[signup] signup_failed", result.error.message ?? "unknown_error");
  }

  return redirectToSignup({ error: "signup_failed" });
};
