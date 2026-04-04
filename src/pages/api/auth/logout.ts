import type { APIRoute } from "astro";
import { clearAuthCookies, cookieNames } from "@/lib/auth";
import { logout } from "@/lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const accessToken = cookies.get(cookieNames.access)?.value;

  if (accessToken) {
    try {
      await logout(accessToken);
    } catch {
      // continue and clear cookies even if upstream logout fails
    }
  }

  clearAuthCookies(cookies);
  return redirect("/");
};
