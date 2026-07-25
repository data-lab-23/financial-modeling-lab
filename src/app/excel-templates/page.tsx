import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";

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
  return <TopicHub topic="excel" eyebrow="Excel教材" title="Excel教材で、手を動かして理解する" lead="読むだけで終わらせず、前提の入力、三表の連動、チェックの流れをExcelで確かめます。共通案件の受領資料から完成モデルまで、実務の順序で選べます。" learningSteps={["受領資料の差異と不足を確認する", "PL・BS・CFを実務の順序で連動させる", "完成モデルと指摘事項でレビューする"]} />;
}
