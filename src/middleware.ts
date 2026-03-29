import { defineMiddleware } from "astro:middleware";
import { getSessionUser } from "@/lib/auth";
import { setRuntimeEnv } from "@/lib/env";

function getRuntimeBindings(context: Parameters<Parameters<typeof defineMiddleware>[0]>[0]) {
  const fromLocals = (context.locals as { runtime?: { env?: Record<string, unknown> } } | undefined)?.runtime
    ?.env;
  const fromContext = (context as { runtime?: { env?: Record<string, unknown> } } | undefined)?.runtime?.env;

  const candidate = fromLocals ?? fromContext;
  if (!candidate) return undefined;

  const knownKeys = [
    "PUBLIC_SITE_URL",
    "PUBLIC_SUPABASE_URL",
    "PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ] as const;

  const sanitized: Record<string, string> = {};

  for (const key of knownKeys) {
    const raw = candidate[key];
    if (typeof raw === "string") {
      sanitized[key] = raw;
    }
  }

  return sanitized;
}

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    setRuntimeEnv(getRuntimeBindings(context));

    try {
      context.locals.user = await getSessionUser(context.cookies);
    } catch {
      context.locals.user = null;
    }

    return await next();
  } catch {
    // Avoid taking down the entire app because of middleware/runtime-env wiring.
    setRuntimeEnv(undefined);
    context.locals.user = null;
    return next();
  }
});
