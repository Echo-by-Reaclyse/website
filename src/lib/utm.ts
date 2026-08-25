const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UTMParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "echo_utm";

/** Call once on page mount — reads URL params and persists to sessionStorage. */
export function captureUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  UTM_KEYS.forEach((key) => {
    const val = params.get(key);
    if (val) utm[key] = val;
  });
  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    } catch {}
  }
  return utm;
}

/** Retrieve previously captured UTM params (survives same-tab navigation). */
export function getStoredUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UTMParams) : {};
  } catch {
    return {};
  }
}
