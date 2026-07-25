import assert from "node:assert/strict";
import {
  practicalCase,
  practicalDownloads,
  practicalModelSheets,
  practicalQualityGate,
  practicalSourceSheets,
  practicalWorkflow,
} from "../src/data/practical-case";

assert.equal(practicalCase.company, "東都精密工業株式会社");
assert.equal(practicalCase.unit, "百万円");
assert.equal(practicalCase.yearEnd, "3月");
assert.equal(practicalCase.actual.year, "2025年3月期");
assert.equal(practicalCase.actual.revenue, 10_000);
assert.equal(practicalCase.actual.ebitda, 1_500);
assert.deepEqual(practicalCase.scenarios.map((scenario) => scenario.name), ["Base", "Upside", "Downside"]);
assert.deepEqual(practicalCase.forecastYears, ["2026年3月期", "2027年3月期", "2028年3月期", "2029年3月期", "2030年3月期"]);

assert.equal(practicalWorkflow.length, 8);
assert.equal(practicalWorkflow[0].id, "source-review");
assert.equal(practicalWorkflow.at(-1)?.id, "quality");
for (const stage of practicalWorkflow) {
  assert.ok(stage.inputs.length > 0, `${stage.id}: 受領資料が必要`);
  assert.ok(stage.deliverables.length > 0, `${stage.id}: 成果物が必要`);
  assert.ok(stage.excel.length > 0, `${stage.id}: Excel実装が必要`);
  assert.ok(stage.checks.length > 0, `${stage.id}: 確認項目が必要`);
  assert.ok(stage.reviewComment.length > 0, `${stage.id}: レビュー指摘が必要`);
}

assert.equal(practicalSourceSheets.length, 10);
assert.ok(practicalSourceSheets.includes("09_勘定科目対応"));
assert.equal(practicalModelSheets.length, 19);
assert.deepEqual(practicalQualityGate.readiness.map((item) => item.name), ["Ready", "Ready with caveats", "Not ready"]);
assert.deepEqual(practicalQualityGate.severities.map((item) => item.name), ["Critical", "Major", "Minor"]);
assert.deepEqual(practicalDownloads.map((item) => item.file), [
  "08_東都精密工業_受領資料パック.xlsx",
  "09_東都精密工業_完成三表モデル.xlsx",
]);

console.log("Practical case validation passed");
