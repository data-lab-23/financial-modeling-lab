import { AdSenseInitializer } from "@/components/AdSenseInitializer";
import { getAdSenseConfig } from "@/lib/adsense";

export function AdUnit({
  client = getAdSenseConfig().client,
  slot = getAdSenseConfig().articleSlot,
  placement,
}: {
  client?: string;
  slot?: string;
  placement: "article-end" | "site-end";
}) {
  if (!client || !slot) return null;

  return (
    <aside className="ad-unit" aria-label="広告" data-ad-placement={placement}>
      <span className="ad-label">広告</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
      <AdSenseInitializer />
    </aside>
  );
}
