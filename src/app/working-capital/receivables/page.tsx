import type { Metadata } from "next";
import { WorkingCapitalFormulaTable } from "@/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalLessonLayout } from "@/components/working-capital/WorkingCapitalLessonLayout";
import { workingCapitalCase } from "@/data/working-capital-case";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/working-capital/receivables";
export const metadata: Metadata = { title: "売掛金の予測方法｜回収日数とExcel数式", description: "売上高と回収日数から売掛金を予測し、延滞債権や回収条件をExcelモデルへ反映する方法を数値例で解説します。", alternates: { canonical } };
const faqs = [
  { question: "売掛金回収日数はどの売上高を使いますか？", answer: "原則は掛売上高を使います。現金売上が重要な場合は総売上高から分けて計算します。" },
  { question: "延滞債権は通常の回収日数に含めますか？", answer: "通常残高と延滞債権を分け、延滞分は個別回収計画または回収不能見込みで評価します。" },
] as const;
export default function Page() {
  const result = workingCapitalCase.forecastResult.receivables;
  return (
    <WorkingCapitalLessonLayout href="/working-capital/receivables" eyebrow="運転資本講座 01" title="売掛金の予測と回収日数" lead="売上高と回収条件から売掛金残高を予測し、回収遅延が資金繰りへ与える影響を確認します。" faqs={faqs}>
      <h2>完成する成果物</h2><p>2027/3期の売掛金残高を180.8百万円と計算し、前期差をCFへ接続します。</p>
      <h2>実務上の使用場面</h2><p>月次資金繰り、事業計画、買収後の運転資金検証で、売上成長と回収条件の変化を分けて説明します。</p>
      <h2>数値例</h2><p>売上高1,320百万円、回収日数50日、年間365日です。売掛金＝売上高÷365日×回収日数により、{result.toFixed(1)}百万円となります。</p>
      <h2>Excelでの実装</h2><p>売上高はPL、回収日数は前提条件シートから参照します。Excel数式は <code>=C5/C10*C7</code> とし、売掛金＝売上高÷365日×回収日数を再現します。</p>
      <WorkingCapitalFormulaTable rows={[{ label: "売掛金", formula: "売上高÷365日×回収日数", excelFormula: "=C5/C10*C7", result }]} />
      <h2>財務三表・DCFへの接続</h2><p>売掛金増加はBS資産の増加、CFではマイナス、FCFFでも運転資本増加として控除します。</p>
      <h2>よくある誤り</h2><ul><li>現金売上を含む総売上高を無調整で使う</li><li>延滞債権を通常回収日数へ混在させる</li><li>消費税込み・税抜き残高の定義を混ぜる</li></ul>
      <h2>レビュー時の確認項目</h2><ul><li>契約上の支払条件と実績回収日数の差</li><li>上位顧客の集中と延滞状況</li><li>貸倒引当金控除前後の残高定義</li></ul>
    </WorkingCapitalLessonLayout>
  );
}
