type EnvKey =
  | "PUBLIC_SITE_URL"
  | "PUBLIC_SUPABASE_URL"
  | "PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET";

const optional = (value: string | undefined) => value?.trim() ?? "";

/**
 * Supports both build-time injection (`import.meta.env`) and runtime process env lookup.
 * - Astro/Workers build-time variables are usually available on `import.meta.env`.
 * - Some runtimes/tools expose env vars through `process.env`.
 */
function readEnv(key: EnvKey) {
  const importMetaValue = (import.meta.env[key] as string | undefined) ?? "";
  const processValue = typeof process !== "undefined" ? process.env?.[key] ?? "" : "";

  return optional(importMetaValue || processValue || undefined);
}

export const env = {
  publicSiteUrl: readEnv("PUBLIC_SITE_URL"),
  supabaseUrl: readEnv("PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  stripeSecretKey: readEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: readEnv("STRIPE_WEBHOOK_SECRET"),
};

export const hasSupabasePublicConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasServerCommerceConfig = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey && env.stripeSecretKey && env.publicSiteUrl,
);
