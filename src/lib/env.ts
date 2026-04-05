type EnvKey =
  | "PUBLIC_SITE_URL"
  | "PUBLIC_SUPABASE_URL"
  | "PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET";

type RuntimeEnv = Partial<Record<EnvKey, string>>;

const optional = (value: unknown) => (typeof value === "string" ? value.trim() : "");

let runtimeEnv: RuntimeEnv = {};

// Called from middleware/routes when runtime bindings are available.
export function setRuntimeEnv(bindings: RuntimeEnv | undefined) {
  runtimeEnv = bindings ?? {};
}

function readEnv(key: EnvKey) {
  const runtimeValue = optional(runtimeEnv[key]);
  const importMetaValue = optional(import.meta.env[key]);
  const processValue = optional(typeof process !== "undefined" ? process.env?.[key] : undefined);

  return runtimeValue || importMetaValue || processValue;
}

export const env = {
  get publicSiteUrl() {
    return readEnv("PUBLIC_SITE_URL");
  },
  get supabaseUrl() {
    return readEnv("PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return readEnv("PUBLIC_SUPABASE_ANON_KEY");
  },
  get supabaseServiceRoleKey() {
    return readEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get stripeSecretKey() {
    return readEnv("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return readEnv("STRIPE_WEBHOOK_SECRET");
  },
};

export const hasSupabasePublicConfig = () => Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasServerCommerceConfig = () =>
  Boolean(env.supabaseUrl && env.supabaseServiceRoleKey && env.stripeSecretKey && env.publicSiteUrl);
