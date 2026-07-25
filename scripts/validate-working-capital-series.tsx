import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { WorkingCapitalDownload } from "../src/components/working-capital/WorkingCapitalDownload";
import { WorkingCapitalFormulaTable } from "../src/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalNavigation } from "../src/components/working-capital/WorkingCapitalNavigation";
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

const formulaMarkup = renderToStaticMarkup(
  <WorkingCapitalFormulaTable
    rows={[{
      label: "売掛金",
      formula: "売上高÷365日×回収日数",
      excelFormula: "=C5/C10*C7",
      result: workingCapitalCase.forecastResult.receivables,
    }]}
  />,
);
const navigationMarkup = renderToStaticMarkup(
  <WorkingCapitalNavigation currentHref="/working-capital/receivables" />,
);
const downloadMarkup = renderToStaticMarkup(<WorkingCapitalDownload />);
assert.match(formulaMarkup, /売掛金/);
assert.match(formulaMarkup, /売上高÷365日×回収日数/);
assert.match(navigationMarkup, /運転資本モデルの作り方/);
assert.match(downloadMarkup, /working-capital-model\.xlsx/);
assert.match(downloadMarkup, /download/);

console.log("Working capital series validation passed");
