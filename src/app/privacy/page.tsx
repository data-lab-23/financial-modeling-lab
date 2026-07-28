import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/privacy", {
  title: "プライバシーポリシー",
  description: "Finance Modeling Labのアクセス解析、第三者配信広告、Cookie、アフィリエイトリンク、個人情報の取り扱いについて。",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <div className="eyebrow">プライバシーポリシー</div>
      <h1 className="mt-3 text-4xl font-bold">プライバシーポリシー</h1>
      <div className="prose mt-8 space-y-8">
        <section>
          <h2>アクセス解析について</h2>
          <p>
            Finance Modeling Labでは、サイト改善と利用状況の分析のため、Google Analyticsを使用する場合があります。
            Google AnalyticsはCookie等を利用して、ページ閲覧、流入元、利用端末などの情報を収集することがあります。
          </p>
        </section>
        <section>
          <h2>収集した情報の利用目的</h2>
          <p>
            収集した情報は、人気ページの把握、コンテンツ改善、導線改善、サイト品質の向上のために利用します。
            個人を特定する目的では利用しません。
          </p>
        </section>
        <section>
          <h2>イベント計測について</h2>
          <p>
            Amazonリンク、Excelテンプレート、講座、問い合わせ、ニュースレター登録などのCTAクリックを、サイト改善のために計測する場合があります。
          </p>
        </section>
        <section>
          <h2>第三者配信広告について</h2>
          <p>
            当サイトでは、第三者配信広告サービスのGoogle AdSenseを利用する場合があります。
            Googleを含む第三者配信事業者は、Cookie、ウェブビーコン、IPアドレスなどの識別情報を使用し、
            当サイトまたは他のウェブサイトへの過去のアクセス情報に基づいて広告を配信することがあります。
          </p>
        </section>
        <section>
          <h2>広告Cookieとパーソナライズ広告</h2>
          <p>
            Googleの広告Cookieにより、Googleとそのパートナーは、利用者による当サイトまたは他のサイトへのアクセス情報に基づいて
            パーソナライズ広告を表示できる場合があります。利用者は
            <a href="https://adssettings.google.com/" rel="noopener noreferrer" className="font-bold text-[#147d73] underline underline-offset-4">
              Googleの広告設定
            </a>
            からパーソナライズ広告を無効にできます。
          </p>
          <p>
            Googleによる広告Cookie等の利用方法は、
            <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" className="font-bold text-[#147d73] underline underline-offset-4">
              Googleの広告に関するポリシー
            </a>
            をご確認ください。
          </p>
        </section>
        <section>
          <h2>国外からのアクセスと同意管理</h2>
          <p>
            欧州経済領域、英国、スイスなど同意取得が必要な地域からのアクセスには、Google AdSenseの
            「プライバシーとメッセージ」で設定したGoogle認定の同意管理機能を利用します。
          </p>
        </section>
        <section>
          <h2>アフィリエイトリンクについて</h2>
          <p>
            当サイトには、将来的にAmazonアソシエイト等のアフィリエイトリンクを含む場合があります。
            リンク先の商品・サービスの購入、契約、利用については、リンク先事業者の条件をご確認ください。
          </p>
        </section>
        <section>
          <h2>免責</h2>
          <p>
            当サイトの情報は教育目的で提供しています。実案件では、会計士、税理士、弁護士などの専門家と、対象会社固有の事実関係をご確認ください。
          </p>
        </section>
      </div>
    </div>
  );
}
