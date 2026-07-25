import type { Metadata } from "next";
import { DownloadCard } from "@/components/DownloadCard";
import { downloads } from "@/data/lab";
import { practicalDownloads } from "@/data/practical-case";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/downloads", {
  title: "ダウンロードセンター",
  description: "財務モデリング演習に使えるExcelファイルをダウンロードできます。",
});

export default function DownloadsPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">Excel教材一覧</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">ダウンロードセンター</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        仕訳演習、前提条件入力、PL、BS/CF統合、完成3表モデル、DCF、品質チェックリストをExcel形式で配布します。すべて教育目的のサンプルファイルです。
      </p>
      <div className="callout mt-8">
        <strong>東都精密工業の実務ケースを更新しました</strong><br />
        受領資料パックにはPL・BS全科目の試算表と勘定科目対応表を収録しています。完成三表モデルは2026年3月期から2030年3月期まで5年間完全連動し、貸借一致、CF・BS現預金一致、固定資産、借入金、前提根拠を数式による自動チェックで確認できます。
      </div>
      <div className="mt-10 grid gap-5">
        {[...practicalDownloads, ...downloads].map((item) => <DownloadCard key={item.file} item={item} />)}
      </div>
      <div className="callout warning mt-10">
        <strong>利用条件</strong><br />計算整合性を確認できる教材ですが、判定は「教育用・実案件への利用不可」です。実案件の判断、会計・税務・投資判断を代替するものではありません。Excelで開いた際は数式を再計算し、機密情報を入力した状態で第三者へ共有しないでください。
      </div>
    </div>
  );
}
