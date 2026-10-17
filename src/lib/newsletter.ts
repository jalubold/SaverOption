/**
 * Newsletter provider adapter. The signup form posts to /api/newsletter,
 * which calls `subscribe`. Add a provider by extending the switch below.
 */

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "not-configured" | "provider-error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function newsletterProvider(): string | undefined {
  return process.env.NEWSLETTER_PROVIDER || undefined;
}

export async function subscribe(email: string): Promise<SubscribeResult> {
  if (!isValidEmail(email)) {
    return { ok: false, reason: "invalid", message: "Please enter a valid email address." };
  }

  switch (newsletterProvider()) {
    case "buttondown": {
      const apiKey = process.env.BUTTONDOWN_API_KEY;
      if (!apiKey) break;
      const res = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email }),
      });
      // 409 for an existing subscriber is still a success from the reader's point of view.
      if (res.ok || res.status === 409) return { ok: true };
      return { ok: false, reason: "provider-error", message: "We couldn't sign you up right now. Please try again later." };
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[newsletter] No provider configured — would subscribe ${email}`);
    return { ok: true };
  }
  return {
    ok: false,
    reason: "not-configured",
    message: "The newsletter isn't open yet. Please check back soon.",
  };
}
