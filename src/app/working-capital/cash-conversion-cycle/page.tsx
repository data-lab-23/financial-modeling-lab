import type { Metadata } from "next";
import { WorkingCapitalFormulaTable } from "@/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalLessonLayout } from "@/components/working-capital/WorkingCapitalLessonLayout";
import { workingCapitalCase } from "@/data/working-capital-case";
const canonical = "https://data-lab-23.github.io/financial-modeling-lab/working-capital/cash-conversion-cycle";
export const metadata: Metadata = { title: "CCCの計算方法｜運転資金とExcel分析", description: "回収日数・在庫回転日数・支払日数からCCCを計算し、運転資金負担とキャッシュ・フローへの影響を分析します。", alternates: { canonical } };
const faqs = [
  { question: "CCCは短いほど必ず良いですか？", answer: "一般には資金効率が高まりますが、過度な在庫削減や仕入先への負担転嫁が事業継続性を損なわないか確認します。" },
  { question: "CCCだけで運転資金額を計算できますか？", answer: "CCCは日数指標です。金額を計算するには売上高・売上原価と各勘定の回転日数を使います。" },
] as const;
export default function Page() {
  const { actualResult, forecastResult } = workingCapitalCase;
  return (
    <WorkingCapitalLessonLayout href="/working-capital/cash-conversion-cycle" eyebrow="運転資本講座 04" title="CCCの計算と資金繰りへの影響" lead="売上代金の回収から仕入代金の支払いまでの資金拘束期間を分解し、改善余地を確認します。" faqs={faqs}>
      <h2>完成する成果物</h2><p>2026/3期70日、2027/3期75日のCCCを計算し、5日長期化した原因を勘定別に説明します。</p>
      <h2>実務上の使用場面</h2><p>同業他社比較、運転資金改善、買収後100日プラン、借入返済余力の検証で使用します。</p>
      <h2>数値例</h2><p>CCC＝回収日数＋在庫回転日数－支払日数です。2027/3期は50日＋65日－40日＝{forecastResult.cashConversionCycle.toFixed(1)}日です。</p>
      <h2>Excelでの実装</h2><p>各日数を前提条件シートから参照し、Excel数式は <code>=C5+C6-C7</code> とします。日数の変化と金額影響を同じ表で混在させません。</p>
      <WorkingCapitalFormulaTable rows={[
        { label: "2026/3期 CCC", formula: "45日＋60日－35日", excelFormula: "=B5+B6-B7", result: actualResult.cashConversionCycle, unit: "日" },
        { label: "2027/3期 CCC", formula: "50日＋65日－40日", excelFormula: "=C5+C6-C7", result: forecastResult.cashConversionCycle, unit: "日" },
      ]} />
      <h2>財務三表・DCFへの接続</h2><p>CCCは説明指標であり、CFへ直接入力しません。売掛金・棚卸資産・買掛金の残高を計算し、その前期差をFCFFへ反映します。</p>
      <h2>よくある誤り</h2><ul><li>買掛金支払日数を加算する</li><li>日数の改善をそのまま金額としてCFへ入れる</li><li>季節性の異なる企業を単純比較する</li></ul>
      <h2>レビュー時の確認項目</h2><ul><li>三つの日数が同じ期間・定義か</li><li>改善が顧客・仕入先・在庫のどこから生じるか</li><li>改善施策がBase / Upside / Downsideに整合するか</li></ul>
    </WorkingCapitalLessonLayout>
  );
}
