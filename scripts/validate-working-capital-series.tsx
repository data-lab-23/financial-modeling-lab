import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { WorkingCapitalDownload } from "../src/components/working-capital/WorkingCapitalDownload";
import { WorkingCapitalFormulaTable } from "../src/components/working-capital/WorkingCapitalFormulaTable";
import { WorkingCapitalNavigation } from "../src/components/working-capital/WorkingCapitalNavigation";
import WorkingCapitalHub from "../src/app/working-capital-model/page";
import ReceivablesPage from "../src/app/working-capital/receivables/page";
import InventoryPage from "../src/app/working-capital/inventory/page";
import PayablesPage from "../src/app/working-capital/payables/page";
import CashConversionCyclePage from "../src/app/working-capital/cash-conversion-cycle/page";
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

const hubMarkup = renderToStaticMarkup(<WorkingCapitalHub />);
const receivablesMarkup = renderToStaticMarkup(<ReceivablesPage />);
const inventoryMarkup = renderToStaticMarkup(<InventoryPage />);
const payablesMarkup = renderToStaticMarkup(<PayablesPage />);
const cccMarkup = renderToStaticMarkup(<CashConversionCyclePage />);
assert.match(hubMarkup, /運転資本モデルの作り方/);
assert.match(hubMarkup, /東都パーツ株式会社/);
assert.match(hubMarkup, /2026\/3期/);
assert.match(hubMarkup, /2027\/3期/);
assert.match(receivablesMarkup, /売掛金＝売上高÷365日×回収日数/);
assert.match(inventoryMarkup, /棚卸資産＝売上原価÷365日×在庫回転日数/);
assert.match(payablesMarkup, /買掛金＝売上原価÷365日×支払日数/);
assert.match(cccMarkup, /CCC＝回収日数＋在庫回転日数－支払日数/);
assert.match(hubMarkup, /working-capital-model\.xlsx/);

for (const markup of [hubMarkup, receivablesMarkup, inventoryMarkup, payablesMarkup, cccMarkup]) {
  assert.match(markup, /実務上の使用場面/);
  assert.match(markup, /Excelでの実装/);
  assert.match(markup, /よくある誤り/);
  assert.match(markup, /レビュー時の確認項目/);
}

console.log("Working capital series validation passed");
