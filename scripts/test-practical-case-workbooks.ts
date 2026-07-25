import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { practicalModelSheets, practicalSourceSheets } from "../src/data/practical-case";

async function main() {
const source = new ExcelJS.Workbook();
await source.xlsx.readFile("public/downloads/08_東都精密工業_受領資料パック.xlsx");
assert.deepEqual(source.worksheets.map((sheet) => sheet.name), [...practicalSourceSheets]);
assert.equal(source.creator, "Finance Modeling Lab 編集部");
assert.equal(source.getWorksheet("00_使い方")!.getCell("B3").value, "東都精密工業株式会社");
assert.deepEqual(source.getWorksheet("01_月次試算表")!.getCell("N6").value, { formula: "SUM(B6:M6)", result: 10_000 });
assert.deepEqual(source.getWorksheet("05_固定資産台帳")!.getCell("F12").value, { formula: "SUM(F8:F11)", result: 2_940 });
assert.deepEqual(source.getWorksheet("06_借入金明細")!.getCell("F8").value, { formula: "SUM(F6:F7)", result: 1_950 });
assert.equal(source.getWorksheet("08_資料管理")!.getCell("G6").value, "要確認");

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
assert.equal(model.getWorksheet("16_チェック")!.getCell("C8").value, 0);
assert.equal(model.getWorksheet("16_チェック")!.getCell("D8").value, "適合");
assert.equal(model.getWorksheet("17_指摘事項")!.getCell("C5").value, "Major");
assert.equal(model.getWorksheet("18_変更履歴")!.getCell("A5").value, "v1.0");

const revenueFormula = model.getWorksheet("06_売上高")!.getCell("C12").value as ExcelJS.CellFormulaValue;
const cashFormula = model.getWorksheet("14_CF")!.getCell("C20").value as ExcelJS.CellFormulaValue;
const bsCheckFormula = model.getWorksheet("16_チェック")!.getCell("C8").value;
assert.equal(revenueFormula.formula, "C8*C9");
assert.equal(cashFormula.formula, "B20+C19");
assert.equal(bsCheckFormula, 0);

for (const workbook of [source, model]) {
  for (const sheet of workbook.worksheets) {
    assert.ok(sheet.views.some((view) => view.state === "frozen"), `${sheet.name}: 見出し固定`);
    assert.ok(sheet.pageSetup.printArea, `${sheet.name}: 印刷範囲`);
  }
}

console.log("Practical case workbooks validation passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
