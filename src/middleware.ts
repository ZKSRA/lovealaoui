import type { MiddlewareHandler } from "astro";
import { env as cloudflareEnv } from "cloudflare:workers";
import { getSessionUser } from "@/lib/auth";
import { setRuntimeEnv } from "@/lib/env";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const runtimeBindings =
    ((context.locals as { runtime?: { env?: Record<string, string> } }).runtime?.env as
      | Record<string, string>
      | undefined) ??
    ((context as { runtime?: { env?: Record<string, string> } }).runtime?.env as
      | Record<string, string>
      | undefined) ??
    (cloudflareEnv as Record<string, string> | undefined);

  setRuntimeEnv(runtimeBindings);

  try {
    context.locals.user = await getSessionUser(context.cookies);
  } catch {
    context.locals.user = null;
  }

  return next();
};
