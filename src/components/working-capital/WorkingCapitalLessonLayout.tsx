import Link from "next/link";
import type { ReactNode } from "react";
import { WorkingCapitalDownload } from "./WorkingCapitalDownload";
import { WorkingCapitalNavigation } from "./WorkingCapitalNavigation";
import type { WorkingCapitalHref } from "@/data/working-capital-case";

const SITE_ROOT = "https://data-lab-23.github.io/financial-modeling-lab";

export function WorkingCapitalLessonLayout({
  href,
  eyebrow,
  title,
  lead,
  children,
  faqs,
}: {
  href: WorkingCapitalHref;
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
  faqs: readonly { question: string; answer: string }[];
}) {
  const articleUrl = `${SITE_ROOT}${href}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: lead,
    inLanguage: "ja",
    mainEntityOfPage: articleUrl,
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "Finance Modeling Lab 編集部" },
    publisher: { "@type": "Organization", name: "Finance Modeling Lab 編集部" },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_ROOT}/` },
      { "@type": "ListItem", position: 2, name: "財務モデリング", item: `${SITE_ROOT}/financial-modeling` },
      { "@type": "ListItem", position: 3, name: title, item: articleUrl },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <article>
      <section className="border-b border-[#d8e0e5] bg-[#f3f7f8]">
        <div className="container py-12 md:py-16">
          <nav aria-label="パンくずリスト" className="text-sm text-[#607080]">
            <Link href="/">ホーム</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/financial-modeling">財務モデリング</Link>
          </nav>
          <p className="mt-8 text-xs font-bold tracking-[.16em] text-[#147d73]">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-[#102235] md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#405466]">{lead}</p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#607080]">
            <div><dt className="sr-only">著者</dt><dd>Finance Modeling Lab 編集部</dd></div>
            <div><dt className="sr-only">公開日</dt><dd>公開日：2026-07-26</dd></div>
            <div><dt className="sr-only">更新日</dt><dd>更新日：2026-07-26</dd></div>
          </dl>
        </div>
      </section>
      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="article-body min-w-0">
          {children}
          <WorkingCapitalDownload />
          <WorkingCapitalNavigation currentHref={href} />
          <section className="mt-10 border-t border-[#d8e0e5] pt-8">
            <h2>よくある質問</h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <section key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </section>
              ))}
            </div>
          </section>
          <section className="mt-10 border-t border-[#d8e0e5] pt-8">
            <h2>編集情報</h2>
            <p>著者：Finance Modeling Lab 編集部</p>
            <p>変更履歴：2026-07-26に数値例、Excel数式、モデルチェック、教材を公開しました。</p>
            <p>
              参考資料：IAS 1、IAS 2、IAS 7、IFRS 9およびMicrosoft Excel数式ガイド。
              教育目的の一般情報であり、個別案件への助言ではありません。
            </p>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-[#d8e0e5] bg-white p-5 lg:sticky lg:top-24">
          <p className="text-xs font-bold tracking-[.12em] text-[#607080]">この講座で確認すること</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>具体的な数値例</li>
            <li>Excelでの実装</li>
            <li>財務三表・DCFへの接続</li>
            <li>よくある誤り</li>
            <li>レビュー時の確認項目</li>
          </ul>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </article>
  );
}
