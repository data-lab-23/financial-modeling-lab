import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCard } from "@/components/DownloadCard";
import { practicalCase, practicalDownloads, practicalWorkflow } from "@/data/practical-case";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("/learning-roadmap", {
  title: "実務案件型・学習ロードマップ",
  description: "受領資料の確認から財務三表モデルの提出可否判定まで、共通の製造業案件を8工程で学ぶロードマップ。",
});

export default function LearningRoadmapPage() {
  return (
    <div className="container py-14">
      <div className="eyebrow">資料受領から提出まで</div>
      <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] text-[#102235] md:text-5xl">実務案件型・学習ロードマップ</h1>
      <p className="mt-5 max-w-3xl text-lg text-[#607080]">
        {practicalCase.company}を共通ケースとして、受領資料の確認、実績整理、前提条件、PL、BS、CF、三表連動、品質判定を順に進めます。
        各工程では「入力資料」「Excel作業」「成果物」「完了条件」を明示します。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {practicalDownloads.map((item) => <DownloadCard key={item.file} item={item} />)}
      </div>
      <section className="mt-10 grid gap-4">
        {practicalWorkflow.map((stage) => (
          <article key={stage.id} data-practical-stage={stage.id} className="grid gap-5 border border-[#d8e0e5] bg-white p-5 lg:grid-cols-[90px_1fr_230px]">
            <div className="font-mono text-4xl font-bold text-[#147d73]">{String(stage.no).padStart(2, "0")}</div>
            <div>
              <h2 className="text-2xl font-bold text-[#102235]">{stage.title}</h2>
              <p className="mt-2 text-sm text-[#607080]">{stage.purpose}</p>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><dt className="font-bold text-[#102235]">入力資料</dt><dd className="text-[#607080]">{stage.inputs.join("、")}</dd></div>
                <div><dt className="font-bold text-[#102235]">成果物</dt><dd className="text-[#607080]">{stage.deliverables.join("、")}</dd></div>
                <div><dt className="font-bold text-[#102235]">Excel作業</dt><dd className="text-[#607080]">{stage.excel.join("／")}</dd></div>
                <div><dt className="font-bold text-[#102235]">完了条件</dt><dd className="text-[#607080]">{stage.checks.join("／")}</dd></div>
              </dl>
            </div>
            <Link href={stage.href} className="button green self-center">工程の解説を読む</Link>
          </article>
        ))}
      </section>
    </div>
  );
}
