import type { Metadata } from "next";
import { WorkingCapitalFormulaTable } from "@/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalLessonLayout } from "@/components/working-capital/WorkingCapitalLessonLayout";
import { workingCapitalCase } from "@/data/working-capital-case";
const canonical = "https://data-lab-23.github.io/financial-modeling-lab/working-capital/payables";
export const metadata: Metadata = { title: "買掛金の予測方法｜支払日数とExcel数式", description: "売上原価と支払日数から買掛金を予測し、仕入条件と資金繰りへの影響をExcelモデルへ反映します。", alternates: { canonical }, openGraph: { title: "買掛金の予測方法｜支払日数とExcel数式", description: "売上原価と支払日数から買掛金を予測し、仕入条件と資金繰りへの影響をExcelモデルへ反映します。", url: canonical, type: "article" } };
const faqs = [
  { question: "買掛金は売上原価から計算してよいですか？", answer: "簡便法では可能ですが、外注費や在庫増減が重要なら仕入高ベースへ調整します。" },
  { question: "支払日数を長くすれば価値は上がりますか？", answer: "短期的にはCFが改善しますが、契約条件や仕入先との関係を超えた延長は継続可能ではありません。" },
] as const;
export default function Page() {
  const result = workingCapitalCase.forecastResult.payables;
  return (
    <WorkingCapitalLessonLayout href="/working-capital/payables" eyebrow="運転資本講座 03" title="買掛金の予測と支払日数" lead="売上原価と仕入条件から買掛金を予測し、支払サイト変更の継続可能性を確認します。" faqs={faqs}>
      <h2>完成する成果物</h2><p>2027/3期の買掛金を86.8百万円と計算し、増加分をCFプラスとして接続します。</p>
      <h2>実務上の使用場面</h2><p>資金繰り、仕入条件の交渉、買収後の運転資金正常化で、通常条件と一時的な支払遅延を区別します。</p>
      <h2>数値例</h2><p>売上原価792百万円、支払日数40日です。買掛金＝売上原価÷365日×支払日数により、{result.toFixed(1)}百万円となります。</p>
      <h2>Excelでの実装</h2><p>Excel数式は <code>=C6/C10*C9</code> です。仕入高が売上原価と大きく異なる場合は、在庫増減を考慮した仕入高へ差し替えます。</p>
      <WorkingCapitalFormulaTable rows={[{ label: "買掛金", formula: "売上原価÷365日×支払日数", excelFormula: "=C6/C10*C9", result }]} />
      <h2>財務三表・DCFへの接続</h2><p>買掛金増加はBS負債の増加で、CFとFCFFではプラスです。売掛金・棚卸資産とは符号が逆になります。</p>
      <h2>よくある誤り</h2><ul><li>買掛金増加をCFマイナスにする</li><li>売上原価と仕入高の差を無視する</li><li>一時的な支払遅延を恒常前提にする</li></ul>
      <h2>レビュー時の確認項目</h2><ul><li>主要仕入先との契約条件</li><li>期末日の休日・締め日の影響</li><li>未払金や未払費用との科目区分</li></ul>
    </WorkingCapitalLessonLayout>
  );
}
