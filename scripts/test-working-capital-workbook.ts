import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { workingCapitalWorkbook } from "../src/data/working-capital-case";

function formulaCell(cell: ExcelJS.Cell, label: string) {
  const value = cell.value as ExcelJS.CellFormulaValue;
  assert.equal(typeof value, "object", `${label}は数式セルであること`);
  assert.ok(value && "formula" in value, `${label}に数式があること`);
  return value;
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(`public/downloads/${workingCapitalWorkbook.filename}`);

  assert.deepEqual(
    workbook.worksheets.map((sheet) => sheet.name),
    [...workingCapitalWorkbook.sheets],
  );
  assert.equal(workbook.creator, "Finance Modeling Lab 編集部");
  assert.equal(workbook.getWorksheet("01_前提条件")!.getCell("C5").value, 1_320);
  assert.equal(
    formulaCell(workbook.getWorksheet("02_売掛金")!.getCell("C8"), "02_売掛金!C8").formula,
    "'01_前提条件'!C5/'01_前提条件'!C10*'01_前提条件'!C7",
  );
  assert.equal(
    formulaCell(workbook.getWorksheet("03_棚卸資産")!.getCell("C8"), "03_棚卸資産!C8").formula,
    "'01_前提条件'!C6/'01_前提条件'!C10*'01_前提条件'!C8",
  );
  assert.equal(
    formulaCell(workbook.getWorksheet("04_買掛金")!.getCell("C8"), "04_買掛金!C8").formula,
    "'01_前提条件'!C6/'01_前提条件'!C10*'01_前提条件'!C9",
  );
  const firstCheck = formulaCell(workbook.getWorksheet("07_チェック")!.getCell("C5"), "07_チェック!C5");
  // ExcelJS 4.x omits a cached result when the result is exactly zero.
  assert.equal(firstCheck.result ?? 0, 0);

  let formulaCount = 0;
  for (const sheet of workbook.worksheets) {
    assert.ok(sheet.views.some((view) => view.state === "frozen"), `${sheet.name}: ウィンドウ枠固定`);
    assert.ok(sheet.pageSetup.printArea, `${sheet.name}: 印刷範囲`);
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.type !== ExcelJS.ValueType.Formula) return;
        formulaCount += 1;
        const value = formulaCell(cell, `${sheet.name}!${cell.address}`);
        assert.doesNotMatch(value.formula, /\[[^\]]+\]/, `${sheet.name}!${cell.address}: 外部参照なし`);
        if (typeof value.result === "string") {
          assert.doesNotMatch(value.result, /^#(REF!|VALUE!|DIV\/0!|NAME\?|N\/A|NUM!|NULL!)/);
        }
      });
    });
  }
  assert.ok(formulaCount >= 20, `数式セルが20個以上あること: ${formulaCount}`);

  console.log("Working capital workbook validation passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
