/**
 * The App Store listing, in one place.
 *
 * ÉCHO 1.0 went live on 29 September 2026. Before that the site carried
 * "coming in 2026" copy and every download CTA scrolled to the waitlist
 * instead, which is why this constant did not exist.
 *
 * The id is 6806377088. An earlier id (6766782667) is wrong — it is not this
 * app and returns nothing from the App Store lookup API. It shipped in the iOS
 * app's Share sheet in 1.0; do not copy it from anywhere.
 */
export const APP_STORE_URL =
  "https://apps.apple.com/app/écho-by-réaclyse-ai-mirror/id6806377088";

/** Props every outbound App Store link needs, so none of them forget `rel`. */
export const APP_STORE_LINK_PROPS = {
  href: APP_STORE_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
