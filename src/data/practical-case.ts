export type PracticalStage = {
  id: string;
  no: number;
  title: string;
  href: string;
  purpose: string;
  inputs: string[];
  deliverables: string[];
  excel: string[];
  checks: string[];
  reviewComment: string;
  nextHref?: string;
};

export const practicalCase = {
  company: "東都精密工業株式会社",
  business: "産業機器向け精密部品の製造・販売（架空）",
  unit: "百万円",
  yearEnd: "3月",
  actual: {
    year: "2025年3月期",
    revenue: 10_000,
    costOfSales: 7_000,
    grossProfit: 3_000,
    sga: 1_800,
    ebitda: 1_500,
    operatingProfit: 1_200,
    cash: 600,
    accountsReceivable: 1_500,
    inventory: 1_200,
    accountsPayable: 900,
    debt: 2_000,
    capex: 600,
  },
  forecastYears: ["2026年3月期", "2027年3月期", "2028年3月期", "2029年3月期", "2030年3月期"],
  products: ["製品A（量産部品）", "製品B（高付加価値部品）"],
  markets: ["国内", "海外"],
  scenarios: [
    { name: "Base", volumeGrowth: 0.04, priceGrowth: 0.01, materialCostRate: 0.42, receivableDays: 55, inventoryDays: 63 },
    { name: "Upside", volumeGrowth: 0.07, priceGrowth: 0.02, materialCostRate: 0.40, receivableDays: 52, inventoryDays: 58 },
    { name: "Downside", volumeGrowth: -0.03, priceGrowth: 0, materialCostRate: 0.46, receivableDays: 62, inventoryDays: 75 },
  ],
} as const;

export const practicalSourceSheets = [
  "00_使い方",
  "01_月次試算表",
  "02_勘定科目明細",
  "03_販売実績",
  "04_事業計画",
  "05_固定資産台帳",
  "06_借入金明細",
  "07_運転資本明細",
  "08_資料管理",
  "09_勘定科目対応",
] as const;

export const practicalModelSheets = [
  "00_表紙",
  "01_管理",
  "02_資料管理",
  "03_実績財務諸表",
  "04_正常化調整",
  "05_前提条件",
  "06_売上高",
  "07_原価",
  "08_人員",
  "09_運転資本",
  "10_固定資産",
  "11_借入金",
  "12_PL",
  "13_BS",
  "14_CF",
  "15_出力",
  "16_チェック",
  "17_指摘事項",
  "18_変更履歴",
] as const;

export const practicalDownloads = [
  {
    file: "08_東都精密工業_受領資料パック.xlsx",
    audience: "受領資料の確認、実績整理、差異調査を実務形式で練習したい方",
    content: "PL・BS全科目の月次試算表、勘定科目明細、販売実績、事業計画、固定資産、借入金、運転資本、資料管理、勘定科目対応",
    size: "約23KB",
    updated: "2026-07-25",
    terms: "教育目的・再配布不可",
  },
  {
    file: "09_東都精密工業_完成三表モデル.xlsx",
    audience: "前提条件からPL・BS・CFを連動させ、レビューまで確認したい方",
    content: "5年完全連動、Base / Upside / Downside、補助計算、財務三表、経営指標、数式チェック、指摘事項、変更履歴",
    size: "約48KB",
    updated: "2026-07-25",
    terms: "教育目的・再配布不可",
  },
] as const;

export const practicalWorkflow: PracticalStage[] = [
  {
    id: "source-review", no: 1, title: "受領資料を確認する", href: "/learning-roadmap",
    purpose: "資料の基準日、単位、対象範囲、不足資料を整理し、作業開始時点の不確実性を明らかにします。",
    inputs: ["月次試算表", "勘定科目明細", "事業計画", "固定資産台帳", "借入金明細"],
    deliverables: ["資料管理表", "不足資料一覧", "初期確認事項"],
    excel: ["02_資料管理!A5:H20に資料番号、基準日、入手元、使用先を記録"],
    checks: ["資料間で会社名・基準日・単位が一致する", "未受領資料に担当者と期限がある"],
    reviewComment: "固定資産台帳の基準日が試算表より古い。期中取得・除却の確認が必要です。",
    nextHref: "/learning-roadmap",
  },
  {
    id: "historical", no: 2, title: "実績財務諸表を整理する", href: "/learning-roadmap",
    purpose: "試算表をPL・BSへ組み替え、補助明細との不一致と正常化調整を記録します。",
    inputs: ["月次試算表", "勘定科目明細", "固定資産台帳", "借入金明細"],
    deliverables: ["実績財務諸表", "組替表", "正常化調整一覧"],
    excel: ["03_実績財務諸表!B8:G40へ試算表科目を対応付け", "04_正常化調整に一過性費用を記録"],
    checks: ["試算表の借方・貸方差額がゼロ", "PL・BS合計が元資料と一致する"],
    reviewComment: "役員退職金を正常化していますが、一過性と判断した根拠資料が添付されていません。",
    nextHref: "/assumptions",
  },
  {
    id: "assumptions", no: 3, title: "前提条件とシナリオを設定する", href: "/assumptions",
    purpose: "数量、単価、原価、人員、設備投資、運転資本を根拠資料と結び、シナリオを一括管理します。",
    inputs: ["販売実績", "事業計画", "人員計画", "設備投資計画", "回収・支払条件"],
    deliverables: ["前提条件一覧", "シナリオ比較表", "前提根拠一覧"],
    excel: ["05_前提条件!B4でシナリオ選択", "05_前提条件!F8 = XLOOKUP($B$4,$C$7:$E$7,C8:E8)"],
    checks: ["すべての重要前提に出所・基準日・担当者がある", "シナリオ変更が数量から資金繰りまで連動する"],
    reviewComment: "Downsideで売上高は減少していますが、在庫日数と追加借入がBaseのままです。",
    nextHref: "/pl-model",
  },
  {
    id: "pl", no: 4, title: "損益計算書を作成する", href: "/pl-model",
    purpose: "売上高を数量と単価、主要費用を原価・人員などの事業要因から積み上げます。",
    inputs: ["製品別販売実績", "受注計画", "原材料価格", "人員計画"],
    deliverables: ["製品別売上高計画", "原価計画", "5年間の損益計算書"],
    excel: ["06_売上高!H12 = H8*H9", "12_PL!H10 = 06_売上高!H20", "12_PL!H31 = H21-H30"],
    checks: ["売上高増加に必要な生産能力と人員が反映される", "EBITDAと営業利益の差額が減価償却費と一致する"],
    reviewComment: "販売数量が7%増加する一方、設備稼働率と製造人員が据え置きで、実現可能性を説明できません。",
    nextHref: "/bs-model",
  },
  {
    id: "bs", no: 5, title: "貸借対照表を作成する", href: "/bs-model",
    purpose: "運転資本、固定資産、借入金、利益剰余金を補助計算からロールフォワードします。",
    inputs: ["回収・支払条件", "在庫方針", "固定資産台帳", "借入金返済予定"],
    deliverables: ["運転資本計算", "固定資産計算", "借入金計算", "貸借対照表"],
    excel: ["09_運転資本!H8 = 12_PL!H10/365*05_前提条件!H24", "13_BS!H18 = 09_運転資本!H8"],
    checks: ["回転日数が実績と契約条件から説明できる", "固定資産と借入金が期首＋増加－減少＝期末で一致する"],
    reviewComment: "売掛金回転日数を55日から45日に改善した根拠がなく、資金繰りを過大評価しています。",
    nextHref: "/cf-model",
  },
  {
    id: "cf", no: 6, title: "キャッシュ・フロー計算書を作成する", href: "/cf-model",
    purpose: "当期純利益から非資金損益と運転資本増減を調整し、投資・財務活動と期末現預金を接続します。",
    inputs: ["損益計算書", "貸借対照表増減", "設備投資計画", "借入金計画"],
    deliverables: ["キャッシュ・フロー計算書", "資金余剰・不足額", "追加借入必要額"],
    excel: ["14_CF!H10 = 12_PL!H60", "14_CF!H40 = SUM(H10:H35)", "13_BS!H8 = 14_CF!H55"],
    checks: ["CFの現預金増減とBSの現預金増減が一致する", "非資金損益と運転資本の符号が正しい"],
    reviewComment: "棚卸資産の増加を営業CFに加算しており、符号が逆です。",
    nextHref: "/three-statements",
  },
  {
    id: "three-statements", no: 7, title: "財務三表を連動させる", href: "/three-statements",
    purpose: "PL、BS、CF、借入金、現預金、利益剰余金を一方向の計算順序で接続します。",
    inputs: ["完成したPL", "各BS補助計算", "CF", "最低現預金前提"],
    deliverables: ["統合財務三表モデル", "資金調達必要額", "経営指標一覧"],
    excel: ["13_BS!H60 = G60+12_PL!H60-H配当", "16_チェック!H8 = 13_BS!H資産合計-13_BS!H負債純資産合計"],
    checks: ["BS差額とCF差額がゼロ", "差額を現預金やその他資産へ強制的に入れていない"],
    reviewComment: "BS差額を現預金へ加算して一致させています。原因勘定を特定して数式を修正してください。",
    nextHref: "/quality-standard",
  },
  {
    id: "quality", no: 8, title: "レビューして提出可否を判定する", href: "/quality-standard",
    purpose: "数式、根拠、整合性、表示、未解決事項を確認し、モデルを提出できる状態か判定します。",
    inputs: ["統合財務三表モデル", "資料管理表", "指摘事項一覧", "変更履歴"],
    deliverables: ["品質判定", "指摘事項一覧", "引継ぎメモ"],
    excel: ["16_チェックで主要差額を判定", "17_指摘事項で重要度・担当者・期限・対応状況を管理"],
    checks: ["Criticalの未対応がゼロ", "未解決事項と利用上の留意点が明示される"],
    reviewComment: "重要前提の根拠不足が未解決のため、現時点の判定はNot readyです。",
  },
];

export const practicalQualityGate = {
  readiness: [
    { name: "Ready", description: "主要確認項目を通過し、そのまま提出可能" },
    { name: "Ready with caveats", description: "軽微な未解決事項を明示したうえで提出可能" },
    { name: "Not ready", description: "意思決定に影響する不整合があり提出不可" },
  ],
  severities: [
    { name: "Critical", description: "財務三表不一致、参照切れ、重要資料との不一致" },
    { name: "Major", description: "重要前提の根拠不足、シナリオ未連動、計算方法の誤り" },
    { name: "Minor", description: "表示形式、注記不足、軽微な構造改善" },
  ],
} as const;
