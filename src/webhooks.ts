import type {
  WebhookEvent,
  MessageWebhookEvent,
  ReactionWebhookEvent,
  TypingWebhookEvent,
  PaymentWebhookEvent,
  FacetimeWebhookEvent,
} from "./types.js";

/**
 * Verify a webhook signature using HMAC-SHA256.
 * Works in Node.js 18+ using the built-in `crypto` module.
 */
export async function verifyWebhookSignature(
  payload: string | Uint8Array,
  signature: string,
  secret: string,
): Promise<boolean> {
  const crypto = await import("node:crypto");
  const payloadBytes =
    typeof payload === "string" ? Buffer.from(payload, "utf-8") : payload;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payloadBytes)
    .digest("hex");

  // Constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

/**
 * Parse and return a typed webhook event from a raw JSON body.
 */
export function parseWebhookEvent(body: string | Record<string, unknown>): WebhookEvent {
  const parsed: unknown = typeof body === "string" ? JSON.parse(body) : body;
  return parsed as WebhookEvent;
}

// ── Type Guards ──

export function isMessageEvent(event: WebhookEvent): event is MessageWebhookEvent {
  return event.type.startsWith("message.");
}

export function isReactionEvent(event: WebhookEvent): event is ReactionWebhookEvent {
  return event.type.startsWith("reaction.");
}

export function isTypingEvent(event: WebhookEvent): event is TypingWebhookEvent {
  return event.type.startsWith("typing.");
}

export function isPaymentEvent(event: WebhookEvent): event is PaymentWebhookEvent {
  return event.type.startsWith("payment.");
}

export function isFacetimeEvent(event: WebhookEvent): event is FacetimeWebhookEvent {
  return event.type.startsWith("facetime.");
}
