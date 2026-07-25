import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PracticalCasePanel } from "../src/components/PracticalCasePanel";

const markup = renderToStaticMarkup(createElement(PracticalCasePanel, { stageId: "bs" }));

for (const expected of [
  "東都精密工業株式会社",
  "この工程の成果物",
  "使用する受領資料",
  "Excelでの実装",
  "確認項目",
  "レビュアーからの指摘例",
  "売掛金回転日数を55日から45日に改善した根拠がなく",
  'href="/cf-model"',
  "08_東都精密工業_受領資料パック.xlsx",
  "09_東都精密工業_完成三表モデル.xlsx",
]) {
  assert.ok(markup.includes(expected), `工程パネルに「${expected}」が必要`);
}
assert.throws(() => renderToStaticMarkup(createElement(PracticalCasePanel, { stageId: "unknown" })), /Unknown practical stage/);

console.log("Practical case panel validation passed");
