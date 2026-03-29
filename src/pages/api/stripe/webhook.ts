import type { APIRoute } from "astro";
import { env } from "@/lib/env";
import { upsertPurchase } from "@/lib/supabase";

export const prerender = false;

const textEncoder = new TextEncoder();

function parseStripeSignatureHeader(header: string | null) {
  if (!header) return null;

  const pairs = header.split(",").map((segment) => segment.trim());
  const timestamp = pairs.find((value) => value.startsWith("t="))?.slice(2);
  const signatures = pairs
    .filter((value) => value.startsWith("v1="))
    .map((value) => value.slice(3))
    .filter(Boolean);

  if (!timestamp || signatures.length === 0) {
    return null;
  }

  return { timestamp, signatures };
}

async function computeStripeSignature(secret: string, signedPayload: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(signedPayload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyStripeWebhookSignature(request: Request, rawBody: string) {
  if (!env.stripeWebhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  const parsed = parseStripeSignatureHeader(request.headers.get("stripe-signature"));
  if (!parsed) {
    return false;
  }

  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const expected = await computeStripeSignature(env.stripeWebhookSecret, signedPayload);

  return parsed.signatures.some((candidate) => candidate === expected);
}

export const POST: APIRoute = async ({ request }) => {
  if (!env.stripeSecretKey || !env.supabaseServiceRoleKey) {
    return new Response("Missing Stripe/Supabase server configuration", { status: 500 });
  }

  const rawBody = await request.text();
  const signatureValid = await verifyStripeWebhookSignature(request, rawBody);

  if (!signatureValid) {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  const payload = JSON.parse(rawBody) as {
    type?: string;
    data?: {
      object?: {
        id?: string;
        amount_total?: number;
        currency?: string;
        metadata?: { user_id?: string; product_slug?: string };
      };
    };
  };

  if (payload.type !== "checkout.session.completed") {
    return new Response("Ignored", { status: 200 });
  }

  const session = payload.data?.object;
  const userId = session?.metadata?.user_id;
  const productSlug = session?.metadata?.product_slug;

  if (!session?.id || !userId || !productSlug || !session.amount_total || !session.currency) {
    return new Response("Invalid session metadata", { status: 400 });
  }

  await upsertPurchase({
    userId,
    productSlug,
    stripeSessionId: session.id,
    amountTotal: session.amount_total,
    currency: session.currency,
  });

  return new Response("ok", { status: 200 });
};
