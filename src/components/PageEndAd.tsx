import { AdUnit } from "@/components/AdUnit";
import { getAdSenseConfig } from "@/lib/adsense";

export function PageEndAd() {
  const { client, articleSlot } = getAdSenseConfig();
  if (!client || !articleSlot) return null;

  return (
    <div className="container">
      <AdUnit client={client} slot={articleSlot} placement="site-end" />
    </div>
  );
}
