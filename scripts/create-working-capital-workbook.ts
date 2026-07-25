import ExcelJS from "exceljs";
import {
  workingCapitalCase,
  workingCapitalWorkbook,
} from "../src/data/working-capital-case";

const navy = "FF102235";
const teal = "FF147D73";
const paleBlue = "FFEAF3F8";
const paleYellow = "FFFFF4CC";
const border = "FFD8E0E5";
const inputBlue = "FF0000FF";
const linkGreen = "FF008000";

function addTitle(sheet: ExcelJS.Worksheet, title: string, subtitle: string) {
  sheet.mergeCells("A1:F1");
  sheet.getCell("A1").value = title;
  sheet.getCell("A1").font = { bold: true, color: { argb: "FFFFFFFF" }, size: 16 };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
  sheet.getCell("A2").value = subtitle;
  sheet.getCell("A2").font = { color: { argb: "FF607080" }, italic: true };
}

function addHeader(sheet: ExcelJS.Worksheet, row: number, values: string[]) {
  values.forEach((value, index) => {
    const cell = sheet.getCell(row, index + 1);
    cell.value = value;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: teal } };
    cell.alignment = { horizontal: "center" };
  });
}

function setFormula(
  cell: ExcelJS.Cell,
  formula: string,
  result: number | string,
  link = false,
) {
  cell.value = { formula, result };
  cell.font = { color: { argb: link ? linkGreen : "FF000000" } };
}

function finishSheet(sheet: ExcelJS.Worksheet, printArea: string) {
  sheet.views = [{ state: "frozen", ySplit: 3, xSplit: 1 }];
  sheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printArea,
  };
  sheet.properties.defaultRowHeight = 18;
  sheet.columns.forEach((column, index) => {
    column.width = index === 0 ? 27 : 18;
  });
  for (let row = 1; row <= Math.max(sheet.rowCount, 15); row += 1) {
    for (let column = 1; column <= 6; column += 1) {
      const cell = sheet.getCell(row, column);
      cell.border = {
        bottom: { style: "hair", color: { argb: border } },
      };
      cell.alignment = { ...cell.alignment, vertical: "middle", wrapText: true };
    }
  }
}

function inputCell(cell: ExcelJS.Cell, value: number) {
  cell.value = value;
  cell.font = { color: { argb: inputBlue } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: paleBlue } };
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Finance Modeling Lab 編集部";
  workbook.lastModifiedBy = "Finance Modeling Lab 編集部";
  workbook.created = new Date("2026-07-26T00:00:00+09:00");
  workbook.modified = new Date("2026-07-26T00:00:00+09:00");
  workbook.calcProperties.fullCalcOnLoad = true;

  const guide = workbook.addWorksheet("00_使い方");
  addTitle(guide, "運転資本モデル", `${workingCapitalCase.company}｜単位：百万円`);
  addHeader(guide, 4, ["手順", "内容", "確認事項"]);
  [
    ["1", "01_前提条件に売上高、売上原価、回転日数を入力", "青字セルのみ入力"],
    ["2", "売掛金、棚卸資産、買掛金の計算結果を確認", "緑字は別シート参照"],
    ["3", "05_運転資本で前期差とCF影響を確認", "運転資本増加はCFマイナス"],
    ["4", "07_チェックがすべて0であることを確認", "差額が残る場合は提出不可"],
  ].forEach((values, index) => {
    guide.getRow(index + 5).values = values;
  });
  guide.getCell("A11").value = "利用条件";
  guide.getCell("B11").value = "教育目的・実案件への利用不可";
  finishSheet(guide, "A1:C12");

  const assumptions = workbook.addWorksheet("01_前提条件");
  addTitle(assumptions, "前提条件", "実績と予測を同じ定義で並べます。");
  addHeader(assumptions, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "単位", "出所・判断"]);
  const assumptionRows = [
    ["売上高", workingCapitalCase.actual.revenue, workingCapitalCase.forecast.revenue, "百万円", "事業計画"],
    ["売上原価", workingCapitalCase.actual.cogs, workingCapitalCase.forecast.cogs, "百万円", "事業計画"],
    ["売掛金回収日数", workingCapitalCase.actual.receivableDays, workingCapitalCase.forecast.receivableDays, "日", "回収条件・滞留分析"],
    ["在庫回転日数", workingCapitalCase.actual.inventoryDays, workingCapitalCase.forecast.inventoryDays, "日", "在庫計画"],
    ["買掛金支払日数", workingCapitalCase.actual.payableDays, workingCapitalCase.forecast.payableDays, "日", "仕入条件"],
    ["年間日数", workingCapitalCase.actual.daysInYear, workingCapitalCase.forecast.daysInYear, "日", "365日固定"],
  ] as const;
  assumptionRows.forEach((values, index) => {
    const row = index + 5;
    assumptions.getCell(row, 1).value = values[0];
    inputCell(assumptions.getCell(row, 2), values[1]);
    inputCell(assumptions.getCell(row, 3), values[2]);
    assumptions.getCell(row, 4).value = values[3];
    assumptions.getCell(row, 5).value = values[4];
  });
  assumptions.getCell("C10").value = workingCapitalCase.forecast.daysInYear;
  finishSheet(assumptions, "A1:E11");

  const receivables = workbook.addWorksheet("02_売掛金");
  addTitle(receivables, "売掛金", "売上高と回収日数から期末残高を計算します。");
  addHeader(receivables, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "単位", "計算根拠"]);
  receivables.getRow(5).values = ["売上高", workingCapitalCase.actual.revenue, workingCapitalCase.forecast.revenue, "百万円", "01_前提条件"];
  receivables.getRow(6).values = ["回収日数", workingCapitalCase.actual.receivableDays, workingCapitalCase.forecast.receivableDays, "日", "01_前提条件"];
  receivables.getCell("A8").value = "売掛金";
  setFormula(receivables.getCell("B8"), "'01_前提条件'!B5/'01_前提条件'!B10*'01_前提条件'!B7", workingCapitalCase.actualResult.receivables, true);
  setFormula(receivables.getCell("C8"), "'01_前提条件'!C5/'01_前提条件'!C10*'01_前提条件'!C7", workingCapitalCase.forecastResult.receivables, true);
  receivables.getCell("D8").value = "百万円";
  receivables.getCell("E8").value = "売上高÷365日×回収日数";
  finishSheet(receivables, "A1:E10");

  const inventory = workbook.addWorksheet("03_棚卸資産");
  addTitle(inventory, "棚卸資産", "売上原価と在庫回転日数から期末残高を計算します。");
  addHeader(inventory, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "単位", "計算根拠"]);
  inventory.getRow(5).values = ["売上原価", workingCapitalCase.actual.cogs, workingCapitalCase.forecast.cogs, "百万円", "01_前提条件"];
  inventory.getRow(6).values = ["在庫回転日数", workingCapitalCase.actual.inventoryDays, workingCapitalCase.forecast.inventoryDays, "日", "01_前提条件"];
  inventory.getCell("A8").value = "棚卸資産";
  setFormula(inventory.getCell("B8"), "'01_前提条件'!B6/'01_前提条件'!B10*'01_前提条件'!B8", workingCapitalCase.actualResult.inventory, true);
  setFormula(inventory.getCell("C8"), "'01_前提条件'!C6/'01_前提条件'!C10*'01_前提条件'!C8", workingCapitalCase.forecastResult.inventory, true);
  inventory.getCell("D8").value = "百万円";
  inventory.getCell("E8").value = "売上原価÷365日×在庫回転日数";
  finishSheet(inventory, "A1:E10");

  const payables = workbook.addWorksheet("04_買掛金");
  addTitle(payables, "買掛金", "売上原価と支払日数から期末残高を計算します。");
  addHeader(payables, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "単位", "計算根拠"]);
  payables.getRow(5).values = ["売上原価", workingCapitalCase.actual.cogs, workingCapitalCase.forecast.cogs, "百万円", "01_前提条件"];
  payables.getRow(6).values = ["支払日数", workingCapitalCase.actual.payableDays, workingCapitalCase.forecast.payableDays, "日", "01_前提条件"];
  payables.getCell("A8").value = "買掛金";
  setFormula(payables.getCell("B8"), "'01_前提条件'!B6/'01_前提条件'!B10*'01_前提条件'!B9", workingCapitalCase.actualResult.payables, true);
  setFormula(payables.getCell("C8"), "'01_前提条件'!C6/'01_前提条件'!C10*'01_前提条件'!C9", workingCapitalCase.forecastResult.payables, true);
  payables.getCell("D8").value = "百万円";
  payables.getCell("E8").value = "売上原価÷365日×支払日数";
  finishSheet(payables, "A1:E10");

  const workingCapital = workbook.addWorksheet("05_運転資本");
  addTitle(workingCapital, "正味運転資本", "三勘定を集約し、前期差をキャッシュ・フローへ接続します。");
  addHeader(workingCapital, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "増減", "CF影響"]);
  const links = [
    ["売掛金", "'02_売掛金'!B8", "'02_売掛金'!C8", workingCapitalCase.actualResult.receivables, workingCapitalCase.forecastResult.receivables],
    ["棚卸資産", "'03_棚卸資産'!B8", "'03_棚卸資産'!C8", workingCapitalCase.actualResult.inventory, workingCapitalCase.forecastResult.inventory],
    ["買掛金", "'04_買掛金'!B8", "'04_買掛金'!C8", workingCapitalCase.actualResult.payables, workingCapitalCase.forecastResult.payables],
  ] as const;
  links.forEach(([label, actualFormula, forecastFormula, actualValue, forecastValue], index) => {
    const row = index + 5;
    workingCapital.getCell(row, 1).value = label;
    setFormula(workingCapital.getCell(row, 2), actualFormula, actualValue, true);
    setFormula(workingCapital.getCell(row, 3), forecastFormula, forecastValue, true);
    setFormula(workingCapital.getCell(row, 4), `C${row}-B${row}`, forecastValue - actualValue);
    const sign = label === "買掛金" ? 1 : -1;
    setFormula(workingCapital.getCell(row, 5), `${sign === 1 ? "" : "-"}D${row}`, sign * (forecastValue - actualValue));
  });
  workingCapital.getCell("A9").value = "正味運転資本";
  setFormula(workingCapital.getCell("B9"), "SUM(B5:B6)-B7", workingCapitalCase.actualResult.netWorkingCapital);
  setFormula(workingCapital.getCell("C9"), "SUM(C5:C6)-C7", workingCapitalCase.forecastResult.netWorkingCapital);
  setFormula(workingCapital.getCell("D9"), "C9-B9", workingCapitalCase.forecastResult.netWorkingCapital - workingCapitalCase.actualResult.netWorkingCapital);
  setFormula(workingCapital.getCell("E9"), "-D9", workingCapitalCase.cashFlowImpact);
  finishSheet(workingCapital, "A1:E11");

  const ccc = workbook.addWorksheet("06_CCC分析");
  addTitle(ccc, "CCC分析", "回収・在庫・支払の三要素を日数で比較します。");
  addHeader(ccc, 4, ["項目", "2026/3期 実績", "2027/3期 予測", "増減", "読み方"]);
  const dayRows = [
    ["売掛金回収日数", 7, workingCapitalCase.actual.receivableDays, workingCapitalCase.forecast.receivableDays, "短いほど回収が早い"],
    ["在庫回転日数", 8, workingCapitalCase.actual.inventoryDays, workingCapitalCase.forecast.inventoryDays, "短いほど在庫効率が高い"],
    ["買掛金支払日数", 9, workingCapitalCase.actual.payableDays, workingCapitalCase.forecast.payableDays, "長いほど支払いまでの期間が長い"],
  ] as const;
  dayRows.forEach(([label, sourceRow, actualValue, forecastValue, note], index) => {
    const row = index + 5;
    ccc.getCell(row, 1).value = label;
    setFormula(ccc.getCell(row, 2), `'01_前提条件'!B${sourceRow}`, actualValue, true);
    setFormula(ccc.getCell(row, 3), `'01_前提条件'!C${sourceRow}`, forecastValue, true);
    setFormula(ccc.getCell(row, 4), `C${row}-B${row}`, forecastValue - actualValue);
    ccc.getCell(row, 5).value = note;
  });
  ccc.getCell("A9").value = "CCC";
  setFormula(ccc.getCell("B9"), "B5+B6-B7", workingCapitalCase.actualResult.cashConversionCycle);
  setFormula(ccc.getCell("C9"), "C5+C6-C7", workingCapitalCase.forecastResult.cashConversionCycle);
  setFormula(ccc.getCell("D9"), "C9-B9", workingCapitalCase.forecastResult.cashConversionCycle - workingCapitalCase.actualResult.cashConversionCycle);
  ccc.getCell("E9").value = "長期化は運転資金負担の増加を示す";
  finishSheet(ccc, "A1:E11");

  const checks = workbook.addWorksheet("07_チェック");
  addTitle(checks, "モデルチェック", "差額が0であることを確認します。");
  addHeader(checks, 4, ["確認項目", "期待値", "差額", "判定"]);
  const checkRows = [
    ["売掛金計算", workingCapitalCase.forecastResult.receivables, "'02_売掛金'!C8-C5"],
    ["棚卸資産計算", workingCapitalCase.forecastResult.inventory, "'03_棚卸資産'!C8-C6"],
    ["買掛金計算", workingCapitalCase.forecastResult.payables, "'04_買掛金'!C8-C7"],
    ["CF影響符号", workingCapitalCase.cashFlowImpact, "'05_運転資本'!E9-C8"],
  ] as const;
  checkRows.forEach(([label, expected, expression], index) => {
    const row = index + 5;
    checks.getCell(row, 1).value = label;
    checks.getCell(row, 2).value = expected;
    setFormula(checks.getCell(row, 3), expression, 0);
    setFormula(checks.getCell(row, 4), `IF(ABS(C${row})<0.1,"適合","要確認")`, "適合");
    checks.getCell(row, 3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: paleYellow } };
  });
  finishSheet(checks, "A1:D10");

  for (const sheet of workbook.worksheets) {
    for (let row = 5; row <= sheet.rowCount; row += 1) {
      for (let column = 2; column <= 5; column += 1) {
        const cell = sheet.getCell(row, column);
        if (typeof cell.value === "number" || cell.type === ExcelJS.ValueType.Formula) {
          cell.numFmt = cell.address.includes("D") && sheet.name === "06_CCC分析" ? "0.0\"日\"" : "0.0";
        }
      }
    }
  }

  await workbook.xlsx.writeFile(`public/downloads/${workingCapitalWorkbook.filename}`);
  console.log("Working capital workbook generated");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
