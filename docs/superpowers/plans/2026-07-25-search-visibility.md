# Search Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Googleがサイト主体と主要記事を理解でき、利用者が検索結果から実務解説とExcel成果物へ到達できるSEO基盤を作る。

**Architecture:** Next.js Metadata APIとJSON-LDを全体基盤に置き、主要記事は既存の編集情報・内部リンク構造へ統合する。Search Console確認値は公開環境変数からビルド時に注入する。

**Tech Stack:** Next.js 16、React 19、TypeScript、Schema.org JSON-LD、GitHub Pages

## Global Constraints

- 検索者向けの自然な日本語を優先する。
- 1ページにつき主検索意図を1つに限定する。
- 構造化データは画面に表示される内容と一致させる。
- 検証トークンはコードへ直書きしない。

---

### Task 1: SEO基盤の回帰検証

**Files:**
- Create: `scripts/validate-search-visibility.tsx`
- Modify: `package.json`

- [ ] WebSite・Organization構造化データ、所有権確認関数、主要title、H1、実務要素、主要内部リンクを検証する。
- [ ] 検証を実行し、現状で意図した失敗を確認する。

### Task 2: 全体構造化データとSearch Console確認

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `.env.example`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

- [ ] `createRootMetadata()`を追加し、確認値がある場合だけGoogle verificationを出力する。
- [ ] WebSite・Organization JSON-LDを全ページへ出力する。
- [ ] GitHub Actionsの変数をビルドへ渡す。
- [ ] Search Console登録、サイトマップ送信、主要URL検査の手順を記録する。

### Task 3: 主要3ページの検索意図強化

**Files:**
- Modify: `src/app/three-statements/page.tsx`
- Modify: `src/app/valuation/dcf/page.tsx`
- Modify: `src/app/comps-peer-selection/page.tsx`

- [ ] title、description、H1を具体的な作業内容へ合わせる。
- [ ] 三表モデルへ数値例、Excel数式、確認項目、失敗例、完成Excel導線を追加する。
- [ ] DCFハブへ編集情報とArticle・BreadcrumbListを追加する。
- [ ] 3ページ間と関連教材の説明的な内部リンクを整える。

### Task 4: 編集情報とサイトマップ

**Files:**
- Modify: `src/data/editorial.ts`
- Modify: `scripts/validate-editorial.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/validate-organic-growth-static.ts`

- [ ] DCFハブの編集情報を追加する。
- [ ] 主要3ページの更新日と変更内容を2026-07-25へ更新する。
- [ ] sitemap.xmlの主要3ページを実更新日に合わせる。
- [ ] 静的出力検証の件数と更新日期待値を現在の39ページへ合わせる。

### Task 5: 検証と公開

**Files:**
- Modify: generated static output only through the existing build process

- [ ] SEO検証、編集情報検証、サイト検証、言語検証、lint、buildを実行する。
- [ ] mainへコミット・pushする。
- [ ] 公開HTMLのtitle、構造化データ、主要本文、HTTP 200を確認する。

