import type { Metadata } from "next";
import Link from "next/link";
import { TopicHub } from "@/components/TopicHub";
import { workingCapitalWorkbook } from "@/data/working-capital-case";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/excel-templates";
const title = "Excel教材・テンプレート";
const description = "仕訳から財務三表、類似会社比較、モデル品質チェックまで、財務モデリング学習用のExcel教材をまとめています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
};

export default function ExcelTemplatesPage() {
  return (
    <>
      <TopicHub
        topic="excel"
        eyebrow="Excel教材"
        title="Excel教材で、手を動かして理解する"
        lead="読むだけで終わらせず、前提の入力、三表の連動、チェックの流れをExcelで確かめます。共通案件の受領資料から完成モデルまで、実務の順序で選べます。"
        learningSteps={[
          "受領資料の差異と不足を確認する",
          "PL・BS・CFを実務の順序で連動させる",
          "完成モデルと指摘事項でレビューする",
        ]}
      />

      <section className="container pb-16" aria-labelledby="working-capital-workbook">
        <div className="rounded-2xl border border-[#d7e0e8] bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold tracking-[.12em] text-[#536579]">新しいExcel教材</p>
          <h2 id="working-capital-workbook" className="mt-2 text-2xl font-bold text-[#102235]">
            運転資本モデル
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#526170]">
            売掛金・棚卸資産・買掛金・CCCを、共通の売上高・売上原価・回転日数から一貫して計算します。
            予測BS、FCFF、資金繰りを作る前に、前提条件と計算式のつながりを確認できる教材です。
          </p>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-[#f4f7f9] p-4">
              <dt className="font-bold text-[#536579]">構成</dt>
              <dd className="mt-1 text-[#102235]">8シート</dd>
            </div>
            <div className="rounded-xl bg-[#f4f7f9] p-4">
              <dt className="font-bold text-[#536579]">更新日</dt>
              <dd className="mt-1 text-[#102235]">{workingCapitalWorkbook.updated}</dd>
            </div>
            <div className="rounded-xl bg-[#f4f7f9] p-4">
              <dt className="font-bold text-[#536579]">利用条件</dt>
              <dd className="mt-1 text-[#102235]">教育目的・実案件への利用不可</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={workingCapitalWorkbook.href}
              download={workingCapitalWorkbook.filename}
              className="inline-flex rounded-full bg-[#102235] px-5 py-3 text-sm font-bold text-white"
            >
              working-capital-model.xlsx
            </Link>
            <Link
              href="/working-capital-model"
              className="inline-flex rounded-full border border-[#102235] px-5 py-3 text-sm font-bold text-[#102235]"
            >
              解説ページを読む
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
