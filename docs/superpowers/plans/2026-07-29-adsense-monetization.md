# AdSense Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 可読性を損なわず、AdSense承認後に環境変数だけで広告配信を開始できる基盤を公開する。

**Architecture:** 環境変数の正規化を広告設定モジュールへ集約し、共通scriptと記事末尾広告を独立コンポーネントとして実装する。未設定時はnullを返し、静的サイトに空枠を残さない。

**Tech Stack:** Next.js 16、React 19、TypeScript、Google AdSense、GitHub Pages

## Global Constraints

- 全ページの本文終了後に1枠、長文記事の編集情報後に1枠を置く。
- ダウンロード、フォーム、ナビゲーションの近くには置かない。
- 広告IDをコードへ直書きしない。
- 未設定時はscriptと広告枠を出力しない。

---

### Task 1: 広告設定とコンポーネント

**Files:**
- Create: `src/lib/adsense.ts`
- Create: `src/components/AdSenseScript.tsx`
- Create: `src/components/AdUnit.tsx`
- Create: `scripts/validate-adsense.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `getAdSenseConfig()`、`AdSenseScript`、`AdUnit`

- [ ] 失敗する検証を追加し、未実装エラーを確認する。
- [ ] publisher IDとslot IDを検証する設定関数を実装する。
- [ ] ID未設定時にnull、設定時に正しいタグを返すコンポーネントを実装する。
- [ ] `npm run validate:adsense`を成功させる。

### Task 2: 全ページと記事への統合

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/PageEndAd.tsx`
- Modify: `src/components/article-shell.tsx`
- Modify: `src/components/DcfLessonShell.tsx`
- Modify: `src/components/working-capital/WorkingCapitalLessonLayout.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `AdSenseScript`、`AdUnit`

- [ ] 検証に各シェルの広告枠要件を追加して失敗を確認する。
- [ ] ルートへscriptとページ末尾広告、三つの記事シェルへ本文末尾広告を追加する。
- [ ] 目立たない広告ラベルとレスポンシブ余白を追加する。
- [ ] 広告検証を成功させる。

### Task 3: 規約・設定・ads.txt

**Files:**
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `.env.example`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Create: `scripts/create-ads-txt.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `out/ads.txt`

- [ ] 規約、環境変数、workflow、ads.txt形式の失敗検証を追加する。
- [ ] プライバシーポリシーとフッター導線を更新する。
- [ ] build前にpublisher IDから`public/ads.txt`を生成するscriptを追加する。
- [ ] ID未設定時はプレースホルダーを公開しない。

### Task 4: 検証・公開

**Files:**
- Verify only

- [ ] 広告検証、既存検証、lint、公開用buildを実行する。
- [ ] IDあり・なしの両方で静的出力を検査する。
- [ ] ChromeでPC・スマートフォン表示を確認する。
- [ ] コミットして`origin/main`へpushする。
- [ ] GitHub Actions成功後に公開URLを確認する。
