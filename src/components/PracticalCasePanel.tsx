import Link from "next/link";
import { practicalCase, practicalDownloads, practicalWorkflow } from "@/data/practical-case";

export function PracticalCasePanel({ stageId }: { stageId: string }) {
  const stage = practicalWorkflow.find((item) => item.id === stageId);
  if (!stage) throw new Error(`Unknown practical stage: ${stageId}`);

  return (
    <section className="my-10 border border-[#c9d5da] bg-[#f7f8f6] p-5 md:p-7" aria-labelledby={`practical-${stage.id}`}>
      <div className="eyebrow">共通実務案件・工程 {String(stage.no).padStart(2, "0")}</div>
      <h2 id={`practical-${stage.id}`} className="mt-2 text-2xl font-bold text-[#102235]">
        {practicalCase.company}：{stage.title}
      </h2>
      <p className="mt-3 text-[#465968]">{stage.purpose}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="border border-[#d8e0e5] bg-white p-4">
          <h3 className="font-bold text-[#102235]">使用する受領資料</h3>
          <ul className="mt-2 text-sm text-[#607080]">{stage.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="border border-[#d8e0e5] bg-white p-4">
          <h3 className="font-bold text-[#102235]">この工程の成果物</h3>
          <ul className="mt-2 text-sm text-[#607080]">{stage.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="border border-[#d8e0e5] bg-white p-4">
          <h3 className="font-bold text-[#102235]">Excelでの実装</h3>
          <ul className="mt-2 font-mono text-sm text-[#465968]">{stage.excel.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="border border-[#d8e0e5] bg-white p-4">
          <h3 className="font-bold text-[#102235]">確認項目</h3>
          <ul className="mt-2 text-sm text-[#607080]">{stage.checks.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className="callout warning mt-4">
        <strong>レビュアーからの指摘例</strong><br />
        {stage.reviewComment}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {practicalDownloads.map((item) => (
          <Link key={item.file} href={`/downloads/${item.file}`} className="button secondary">
            {item.file}
          </Link>
        ))}
        {stage.nextHref ? <Link href={stage.nextHref} className="button green">次の工程へ進む</Link> : null}
      </div>
    </section>
  );
}
