import type { MetadataRoute } from "next";
import { lessons } from "@/data/site";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-lab-23.github.io/financial-modeling-lab";
const lastModified = new Date("2026-07-22T00:00:00+09:00");
const searchVisibilityModified = new Date("2026-07-25T00:00:00+09:00");
const workingCapitalModified = new Date("2026-07-26T00:00:00+09:00");
const workingCapitalPaths = [
  "/working-capital-model",
  "/working-capital/receivables",
  "/working-capital/inventory",
  "/working-capital/payables",
  "/working-capital/cash-conversion-cycle",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/learning-roadmap", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/three-statements", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/working-capital-model", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/working-capital/receivables", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/working-capital/inventory", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/working-capital/payables", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/working-capital/cash-conversion-cycle", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/journal-lab", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/quality-standard", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/downloads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/downloads/dcf-valuation-model", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/financial-modeling", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/valuation", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/ma-modeling", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/excel-templates", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/private-company-valuation", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/comps-peer-selection", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf/fcff", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf/wacc", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf/terminal-value", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf/sensitivity-analysis", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/valuation/dcf/enterprise-to-equity", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/books", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/request", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/editorial-policy", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    ...lessons.map((lesson) => ({
      path: `/${lesson.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
  ];

  return paths.map((item) => ({
    url: `${base}${item.path}`,
    lastModified: workingCapitalPaths.includes(item.path)
      ? workingCapitalModified
      : ["/three-statements", "/valuation/dcf", "/comps-peer-selection"].includes(item.path)
        ? searchVisibilityModified
        : lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
