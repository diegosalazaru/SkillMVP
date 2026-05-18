import Script from "next/script";
import { ANALYTICS_DOMAIN } from "../../config/analytics";

export function AnalyticsLoader() {
  if (!ANALYTICS_DOMAIN) {
    return null;
  }

  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={ANALYTICS_DOMAIN}
      strategy="afterInteractive"
    />
  );
}
