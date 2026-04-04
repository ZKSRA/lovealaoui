import type { APIRoute } from "astro";
import { setAuthCookies } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/env";
import { signUpWithEmail } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/my-deck");

  if (!email || !password) {
    return redirect("/signup?error=missing_fields");
  }

  if (!hasSupabasePublicConfig()) {
    console.error("[signup] missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
    return redirect("/signup?error=missing_supabase_config");
  }

  let result;
  try {
    result = await signUpWithEmail(email, password);
  } catch (error) {
    console.error("[signup] unexpected signup error", error);
    return redirect("/signup?error=signup_unavailable");
  }

  if (result.error) {
    console.error("[signup] signup_failed", result.error.message ?? "unknown_error");
  if (result.error || !result.session) {
    console.error("[signup] signup_failed", result.error?.message ?? "missing_session");
    return redirect("/signup?error=signup_failed");
  }

  if (result.session) {
    setAuthCookies(cookies, result.session);
    return redirect(next);
  }

  // Supabase can return `user` with no `session` when email confirmation is required.
  if (result.user) {
    return redirect("/signup?notice=check_email");
  }

  return redirect("/signup?error=signup_failed");
};
