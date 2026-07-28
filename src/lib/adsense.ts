export type AdSenseConfig = {
  client?: string;
  articleSlot?: string;
  publisherId?: string;
};

const CLIENT_PATTERN = /^ca-pub-\d{16}$/;
const SLOT_PATTERN = /^\d{10}$/;
const PUBLISHER_PATTERN = /^\d{16}$/;

export function parseAdSenseConfig(input: {
  client?: string;
  articleSlot?: string;
  publisherId?: string;
}): AdSenseConfig {
  const client = input.client?.trim();
  const articleSlot = input.articleSlot?.trim();
  const publisherId = input.publisherId?.trim();

  return {
    ...(client && CLIENT_PATTERN.test(client) ? { client } : {}),
    ...(articleSlot && SLOT_PATTERN.test(articleSlot) ? { articleSlot } : {}),
    ...(publisherId && PUBLISHER_PATTERN.test(publisherId) ? { publisherId } : {}),
  };
}

export function getAdSenseConfig(): AdSenseConfig {
  return parseAdSenseConfig({
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    articleSlot: process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT,
    publisherId: process.env.ADSENSE_PUBLISHER_ID,
  });
}

export function adSenseScriptUrl(client: string) {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
}
