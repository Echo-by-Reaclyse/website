// ── GA4 ──────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let ga4Initialised = false;

/**
 * Initialise GA4. Call once from the root component if VITE_GA4_ID is set.
 * Safe to call multiple times — initialises only once.
 */
export function initGA4(measurementId: string): void {
  if (typeof window === "undefined" || ga4Initialised || !measurementId) return;
  ga4Initialised = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

// ── Event helpers ─────────────────────────────────────────────────────────────

function gtag(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

/** Track a GA4 page view (call on route change). */
export function trackGA4PageView(path: string, title?: string): void {
  gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

// ── Custom events (sent to both GA4 and Meta Pixel where applicable) ──────────

/** User clicked any CTA button (tracks label + location). */
export function trackCTAClick(label: string, section: string): void {
  gtag("event", "cta_click", { label, section });
}

/** User focused the email input field for the first time. */
export function trackFormStart(formId: string): void {
  gtag("event", "form_start", { form_id: formId });
}

/** User successfully submitted the waitlist form. */
export function trackFormSubmit(formId: string): void {
  gtag("event", "form_submit", { form_id: formId });
}

/** A landing-page section scrolled into view. */
export function trackSectionView(sectionName: string): void {
  gtag("event", "section_view", { section: sectionName });
}
