import assert from "node:assert/strict";
import {
  calculateWorkingCapital,
  workingCapitalCase,
  workingCapitalPages,
  workingCapitalWorkbook,
} from "../src/data/working-capital-case";

assert.equal(workingCapitalCase.company, "東都パーツ株式会社");
assert.equal(workingCapitalCase.actual.year, "2026/3期");
assert.equal(workingCapitalCase.forecast.year, "2027/3期");
assert.equal(workingCapitalCase.forecast.revenue, 1320);
assert.equal(workingCapitalCase.forecast.cogs, 792);
assert.equal(workingCapitalCase.forecast.receivableDays, 50);
assert.equal(workingCapitalCase.forecast.inventoryDays, 65);
assert.equal(workingCapitalCase.forecast.payableDays, 40);
assert.equal(workingCapitalPages.length, 5);
assert.equal(workingCapitalWorkbook.filename, "working-capital-model.xlsx");
assert.throws(
  () => calculateWorkingCapital({ ...workingCapitalCase.forecast, daysInYear: 0 }),
  /年間日数/,
);

console.log("Working capital series validation passed");
