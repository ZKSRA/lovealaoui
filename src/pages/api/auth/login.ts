import type { APIRoute } from "astro";
import { setAuthCookies } from "@/lib/auth";
import { hasSupabasePublicConfig } from "@/lib/env";
import { loginWithEmail } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/my-deck");

  if (!email || !password) {
    return redirect("/login?error=missing_fields");
  }

  if (!hasSupabasePublicConfig()) {
    console.error("[login] missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
    return redirect("/login?error=missing_supabase_config");
  }

  let result;
  try {
    result = await loginWithEmail(email, password);
  } catch (error) {
    console.error("[login] unexpected login error", error);
    return redirect("/login?error=login_unavailable");
  }

  const message = result.error?.message?.toLowerCase() ?? "";
  if (message.includes("email not confirmed") || message.includes("email_not_confirmed")) {
    return redirect("/login?error=email_not_confirmed");
  }

  if (result.error || !result.session) {
    console.error("[login] login_failed", result.error?.message ?? "missing_session");
    return redirect("/login?error=login_failed");
  }

  setAuthCookies(cookies, result.session);
  return redirect(next);
};
