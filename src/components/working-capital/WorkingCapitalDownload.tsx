import { workingCapitalWorkbook } from "@/data/working-capital-case";

export function WorkingCapitalDownload() {
  return (
    <aside className="mt-8 rounded-2xl bg-[#102235] p-6 text-white" aria-labelledby="working-capital-download">
      <p className="text-xs font-bold tracking-[.12em] text-white/65">Excel教材</p>
      <h2 id="working-capital-download" className="mt-2 text-2xl font-bold text-white">
        運転資本モデルをダウンロード
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/75">
        売掛金・棚卸資産・買掛金・正味運転資本・CCCを同じ前提条件から計算する8シート構成です。
      </p>
      <a
        href={workingCapitalWorkbook.href}
        download={workingCapitalWorkbook.filename}
        className="mt-5 inline-flex rounded-full bg-white px-5 py-3 font-bold text-[#102235]"
      >
        {workingCapitalWorkbook.filename}
      </a>
      <p className="mt-3 text-xs text-white/55">教育目的・実案件への利用不可｜更新日：{workingCapitalWorkbook.updated}</p>
    </aside>
  );
}
