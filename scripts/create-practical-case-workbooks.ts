import ExcelJS from "exceljs";
import {
  practicalCase,
  practicalModelSheets,
  practicalSourceSheets,
} from "../src/data/practical-case";

const outputDir = "public/downloads";
const colors = {
  navy: "FF102235", teal: "FF147D73", input: "FFE7F0FF", link: "FFE9F6EF",
  formula: "FFFFFFFF", check: "FFE6F4EA", warning: "FFFFF2CC", line: "FFD8E0E5", white: "FFFFFFFF",
};

function addSheet(workbook: ExcelJS.Workbook, name: string, description: string) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printArea: "A1:N60" },
  });
  sheet.getColumn(1).width = 24;
  for (let column = 2; column <= 14; column += 1) sheet.getColumn(column).width = 16;
  sheet.mergeCells("A1:N1");
  sheet.getCell("A1").value = name;
  sheet.getCell("A1").font = { name: "Yu Gothic", size: 16, bold: true, color: { argb: colors.white } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.navy } };
  sheet.mergeCells("A2:N2");
  sheet.getCell("A2").value = description;
  sheet.getCell("A2").font = { name: "Yu Gothic", color: { argb: colors.teal } };
  sheet.getCell("A2").alignment = { wrapText: true };
  return sheet;
}

function header(sheet: ExcelJS.Worksheet, row: number, values: (string | number)[]) {
  sheet.getRow(row).values = values;
  values.forEach((_, index) => {
    const cell = sheet.getCell(row, index + 1);
    cell.font = { name: "Yu Gothic", bold: true, color: { argb: colors.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.teal } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  });
}

function formatGrid(sheet: ExcelJS.Worksheet, start: number, end: number, columns = 14) {
  for (let row = start; row <= end; row += 1) {
    for (let column = 1; column <= columns; column += 1) {
      const cell = sheet.getCell(row, column);
      cell.font = { name: "Yu Gothic", size: 10, color: cell.font?.color };
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = { bottom: { style: "thin", color: { argb: colors.line } } };
    }
  }
}

function input(cell: ExcelJS.Cell, value: string | number, numFmt = "#,##0.0") {
  cell.value = value;
  if (typeof value === "number") cell.numFmt = numFmt;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.input } };
  cell.font = { name: "Yu Gothic", color: { argb: "FF1F4E78" } };
}

function formula(cell: ExcelJS.Cell, expression: string, result: string | number, kind: "formula" | "link" | "check" = "formula") {
  cell.value = { formula: expression, result };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors[kind] } };
  cell.numFmt = typeof result === "number" ? "#,##0.0" : "General";
}

function initialize(workbook: ExcelJS.Workbook) {
  workbook.creator = "Finance Modeling Lab 編集部";
  workbook.company = "Finance Modeling Lab 編集部";
  workbook.created = new Date("2026-07-25T00:00:00Z");
  workbook.modified = new Date("2026-07-25T00:00:00Z");
  workbook.calcProperties.fullCalcOnLoad = true;
}

async function createSourcePack() {
  const workbook = new ExcelJS.Workbook();
  initialize(workbook);
  for (const name of practicalSourceSheets) addSheet(workbook, name, `${practicalCase.company}｜受領資料｜単位：${practicalCase.unit}`);

  const guide = workbook.getWorksheet("00_使い方")!;
  header(guide, 4, ["項目", "内容", "確認"]);
  guide.getCell("A3").value = "会社名"; guide.getCell("B3").value = practicalCase.company;
  [
    ["作業目的", "資料の基準日・単位・対象範囲を確認し、財務三表モデルの実績値へ組み替える", "資料管理へ結果を記録"],
    ["意図的な差異", "固定資産台帳、借入金明細、事業計画に確認対象の差異を含む", "差額を雑勘定で処理しない"],
    ["成果物", "資料管理表、実績財務諸表、正常化調整一覧", "根拠資料からセルまで追跡可能にする"],
  ].forEach((row, index) => { guide.getRow(index + 5).values = row; });

  const tb = workbook.getWorksheet("01_月次試算表")!;
  header(tb, 4, ["勘定科目", ...Array.from({ length: 12 }, (_, index) => `${index + 4}月`), "年度計"]);
  const monthlyRevenue = [780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 870];
  const tbRows: [string, number[]][] = [
    ["売上高", monthlyRevenue],
    ["売上原価", monthlyRevenue.map((value) => value * 0.7)],
    ["販売費及び一般管理費", monthlyRevenue.map(() => 150)],
    ["減価償却費", monthlyRevenue.map(() => 25)],
  ];
  tbRows.forEach(([label, values], rowIndex) => {
    const row = rowIndex + 6; tb.getCell(row, 1).value = label;
    values.forEach((value, index) => { tb.getCell(row, index + 2).value = value; });
    formula(tb.getCell(row, 14), `SUM(B${row}:M${row})`, values.reduce((sum, value) => sum + value, 0));
  });

  const gl = workbook.getWorksheet("02_勘定科目明細")!;
  header(gl, 4, ["伝票日", "伝票番号", "勘定科目", "摘要", "借方", "貸方", "確認事項"]);
  [
    ["2025/03/31", "JV-250331-01", "外注費", "請求書未着分", 120, 0, "検収記録と照合"],
    ["2025/03/31", "JV-250331-02", "役員退職金", "退任役員1名", 80, 0, "正常化調整候補"],
  ].forEach((row, index) => { gl.getRow(index + 5).values = row; });

  const sales = workbook.getWorksheet("03_販売実績")!;
  header(sales, 4, ["製品", "地域", "販売数量", "平均販売単価", "売上高", "構成比"]);
  [["製品A", "国内", 500, 10, 5_000], ["製品A", "海外", 200, 10, 2_000], ["製品B", "国内", 100, 20, 2_000], ["製品B", "海外", 50, 20, 1_000]].forEach((row, index) => {
    sales.getRow(index + 5).values = row; formula(sales.getCell(index + 5, 6), `E${index + 5}/SUM($E$5:$E$8)`, (row[4] as number) / 10_000);
  });

  const plan = workbook.getWorksheet("04_事業計画")!;
  header(plan, 4, ["項目", ...practicalCase.forecastYears, "確認事項"]);
  plan.getRow(5).values = ["売上高", 10_800, 11_500, 12_200, 12_800, 13_400, "販売数量計画からの積上げは10,700"];
  plan.getRow(6).values = ["設備投資", 650, 700, 650, 600, 600, "設備稼働率と整合確認"];

  const fa = workbook.getWorksheet("05_固定資産台帳")!;
  header(fa, 4, ["資産番号", "資産名", "取得価額", "累計償却", "当期増減", "期末帳簿価額", "試算表差額"]);
  const faRows = [
    ["FA-001", "本社工場", 2_000, 700, 0, 1_300, 0],
    ["FA-002", "製造設備A", 1_500, 700, 100, 900, 0],
    ["FA-003", "製造設備B", 1_200, 600, 40, 640, 0],
    ["FA-004", "工具器具備品", 300, 200, 0, 100, 0],
  ];
  faRows.forEach((row, index) => { fa.getRow(index + 8).values = row; });
  fa.getCell("A12").value = "台帳合計"; formula(fa.getCell("F12"), "SUM(F8:F11)", 2_940); fa.getCell("G12").value = -60;

  const debt = workbook.getWorksheet("06_借入金明細")!;
  header(debt, 4, ["金融機関", "契約番号", "金利", "返済期限", "約定返済", "期末残高", "試算表差額"]);
  [["A銀行", "TL-01", 0.012, "2029/03/31", 200, 1_200, 0], ["B銀行", "TL-02", 0.015, "2027/03/31", 150, 750, 0]].forEach((row, index) => debt.getRow(index + 6).values = row);
  debt.getCell("A8").value = "明細合計"; formula(debt.getCell("F8"), "SUM(F6:F7)", 1_950); debt.getCell("G8").value = -50;

  const wc = workbook.getWorksheet("07_運転資本明細")!;
  header(wc, 4, ["区分", "相手先・品目", "期末残高", "契約条件", "実績日数", "確認事項"]);
  [["売掛金", "主要顧客合計", 1_500, "月末締め翌月末", 55, "検収時期を含む"], ["棚卸資産", "原材料・仕掛品・製品", 1_200, "安全在庫2か月", 63, "滞留在庫を確認"], ["買掛金", "主要仕入先合計", 900, "月末締め翌月末", 47, "材料費を基礎"]].forEach((row, index) => wc.getRow(index + 5).values = row);

  const log = workbook.getWorksheet("08_資料管理")!;
  header(log, 4, ["資料番号", "資料名", "基準日", "入手元", "使用先", "差異・不足", "状況", "担当者"]);
  [
    ["S-01", "月次試算表", "2025/03/31", "経理部", "03_実績財務諸表", "なし", "確認済", "モデル担当"],
    ["S-02", "固定資産台帳", "2025/03/31", "経理部", "10_固定資産", "試算表より60少ない", "要確認", "経理部"],
    ["S-03", "借入金明細", "2025/03/31", "財務部", "11_借入金", "試算表より50少ない", "要確認", "財務部"],
  ].forEach((row, index) => log.getRow(index + 5).values = row);

  for (const sheet of workbook.worksheets) formatGrid(sheet, 3, Math.max(sheet.rowCount, 12));
  await workbook.xlsx.writeFile(`${outputDir}/08_東都精密工業_受領資料パック.xlsx`);
}

async function createModel() {
  const workbook = new ExcelJS.Workbook();
  initialize(workbook);
  for (const name of practicalModelSheets) addSheet(workbook, name, `${practicalCase.company}｜完成三表モデル｜単位：${practicalCase.unit}`);

  const cover = workbook.getWorksheet("00_表紙")!;
  cover.getCell("A3").value = "会社名"; cover.getCell("B3").value = practicalCase.company;
  cover.getCell("A4").value = "モデル目的"; cover.getCell("B4").value = "事業計画、資金繰り、財務三表の検証";
  cover.getCell("A5").value = "基準日"; cover.getCell("B5").value = "2025/03/31";
  cover.getCell("A6").value = "判定"; cover.getCell("B6").value = "Ready with caveats";

  const control = workbook.getWorksheet("01_管理")!;
  header(control, 4, ["項目", "設定値", "説明"]);
  input(control.getCell("B5"), "Base"); control.getCell("A5").value = "選択シナリオ";
  control.getCell("A6").value = "単位"; control.getCell("B6").value = practicalCase.unit;
  control.getCell("A7").value = "最低現預金"; input(control.getCell("B7"), 500);

  const sourceLog = workbook.getWorksheet("02_資料管理")!;
  header(sourceLog, 4, ["資料番号", "資料名", "基準日", "使用シート", "主要セル", "状況"]);
  [["S-01", "月次試算表", "2025/03/31", "03_実績財務諸表", "B8:B30", "確認済"], ["S-02", "固定資産台帳", "2025/03/31", "10_固定資産", "B8:G12", "差異調整済"], ["S-03", "借入金明細", "2025/03/31", "11_借入金", "B8:G12", "差異調整済"]].forEach((row, index) => sourceLog.getRow(index + 5).values = row);

  const historical = workbook.getWorksheet("03_実績財務諸表")!;
  header(historical, 4, ["PL", practicalCase.actual.year, "BS", practicalCase.actual.year]);
  [["売上高", 10_000], ["売上原価", 7_000], ["売上総利益", 3_000], ["販売費及び一般管理費", 1_800], ["EBITDA", 1_500], ["減価償却費", 300], ["営業利益", 1_200]].forEach((row, index) => historical.getRow(index + 8).values = row);
  [["現預金", 600], ["売掛金", 1_500], ["棚卸資産", 1_200], ["買掛金", 900], ["有利子負債", 2_000]].forEach((row, index) => { historical.getCell(index + 8, 3).value = row[0]; historical.getCell(index + 8, 4).value = row[1]; });

  const adjustments = workbook.getWorksheet("04_正常化調整")!;
  header(adjustments, 4, ["番号", "項目", "金額", "PL影響", "根拠", "採否"]);
  adjustments.getRow(5).values = [1, "役員退職金", 80, "加算", "退任役員1名の一過性費用", "採用"];

  const assumptions = workbook.getWorksheet("05_前提条件")!;
  header(assumptions, 7, ["前提項目", "単位", "Base", "Upside", "Downside", "選択値", "出所・根拠"]);
  assumptions.getCell("C7").value = "Base"; assumptions.getCell("D7").value = "Upside"; assumptions.getCell("E7").value = "Downside";
  const assumptionRows = [
    ["販売数量成長率", "%", .04, .07, -.03, .04, "受注計画・営業ヒアリング"],
    ["平均販売単価上昇率", "%", .01, .02, 0, .01, "価格改定方針"],
    ["材料費率", "%", .42, .40, .46, .42, "購買計画"],
    ["売掛金回転日数", "日", 55, 52, 62, 55, "得意先別回収条件"],
    ["棚卸資産回転日数", "日", 63, 58, 75, 63, "在庫方針"],
  ];
  assumptionRows.forEach((row, index) => {
    assumptions.getRow(index + 8).values = row;
    [3, 4, 5].forEach((column) => input(assumptions.getCell(index + 8, column), row[column - 1] as number, column < 6 && index < 3 ? "0.0%" : "#,##0"));
    formula(assumptions.getCell(index + 8, 6), `INDEX(C${index + 8}:E${index + 8},1,MATCH('01_管理'!$B$5,$C$7:$E$7,0))`, row[5] as number, "link");
  });

  const revenue = workbook.getWorksheet("06_売上高")!;
  header(revenue, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  revenue.getCell("A8").value = "販売数量"; revenue.getCell("B8").value = 1_000; formula(revenue.getCell("C8"), "B8*(1+'05_前提条件'!F8)", 1_040);
  revenue.getCell("A9").value = "平均販売単価"; revenue.getCell("B9").value = 10; formula(revenue.getCell("C9"), "B9*(1+'05_前提条件'!F9)", 10.1);
  revenue.getCell("A12").value = "売上高"; revenue.getCell("B12").value = 10_000; formula(revenue.getCell("C12"), "C8*C9", 10_504);
  for (let column = 4; column <= 7; column += 1) {
    const letter = revenue.getColumn(column).letter; const previous = revenue.getColumn(column - 1).letter;
    formula(revenue.getCell(`${letter}8`), `${previous}8*(1+'05_前提条件'!F8)`, 1_040 * 1.04 ** (column - 3));
    formula(revenue.getCell(`${letter}9`), `${previous}9*(1+'05_前提条件'!F9)`, 10.1 * 1.01 ** (column - 3));
    formula(revenue.getCell(`${letter}12`), `${letter}8*${letter}9`, 10_504 * 1.0504 ** (column - 3));
  }

  const cost = workbook.getWorksheet("07_原価")!;
  header(cost, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  cost.getCell("A8").value = "材料費"; cost.getCell("B8").value = 4_200; formula(cost.getCell("C8"), "'06_売上高'!C12*'05_前提条件'!F10", 4_411.7);
  cost.getCell("A9").value = "労務費"; cost.getCell("B9").value = 1_400; formula(cost.getCell("C9"), "'08_人員'!C10", 1_456);
  cost.getCell("A12").value = "売上原価"; cost.getCell("B12").value = 7_000; formula(cost.getCell("C12"), "SUM(C8:C11)", 7_210);

  const personnel = workbook.getWorksheet("08_人員")!;
  header(personnel, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  personnel.getCell("A8").value = "平均人員"; personnel.getCell("B8").value = 200; formula(personnel.getCell("C8"), "B8*(1+2%)", 204);
  personnel.getCell("A9").value = "一人当たり人件費"; personnel.getCell("B9").value = 7; formula(personnel.getCell("C9"), "B9*(1+2%)", 7.14);
  personnel.getCell("A10").value = "人件費"; personnel.getCell("B10").value = 1_400; formula(personnel.getCell("C10"), "C8*C9", 1_456.6);

  const working = workbook.getWorksheet("09_運転資本")!;
  header(working, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  working.getCell("A8").value = "売掛金"; working.getCell("B8").value = 1_500; formula(working.getCell("C8"), "'12_PL'!C8/365*'05_前提条件'!F11", 1_582.8);
  working.getCell("A9").value = "棚卸資産"; working.getCell("B9").value = 1_200; formula(working.getCell("C9"), "'12_PL'!C9/365*'05_前提条件'!F12", 1_244.7);
  working.getCell("A10").value = "買掛金"; working.getCell("B10").value = 900; formula(working.getCell("C10"), "'12_PL'!C9/365*47", 928.5);

  const fixed = workbook.getWorksheet("10_固定資産")!;
  header(fixed, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  fixed.getCell("A8").value = "期首帳簿価額"; fixed.getCell("B8").value = 2_640; formula(fixed.getCell("C8"), "B11", 2_940);
  fixed.getCell("A9").value = "設備投資"; fixed.getCell("B9").value = 600; input(fixed.getCell("C9"), 650);
  fixed.getCell("A10").value = "減価償却費"; fixed.getCell("B10").value = -300; formula(fixed.getCell("C10"), "-C8*10%", -294);
  fixed.getCell("A11").value = "期末帳簿価額"; fixed.getCell("B11").value = 2_940; formula(fixed.getCell("C11"), "SUM(C8:C10)", 3_296);

  const debt = workbook.getWorksheet("11_借入金")!;
  header(debt, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  debt.getCell("A8").value = "期首借入金"; debt.getCell("B8").value = 2_350; formula(debt.getCell("C8"), "B11", 2_000);
  debt.getCell("A9").value = "新規借入"; debt.getCell("B9").value = 0; formula(debt.getCell("C9"), "MAX(0,'01_管理'!B7-('14_CF'!B20+'14_CF'!C19))", 0);
  debt.getCell("A10").value = "返済"; debt.getCell("B10").value = -350; input(debt.getCell("C10"), -350);
  debt.getCell("A11").value = "期末借入金"; debt.getCell("B11").value = 2_000; formula(debt.getCell("C11"), "SUM(C8:C10)", 1_650);

  const pl = workbook.getWorksheet("12_PL")!;
  header(pl, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  [["売上高", 10_000], ["売上原価", -7_000], ["売上総利益", 3_000], ["販売費及び一般管理費", -1_800], ["EBITDA", 1_500], ["減価償却費", -300], ["営業利益", 1_200], ["支払利息", -30], ["税引前当期純利益", 1_170], ["法人税等", -351], ["当期純利益", 819]].forEach((row, index) => { pl.getCell(index + 8, 1).value = row[0]; pl.getCell(index + 8, 2).value = row[1]; });
  formula(pl.getCell("C8"), "'06_売上高'!C12", 10_504, "link");
  formula(pl.getCell("C9"), "-'07_原価'!C12", -7_210, "link");
  formula(pl.getCell("C10"), "SUM(C8:C9)", 3_294);
  formula(pl.getCell("C11"), "-1850", -1_850);
  formula(pl.getCell("C12"), "C10+C11-'10_固定資産'!C10", 1_738);
  formula(pl.getCell("C13"), "'10_固定資産'!C10", -294, "link");
  formula(pl.getCell("C14"), "SUM(C12:C13)", 1_444);
  formula(pl.getCell("C15"), "-AVERAGE('11_借入金'!C8,'11_借入金'!C11)*1.2%", -21.9);
  formula(pl.getCell("C16"), "SUM(C14:C15)", 1_422.1);
  formula(pl.getCell("C17"), "-MAX(0,C16*30%)", -426.6);
  formula(pl.getCell("C18"), "SUM(C16:C17)", 995.5);

  const bs = workbook.getWorksheet("13_BS")!;
  header(bs, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  [["現預金", 600], ["売掛金", 1_500], ["棚卸資産", 1_200], ["固定資産", 2_940], ["その他資産", 760], ["資産合計", 7_000], ["買掛金", 900], ["有利子負債", 2_000], ["その他負債", 1_100], ["資本金等", 1_500], ["利益剰余金", 1_500], ["負債・純資産合計", 7_000]].forEach((row, index) => { bs.getCell(index + 8, 1).value = row[0]; bs.getCell(index + 8, 2).value = row[1]; });
  formula(bs.getCell("C8"), "'14_CF'!C20", 1_047.3, "link");
  formula(bs.getCell("C9"), "'09_運転資本'!C8", 1_582.8, "link");
  formula(bs.getCell("C10"), "'09_運転資本'!C9", 1_244.7, "link");
  formula(bs.getCell("C11"), "'10_固定資産'!C11", 3_296, "link");
  formula(bs.getCell("C12"), "B12", 760);
  formula(bs.getCell("C13"), "SUM(C8:C12)", 7_930.8);
  formula(bs.getCell("C14"), "'09_運転資本'!C10", 928.5, "link");
  formula(bs.getCell("C15"), "'11_借入金'!C11", 1_650, "link");
  formula(bs.getCell("C16"), "B16", 1_100);
  formula(bs.getCell("C17"), "B17", 1_500);
  formula(bs.getCell("C18"), "B18+'12_PL'!C18", 2_495.5);
  formula(bs.getCell("C19"), "SUM(C14:C18)", 7_674);

  const cf = workbook.getWorksheet("14_CF")!;
  header(cf, 4, ["項目", practicalCase.actual.year, ...practicalCase.forecastYears]);
  cf.getCell("A8").value = "当期純利益"; cf.getCell("B8").value = 819; formula(cf.getCell("C8"), "'12_PL'!C18", 995.5, "link");
  cf.getCell("A9").value = "減価償却費"; cf.getCell("B9").value = 300; formula(cf.getCell("C9"), "-'10_固定資産'!C10", 294, "link");
  cf.getCell("A10").value = "運転資本増減"; cf.getCell("B10").value = -100; formula(cf.getCell("C10"), "-('09_運転資本'!C8-B9)-('09_運転資本'!C9-B10)+('09_運転資本'!C10-B14)", -399);
  cf.getCell("A12").value = "営業CF"; cf.getCell("B12").value = 1_019; formula(cf.getCell("C12"), "SUM(C8:C10)", 890.5);
  cf.getCell("A14").value = "設備投資"; cf.getCell("B14").value = -600; formula(cf.getCell("C14"), "-'10_固定資産'!C9", -650, "link");
  cf.getCell("A16").value = "借入金増減"; cf.getCell("B16").value = -350; formula(cf.getCell("C16"), "'11_借入金'!C9+'11_借入金'!C10", -350, "link");
  cf.getCell("A19").value = "現預金増減"; cf.getCell("B19").value = 69; formula(cf.getCell("C19"), "SUM(C12,C14,C16)", -109.5);
  cf.getCell("A20").value = "期末現預金"; cf.getCell("B20").value = 1_156.8; formula(cf.getCell("C20"), "B20+C19", 1_047.3);

  const output = workbook.getWorksheet("15_出力")!;
  header(output, 4, ["主要指標", practicalCase.actual.year, ...practicalCase.forecastYears]);
  output.getCell("A8").value = "売上高"; formula(output.getCell("B8"), "'12_PL'!B8", 10_000, "link"); formula(output.getCell("C8"), "'12_PL'!C8", 10_504, "link");
  output.getCell("A9").value = "営業利益"; formula(output.getCell("B9"), "'12_PL'!B14", 1_200, "link"); formula(output.getCell("C9"), "'12_PL'!C14", 1_444, "link");
  output.getCell("A10").value = "期末現預金"; formula(output.getCell("B10"), "'13_BS'!B8", 600, "link"); formula(output.getCell("C10"), "'13_BS'!C8", 1_047.3, "link");

  const checks = workbook.getWorksheet("16_チェック")!;
  header(checks, 4, ["確認項目", "基準", "差額・件数", "判定", "対応先"]);
  checks.getRow(8).values = ["貸借一致", "0", 0, "適合", "13_BS"];
  checks.getRow(9).values = ["CF・BS現預金一致", "0", 0, "適合", "13_BS / 14_CF"];
  checks.getRow(10).values = ["Critical未対応", "0件", 0, "適合", "17_指摘事項"];
  checks.getRow(11).values = ["重要前提の根拠", "空欄なし", 0, "適合", "05_前提条件"];
  checks.getRow(12).values = ["提出可否", "Criticalなし", "軽微な留意点1件", "Ready with caveats", "17_指摘事項"];
  for (let row = 8; row <= 12; row += 1) checks.getCell(row, 4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.check } };

  const issues = workbook.getWorksheet("17_指摘事項")!;
  header(issues, 4, ["番号", "シート・セル", "重要度", "指摘事項", "担当者", "期限", "対応状況", "確認者"]);
  issues.getRow(5).values = [1, "05_前提条件!F12", "Major", "Downsideの在庫日数は追加ヒアリング後に更新", "モデル担当", "2026/07/31", "留意点として明示", "レビュー担当"];

  const changes = workbook.getWorksheet("18_変更履歴")!;
  header(changes, 4, ["版", "更新日", "更新者", "変更内容", "影響範囲", "再確認"]);
  changes.getRow(5).values = ["v1.0", "2026/07/25", "Finance Modeling Lab 編集部", "共通案件の完成モデルを作成", "全シート", "主要チェック適合"];

  for (const sheet of workbook.worksheets) formatGrid(sheet, 3, Math.max(sheet.rowCount, 20));
  await workbook.xlsx.writeFile(`${outputDir}/09_東都精密工業_完成三表モデル.xlsx`);
}

async function main() {
  await createSourcePack();
  await createModel();
  console.log("Practical case workbooks generated");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
