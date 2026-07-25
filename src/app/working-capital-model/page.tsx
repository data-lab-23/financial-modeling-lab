import type { Metadata } from "next";
import Link from "next/link";
import { WorkingCapitalFormulaTable } from "@/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalLessonLayout } from "@/components/working-capital/WorkingCapitalLessonLayout";
import { workingCapitalCase, workingCapitalPages } from "@/data/working-capital-case";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/working-capital-model";
export const metadata: Metadata = {
  title: "運転資本モデルの作り方｜回転日数・Excel数式・計算例",
  description: "売掛金・棚卸資産・買掛金を回転日数で予測し、正味運転資本、CCC、キャッシュ・フローへ接続するExcel実装を数値例で解説します。",
  alternates: { canonical },
  openGraph: { title: "運転資本モデルの作り方", description: "回転日数とExcel数式で運転資本を予測します。", url: canonical, type: "article" },
};

const faqs = [
  { question: "運転資本は売上高比率で予測してよいですか？", answer: "概算には使えますが、実務モデルでは売掛金・棚卸資産・買掛金を回転日数で分け、契約条件と滞留状況を説明できる形にします。" },
  { question: "運転資本の増加はキャッシュ・フローでプラスですか？", answer: "正味運転資本の増加は資金が事業に拘束されるため、キャッシュ・フローではマイナスです。" },
] as const;

export default function Page() {
  const { actualResult, forecastResult } = workingCapitalCase;
  return (
    <WorkingCapitalLessonLayout
      href="/working-capital-model"
      eyebrow="運転資本モデル完全ガイド"
      title="運転資本モデルの作り方"
      lead="売掛金・棚卸資産・買掛金を回転日数から予測し、正味運転資本の増減をキャッシュ・フローとDCFへ接続します。"
      faqs={faqs}
    >
      <h2>完成する成果物</h2>
      <p>{workingCapitalCase.company}の2026/3期実績と2027/3期予測を使い、三勘定、正味運転資本、CCC、キャッシュ・フロー影響まで完成させます。</p>

      <h2>実務上の使用場面</h2>
      <ul>
        <li>事業計画で売上成長に必要な追加運転資金を見積もる</li>
        <li>M&Aモデルで買収後の資金繰りと借入返済余力を検証する</li>
        <li>DCFでFCFFに反映する運転資本増減を計算する</li>
      </ul>

      <h2>2026/3期から2027/3期の数値例</h2>
      <div className="data-scroll">
        <table className="data-table min-w-[680px]">
          <thead><tr><th>項目</th><th>2026/3期</th><th>2027/3期</th><th>増減</th></tr></thead>
          <tbody>
            <tr><td>売上高</td><td>1,200.0</td><td>1,320.0</td><td>+120.0</td></tr>
            <tr><td>売掛金</td><td>{actualResult.receivables.toFixed(1)}</td><td>{forecastResult.receivables.toFixed(1)}</td><td>{(forecastResult.receivables - actualResult.receivables).toFixed(1)}</td></tr>
            <tr><td>棚卸資産</td><td>{actualResult.inventory.toFixed(1)}</td><td>{forecastResult.inventory.toFixed(1)}</td><td>{(forecastResult.inventory - actualResult.inventory).toFixed(1)}</td></tr>
            <tr><td>買掛金</td><td>{actualResult.payables.toFixed(1)}</td><td>{forecastResult.payables.toFixed(1)}</td><td>{(forecastResult.payables - actualResult.payables).toFixed(1)}</td></tr>
            <tr><td>正味運転資本</td><td>{actualResult.netWorkingCapital.toFixed(1)}</td><td>{forecastResult.netWorkingCapital.toFixed(1)}</td><td>{(forecastResult.netWorkingCapital - actualResult.netWorkingCapital).toFixed(1)}</td></tr>
            <tr><td>CCC</td><td>{actualResult.cashConversionCycle.toFixed(1)}日</td><td>{forecastResult.cashConversionCycle.toFixed(1)}日</td><td>+{(forecastResult.cashConversionCycle - actualResult.cashConversionCycle).toFixed(1)}日</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Excelでの実装</h2>
      <p>01_前提条件に売上高、売上原価、三つの回転日数を入力し、勘定別シートでは入力値を再入力せず参照します。表示は百万円・小数第1位ですが、内部計算値は丸めません。</p>
      <WorkingCapitalFormulaTable rows={[
        { label: "売掛金", formula: "売上高÷365日×回収日数", excelFormula: "=C5/C10*C7", result: forecastResult.receivables },
        { label: "棚卸資産", formula: "売上原価÷365日×在庫回転日数", excelFormula: "=C6/C10*C8", result: forecastResult.inventory },
        { label: "買掛金", formula: "売上原価÷365日×支払日数", excelFormula: "=C6/C10*C9", result: forecastResult.payables },
        { label: "正味運転資本", formula: "売掛金＋棚卸資産－買掛金", excelFormula: "=SUM(C5:C6)-C7", result: forecastResult.netWorkingCapital },
      ]} />

      <h2>財務三表・DCFへの接続</h2>
      <p>予測期の正味運転資本が前期から増えたため、CFでは{Math.abs(workingCapitalCase.cashFlowImpact).toFixed(1)}百万円のマイナスです。この金額は営業CFとFCFFの双方へ同じ符号で接続します。</p>

      <h2>よくある誤り</h2>
      <ul><li>売上高比率だけで三勘定を一括予測する</li><li>買掛金増加をCFマイナスにする</li><li>表示上の丸め値を次の計算へ使う</li><li>滞留債権・滞留在庫を通常残高へ混在させる</li></ul>

      <h2>レビュー時の確認項目</h2>
      <ul><li>回転日数が契約条件と実績推移に整合しているか</li><li>売上原価と仕入高の定義差を確認したか</li><li>正味運転資本増減とCF影響が符号反転しているか</li><li>Base / Upside / Downsideで回転日数も変動させたか</li></ul>

      <h2>勘定別の実装へ進む</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {workingCapitalPages.slice(1).map((page) => (
          <Link key={page.href} href={page.href} className="callout">
            <strong>{page.title}</strong><br /><span className="text-sm text-[#607080]">{page.description}</span>
          </Link>
        ))}
      </div>
    </WorkingCapitalLessonLayout>
  );
}
