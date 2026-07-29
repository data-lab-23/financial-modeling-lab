import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { AdSenseScript } from "../src/components/AdSenseScript";
import { AdUnit } from "../src/components/AdUnit";
import { adSenseScriptUrl, parseAdSenseConfig } from "../src/lib/adsense";
import { ArticleShell } from "../src/components/article-shell";
import { DcfLessonShell } from "../src/components/DcfLessonShell";
import { WorkingCapitalLessonLayout } from "../src/components/working-capital/WorkingCapitalLessonLayout";
import PrivacyPage from "../src/app/privacy/page";
import { SiteFooter } from "../src/components/site-footer";
import { PageEndAd } from "../src/components/PageEndAd";
import { buildAdsTxt, publisherIdFromClient } from "../src/lib/ads-txt";

const completeConfig = parseAdSenseConfig({
  client: "ca-pub-1234567890123456",
  articleSlot: "1234567890",
  publisherId: "1234567890123456",
});
assert.deepEqual(completeConfig, {
  client: "ca-pub-1234567890123456",
  articleSlot: "1234567890",
  publisherId: "1234567890123456",
});

assert.deepEqual(parseAdSenseConfig({
  client: "pub-invalid",
  articleSlot: "slot-invalid",
  publisherId: "publisher-invalid",
}), {});

assert.equal(renderToStaticMarkup(<AdSenseScript client="" />), "");
assert.equal(renderToStaticMarkup(<AdUnit client="" slot="" placement="article-end" />), "");

assert.equal(
  adSenseScriptUrl(completeConfig.client),
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
);

const adMarkup = renderToStaticMarkup(
  <AdUnit
    client={completeConfig.client}
    slot={completeConfig.articleSlot}
    placement="article-end"
  />,
);
assert.match(adMarkup, /data-ad-placement="article-end"/);
assert.match(adMarkup, /data-ad-client="ca-pub-1234567890123456"/);
assert.match(adMarkup, /data-ad-slot="1234567890"/);
assert.match(adMarkup, /data-ad-layout="in-article"/);
assert.match(adMarkup, /data-ad-format="fluid"/);
assert.doesNotMatch(adMarkup, /data-full-width-responsive/);
assert.match(adMarkup, />広告</);
assert.equal((adMarkup.match(/adsbygoogle/g) ?? []).length, 1);

process.env.NEXT_PUBLIC_ADSENSE_CLIENT = completeConfig.client;
process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT = completeConfig.articleSlot;

for (const [name, page] of [
  ["standard article", (
    <ArticleShell key="standard" no="02" href="/assumptions" title="前提条件" lead="前提条件の説明" sections={[]}>
      <p>記事本文</p>
    </ArticleShell>
  )],
  ["DCF lesson", (
    <DcfLessonShell
      key="dcf"
      number="01"
      href="/valuation/dcf/fcff"
      title="FCFF"
      lead="FCFFの説明"
      readingTime="10分"
      previous={{ href: "/valuation/dcf", label: "DCF" }}
      next={{ href: "/valuation/dcf/wacc", label: "WACC" }}
    >
      <p>記事本文</p>
    </DcfLessonShell>
  )],
  ["working capital lesson", (
    <WorkingCapitalLessonLayout
      key="working-capital"
      href="/working-capital-model"
      eyebrow="運転資本"
      title="運転資本モデル"
      lead="運転資本の説明"
      faqs={[]}
    >
      <p>記事本文</p>
    </WorkingCapitalLessonLayout>
  )],
] as const) {
  const markup = renderToStaticMarkup(page);
  assert.equal(
    (markup.match(/data-ad-placement="article-end"/g) ?? []).length,
    1,
    `${name} must render one article-end ad`,
  );
  assert.match(markup, /data-ad-client="ca-pub-1234567890123456"/);
  assert.match(markup, /data-ad-slot="1234567890"/);
}

assert.equal(publisherIdFromClient("ca-pub-1234567890123456"), "1234567890123456");
assert.equal(publisherIdFromClient("invalid"), undefined);
assert.equal(
  buildAdsTxt("1234567890123456"),
  "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n",
);
assert.equal(buildAdsTxt("invalid"), "");

const privacyMarkup = renderToStaticMarkup(<PrivacyPage />);
for (const expected of ["第三者配信広告", "広告Cookie", "パーソナライズ広告", "広告設定"]) {
  assert.ok(privacyMarkup.includes(expected), `privacy policy must include ${expected}`);
}
assert.match(renderToStaticMarkup(<SiteFooter />), /href="\/privacy"/);

const rootMarkup = renderToStaticMarkup(<PageEndAd />);
assert.equal(
  (rootMarkup.match(/data-ad-placement="site-end"/g) ?? []).length,
  1,
  "every page must render one site-end ad when configured",
);

const envExample = readFileSync(".env.example", "utf8");
const workflow = readFileSync(".github/workflows/deploy-pages.yml", "utf8");
for (const content of [envExample, workflow]) {
  assert.match(content, /NEXT_PUBLIC_ADSENSE_CLIENT/);
  assert.match(content, /NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT/);
}

console.log("AdSense validation passed");
