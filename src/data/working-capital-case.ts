export type WorkingCapitalInput = {
  year?: string;
  revenue: number;
  cogs: number;
  receivableDays: number;
  inventoryDays: number;
  payableDays: number;
  daysInYear: number;
};

export type WorkingCapitalResult = {
  receivables: number;
  inventory: number;
  payables: number;
  netWorkingCapital: number;
  cashConversionCycle: number;
};

export function calculateWorkingCapital(input: WorkingCapitalInput): WorkingCapitalResult {
  if (input.daysInYear <= 0) {
    throw new Error("年間日数は1日以上で入力してください。");
  }

  const numericInputs = [
    ["売上高", input.revenue],
    ["売上原価", input.cogs],
    ["回収日数", input.receivableDays],
    ["在庫回転日数", input.inventoryDays],
    ["支払日数", input.payableDays],
    ["年間日数", input.daysInYear],
  ] as const;

  for (const [label, value] of numericInputs) {
    if (!Number.isFinite(value)) {
      throw new Error(`${label}に有効な数値を入力してください。`);
    }
  }

  const receivables = input.revenue / input.daysInYear * input.receivableDays;
  const inventory = input.cogs / input.daysInYear * input.inventoryDays;
  const payables = input.cogs / input.daysInYear * input.payableDays;

  return {
    receivables,
    inventory,
    payables,
    netWorkingCapital: receivables + inventory - payables,
    cashConversionCycle: input.receivableDays + input.inventoryDays - input.payableDays,
  };
}

const actual = {
  year: "2026/3期",
  revenue: 1_200,
  cogs: 720,
  receivableDays: 45,
  inventoryDays: 60,
  payableDays: 35,
  daysInYear: 365,
} as const satisfies WorkingCapitalInput;

const forecast = {
  year: "2027/3期",
  revenue: 1_320,
  cogs: 792,
  receivableDays: 50,
  inventoryDays: 65,
  payableDays: 40,
  daysInYear: 365,
} as const satisfies WorkingCapitalInput;

const actualResult = calculateWorkingCapital(actual);
const forecastResult = calculateWorkingCapital(forecast);

export const workingCapitalCase = {
  company: "東都パーツ株式会社",
  unit: "百万円",
  actual,
  forecast,
  actualResult,
  forecastResult,
  cashFlowImpact: actualResult.netWorkingCapital - forecastResult.netWorkingCapital,
} as const;

export const workingCapitalPages = [
  {
    href: "/working-capital-model",
    title: "運転資本モデルの作り方",
    shortTitle: "運転資本モデル",
    description: "回転日数から売掛金・棚卸資産・買掛金を予測し、正味運転資本とキャッシュ・フローへ接続します。",
  },
  {
    href: "/working-capital/receivables",
    title: "売掛金の予測と回収日数",
    shortTitle: "売掛金",
    description: "売上高と回収日数から売掛金残高を予測し、延滞や回収条件の変化をモデルへ反映します。",
  },
  {
    href: "/working-capital/inventory",
    title: "棚卸資産の予測と在庫回転日数",
    shortTitle: "棚卸資産",
    description: "売上原価と在庫回転日数から棚卸資産を予測し、滞留在庫や評価減を切り分けます。",
  },
  {
    href: "/working-capital/payables",
    title: "買掛金の予測と支払日数",
    shortTitle: "買掛金",
    description: "売上原価と支払日数から買掛金を予測し、仕入条件と資金繰りへの影響を確認します。",
  },
  {
    href: "/working-capital/cash-conversion-cycle",
    title: "CCCの計算と資金繰りへの影響",
    shortTitle: "CCC分析",
    description: "回収日数・在庫回転日数・支払日数からCCCを計算し、運転資金負担を評価します。",
  },
] as const;

export type WorkingCapitalHref = (typeof workingCapitalPages)[number]["href"];

export const workingCapitalWorkbook = {
  filename: "working-capital-model.xlsx",
  href: "/downloads/working-capital-model.xlsx",
  updated: "2026-07-26",
  sheets: [
    "00_使い方",
    "01_前提条件",
    "02_売掛金",
    "03_棚卸資産",
    "04_買掛金",
    "05_運転資本",
    "06_CCC分析",
    "07_チェック",
  ],
} as const;
