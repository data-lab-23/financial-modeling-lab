import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl = "https://data-lab-23.github.io/financial-modeling-lab/";
const siteName = "Finance Modeling Lab";
const siteDescription = "非上場企業の財務モデリング、Valuation、Excel実装を、数値例とダウンロード教材で学ぶ実務メディア。";

export function createRootMetadata(
  verificationToken = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: siteDescription,
    keywords: ["財務モデリング", "三表モデル", "DCF", "Excel", "非上場企業", "M&A"],
    verification: verificationToken ? { google: verificationToken } : undefined,
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName,
      title: siteName,
      description: siteDescription,
      url: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const metadata: Metadata = createRootMetadata();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: siteName,
  url: siteUrl,
  description: siteDescription,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  name: siteName,
  alternateName: "ファイナンス・モデリング・ラボ",
  url: siteUrl,
  inLanguage: "ja",
  publisher: { "@id": `${siteUrl}#organization` },
};

function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd) }} />
        <a className="skip-link" href="#main-content">本文へスキップ</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
