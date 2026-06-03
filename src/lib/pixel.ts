function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function sendCAPI(payload: {
  eventName: string;
  eventId: string;
  email?: string;
}): Promise<void> {
  await fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      sourceUrl: window.location.href,
      userAgent: navigator.userAgent,
    }),
  });
}

export function trackPageView(): void {
  const eventId = generateEventId();
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView", {}, { eventID: eventId });
  }
  sendCAPI({ eventName: "PageView", eventId }).catch(() => {});
}

export function trackLead(email: string): void {
  const eventId = generateEventId();
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {}, { eventID: eventId });
  }
  sendCAPI({ eventName: "Lead", eventId, email }).catch(() => {});
}
