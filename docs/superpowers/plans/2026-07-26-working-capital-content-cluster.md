# Working Capital Content Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a five-page Japanese working-capital modeling course and a tested Excel workbook that increase organic search coverage and connect into the existing three-statement and DCF content.

**Architecture:** Store every numeric assumption and calculated result in one typed data module. Render the hub and four detail pages from that shared case, and generate the downloadable workbook from the same module so page values, formulas, and workbook values cannot drift. Extend the existing editorial, content-catalog, sitemap, and internal-link systems rather than adding a parallel publishing framework.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, ExcelJS 4, TSX validation scripts, GitHub Pages static export.

## Global Constraints

- Use practical Japanese terminology used by Japanese operating companies and financial institutions.
- Keep `Valuation`, `Enterprise Value`, `Equity Value`, and `Base / Upside / Downside` in English; translate other avoidable English labels into Japanese.
- Use the fictional company name `東都パーツ株式会社` and the approved 2026/3 actual and 2027/3 forecast case.
- Display monetary values in JPY millions to one decimal place while retaining unrounded values in calculations.
- Keep the workbook generation script as the source of truth; do not hand-edit the generated `.xlsx`.
- Preserve static export compatibility and the `/financial-modeling-lab` GitHub Pages base path.
- Do not add dependencies.
- Author byline is `Finance Modeling Lab 編集部`.

---

## File Structure

### Create

- `src/data/working-capital-case.ts`: typed assumptions, formulas, calculated values, page metadata, and workbook filename.
- `src/components/working-capital/WorkingCapitalFormulaTable.tsx`: accessible formula and numeric-example table.
- `src/components/working-capital/WorkingCapitalNavigation.tsx`: parent, child, previous, and next links.
- `src/components/working-capital/WorkingCapitalDownload.tsx`: shared workbook download panel.
- `src/app/working-capital-model/page.tsx`: cluster hub.
- `src/app/working-capital/receivables/page.tsx`: receivables lesson.
- `src/app/working-capital/payables/page.tsx`: payables lesson.
- `src/app/working-capital/inventory/page.tsx`: inventory lesson.
- `src/app/working-capital/cash-conversion-cycle/page.tsx`: CCC lesson.
- `scripts/create-working-capital-workbook.ts`: deterministic workbook generator.
- `scripts/test-working-capital-workbook.ts`: workbook structure, formula, value, and formatting assertions.
- `scripts/validate-working-capital-series.tsx`: page, metadata, structured-data, link, and shared-case validation.
- `public/downloads/working-capital-model.xlsx`: generated workbook.

### Modify

- `package.json`: generation and validation commands.
- `src/data/editorial.ts`: five new article records and sources.
- `src/data/content-catalog.ts`: five searchable catalog records.
- `src/app/sitemap.ts`: five URLs.
- `src/app/financial-modeling/page.tsx`: cluster entry point.
- `src/app/bs-model/page.tsx`: contextual working-capital link.
- `src/app/cf-model/page.tsx`: contextual cash-flow link.
- `src/app/three-statements/page.tsx`: contextual model link.
- `src/app/valuation/dcf/fcff/page.tsx`: contextual FCFF link.
- `src/app/excel-templates/page.tsx`: workbook listing.

---

### Task 1: Shared Working-Capital Case

**Files:**
- Create: `src/data/working-capital-case.ts`
- Create: `scripts/validate-working-capital-series.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `workingCapitalCase`, `workingCapitalPages`, `workingCapitalWorkbook`, `calculateWorkingCapital(input)`.
- `calculateWorkingCapital` accepts `{ revenue: number; cogs: number; receivableDays: number; inventoryDays: number; payableDays: number; daysInYear: number }`.
- It returns `{ receivables: number; inventory: number; payables: number; netWorkingCapital: number; cashConversionCycle: number }`.

- [ ] **Step 1: Write the failing shared-case validation**

Create `scripts/validate-working-capital-series.tsx` with assertions for:

```tsx
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
```

- [ ] **Step 2: Add the command and verify failure**

Add:

```json
"validate:working-capital": "tsx scripts/validate-working-capital-series.tsx"
```

Run: `npm.cmd run validate:working-capital`

Expected: FAIL because `src/data/working-capital-case.ts` does not exist.

- [ ] **Step 3: Implement the typed case and calculations**

Use:

```ts
export function calculateWorkingCapital(input: WorkingCapitalInput) {
  if (input.daysInYear <= 0) throw new Error("年間日数は1日以上で入力してください。");
  for (const [label, value] of Object.entries(input)) {
    if (!Number.isFinite(value)) throw new Error(`${label}に有効な数値を入力してください。`);
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
```

Define the approved actual and forecast cases, calculate both periods, and export `cashFlowImpact = actual.netWorkingCapital - forecast.netWorkingCapital`.

- [ ] **Step 4: Run validation**

Run: `npm.cmd run validate:working-capital`

Expected: PASS with `Working capital series validation passed`.

- [ ] **Step 5: Commit**

```powershell
git add package.json src/data/working-capital-case.ts scripts/validate-working-capital-series.tsx
git commit -m "feat: add shared working capital case"
```

---

### Task 2: Generated Excel Workbook

**Files:**
- Create: `scripts/create-working-capital-workbook.ts`
- Create: `scripts/test-working-capital-workbook.ts`
- Create: `public/downloads/working-capital-model.xlsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `workingCapitalCase`, `workingCapitalWorkbook`, and `calculateWorkingCapital`.
- Produces: a workbook with sheets `00_使い方`, `01_前提条件`, `02_売掛金`, `03_棚卸資産`, `04_買掛金`, `05_運転資本`, `06_CCC分析`, `07_チェック`.

- [ ] **Step 1: Write the failing workbook test**

Assert:

```ts
assert.deepEqual(
  workbook.worksheets.map((sheet) => sheet.name),
  ["00_使い方", "01_前提条件", "02_売掛金", "03_棚卸資産", "04_買掛金", "05_運転資本", "06_CCC分析", "07_チェック"],
);
assert.equal(workbook.creator, "Finance Modeling Lab 編集部");
assert.equal(workbook.getWorksheet("01_前提条件")!.getCell("C5").value, 1320);
assert.equal(
  (workbook.getWorksheet("02_売掛金")!.getCell("C8").value as ExcelJS.CellFormulaValue).formula,
  "'01_前提条件'!C5/'01_前提条件'!C10*'01_前提条件'!C7",
);
assert.equal(
  (workbook.getWorksheet("07_チェック")!.getCell("C5").value as ExcelJS.CellFormulaValue).result,
  0,
);
```

Also assert frozen panes, print areas, formula presence, no external workbook references, and no cached Excel error values.

- [ ] **Step 2: Add workbook commands and verify failure**

Add:

```json
"generate:working-capital-workbook": "tsx scripts/create-working-capital-workbook.ts",
"test:working-capital-workbook": "tsx scripts/test-working-capital-workbook.ts"
```

Run: `npm.cmd run test:working-capital-workbook`

Expected: FAIL because the workbook does not exist.

- [ ] **Step 3: Implement workbook generation**

Use blue font and pale-blue fill for input cells, black font for formulas, green font for cross-sheet links, and pale-yellow fill for checks. Include formula cells with cached numeric results:

```ts
cell.value = { formula, result };
```

Use the approved formulas:

```text
売掛金 = 売上高 / 365 * 回収日数
棚卸資産 = 売上原価 / 365 * 在庫回転日数
買掛金 = 売上原価 / 365 * 支払日数
正味運転資本 = 売掛金 + 棚卸資産 - 買掛金
CCC = 回収日数 + 在庫回転日数 - 支払日数
CF影響 = 前期正味運転資本 - 当期正味運転資本
```

Set `numFmt = "0.0"` for JPY millions and `numFmt = "0.0日"` for day metrics.

- [ ] **Step 4: Generate and test**

Run:

```powershell
npm.cmd run generate:working-capital-workbook
npm.cmd run test:working-capital-workbook
```

Expected: both commands PASS.

- [ ] **Step 5: Commit**

```powershell
git add package.json scripts/create-working-capital-workbook.ts scripts/test-working-capital-workbook.ts public/downloads/working-capital-model.xlsx
git commit -m "feat: add working capital Excel model"
```

---

### Task 3: Shared Page Components

**Files:**
- Create: `src/components/working-capital/WorkingCapitalFormulaTable.tsx`
- Create: `src/components/working-capital/WorkingCapitalNavigation.tsx`
- Create: `src/components/working-capital/WorkingCapitalDownload.tsx`
- Modify: `scripts/validate-working-capital-series.tsx`

**Interfaces:**
- `WorkingCapitalFormulaTable({ rows })` consumes rows with `label`, `formula`, `excelFormula`, `result`.
- `WorkingCapitalNavigation({ currentHref })` consumes one of the five `workingCapitalPages` hrefs.
- `WorkingCapitalDownload()` reads the shared workbook filename and renders an anchor with `download`.

- [ ] **Step 1: Add failing component assertions**

Render each component with `renderToStaticMarkup` and assert:

```tsx
assert.match(formulaMarkup, /売掛金/);
assert.match(formulaMarkup, /売上高÷365日×回収日数/);
assert.match(navigationMarkup, /運転資本モデルの作り方/);
assert.match(downloadMarkup, /working-capital-model\.xlsx/);
assert.match(downloadMarkup, /download=/);
```

- [ ] **Step 2: Run validation and verify failure**

Run: `npm.cmd run validate:working-capital`

Expected: FAIL because the component modules do not exist.

- [ ] **Step 3: Implement minimal accessible components**

Use semantic `<table>`, `<nav aria-label="運転資本講座">`, and a standard `<a href>` download link. Format results with:

```ts
new Intl.NumberFormat("ja-JP", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format(value)
```

- [ ] **Step 4: Run validation**

Run: `npm.cmd run validate:working-capital`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/working-capital scripts/validate-working-capital-series.tsx
git commit -m "feat: add working capital lesson components"
```

---

### Task 4: Hub and Four Practical Lessons

**Files:**
- Create: `src/app/working-capital-model/page.tsx`
- Create: `src/app/working-capital/receivables/page.tsx`
- Create: `src/app/working-capital/payables/page.tsx`
- Create: `src/app/working-capital/inventory/page.tsx`
- Create: `src/app/working-capital/cash-conversion-cycle/page.tsx`
- Modify: `scripts/validate-working-capital-series.tsx`

**Interfaces:**
- Consumes the shared case and the three shared components.
- Produces five statically rendered pages with unique metadata, H1, Article, BreadcrumbList, and relevant FAQPage JSON-LD.

- [ ] **Step 1: Add failing page assertions**

Import and render all five pages. Assert each unique H1 and these practical strings:

```tsx
assert.match(hubMarkup, /運転資本モデルの作り方/);
assert.match(hubMarkup, /東都パーツ株式会社/);
assert.match(hubMarkup, /2026\/3期/);
assert.match(hubMarkup, /2027\/3期/);
assert.match(receivablesMarkup, /売掛金＝売上高÷365日×回収日数/);
assert.match(inventoryMarkup, /棚卸資産＝売上原価÷365日×在庫回転日数/);
assert.match(payablesMarkup, /買掛金＝売上原価÷365日×支払日数/);
assert.match(cccMarkup, /CCC＝回収日数＋在庫回転日数－支払日数/);
assert.match(hubMarkup, /working-capital-model\.xlsx/);
```

Also assert every page contains `実務上の使用場面`, `Excelでの実装`, `よくある誤り`, `レビュー時の確認項目`, and contextual links.

- [ ] **Step 2: Run validation and verify failure**

Run: `npm.cmd run validate:working-capital`

Expected: FAIL because the page modules do not exist.

- [ ] **Step 3: Implement the hub**

Include the approved actual-to-forecast bridge, formulas, cash-flow impact, links to all four children, and workbook download. Use `createPageMetadata` and `EditorialDetails`.

- [ ] **Step 4: Implement the four detail lessons**

Each lesson must include:

```text
完成する成果物
実務上の使用場面
数値例
Excelでの実装
Excel数式
財務三表・DCFへの接続
よくある誤り
レビュー時の確認項目
関連ページ
Excel教材
```

Do not duplicate the hub explanation. Receivables owns collection-day judgment, inventory owns slow-moving inventory and write-down considerations, payables owns supplier terms and sustainable extension, and CCC owns cross-account interpretation and cash impact.

- [ ] **Step 5: Run validation**

Run: `npm.cmd run validate:working-capital`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/app/working-capital-model src/app/working-capital scripts/validate-working-capital-series.tsx
git commit -m "feat: add working capital modeling course"
```

---

### Task 5: Editorial Records, Search Catalog, Sitemap, and Internal Links

**Files:**
- Modify: `src/data/editorial.ts`
- Modify: `src/data/content-catalog.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/financial-modeling/page.tsx`
- Modify: `src/app/bs-model/page.tsx`
- Modify: `src/app/cf-model/page.tsx`
- Modify: `src/app/three-statements/page.tsx`
- Modify: `src/app/valuation/dcf/fcff/page.tsx`
- Modify: `scripts/validate-working-capital-series.tsx`

**Interfaces:**
- Adds all five hrefs to `ArticleHref`.
- Adds five `EditorialRecord` and five `ContentEntry` objects.
- Makes all five URLs discoverable from the financial-modeling hub and at least one existing practical article.

- [ ] **Step 1: Add failing integration assertions**

Assert:

```tsx
for (const page of workingCapitalPages) {
  assert.ok(ARTICLE_HREFS.includes(page.href));
  assert.ok(editorialRecords.some((record) => record.href === page.href));
  assert.ok(contentCatalog.some((entry) => entry.href === page.href));
  assert.ok(sitemapEntries.some((entry) => entry.url.endsWith(page.href)));
}
```

Render the five existing pages and assert descriptive anchors containing `運転資本`, `売掛金`, `キャッシュ・フロー`, or `FCFF`.

- [ ] **Step 2: Run validation and verify failure**

Run: `npm.cmd run validate:working-capital`

Expected: FAIL because records and links are missing.

- [ ] **Step 3: Add editorial and catalog records**

Use publication and modification date `2026-07-26`. Add authoritative sources for IAS 1, IAS 2, IAS 7, IFRS 9, and Microsoft Excel formulas. Keep each page description unique.

- [ ] **Step 4: Add sitemap entries and internal links**

Set the hub priority to `0.9` and child priorities to `0.85`. Use normal crawlable Next.js links with descriptive anchor text, not generic `こちら`.

- [ ] **Step 5: Run focused and existing validations**

Run:

```powershell
npm.cmd run validate:working-capital
npm.cmd run validate:editorial
npm.cmd run validate:catalog
npm.cmd run validate:search
npm.cmd run validate:language
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/data src/app/sitemap.ts src/app/financial-modeling src/app/bs-model src/app/cf-model src/app/three-statements src/app/valuation/dcf/fcff scripts/validate-working-capital-series.tsx
git commit -m "feat: connect working capital content cluster"
```

---

### Task 6: Workbook Discovery

**Files:**
- Modify: `src/app/excel-templates/page.tsx`
- Modify: `scripts/validate-working-capital-series.tsx`

**Interfaces:**
- Produces a visible workbook listing with filename, eight-sheet contents, update date, use conditions, and links to the hub.

- [ ] **Step 1: Add failing workbook-listing assertions**

Render the Excel templates page and assert:

```tsx
assert.match(markup, /運転資本モデル/);
assert.match(markup, /working-capital-model\.xlsx/);
assert.match(markup, /売掛金・棚卸資産・買掛金・CCC/);
assert.match(markup, /working-capital-model/);
```

- [ ] **Step 2: Run validation and verify failure**

Run: `npm.cmd run validate:working-capital`

Expected: FAIL because the listing is missing.

- [ ] **Step 3: Add the listing**

Follow the existing download-card style. State `教育目的・実案件への利用不可` and update date `2026-07-26`.

- [ ] **Step 4: Run validation**

Run: `npm.cmd run validate:working-capital`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/app/excel-templates/page.tsx scripts/validate-working-capital-series.tsx
git commit -m "feat: list working capital workbook"
```

---

### Task 7: Full Verification and Static Export

**Files:**
- Modify only if verification identifies a defect.

**Interfaces:**
- Confirms all earlier outputs work together under the production base path.

- [ ] **Step 1: Run all focused checks**

```powershell
npm.cmd run generate:working-capital-workbook
npm.cmd run test:working-capital-workbook
npm.cmd run validate:working-capital
npm.cmd run validate:editorial
npm.cmd run validate:catalog
npm.cmd run validate:search
npm.cmd run validate:language
npm.cmd run lint
```

Expected: all PASS.

- [ ] **Step 2: Run the production build**

```powershell
$env:PAGES_BASE_PATH='/financial-modeling-lab'
$env:NEXT_PUBLIC_BASE_PATH='/financial-modeling-lab'
$env:NEXT_PUBLIC_SITE_URL='https://data-lab-23.github.io/financial-modeling-lab'
npm.cmd run build
```

Expected: static generation succeeds and includes all five new routes.

- [ ] **Step 3: Validate built output**

Check that:

```text
out/working-capital-model.html
out/working-capital/receivables.html
out/working-capital/payables.html
out/working-capital/inventory.html
out/working-capital/cash-conversion-cycle.html
out/downloads/working-capital-model.xlsx
```

exist, and that generated HTML contains canonical production URLs and `/financial-modeling-lab` asset paths.

- [ ] **Step 4: Review responsive layouts**

Start the static or development server and inspect the hub, one detail lesson, and the Excel listing at approximately 390px and 1440px widths. Confirm tables do not clip without a horizontal-scroll affordance, headings are not truncated, and download buttons are reachable.

- [ ] **Step 5: Commit verification fixes if needed**

```powershell
git add src/data/working-capital-case.ts src/components/working-capital src/app/working-capital-model src/app/working-capital src/app/excel-templates src/app/financial-modeling src/app/bs-model src/app/cf-model src/app/three-statements src/app/valuation/dcf/fcff src/app/sitemap.ts src/data/editorial.ts src/data/content-catalog.ts scripts/create-working-capital-workbook.ts scripts/test-working-capital-workbook.ts scripts/validate-working-capital-series.tsx public/downloads/working-capital-model.xlsx package.json
git commit -m "fix: polish working capital course"
```

---

### Task 8: Publish and Verify Production

**Files:**
- No source changes unless deployment verification finds a defect.

**Interfaces:**
- Produces a clean `main` branch, successful GitHub Pages workflow, five live pages, and one live workbook.

- [ ] **Step 1: Confirm repository scope**

Run:

```powershell
git status --short --branch
git log --oneline -8
```

Expected: only intentional commits are ahead of `origin/main`; no uncommitted files.

- [ ] **Step 2: Push**

Run: `git push origin main`

Expected: push succeeds.

- [ ] **Step 3: Monitor GitHub Pages**

Open the repository Actions page and confirm the workflow for the final commit completes successfully.

- [ ] **Step 4: Verify public responses**

Confirm HTTP 200 and expected content for:

```text
https://data-lab-23.github.io/financial-modeling-lab/working-capital-model
https://data-lab-23.github.io/financial-modeling-lab/working-capital/receivables
https://data-lab-23.github.io/financial-modeling-lab/working-capital/payables
https://data-lab-23.github.io/financial-modeling-lab/working-capital/inventory
https://data-lab-23.github.io/financial-modeling-lab/working-capital/cash-conversion-cycle
https://data-lab-23.github.io/financial-modeling-lab/downloads/working-capital-model.xlsx
```

- [ ] **Step 5: Submit discovery signals**

Confirm the five URLs appear in the live sitemap. In Search Console, submit or refresh the sitemap and request indexing for the hub page.

- [ ] **Step 6: Final handoff**

Report the live URLs, workbook URL, commit hash, test results, deployment status, and any Search Console processing status that remains asynchronous.
