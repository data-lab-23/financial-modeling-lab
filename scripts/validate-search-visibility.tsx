import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ThreeStatementsPage, { metadata as threeStatementsMetadata } from "../src/app/three-statements/page";
import DcfPage, { metadata as dcfMetadata } from "../src/app/valuation/dcf/page";
import CompsPage, { metadata as compsMetadata } from "../src/app/comps-peer-selection/page";

const layoutSource = readFileSync("src/app/layout.tsx", "utf8");
assert.match(layoutSource, /export function createRootMetadata/);
assert.match(layoutSource, /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
assert.match(layoutSource, /verificationToken \? \{ google: verificationToken \} : undefined/);
assert.match(layoutSource, /"@type": "WebSite"/);
assert.match(layoutSource, /"@type": "Organization"/);
assert.match(layoutSource, /Finance Modeling Lab/);

assert.equal(threeStatementsMetadata.title, "三表モデルの作り方｜PL・BS・CFをExcelで連動する");
assert.equal(dcfMetadata.title, "DCF法の計算方法とExcelでの作り方｜FCFF・WACC・継続価値");
assert.equal(compsMetadata.title, "類似会社の選定方法｜候補抽出・除外理由・EV／EBITDA比較");

const threeStatementsHtml = renderToStaticMarkup(createElement(ThreeStatementsPage));
for (const expected of [
  "三表モデルの作り方",
  "2026年3月期の数値例",
  "Excelでの数式例",
  "三表モデルで起きやすい誤り",
  "完成三表モデル.xlsx",
  "/downloads/09_東都精密工業_完成三表モデル.xlsx",
]) {
  assert.ok(threeStatementsHtml.includes(expected), `three-statements: ${expected}`);
}

const dcfHtml = renderToStaticMarkup(createElement(DcfPage));
for (const expected of ["DCF法の計算方法とExcelでの作り方", "編集情報", '"@type":"Article"', '"@type":"BreadcrumbList"']) {
  assert.ok(dcfHtml.includes(expected), `dcf: ${expected}`);
}

const compsHtml = renderToStaticMarkup(createElement(CompsPage));
for (const expected of ["候補抽出", "除外理由", "EV／EBITDA", "/valuation/dcf"]) {
  assert.ok(compsHtml.includes(expected), `comps: ${expected}`);
}

const envExample = readFileSync(".env.example", "utf8");
const workflow = readFileSync(".github/workflows/deploy-pages.yml", "utf8");
const readme = readFileSync("README.md", "utf8");
for (const content of [envExample, workflow]) {
  assert.match(content, /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
}
for (const expected of ["URL プレフィックス", "sitemap.xml", "URL検査", "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"]) {
  assert.ok(readme.includes(expected), `README: ${expected}`);
}

console.log("Search visibility validation passed");
