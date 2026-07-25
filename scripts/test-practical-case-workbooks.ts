import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { practicalModelSheets, practicalSourceSheets } from "../src/data/practical-case";

function formulaValue(cell: ExcelJS.Cell, label: string) {
  const value = cell.value as ExcelJS.CellFormulaValue;
  assert.notEqual(value, null, `${label}: 数式セルであること`);
  assert.equal(typeof value, "object", `${label}: 数式セルであること`);
  assert.ok("formula" in value, `${label}: 数式が設定されていること`);
  assert.equal(typeof value.formula, "string", `${label}: 数式文字列があること`);
  return value;
}

function resultNumber(cell: ExcelJS.Cell, label: string) {
  const value = formulaValue(cell, label);
  // ExcelJS 4.x drops a cached numeric result when it is exactly zero.
  if (value.result === undefined) return 0;
  assert.equal(typeof value.result, "number", `${label}: 計算結果が数値であること`);
  return value.result as number;
}

function assertNear(actual: number, expected: number, label: string, tolerance = 0.1) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} ≠ ${expected}`);
}

async function main() {
const source = new ExcelJS.Workbook();
await source.xlsx.readFile("public/downloads/08_東都精密工業_受領資料パック.xlsx");
assert.deepEqual(source.worksheets.map((sheet) => sheet.name), [...practicalSourceSheets]);
assert.equal(source.creator, "Finance Modeling Lab 編集部");
assert.equal(source.getWorksheet("00_使い方")!.getCell("B3").value, "東都精密工業株式会社");
assert.deepEqual(source.getWorksheet("05_固定資産台帳")!.getCell("F12").value, { formula: "SUM(F8:F11)", result: 2_940 });
assert.deepEqual(source.getWorksheet("06_借入金明細")!.getCell("F8").value, { formula: "SUM(F6:F7)", result: 1_950 });
assert.equal(source.getWorksheet("08_資料管理")!.getCell("G6").value, "要確認");
assert.ok(source.getWorksheet("09_勘定科目対応"), "勘定科目対応表があること");
assert.equal(source.getWorksheet("01_月次試算表")!.getCell("A6").value, "現預金");
assert.equal(source.getWorksheet("01_月次試算表")!.getCell("P6").value, 600);
assert.equal(source.getWorksheet("09_勘定科目対応")!.getCell("C5").value, "13_BS");

const model = new ExcelJS.Workbook();
await model.xlsx.readFile("public/downloads/09_東都精密工業_完成三表モデル.xlsx");
assert.deepEqual(model.worksheets.map((sheet) => sheet.name), [...practicalModelSheets]);
assert.equal(model.creator, "Finance Modeling Lab 編集部");
assert.equal(model.getWorksheet("00_表紙")!.getCell("B3").value, "東都精密工業株式会社");
assert.deepEqual(
  ["C7", "D7", "E7"].map((cell) => model.getWorksheet("05_前提条件")!.getCell(cell).value),
  ["Base", "Upside", "Downside"],
);
assert.equal(model.getWorksheet("03_実績財務諸表")!.getCell("B8").value, 10_000);
assert.equal(model.getWorksheet("17_指摘事項")!.getCell("C5").value, "Major");
assert.equal(model.getWorksheet("18_変更履歴")!.getCell("A5").value, "v1.1");

const revenueFormula = model.getWorksheet("06_売上高")!.getCell("C12").value as ExcelJS.CellFormulaValue;
const cashFormula = model.getWorksheet("14_CF")!.getCell("C20").value as ExcelJS.CellFormulaValue;
assert.equal(revenueFormula.formula, "C8*C9");
assert.equal(cashFormula.formula, "B20+C19");

const formulaRows: Record<string, number[]> = {
  "06_売上高": [8, 9, 12],
  "07_原価": [8, 9, 10, 12],
  "08_人員": [8, 9, 10],
  "09_運転資本": [8, 9, 10],
  "10_固定資産": [8, 9, 10, 11],
  "11_借入金": [8, 9, 10, 11],
  "12_PL": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  "13_BS": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  "14_CF": [8, 9, 10, 12, 14, 16, 19, 20],
  "15_出力": [8, 9, 10, 11, 12, 13, 14, 15, 16],
};

for (const [sheetName, rows] of Object.entries(formulaRows)) {
  const sheet = model.getWorksheet(sheetName)!;
  for (let column = 3; column <= 7; column += 1) {
    for (const row of rows) formulaValue(sheet.getCell(row, column), `${sheetName}!${sheet.getCell(row, column).address}`);
  }
}

const bs = model.getWorksheet("13_BS")!;
const cf = model.getWorksheet("14_CF")!;
const fixed = model.getWorksheet("10_固定資産")!;
const debt = model.getWorksheet("11_借入金")!;
for (let column = 3; column <= 7; column += 1) {
  const letter = model.getWorksheet("13_BS")!.getColumn(column).letter;
  assertNear(resultNumber(bs.getCell(13, column), `BS資産合計 ${letter}`), resultNumber(bs.getCell(19, column), `BS負債純資産合計 ${letter}`), `BS一致 ${letter}`);
  assertNear(resultNumber(bs.getCell(8, column), `BS現預金 ${letter}`), resultNumber(cf.getCell(20, column), `CF期末現預金 ${letter}`), `CF・BS現預金一致 ${letter}`);
  assertNear(
    resultNumber(fixed.getCell(11, column), `固定資産期末 ${letter}`),
    resultNumber(fixed.getCell(8, column), `固定資産期首 ${letter}`) + resultNumber(fixed.getCell(9, column), `設備投資 ${letter}`) + resultNumber(fixed.getCell(10, column), `減価償却 ${letter}`),
    `固定資産ロールフォワード ${letter}`,
  );
  assertNear(
    resultNumber(debt.getCell(11, column), `借入金期末 ${letter}`),
    resultNumber(debt.getCell(8, column), `借入金期首 ${letter}`) + resultNumber(debt.getCell(9, column), `新規借入 ${letter}`) + resultNumber(debt.getCell(10, column), `返済 ${letter}`),
    `借入金ロールフォワード ${letter}`,
  );
}

const checks = model.getWorksheet("16_チェック")!;
for (let row = 8; row <= 14; row += 1) formulaValue(checks.getCell(row, 3), `16_チェック!C${row}`);
for (let row = 8; row <= 14; row += 1) formulaValue(checks.getCell(row, 4), `16_チェック!D${row}`);
assert.match(formulaValue(checks.getCell("C12"), "16_チェック!C12").formula, /COUNTA/);
assert.doesNotMatch(formulaValue(checks.getCell("C12"), "16_チェック!C12").formula, /COUNTBLANK\('14_CF'!C8:G20\)/);
assert.equal(formulaValue(checks.getCell("D15"), "16_チェック!D15").result, "Ready with caveats");
assert.equal(formulaValue(model.getWorksheet("00_表紙")!.getCell("B6"), "00_表紙!B6").result, "適合");
assert.equal(model.getWorksheet("00_表紙")!.getCell("B7").value, "教育用・実案件への利用不可");
assert.equal(model.getWorksheet("15_出力")!.getCell("A13").value, "EBITDA");
assert.equal(model.getWorksheet("15_出力")!.getCell("A14").value, "EBITDAマージン");
assert.equal(model.getWorksheet("15_出力")!.getCell("A15").value, "純有利子負債");
assert.equal(model.getWorksheet("15_出力")!.getCell("A16").value, "最低現預金余裕額");
assert.equal(model.getWorksheet("02_資料管理")!.getCell("G4").value, "参照先セル");

for (const workbook of [source, model]) {
  for (const sheet of workbook.worksheets) {
    assert.ok(sheet.views.some((view) => view.state === "frozen"), `${sheet.name}: 見出し固定`);
    assert.ok(sheet.pageSetup.printArea, `${sheet.name}: 印刷範囲`);
  }
}

let modelFormulaCount = 0;
for (const sheet of model.worksheets) {
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (cell.type !== ExcelJS.ValueType.Formula) return;
      modelFormulaCount += 1;
      const value = cell.value as ExcelJS.CellFormulaValue;
      assert.doesNotMatch(value.formula, /\[[^\]]+\]/, `${sheet.name}!${cell.address}: 外部ブック参照なし`);
      if (typeof value.result === "string") {
        assert.doesNotMatch(value.result, /^#(REF!|VALUE!|DIV\/0!|NAME\?|N\/A|NUM!|NULL!)/, `${sheet.name}!${cell.address}: 数式エラーなし`);
      }
    });
  });
}
assert.ok(modelFormulaCount >= 250, `完成モデルの数式数: ${modelFormulaCount}`);

console.log("Practical case workbooks validation passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
