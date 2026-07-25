import type { Metadata } from "next";
import Link from "next/link";
import { practicalCase, practicalDownloads, practicalWorkflow } from "@/data/practical-case";

export const metadata: Metadata = {
  alternates: { canonical: "https://data-lab-23.github.io/financial-modeling-lab/" },
};

export default function Home() {
  return (
    <>
      <section className="border-b border-[#d8e0e5] bg-white">
        <div className="container grid gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="eyebrow">共通案件で学ぶ財務モデリング</div>
            <h1 aria-label="資料受領から財務三表モデル完成まで" className="mt-4 text-4xl font-bold leading-[1.16] tracking-[-.05em] text-[#102235] md:text-6xl">
              資料受領から<br /><span className="text-[#147d73]">財務三表モデル完成まで</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#607080]">
              {practicalCase.company}（架空）の月次試算表、販売実績、固定資産、借入金明細を確認し、
              5年間のPL・BS・CFとBase / Upside / Downsideを作成します。数式だけでなく、確認事項とレビュー指摘まで扱います。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button" href="/learning-roadmap">案件を開始する</Link>
              {practicalDownloads.map((item, index) => (
                <Link key={item.file} className={index === 0 ? "button secondary" : "button green"} href={`/downloads/${item.file}`}>
                  {index === 0 ? "受領資料を取得" : "完成モデルを確認"}
                </Link>
              ))}
            </div>
          </div>
          <div className="card overflow-hidden self-center">
            <div className="bg-[#217346] px-4 py-3 font-bold text-white">案件概要｜{practicalCase.company}</div>
            <div className="data-scroll border-0">
              <table className="data-table min-w-[520px]">
                <tbody>
                  <tr><th>事業</th><td>{practicalCase.business}</td></tr>
                  <tr><th>実績基準期</th><td>{practicalCase.actual.year}</td></tr>
                  <tr><th>売上高</th><td className="number">{practicalCase.actual.revenue.toLocaleString("ja-JP")} {practicalCase.unit}</td></tr>
                  <tr><th>EBITDA</th><td className="number">{practicalCase.actual.ebitda.toLocaleString("ja-JP")} {practicalCase.unit}</td></tr>
                  <tr><th>予測期間</th><td>{practicalCase.forecastYears[0]}～{practicalCase.forecastYears.at(-1)}</td></tr>
                  <tr><th>最終成果物</th><td>統合財務三表モデル、品質判定、指摘事項一覧</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f7f8f6]">
        <div className="container py-14">
          <div className="eyebrow">実務の作業順序</div>
          <h2 className="section-title mt-2">8工程で完成させる</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {practicalWorkflow.map((stage) => (
              <Link key={stage.id} href={stage.href} className="border border-[#d8e0e5] bg-white p-5 hover:border-[#147d73]">
                <span className="font-mono font-bold text-[#147d73]">{String(stage.no).padStart(2, "0")}</span>
                <h3 className="mt-2 font-bold text-[#102235]">{stage.title}</h3>
                <p className="mt-2 text-sm text-[#607080]">{stage.deliverables.join("、")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container py-14">
        <div className="eyebrow">分野別ガイド</div>
        <h2 className="section-title mt-2 mb-8">学習テーマから探す</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["財務モデリング", "/financial-modeling", "三表モデルの基礎と実務設計"],
            ["Valuation", "/valuation", "DCFと類似会社比較による価値評価"],
            ["M&Aモデル", "/ma-modeling", "案件論点とモデルレビュー"],
            ["Excel教材", "/excel-templates", "受領資料、完成モデル、演習ファイル"],
          ].map(([title, href, body]) => (
            <Link key={href} href={href} className="border border-[#d8e0e5] bg-white p-5 hover:border-[#147d73]">
              <h2 className="text-xl font-bold text-[#102235]">{title}</h2>
              <p className="mt-2 text-sm text-[#607080]">{body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
