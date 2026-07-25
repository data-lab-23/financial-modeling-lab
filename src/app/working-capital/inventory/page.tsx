import type { Metadata } from "next";
import { WorkingCapitalFormulaTable } from "@/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalLessonLayout } from "@/components/working-capital/WorkingCapitalLessonLayout";
import { workingCapitalCase } from "@/data/working-capital-case";
const canonical = "https://data-lab-23.github.io/financial-modeling-lab/working-capital/inventory";
export const metadata: Metadata = { title: "棚卸資産の予測方法｜在庫回転日数とExcel数式", description: "売上原価と在庫回転日数から棚卸資産を予測し、滞留在庫・季節性・評価減をExcelモデルへ反映します。", alternates: { canonical } };
const faqs = [
  { question: "在庫回転日数には売上高と売上原価のどちらを使いますか？", answer: "棚卸資産は原価で計上されるため、通常は売上原価を使います。" },
  { question: "滞留在庫は回転日数へ含めますか？", answer: "通常在庫と分け、処分・販売・評価減の計画を個別に置く方が説明しやすくなります。" },
] as const;
export default function Page() {
  const result = workingCapitalCase.forecastResult.inventory;
  return (
    <WorkingCapitalLessonLayout href="/working-capital/inventory" eyebrow="運転資本講座 02" title="棚卸資産の予測と在庫回転日数" lead="売上原価と在庫方針から棚卸資産を予測し、増産・季節性・滞留在庫を切り分けます。" faqs={faqs}>
      <h2>完成する成果物</h2><p>2027/3期の棚卸資産を141.0百万円と計算し、在庫回転日数の長期化をCFへ反映します。</p>
      <h2>実務上の使用場面</h2><p>製造業・小売業の事業計画、在庫削減施策、買収後の余剰在庫確認で使用します。</p>
      <h2>数値例</h2><p>売上原価792百万円、在庫回転日数65日です。棚卸資産＝売上原価÷365日×在庫回転日数により、{result.toFixed(1)}百万円となります。</p>
      <h2>Excelでの実装</h2><p>Excel数式は <code>=C6/C10*C8</code> とし、通常在庫と滞留在庫を別の行へ分けます。</p>
      <WorkingCapitalFormulaTable rows={[{ label: "棚卸資産", formula: "売上原価÷365日×在庫回転日数", excelFormula: "=C6/C10*C8", result }]} />
      <h2>財務三表・DCFへの接続</h2><p>棚卸資産増加はBS資産の増加、CFとFCFFではマイナスです。評価減を置く場合はPLへの費用計上との二重反映を避けます。</p>
      <h2>よくある誤り</h2><ul><li>売上高を分母に使う</li><li>季節性のピーク残高と期末残高を混同する</li><li>評価減と数量削減を二重に反映する</li></ul>
      <h2>レビュー時の確認項目</h2><ul><li>原材料・仕掛品・製品の構成</li><li>滞留期間別の在庫残高</li><li>生産リードタイムと安全在庫方針</li></ul>
    </WorkingCapitalLessonLayout>
  );
}
