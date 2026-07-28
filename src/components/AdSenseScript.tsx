import Script from "next/script";
import { adSenseScriptUrl, getAdSenseConfig } from "@/lib/adsense";

export function AdSenseScript({
  client = getAdSenseConfig().client,
}: {
  client?: string;
}) {
  if (!client) return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={adSenseScriptUrl(client)}
    />
  );
}
