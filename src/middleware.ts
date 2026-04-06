import type { MiddlewareHandler } from "astro";
import { env as cloudflareEnv } from "cloudflare:workers";
import { getSessionUser } from "@/lib/auth";
import { setRuntimeEnv } from "@/lib/env";

export const onRequest: MiddlewareHandler = async (context, next) => {
  setRuntimeEnv(cloudflareEnv as Record<string, string> | undefined);

  try {
    context.locals.user = await getSessionUser(context.cookies);
  } catch {
    context.locals.user = null;
  }

  return next();
};
