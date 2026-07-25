import Link from "next/link";
import {
  workingCapitalPages,
  type WorkingCapitalHref,
} from "@/data/working-capital-case";

export function WorkingCapitalNavigation({ currentHref }: { currentHref: WorkingCapitalHref }) {
  const currentIndex = workingCapitalPages.findIndex((page) => page.href === currentHref);
  const previous = currentIndex > 0 ? workingCapitalPages[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < workingCapitalPages.length - 1
    ? workingCapitalPages[currentIndex + 1]
    : undefined;

  return (
    <nav aria-label="運転資本講座" className="mt-10 rounded-2xl border border-[#d8e0e5] bg-white p-5">
      <p className="text-xs font-bold tracking-[.12em] text-[#607080]">運転資本講座</p>
      <Link href="/working-capital-model" className="mt-2 inline-block font-bold text-[#147d73] underline underline-offset-4">
        運転資本モデルの作り方
      </Link>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link href={previous.href} className="rounded-xl bg-[#f3f7f8] p-3 font-bold text-[#102235]">
            ← {previous.shortTitle}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={next.href} className="rounded-xl bg-[#f3f7f8] p-3 text-right font-bold text-[#102235]">
            {next.shortTitle} →
          </Link>
        ) : <span />}
      </div>
    </nav>
  );
}
