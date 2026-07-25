import ExcelJS from "exceljs";
import {
  practicalCase,
  practicalModelSheets,
  practicalSourceSheets,
} from "../src/data/practical-case";

const outputDir = "public/downloads";
const colors = {
  navy: "FF102235",
  teal: "FF147D73",
  input: "FFE7F0FF",
  link: "FFE9F6EF",
  formula: "FFFFFFFF",
  check: "FFE6F4EA",
  warning: "FFFFF2CC",
  line: "FFD8E0E5",
  white: "FFFFFFFF",
};

function addSheet(workbook: ExcelJS.Workbook, name: string, description: string) {
  const sheet = workbook.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      printArea: "A1:Q60",
    },
  });
  sheet.getColumn(1).width = 24;
  for (let column = 2; column <= 17; column += 1) sheet.getColumn(column).width = 16;
  sheet.mergeCells("A1:Q1");
  sheet.getCell("A1").value = name;
  sheet.getCell("A1").font = { name: "Yu Gothic", size: 16, bold: true, color: { argb: colors.white } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.navy } };
  sheet.mergeCells("A2:Q2");
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

function formatGrid(sheet: ExcelJS.Worksheet, start: number, end: number, columns = 17) {
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

function formula(
  cell: ExcelJS.Cell,
  expression: string,
  result: string | number,
  kind: "formula" | "link" | "check" = "formula",
) {
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

type Forecast = {
  volume: number;
  price: number;
  revenue: number;
  headcount: number;
  payPerPerson: number;
  labor: number;
  materials: number;
  otherManufacturing: number;
  cogs: number;
  sga: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  pbt: number;
  tax: number;
  netIncome: number;
  ar: number;
  inventory: number;
  ap: number;
  nwcChange: number;
  cfo: number;
  capex: number;
  beginFixedAssets: number;
  endFixedAssets: number;
  beginDebt: number;
  newBorrowing: number;
  repayment: number;
  endDebt: number;
  cashChange: number;
  endCash: number;
  retainedEarnings: number;
  totalAssets: number;
  totalLiabilitiesEquity: number;
};

function buildForecast(): Forecast[] {
  const capexPlan = [650, 700, 650, 600, 600];
  const repaymentPlan = [350, 350, 300, 300, 200];
  const forecast: Forecast[] = [];
  let volume = 1_000;
  let price = 10;
  let headcount = 200;
  let payPerPerson = 7;
  let ar = 1_500;
  let inventory = 1_200;
  let ap = 900;
  let cash = 600;
  let fixedAssets = 2_940;
  let debt = 2_000;
  let retainedEarnings = 1_500;

  for (let index = 0; index < practicalCase.forecastYears.length; index += 1) {
    volume *= 1.04;
    price *= 1.01;
    const revenue = volume * price;
    headcount *= 1.02;
    payPerPerson *= 1.02;
    const labor = headcount * payPerPerson;
    const materials = revenue * 0.42;
    const otherManufacturing = revenue * 0.14;
    const cogs = materials + labor + otherManufacturing;
    const sga = revenue * 0.15;
    const ebitda = revenue - cogs - sga;
    const beginFixedAssets = fixedAssets;
    const depreciation = beginFixedAssets * 0.10;
    const endFixedAssets = beginFixedAssets + capexPlan[index] - depreciation;
    const beginDebt = debt;
    const interest = beginDebt * 0.012;
    const ebit = ebitda - depreciation;
    const pbt = ebit - interest;
    const tax = Math.max(0, pbt * 0.30);
    const netIncome = pbt - tax;
    const nextAr = revenue / 365 * 55;
    const nextInventory = cogs / 365 * 63;
    const nextAp = cogs / 365 * 47;
    const nwcChange = (nextAr + nextInventory - nextAp) - (ar + inventory - ap);
    const cfo = netIncome + depreciation - nwcChange;
    const repayment = -Math.min(repaymentPlan[index], beginDebt);
    const preFinancingCash = cash + cfo - capexPlan[index] + repayment;
    const newBorrowing = Math.max(0, 500 - preFinancingCash);
    const endDebt = beginDebt + newBorrowing + repayment;
    const cashChange = cfo - capexPlan[index] + newBorrowing + repayment;
    const endCash = cash + cashChange;
    retainedEarnings += netIncome;
    const totalAssets = endCash + nextAr + nextInventory + endFixedAssets + 760;
    const totalLiabilitiesEquity = nextAp + endDebt + 1_100 + 1_500 + retainedEarnings;

    forecast.push({
      volume,
      price,
      revenue,
      headcount,
      payPerPerson,
      labor,
      materials,
      otherManufacturing,
      cogs,
      sga,
      ebitda,
      depreciation,
      ebit,
      interest,
      pbt,
      tax,
      netIncome,
      ar: nextAr,
      inventory: nextInventory,
      ap: nextAp,
      nwcChange,
      cfo,
      capex: capexPlan[index],
      beginFixedAssets,
      endFixedAssets,
      beginDebt,
      newBorrowing,
      repayment,
      endDebt,
      cashChange,
      endCash,
      retainedEarnings,
      totalAssets,
      totalLiabilitiesEquity,
    });

    ar = nextAr;
    inventory = nextInventory;
    ap = nextAp;
    cash = endCash;
    fixedAssets = endFixedAssets;
    debt = endDebt;
  }

  return forecast;
}

async function createSourcePack() {
  const workbook = new ExcelJS.Workbook();
  initialize(workbook);
  for (const name of practicalSourceSheets) {
    addSheet(workbook, name, `${practicalCase.company}｜受領資料｜単位：${practicalCase.unit}`);
  }

  const guide = workbook.getWorksheet("00_使い方")!;
  guide.getCell("A3").value = "会社名";
  guide.getCell("B3").value = practicalCase.company;
  header(guide, 4, ["項目", "内容", "確認"]);
  [
    ["作業目的", "受領資料を残高試算表からPL・BSへ組み替え、完成三表モデルの実績値へ接続する", "資料番号と勘定科目対応を記録"],
    ["意図的な差異", "固定資産台帳と借入金明細には、試算表との確認対象差異を含む", "差額を原因不明のままモデルへ入れない"],
    ["完成成果物", "資料管理表、勘定科目対応表、実績財務諸表、正常化調整一覧", "元資料からモデルセルまで追跡可能にする"],
  ].forEach((row, index) => { guide.getRow(index + 5).values = row; });

  const tb = workbook.getWorksheet("01_月次試算表")!;
  header(tb, 4, ["勘定科目", ...Array.from({ length: 12 }, (_, index) => `${index + 4}月`), "年度計", "区分", "年度末残高", "残高方向"]);
  const monthlyRevenue = [780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 870];
  const evenly = (annual: number) => Array.from({ length: 12 }, () => annual / 12);
  const tbRows: Array<[string, number[], string, number, string]> = [
    ["現預金", Array(12).fill(0), "BS", 600, "借方"],
    ["売掛金", Array(12).fill(0), "BS", 1_500, "借方"],
    ["棚卸資産", Array(12).fill(0), "BS", 1_200, "借方"],
    ["固定資産", Array(12).fill(0), "BS", 3_000, "借方"],
    ["その他資産", Array(12).fill(0), "BS", 760, "借方"],
    ["買掛金", Array(12).fill(0), "BS", 900, "貸方"],
    ["有利子負債", Array(12).fill(0), "BS", 2_000, "貸方"],
    ["その他負債", Array(12).fill(0), "BS", 1_100, "貸方"],
    ["資本金等", Array(12).fill(0), "BS", 1_500, "貸方"],
    ["利益剰余金", Array(12).fill(0), "BS", 1_560, "貸方"],
    ["売上高", monthlyRevenue, "PL", 10_000, "貸方"],
    ["売上原価", monthlyRevenue.map((value) => value * 0.7), "PL", 7_000, "借方"],
    ["販売費及び一般管理費（減価償却費除く）", evenly(1_500), "PL", 1_500, "借方"],
    ["減価償却費", evenly(300), "PL", 300, "借方"],
    ["支払利息", evenly(30), "PL", 30, "借方"],
    ["法人税等", evenly(351), "PL", 351, "借方"],
  ];
  tbRows.forEach(([label, months, category, balance, direction], rowIndex) => {
    const row = rowIndex + 6;
    tb.getCell(row, 1).value = label;
    months.forEach((value, index) => { tb.getCell(row, index + 2).value = value; });
    const annual = category === "PL" ? months.reduce((sum, value) => sum + value, 0) : 0;
    formula(tb.getCell(row, 14), `SUM(B${row}:M${row})`, annual);
    tb.getCell(row, 15).value = category;
    tb.getCell(row, 16).value = balance;
    tb.getCell(row, 17).value = direction;
  });

  const gl = workbook.getWorksheet("02_勘定科目明細")!;
  header(gl, 4, ["伝票日", "伝票番号", "勘定科目", "摘要", "借方", "貸方", "確認事項"]);
  [
    ["2025/03/31", "JV-250331-01", "外注費", "請求書未着分", 120, 0, "検収記録と照合"],
    ["2025/03/31", "JV-250331-02", "役員退職金", "退任役員1名", 80, 0, "正常化調整候補"],
    ["2025/03/31", "JV-250331-03", "減価償却費", "期末償却", 300, 0, "固定資産台帳と照合"],
  ].forEach((row, index) => { gl.getRow(index + 5).values = row; });

  const sales = workbook.getWorksheet("03_販売実績")!;
  header(sales, 4, ["製品", "地域", "販売数量", "平均販売単価", "売上高", "構成比"]);
  [["製品A", "国内", 500, 10, 5_000], ["製品A", "海外", 200, 10, 2_000], ["製品B", "国内", 100, 20, 2_000], ["製品B", "海外", 50, 20, 1_000]].forEach((row, index) => {
    sales.getRow(index + 5).values = row;
    formula(sales.getCell(index + 5, 6), `E${index + 5}/SUM($E$5:$E$8)`, (row[4] as number) / 10_000);
  });

  const plan = workbook.getWorksheet("04_事業計画")!;
  header(plan, 4, ["項目", ...practicalCase.forecastYears, "確認事項"]);
  plan.getRow(5).values = ["売上高", 10_800, 11_500, 12_200, 12_800, 13_400, "数量×単価の積上げ計画10,504との差異を確認"];
  plan.getRow(6).values = ["設備投資", 650, 700, 650, 600, 600, "固定資産台帳と設備投資計画を照合"];
  plan.getRow(7).values = ["借入金返済", 350, 350, 300, 300, 200, "借入金明細の約定返済と照合"];

  const fa = workbook.getWorksheet("05_固定資産台帳")!;
  header(fa, 4, ["資産番号", "資産名", "取得価額", "累計償却", "当期増減", "期末帳簿価額", "試算表差額"]);
  const faRows = [
    ["FA-001", "本社工場", 2_000, 700, 0, 1_300, 0],
    ["FA-002", "製造設備A", 1_500, 700, 100, 900, 0],
    ["FA-003", "製造設備B", 1_200, 600, 40, 640, 0],
    ["FA-004", "工具器具備品", 300, 200, 0, 100, 0],
  ];
  faRows.forEach((row, index) => { fa.getRow(index + 8).values = row; });
  fa.getCell("A12").value = "台帳合計";
  formula(fa.getCell("F12"), "SUM(F8:F11)", 2_940);
  fa.getCell("G12").value = -60;

  const debt = workbook.getWorksheet("06_借入金明細")!;
  header(debt, 4, ["金融機関", "契約番号", "金利", "最終期限", "約定返済", "期末残高", "試算表差額"]);
  [["A銀行", "TL-01", 0.012, "2029/03/31", 200, 1_200, 0], ["B銀行", "TL-02", 0.015, "2027/03/31", 150, 750, 0]].forEach((row, index) => { debt.getRow(index + 6).values = row; });
  debt.getCell("A8").value = "明細合計";
  formula(debt.getCell("F8"), "SUM(F6:F7)", 1_950);
  debt.getCell("G8").value = -50;

  const wc = workbook.getWorksheet("07_運転資本明細")!;
  header(wc, 4, ["区分", "相手先・品目", "期末残高", "契約条件", "実績日数", "確認事項"]);
  [["売掛金", "主要顧客合計", 1_500, "月末締め翌月末", 55, "検収時期を含む"], ["棚卸資産", "原材料・仕掛品・製品", 1_200, "安全在庫2か月", 63, "滞留在庫を確認"], ["買掛金", "主要仕入先合計", 900, "月末締め翌月末", 47, "材料費を基礎"]].forEach((row, index) => { wc.getRow(index + 5).values = row; });

  const log = workbook.getWorksheet("08_資料管理")!;
  header(log, 4, ["資料番号", "資料名", "基準日", "入手元", "使用先", "差異・不足", "状況", "担当者"]);
  [
    ["S-01", "月次試算表", "2025/03/31", "経理部", "03_実績財務諸表", "なし", "確認済", "モデル担当"],
    ["S-02", "固定資産台帳", "2025/03/31", "経理部", "10_固定資産", "試算表より60少ない", "要確認", "経理部"],
    ["S-03", "借入金明細", "2025/03/31", "財務部", "11_借入金", "試算表より50少ない", "要確認", "財務部"],
    ["S-04", "勘定科目対応表", "2025/03/31", "モデル担当", "03_実績財務諸表", "全主要科目を対応済", "確認済", "レビュー担当"],
  ].forEach((row, index) => { log.getRow(index + 5).values = row; });

  const mapping = workbook.getWorksheet("09_勘定科目対応")!;
  header(mapping, 4, ["受領勘定科目", "区分", "モデルシート", "モデル行", "符号", "資料番号", "調整方針"]);
  [
    ["現預金", "BS", "13_BS", "現預金", 1, "S-01", "試算表残高を採用"],
    ["売掛金", "BS", "13_BS", "売掛金", 1, "S-01", "運転資本明細と照合"],
    ["棚卸資産", "BS", "13_BS", "棚卸資産", 1, "S-01", "滞留在庫は別途評価"],
    ["固定資産", "BS", "13_BS", "固定資産", 1, "S-02", "台帳差額60は試算表残高へ調整"],
    ["買掛金", "BS", "13_BS", "買掛金", 1, "S-01", "運転資本明細と照合"],
    ["有利子負債", "BS", "13_BS", "有利子負債", 1, "S-03", "明細差額50は未受領契約として確認"],
    ["売上高", "PL", "12_PL", "売上高", 1, "S-01", "販売実績と照合"],
    ["売上原価", "PL", "12_PL", "売上原価", -1, "S-01", "材料費・労務費・その他へ分解"],
    ["販売費及び一般管理費（減価償却費除く）", "PL", "12_PL", "販売費及び一般管理費", -1, "S-01", "役員退職金80を正常化調整"],
  ].forEach((row, index) => { mapping.getRow(index + 5).values = row; });

  for (const sheet of workbook.worksheets) formatGrid(sheet, 3, Math.max(sheet.rowCount, 12));
  await workbook.xlsx.writeFile(`${outputDir}/08_東都精密工業_受領資料パック.xlsx`);
}

async function createModel() {
  const forecast = buildForecast();
  const workbook = new ExcelJS.Workbook();
  initialize(workbook);
  for (const name of practicalModelSheets) {
    addSheet(workbook, name, `${practicalCase.company}｜完成三表モデル｜単位：${practicalCase.unit}`);
  }

  const cover = workbook.getWorksheet("00_表紙")!;
  cover.getCell("A3").value = "会社名";
  cover.getCell("B3").value = practicalCase.company;
  cover.getCell("A4").value = "モデル目的";
  cover.getCell("B4").value = "事業計画、資金繰り、財務三表の検証";
  cover.getCell("A5").value = "基準日";
  cover.getCell("B5").value = "2025/03/31";
  cover.getCell("A6").value = "計算整合性";
  formula(cover.getCell("B6"), `IF(COUNTIF('16_チェック'!D8:D14,"不適合")=0,"適合","不適合")`, "適合", "check");
  cover.getCell("A7").value = "意思決定への利用可否";
  cover.getCell("B7").value = "教育用・実案件への利用不可";

  const control = workbook.getWorksheet("01_管理")!;
  header(control, 4, ["項目", "設定値", "説明"]);
  control.getCell("A5").value = "選択シナリオ";
  input(control.getCell("B5"), "Base");
  control.getCell("A6").value = "単位";
  control.getCell("B6").value = practicalCase.unit;
  control.getCell("A7").value = "最低現預金";
  input(control.getCell("B7"), 500);
  control.getCell("A8").value = "計算順序";
  control.getCell("B8").value = "前提→売上高・人員・原価・固定資産→PL→運転資本→CF→借入金→BS";

  const sourceLog = workbook.getWorksheet("02_資料管理")!;
  header(sourceLog, 4, ["資料番号", "資料名", "基準日", "使用シート", "主要セル", "状況", "参照先セル"]);
  [
    ["S-01", "月次試算表", "2025/03/31", "03_実績財務諸表", "B8:D30", "確認済", "12_PL!B8:B18 / 13_BS!B8:B19"],
    ["S-02", "固定資産台帳", "2025/03/31", "10_固定資産", "B8:G11", "差異60を調整済", "10_固定資産!B8:B11"],
    ["S-03", "借入金明細", "2025/03/31", "11_借入金", "B8:G11", "差異50を調整済", "11_借入金!B8:B11"],
    ["S-04", "勘定科目対応表", "2025/03/31", "03_実績財務諸表", "全主要科目", "確認済", "03_実績財務諸表!B8:D19"],
  ].forEach((row, index) => { sourceLog.getRow(index + 5).values = row; });

  const historical = workbook.getWorksheet("03_実績財務諸表")!;
  header(historical, 4, ["PL", practicalCase.actual.year, "BS", practicalCase.actual.year]);
  [["売上高", 10_000], ["売上原価", -7_000], ["売上総利益", 3_000], ["販売費及び一般管理費", -1_500], ["EBITDA", 1_500], ["減価償却費", -300], ["営業利益", 1_200], ["支払利息", -30], ["税引前当期純利益", 1_170], ["法人税等", -351], ["当期純利益", 819]].forEach((row, index) => { historical.getRow(index + 8).values = row; });
  [["現預金", 600], ["売掛金", 1_500], ["棚卸資産", 1_200], ["固定資産", 2_940], ["その他資産", 760], ["資産合計", 7_000], ["買掛金", 900], ["有利子負債", 2_000], ["その他負債", 1_100], ["資本金等", 1_500], ["利益剰余金", 1_500], ["負債・純資産合計", 7_000]].forEach((row, index) => {
    historical.getCell(index + 8, 3).value = row[0];
    historical.getCell(index + 8, 4).value = row[1];
  });

  const adjustments = workbook.getWorksheet("04_正常化調整")!;
  header(adjustments, 4, ["番号", "項目", "金額", "PL影響", "根拠", "採否"]);
  adjustments.getRow(5).values = [1, "役員退職金", 80, "加算", "退任役員1名の一過性費用", "採用"];

  const assumptions = workbook.getWorksheet("05_前提条件")!;
  header(assumptions, 7, ["前提項目", "単位", "Base", "Upside", "Downside", "選択値", "出所・根拠"]);
  const assumptionRows: Array<[string, string, number, number, number, string, string]> = [
    ["販売数量成長率", "%", .04, .07, -.03, "0.0%", "受注計画・営業ヒアリング"],
    ["平均販売単価上昇率", "%", .01, .02, 0, "0.0%", "価格改定方針"],
    ["材料費率", "%", .42, .40, .46, "0.0%", "購買計画"],
    ["売掛金回転日数", "日", 55, 52, 62, "#,##0", "得意先別回収条件"],
    ["棚卸資産回転日数", "日", 63, 58, 75, "#,##0", "在庫方針"],
    ["買掛金回転日数", "日", 47, 50, 42, "#,##0", "仕入先別支払条件"],
    ["人員増加率", "%", .02, .03, 0, "0.0%", "人員計画"],
    ["一人当たり人件費上昇率", "%", .02, .02, .015, "0.0%", "給与改定方針"],
    ["その他製造費率", "%", .14, .13, .15, "0.0%", "製造費実績"],
    ["販売費及び一般管理費率", "%", .15, .145, .16, "0.0%", "部門別予算"],
    ["実効税率", "%", .30, .30, .30, "0.0%", "簡略化した教育用前提"],
    ["借入金利", "%", .012, .012, .015, "0.0%", "借入金明細"],
    ["設備投資", "百万円", 650, 650, 500, "#,##0", "設備投資計画（初年度。以降は年度別計画）"],
    ["約定返済", "百万円", 350, 350, 350, "#,##0", "借入金明細（初年度。以降は年度別計画）"],
  ];
  assumptionRows.forEach((row, index) => {
    const excelRow = index + 8;
    assumptions.getCell(excelRow, 1).value = row[0];
    assumptions.getCell(excelRow, 2).value = row[1];
    [3, 4, 5].forEach((column) => input(assumptions.getCell(excelRow, column), row[column - 1] as number, row[5]));
    formula(assumptions.getCell(excelRow, 6), `INDEX(C${excelRow}:E${excelRow},1,MATCH('01_管理'!$B$5,$C$7:$E$7,0))`, row[2], "link");
    assumptions.getCell(excelRow, 7).value = row[6];
  });

  const yearHeaders = ["項目", practicalCase.actual.year, ...practicalCase.forecastYears];
  for (const name of ["06_売上高", "07_原価", "08_人員", "09_運転資本", "10_固定資産", "11_借入金", "12_PL", "13_BS", "14_CF", "15_出力"]) {
    header(workbook.getWorksheet(name)!, 4, yearHeaders);
  }

  const revenue = workbook.getWorksheet("06_売上高")!;
  [["販売数量", 1_000], ["平均販売単価", 10], ["売上高", 10_000]].forEach(([label, value], index) => {
    const row = [8, 9, 12][index];
    revenue.getCell(row, 1).value = label;
    revenue.getCell(row, 2).value = value;
  });

  const cost = workbook.getWorksheet("07_原価")!;
  [["材料費", 4_200], ["労務費", 1_400], ["その他製造費", 1_400], ["売上原価", 7_000]].forEach(([label, value], index) => {
    const row = [8, 9, 10, 12][index];
    cost.getCell(row, 1).value = label;
    cost.getCell(row, 2).value = value;
  });

  const personnel = workbook.getWorksheet("08_人員")!;
  [["平均人員", 200], ["一人当たり人件費", 7], ["人件費", 1_400]].forEach(([label, value], index) => {
    personnel.getCell(index + 8, 1).value = label;
    personnel.getCell(index + 8, 2).value = value;
  });

  const working = workbook.getWorksheet("09_運転資本")!;
  [["売掛金", 1_500], ["棚卸資産", 1_200], ["買掛金", 900]].forEach(([label, value], index) => {
    working.getCell(index + 8, 1).value = label;
    working.getCell(index + 8, 2).value = value;
  });

  const fixed = workbook.getWorksheet("10_固定資産")!;
  [["期首帳簿価額", 2_640], ["設備投資", 600], ["減価償却費", -300], ["期末帳簿価額", 2_940]].forEach(([label, value], index) => {
    fixed.getCell(index + 8, 1).value = label;
    fixed.getCell(index + 8, 2).value = value;
  });

  const debt = workbook.getWorksheet("11_借入金")!;
  [["期首借入金", 2_350], ["新規借入", 0], ["返済", -350], ["期末借入金", 2_000]].forEach(([label, value], index) => {
    debt.getCell(index + 8, 1).value = label;
    debt.getCell(index + 8, 2).value = value;
  });

  const pl = workbook.getWorksheet("12_PL")!;
  [["売上高", 10_000], ["売上原価", -7_000], ["売上総利益", 3_000], ["販売費及び一般管理費", -1_500], ["EBITDA", 1_500], ["減価償却費", -300], ["営業利益", 1_200], ["支払利息", -30], ["税引前当期純利益", 1_170], ["法人税等", -351], ["当期純利益", 819]].forEach(([label, value], index) => {
    pl.getCell(index + 8, 1).value = label;
    pl.getCell(index + 8, 2).value = value;
  });

  const bs = workbook.getWorksheet("13_BS")!;
  [["現預金", 600], ["売掛金", 1_500], ["棚卸資産", 1_200], ["固定資産", 2_940], ["その他資産", 760], ["資産合計", 7_000], ["買掛金", 900], ["有利子負債", 2_000], ["その他負債", 1_100], ["資本金等", 1_500], ["利益剰余金", 1_500], ["負債・純資産合計", 7_000]].forEach(([label, value], index) => {
    bs.getCell(index + 8, 1).value = label;
    bs.getCell(index + 8, 2).value = value;
  });

  const cf = workbook.getWorksheet("14_CF")!;
  [["当期純利益", 819], ["減価償却費", 300], ["運転資本増減", -100], ["営業CF", 1_019], ["設備投資", -600], ["借入金増減", -350], ["現預金増減", 69], ["期末現預金", 600]].forEach(([label, value], index) => {
    const row = [8, 9, 10, 12, 14, 16, 19, 20][index];
    cf.getCell(row, 1).value = label;
    cf.getCell(row, 2).value = value;
  });

  const output = workbook.getWorksheet("15_出力")!;
  [["売上高", 10_000], ["営業利益", 1_200], ["期末現預金", 600], ["有利子負債", 2_000], ["貸借差額", 0], ["EBITDA", 1_500], ["EBITDAマージン", .15], ["純有利子負債", 1_400], ["最低現預金余裕額", 100]].forEach(([label, value], index) => {
    output.getCell(index + 8, 1).value = label;
    const actualExpressions = [
      "'12_PL'!B8",
      "'12_PL'!B14",
      "'13_BS'!B8",
      "'13_BS'!B15",
      "'13_BS'!B13-'13_BS'!B19",
      "'12_PL'!B12",
      "B13/B8",
      "B11-B10",
      "B10-'01_管理'!$B$7",
    ];
    formula(output.getCell(index + 8, 2), actualExpressions[index], value as number, "link");
  });
  output.getRow(14).numFmt = "0.0%";

  for (let index = 0; index < forecast.length; index += 1) {
    const values = forecast[index];
    const column = index + 3;
    const letter = revenue.getColumn(column).letter;
    const previous = revenue.getColumn(column - 1).letter;

    formula(revenue.getCell(8, column), `${previous}8*(1+'05_前提条件'!F8)`, values.volume);
    formula(revenue.getCell(9, column), `${previous}9*(1+'05_前提条件'!F9)`, values.price);
    formula(revenue.getCell(12, column), `${letter}8*${letter}9`, values.revenue);

    formula(personnel.getCell(8, column), `${previous}8*(1+'05_前提条件'!F14)`, values.headcount);
    formula(personnel.getCell(9, column), `${previous}9*(1+'05_前提条件'!F15)`, values.payPerPerson);
    formula(personnel.getCell(10, column), `${letter}8*${letter}9`, values.labor);

    formula(cost.getCell(8, column), `'06_売上高'!${letter}12*'05_前提条件'!F10`, values.materials, "link");
    formula(cost.getCell(9, column), `'08_人員'!${letter}10`, values.labor, "link");
    formula(cost.getCell(10, column), `'06_売上高'!${letter}12*'05_前提条件'!F16`, values.otherManufacturing, "link");
    formula(cost.getCell(12, column), `SUM(${letter}8:${letter}10)`, values.cogs);

    formula(fixed.getCell(8, column), `${previous}11`, values.beginFixedAssets);
    const capexFormula = `CHOOSE(COLUMN()-2,650,700,650,600,600)`;
    formula(fixed.getCell(9, column), capexFormula, values.capex);
    formula(fixed.getCell(10, column), `-${letter}8*10%`, -values.depreciation);
    formula(fixed.getCell(11, column), `SUM(${letter}8:${letter}10)`, values.endFixedAssets);

    formula(pl.getCell(8, column), `'06_売上高'!${letter}12`, values.revenue, "link");
    formula(pl.getCell(9, column), `-'07_原価'!${letter}12`, -values.cogs, "link");
    formula(pl.getCell(10, column), `SUM(${letter}8:${letter}9)`, values.revenue - values.cogs);
    formula(pl.getCell(11, column), `-${letter}8*'05_前提条件'!F17`, -values.sga);
    formula(pl.getCell(12, column), `SUM(${letter}10:${letter}11)`, values.ebitda);
    formula(pl.getCell(13, column), `'10_固定資産'!${letter}10`, -values.depreciation, "link");
    formula(pl.getCell(14, column), `SUM(${letter}12:${letter}13)`, values.ebit);
    formula(pl.getCell(15, column), `-'11_借入金'!${letter}8*'05_前提条件'!F19`, -values.interest);
    formula(pl.getCell(16, column), `SUM(${letter}14:${letter}15)`, values.pbt);
    formula(pl.getCell(17, column), `-MAX(0,${letter}16*'05_前提条件'!F18)`, -values.tax);
    formula(pl.getCell(18, column), `SUM(${letter}16:${letter}17)`, values.netIncome);

    formula(working.getCell(8, column), `'12_PL'!${letter}8/365*'05_前提条件'!F11`, values.ar, "link");
    formula(working.getCell(9, column), `-'12_PL'!${letter}9/365*'05_前提条件'!F12`, values.inventory, "link");
    formula(working.getCell(10, column), `-'12_PL'!${letter}9/365*'05_前提条件'!F13`, values.ap, "link");

    formula(cf.getCell(8, column), `'12_PL'!${letter}18`, values.netIncome, "link");
    formula(cf.getCell(9, column), `-'10_固定資産'!${letter}10`, values.depreciation, "link");
    formula(cf.getCell(10, column), `-(('09_運転資本'!${letter}8-'09_運転資本'!${previous}8)+('09_運転資本'!${letter}9-'09_運転資本'!${previous}9)-('09_運転資本'!${letter}10-'09_運転資本'!${previous}10))`, -values.nwcChange);
    formula(cf.getCell(12, column), `SUM(${letter}8:${letter}10)`, values.cfo);
    formula(cf.getCell(14, column), `-'10_固定資産'!${letter}9`, -values.capex, "link");

    formula(debt.getCell(8, column), `${previous}11`, values.beginDebt);
    const scheduledRepayment = [350, 350, 300, 300, 200][index];
    formula(debt.getCell(10, column), `-MIN(${letter}8,${scheduledRepayment})`, values.repayment);
    formula(debt.getCell(9, column), `MAX(0,'01_管理'!$B$7-('13_BS'!${previous}8+'14_CF'!${letter}12-'10_固定資産'!${letter}9+${letter}10))`, values.newBorrowing);
    formula(debt.getCell(11, column), `SUM(${letter}8:${letter}10)`, values.endDebt);

    formula(cf.getCell(16, column), `'11_借入金'!${letter}9+'11_借入金'!${letter}10`, values.newBorrowing + values.repayment, "link");
    formula(cf.getCell(19, column), `SUM(${letter}12,${letter}14,${letter}16)`, values.cashChange);
    formula(cf.getCell(20, column), `${previous}20+${letter}19`, values.endCash);

    formula(bs.getCell(8, column), `'14_CF'!${letter}20`, values.endCash, "link");
    formula(bs.getCell(9, column), `'09_運転資本'!${letter}8`, values.ar, "link");
    formula(bs.getCell(10, column), `'09_運転資本'!${letter}9`, values.inventory, "link");
    formula(bs.getCell(11, column), `'10_固定資産'!${letter}11`, values.endFixedAssets, "link");
    formula(bs.getCell(12, column), `${previous}12`, 760);
    formula(bs.getCell(13, column), `SUM(${letter}8:${letter}12)`, values.totalAssets);
    formula(bs.getCell(14, column), `'09_運転資本'!${letter}10`, values.ap, "link");
    formula(bs.getCell(15, column), `'11_借入金'!${letter}11`, values.endDebt, "link");
    formula(bs.getCell(16, column), `${previous}16`, 1_100);
    formula(bs.getCell(17, column), `${previous}17`, 1_500);
    formula(bs.getCell(18, column), `${previous}18+'12_PL'!${letter}18`, values.retainedEarnings);
    formula(bs.getCell(19, column), `SUM(${letter}14:${letter}18)`, values.totalLiabilitiesEquity);

    formula(output.getCell(8, column), `'12_PL'!${letter}8`, values.revenue, "link");
    formula(output.getCell(9, column), `'12_PL'!${letter}14`, values.ebit, "link");
    formula(output.getCell(10, column), `'13_BS'!${letter}8`, values.endCash, "link");
    formula(output.getCell(11, column), `'13_BS'!${letter}15`, values.endDebt, "link");
    formula(output.getCell(12, column), `'13_BS'!${letter}13-'13_BS'!${letter}19`, values.totalAssets - values.totalLiabilitiesEquity, "check");
    formula(output.getCell(13, column), `'12_PL'!${letter}12`, values.ebitda, "link");
    formula(output.getCell(14, column), `${letter}13/${letter}8`, values.ebitda / values.revenue);
    output.getCell(14, column).numFmt = "0.0%";
    formula(output.getCell(15, column), `${letter}11-${letter}10`, values.endDebt - values.endCash);
    formula(output.getCell(16, column), `${letter}10-'01_管理'!$B$7`, values.endCash - 500);
  }

  const checks = workbook.getWorksheet("16_チェック")!;
  header(checks, 4, ["確認項目", "基準", "差額・件数", "判定", "対応先"]);
  const checkRows: Array<[string, string, string, number, string]> = [
    ["貸借一致", "最大差額0.1未満", `MAX(ABS('13_BS'!C13-'13_BS'!C19),ABS('13_BS'!D13-'13_BS'!D19),ABS('13_BS'!E13-'13_BS'!E19),ABS('13_BS'!F13-'13_BS'!F19),ABS('13_BS'!G13-'13_BS'!G19))`, 0, "13_BS"],
    ["CF・BS現預金一致", "最大差額0.1未満", `MAX(ABS('13_BS'!C8-'14_CF'!C20),ABS('13_BS'!D8-'14_CF'!D20),ABS('13_BS'!E8-'14_CF'!E20),ABS('13_BS'!F8-'14_CF'!F20),ABS('13_BS'!G8-'14_CF'!G20))`, 0, "13_BS / 14_CF"],
    ["固定資産ロールフォワード", "最大差額0.1未満", `MAX(ABS('10_固定資産'!C8+'10_固定資産'!C9+'10_固定資産'!C10-'10_固定資産'!C11),ABS('10_固定資産'!D8+'10_固定資産'!D9+'10_固定資産'!D10-'10_固定資産'!D11),ABS('10_固定資産'!E8+'10_固定資産'!E9+'10_固定資産'!E10-'10_固定資産'!E11),ABS('10_固定資産'!F8+'10_固定資産'!F9+'10_固定資産'!F10-'10_固定資産'!F11),ABS('10_固定資産'!G8+'10_固定資産'!G9+'10_固定資産'!G10-'10_固定資産'!G11))`, 0, "10_固定資産"],
    ["借入金ロールフォワード", "最大差額0.1未満", `MAX(ABS('11_借入金'!C8+'11_借入金'!C9+'11_借入金'!C10-'11_借入金'!C11),ABS('11_借入金'!D8+'11_借入金'!D9+'11_借入金'!D10-'11_借入金'!D11),ABS('11_借入金'!E8+'11_借入金'!E9+'11_借入金'!E10-'11_借入金'!E11),ABS('11_借入金'!F8+'11_借入金'!F9+'11_借入金'!F10-'11_借入金'!F11),ABS('11_借入金'!G8+'11_借入金'!G9+'11_借入金'!G10-'11_借入金'!G11))`, 0, "11_借入金"],
    ["予測期間の空欄", "0件", `(55-COUNTA('12_PL'!C8:G18))+(60-COUNTA('13_BS'!C8:G19))+(40-COUNTA('14_CF'!C8:G10)-COUNTA('14_CF'!C12:G12)-COUNTA('14_CF'!C14:G14)-COUNTA('14_CF'!C16:G16)-COUNTA('14_CF'!C19:G20))`, 0, "12_PL / 13_BS / 14_CF"],
    ["Critical未対応", "0件", `COUNTIFS('17_指摘事項'!C5:C50,"Critical",'17_指摘事項'!G5:G50,"<>対応済")`, 0, "17_指摘事項"],
    ["重要前提の根拠", "空欄なし", `COUNTBLANK('05_前提条件'!G8:G21)`, 0, "05_前提条件"],
  ];
  checkRows.forEach(([label, basis, expression, result, target], index) => {
    const row = index + 8;
    checks.getCell(row, 1).value = label;
    checks.getCell(row, 2).value = basis;
    formula(checks.getCell(row, 3), expression, result, "check");
    formula(checks.getCell(row, 4), `IF(ABS(C${row})<0.1,"適合","不適合")`, "適合", "check");
    checks.getCell(row, 5).value = target;
  });
  checks.getCell("A15").value = "提出可否";
  checks.getCell("B15").value = "不適合なし、Majorは留意点として明示";
  formula(checks.getCell("C15"), `COUNTIF(D8:D14,"不適合")`, 0, "check");
  formula(checks.getCell("D15"), `IF(C15>0,"Not ready",IF(COUNTIFS('17_指摘事項'!C5:C50,"Major",'17_指摘事項'!G5:G50,"<>対応済")>0,"Ready with caveats","Ready"))`, "Ready with caveats", "check");
  checks.getCell("E15").value = "17_指摘事項";

  const issues = workbook.getWorksheet("17_指摘事項")!;
  header(issues, 4, ["番号", "シート・セル", "重要度", "指摘事項", "担当者", "期限", "対応状況", "確認者"]);
  issues.getRow(5).values = [1, "05_前提条件!F12", "Major", "Downsideの在庫日数は追加ヒアリング後に更新", "モデル担当", "2026/07/31", "留意点として明示", "レビュー担当"];

  const changes = workbook.getWorksheet("18_変更履歴")!;
  header(changes, 4, ["版", "更新日", "更新者", "変更内容", "影響範囲", "再確認"]);
  changes.getRow(5).values = ["v1.1", "2026/07/25", "Finance Modeling Lab 編集部", "5年連動、貸借一致、数式チェック、勘定科目対応を修正", "全シート", "主要チェック適合"];

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
