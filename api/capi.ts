import { createHash } from "crypto";

type Req = {
  method: string;
  body: {
    eventName: string;
    eventId: string;
    sourceUrl: string;
    email?: string;
    userAgent?: string;
  };
  headers: Record<string, string | string[] | undefined>;
  socket: { remoteAddress?: string };
};

type Res = {
  status(code: number): Res;
  json(data: unknown): void;
};

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
const GRAPH_URL = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Silently succeed so missing config never breaks the client
    return res.status(200).json({ ok: true });
  }

  const { eventName, eventId, sourceUrl, email, userAgent } = req.body;

  const rawIp = req.headers["x-forwarded-for"];
  const clientIp =
    typeof rawIp === "string"
      ? rawIp.split(",")[0].trim()
      : (req.socket?.remoteAddress ?? undefined);

  const userData: Record<string, unknown> = {};
  if (clientIp) userData.client_ip_address = clientIp;
  if (userAgent) userData.client_user_agent = userAgent;
  if (email) userData.em = [sha256(email)];

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: userData,
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(GRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: "Meta CAPI error", detail: data });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Failed to reach Meta CAPI" });
  }
}
