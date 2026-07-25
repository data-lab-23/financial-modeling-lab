import type { Metadata } from "next";
import { PracticalCasePanel } from "@/components/PracticalCasePanel";
import { DownloadCard } from "@/components/DownloadCard";
import { practicalDownloads, practicalQualityGate } from "@/data/practical-case";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/quality-standard", {
  title: "モデル品質基準と提出可否判定",
  description: "Critical・Major・Minorの指摘事項とReady・Ready with caveats・Not readyの提出可否で財務モデルをレビューします。",
});

export default function QualityStandardPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">レビューと引継ぎ</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">モデル品質基準と提出可否判定</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        点数だけで良否を決めず、意思決定への影響と未解決事項から提出可否を判定します。指摘事項、担当者、期限、対応状況を残し、変更履歴とともに引き継ぎます。
      </p>
      <PracticalCasePanel stageId="quality" />
      <section className="mt-10">
        <h2 className="section-title">提出可否</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {practicalQualityGate.readiness.map((item) => (
            <article key={item.name} className="border border-[#d8e0e5] bg-white p-5">
              <h3 className="text-xl font-bold text-[#102235]">{item.name}</h3>
              <p className="mt-2 text-sm text-[#607080]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="section-title">指摘事項の重要度</h2>
        <div className="mt-5 data-scroll">
          <table className="data-table">
            <thead><tr><th>重要度</th><th>定義</th><th>対応</th></tr></thead>
            <tbody>
              {practicalQualityGate.severities.map((item, index) => (
                <tr key={item.name}><td><strong>{item.name}</strong></td><td>{item.description}</td><td>{index === 0 ? "提出前に必ず解消" : index === 1 ? "修正または留意点を明示" : "次回更新時の改善可"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="callout"><strong>指摘事項一覧</strong><br />番号、シート・セル、内容、重要度、担当者、期限、対応状況、確認者を記録します。</div>
        <div className="callout"><strong>変更履歴</strong><br />版、更新日、更新者、変更内容、影響範囲、再確認したチェックを記録します。</div>
      </section>
      <div className="mt-10"><DownloadCard item={practicalDownloads[1]} /></div>
    </div>
  );
}
