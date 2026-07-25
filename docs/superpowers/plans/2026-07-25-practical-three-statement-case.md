# Practical Three-Statement Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 共通のB2B製造業案件を通じて、資料受領から財務三表モデル作成・レビューまでを学べる主要8ページと2つのExcel成果物を公開する。

**Architecture:** `src/data/practical-case.ts`をページ、共通表示部品、Excel生成・検証の唯一の案件定義とする。既存のNext.js静的サイト、ExcelJS、GitHub Pages配信を維持し、バックエンドや新規依存関係は追加しない。

**Tech Stack:** Next.js 16、React 19、TypeScript、ExcelJS、Node assert、GitHub Pages

## Global Constraints

- 共通案件は東都精密工業株式会社（架空）、単位は百万円、3月決算とする。
- 2025年3月期を実績基準期、2026年3月期から2030年3月期を予測期間とする。
- シナリオはBase / Upside / Downsideと表記する。
- Valuation、Enterprise Value、Equity Valueおよび既存の許可英語以外の利用者向け語句は日本語を優先する。
- 編集名義はFinance Modeling Lab 編集部とする。
- 新規バックエンド、会員登録、データベース、新規npm依存関係を追加しない。
- 配布ファイルは`public/downloads`に置き、GitHub Pagesから直接取得可能にする。

---

### Task 1: 共通案件データと契約検証

**Files:**
- Create: `src/data/practical-case.ts`
- Create: `scripts/validate-practical-case.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `practicalCase`, `practicalWorkflow`, `practicalQualityGate`, `practicalDownloads`
- Consumes: なし

- [ ] **Step 1: 検証スクリプトを先に作成する**

`scripts/validate-practical-case.ts`で、会社名、単位、年度、売上高10,000、EBITDA1,500、シナリオ順序、8工程、18完成モデルシート、2ファイル名をassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-case.ts`

Expected: `src/data/practical-case`が存在しないためFAIL。

- [ ] **Step 3: 最小の共通案件データを実装する**

`src/data/practical-case.ts`へ、数値、製品区分、シナリオ、受領資料、工程、品質判定、Excelシート名、ダウンロード情報を型付き定数として追加する。

- [ ] **Step 4: GREENを確認する**

Run: `npx tsx scripts/validate-practical-case.ts`

Expected: `Practical case validation passed`。

- [ ] **Step 5: npmスクリプトを追加する**

`package.json`へ`"validate:practical-case": "tsx scripts/validate-practical-case.ts"`を追加する。

- [ ] **Step 6: コミットする**

```bash
git add src/data/practical-case.ts scripts/validate-practical-case.ts package.json
git commit -m "feat: add shared practical modeling case"
```

### Task 2: 実務工程表示部品

**Files:**
- Create: `src/components/PracticalCasePanel.tsx`
- Create: `scripts/validate-practical-case-panel.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `practicalCase`, `practicalWorkflow`
- Produces: `PracticalCasePanel({ stageId })`

- [ ] **Step 1: 表示契約の検証を作成する**

静的HTMLを生成し、会社名、工程目的、受領資料、成果物、Excel実装、確認項目、レビュー指摘、次工程リンク、ダウンロードリンクが含まれることをassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-case-panel.tsx`

Expected: `PracticalCasePanel`が存在しないためFAIL。

- [ ] **Step 3: 最小の表示部品を実装する**

`stageId`に対応する工程を共通データから取得し、見出し付きの意味的HTMLとして表示する。不明な`stageId`は明示的に例外とする。

- [ ] **Step 4: GREENを確認する**

Run: `npx tsx scripts/validate-practical-case-panel.tsx`

Expected: `Practical case panel validation passed`。

- [ ] **Step 5: npmスクリプトとコミット**

`validate:practical-panel`を追加し、対象3ファイルをコミットする。

### Task 3: トップページと学習ロードマップ

**Files:**
- Create: `scripts/validate-practical-core-pages.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/learning-roadmap/page.tsx`
- Modify: `src/data/content-catalog.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `practicalCase`, `practicalWorkflow`, `practicalDownloads`
- Produces: 共通案件を開始できるトップページと工程別ロードマップ

- [ ] **Step 1: ページ契約の検証を作成する**

トップページとロードマップの静的HTMLについて、案件名、受領資料、完成成果物、8工程、受領資料パックと完成モデルへのリンク、最初の工程リンクをassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: 新しい案件名またはダウンロードリンク不足でFAIL。

- [ ] **Step 3: ページを改修する**

トップページに「資料受領から財務三表モデル完成まで」の導線を置く。ロードマップは学習科目ではなく、資料確認、実績整理、前提条件、PL、BS、CF、三表連動、品質判定の順に表示する。

- [ ] **Step 4: GREENを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: `Practical core pages validation passed`。

- [ ] **Step 5: コミットする**

対象ファイルをコミットする。

### Task 4: 前提条件・PL・BS・CFページ

**Files:**
- Modify: `src/app/assumptions/page.tsx`
- Modify: `src/app/pl-model/page.tsx`
- Modify: `src/app/bs-model/page.tsx`
- Modify: `src/app/cf-model/page.tsx`
- Modify: `scripts/validate-practical-core-pages.tsx`

**Interfaces:**
- Consumes: `PracticalCasePanel`
- Produces: 4工程の実務解説

- [ ] **Step 1: 4ページの失敗する契約検証を追加する**

各ページに工程パネル、具体的なシート名・セル式、確認資料、完成成果物、よくある指摘が含まれることをassertする。前提条件ページではBase / Upside / Downside、PLでは数量×単価、BSでは回転日数、CFでは現預金接続を必須とする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: 工程パネルまたは必須実務記述不足でFAIL。

- [ ] **Step 3: 4ページへ共通案件を適用する**

既存理論を残しながら、冒頭、数値例、Excel式、確認項目、レビュー指摘を共通案件へ合わせる。取引前提中心の記述は三表モデル作成に必要な事業・会計前提へ置き換える。

- [ ] **Step 4: GREENを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: PASS。

- [ ] **Step 5: コミットする**

4ページと検証スクリプトをコミットする。

### Task 5: 三表連動・品質基準ページ

**Files:**
- Modify: `src/app/three-statements/page.tsx`
- Modify: `src/app/quality-standard/page.tsx`
- Modify: `scripts/validate-practical-core-pages.tsx`

**Interfaces:**
- Consumes: `PracticalCasePanel`, `practicalQualityGate`
- Produces: モデル完成工程と提出可否判定

- [ ] **Step 1: 失敗する契約検証を追加する**

三表連動ページで借入金・現預金・利益剰余金の接続と強制差額調整禁止をassertする。品質基準ページでReady、Ready with caveats、Not ready、Critical、Major、Minor、指摘事項、変更履歴をassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: 提出可否判定などの不足でFAIL。

- [ ] **Step 3: 2ページを改修する**

三表連動は計算順序と確認式を明示する。品質基準は100点評価を中心にせず、重要度別指摘と提出可否判定を中心にする。

- [ ] **Step 4: GREENを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: PASS。

- [ ] **Step 5: コミットする**

対象ファイルをコミットする。

### Task 6: 受領資料パックExcel

**Files:**
- Create: `scripts/create-practical-case-workbooks.ts`
- Create: `scripts/test-practical-case-workbooks.ts`
- Modify: `package.json`
- Generate: `public/downloads/08_東都精密工業_受領資料パック.xlsx`

**Interfaces:**
- Consumes: `practicalCase`, `practicalDownloads`
- Produces: 9シートの受領資料Excel

- [ ] **Step 1: Excel契約検査を作成する**

ファイル存在、9シート順序、会社名、2025年3月期売上高10,000、資料管理、固定資産差異、借入金差異、見出し固定、印刷設定をassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/test-practical-case-workbooks.ts`

Expected: Excelファイル未生成でFAIL。

- [ ] **Step 3: 受領資料生成を実装する**

ExcelJSで各資料を作成し、青色入力、罫線、単位、基準日、資料番号、確認課題を設定する。

- [ ] **Step 4: 生成してGREENを確認する**

Run: `npx tsx scripts/create-practical-case-workbooks.ts`

Run: `npx tsx scripts/test-practical-case-workbooks.ts`

Expected: 受領資料の検査がPASS。

- [ ] **Step 5: コミットする**

生成スクリプト、検査、Excel、package.jsonをコミットする。

### Task 7: 完成三表モデルExcel

**Files:**
- Modify: `scripts/create-practical-case-workbooks.ts`
- Modify: `scripts/test-practical-case-workbooks.ts`
- Generate: `public/downloads/09_東都精密工業_完成三表モデル.xlsx`

**Interfaces:**
- Consumes: `practicalCase`
- Produces: 19シートの完成モデルExcel

- [ ] **Step 1: 完成モデルの失敗する検査を追加する**

19シート順序、Base / Upside / Downside、2025年3月期実績、2026年3月期から2030年3月期、主要数式、BS差額ゼロ、CF現預金一致、指摘事項、変更履歴、資料からセルへの参照先をassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/test-practical-case-workbooks.ts`

Expected: 完成モデル未生成でFAIL。

- [ ] **Step 3: 完成モデル生成を実装する**

入力、リンク、同一シート数式、確認セルを色分けし、売上高、原価、人員、運転資本、固定資産、借入金、PL、BS、CF、出力、確認を数式で連動する。計算結果キャッシュも設定する。

- [ ] **Step 4: 生成してGREENを確認する**

Run: `npx tsx scripts/create-practical-case-workbooks.ts`

Run: `npx tsx scripts/test-practical-case-workbooks.ts`

Expected: 2ファイルの検査がPASS。

- [ ] **Step 5: コミットする**

生成スクリプト、検査、完成モデルをコミットする。

### Task 8: ダウンロード導線と最終検証

**Files:**
- Modify: `src/data/lab.ts`
- Modify: `src/app/downloads/page.tsx`
- Modify: `src/app/excel-templates/page.tsx`
- Modify: `src/components/DownloadCard.tsx` only if the existing generic link cannot serve the new files
- Modify: `scripts/validate-practical-core-pages.tsx`

**Interfaces:**
- Consumes: `practicalDownloads`
- Produces: 公開ダウンロード導線

- [ ] **Step 1: ダウンロード契約検証を追加する**

ダウンロード一覧と教材ハブに2ファイルが表示され、hrefが`/downloads/<file>`であることをassertする。

- [ ] **Step 2: REDを確認する**

Run: `npx tsx scripts/validate-practical-core-pages.tsx`

Expected: 新規ダウンロードリンク不足でFAIL。

- [ ] **Step 3: 導線を実装する**

トップ、ロードマップ、各工程、ダウンロード一覧、Excel教材ハブから適切なファイルへリンクする。

- [ ] **Step 4: 全検証を実行する**

Run:

```bash
npm run validate:practical-case
npm run validate:practical-panel
npm run validate:practical-pages
npm run test:practical-workbooks
npm run validate:language
npm run lint
npm run build
```

Expected: すべてexit 0。

- [ ] **Step 5: 静的出力を確認する**

`out`内の主要8ページ、ダウンロード一覧、2つのExcelファイルの存在とリンクを確認する。

- [ ] **Step 6: コミットする**

対象ファイルをコミットする。

### Task 9: GitHub Pages公開

**Files:**
- Modify: なし（GitHub Actionsの既存公開設定を利用）

**Interfaces:**
- Consumes: 検証済みコミット
- Produces: 公開サイト

- [ ] **Step 1: ブランチをGitHubへpushする**

Run: `git push origin feature/practical-japanese-content`

- [ ] **Step 2: mainへ反映する**

既存のリポジトリ運用に合わせ、競合がないことを確認してmainへ反映し、`git push origin main`を実行する。

- [ ] **Step 3: GitHub Actionsを確認する**

対象のPagesワークフローが成功するまで状態と失敗ログを確認する。

- [ ] **Step 4: 公開URLを確認する**

`https://data-lab-23.github.io/financial-modeling-lab/`、主要8ページ、ダウンロード一覧、2つのExcel URLがHTTP 200を返すことを確認する。

- [ ] **Step 5: 最終差分と公開コミットを記録する**

`git status --short --branch`、`git log -1 --oneline`、公開URLを最終報告へ記載する。

