# Practical Workbook Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 配布中の受領資料パックと完成三表モデルを、5年連動・数式チェック・実務的な資料対応を備えた教材へ修正する。

**Architecture:** ExcelJSの生成スクリプトを単一の計算仕様に揃え、JavaScriptで算出した予測値を数式のキャッシュ値として格納する。監査スクリプトは生成物を再読込し、数式密度、三表差額、チェック式、資料対応を検証する。

**Tech Stack:** TypeScript、ExcelJS、Node.js assert、Next.js 16、GitHub Pages

## Global Constraints

- 2025年3月期実績、2026年3月期から2030年3月期予測、単位は百万円とする。
- Base / Upside / Downsideは英語表記を維持し、その他の利用者向け用語は日本語を優先する。
- 数式による差額調整を現預金やその他資産へ埋め込まない。
- 新規依存関係とバックエンドを追加しない。
- 公開ファイル名と既存URLを維持する。

---

### Task 1: 監査テストの強化

**Files:**
- Modify: `scripts/test-practical-case-workbooks.ts`

- [ ] 予測5列の主要計算行がすべて数式であることを検証する。
- [ ] 各年度のBS差額、CF・BS現預金差額、固定資産差額、借入金差額がゼロであることを検証する。
- [ ] チェック欄と提出可否が数式であることを検証する。
- [ ] 受領資料に残高試算表と勘定科目対応表が存在することを検証する。
- [ ] `npm run test:practical-workbooks`を実行し、既存生成物で意図した失敗を確認する。

### Task 2: Excel生成ロジックの修正

**Files:**
- Modify: `scripts/create-practical-case-workbooks.ts`
- Modify: `src/data/practical-case.ts`
- Generate: `public/downloads/08_東都精密工業_受領資料パック.xlsx`
- Generate: `public/downloads/09_東都精密工業_完成三表モデル.xlsx`

- [ ] 受領資料へ残高試算表、勘定科目対応表、調整方針を追加する。
- [ ] 5年間の補助計算と三表を展開する。
- [ ] 循環参照なしの最低現預金・借入金計算を実装する。
- [ ] チェックと提出可否を数式化する。
- [ ] Excelを再生成し、監査テストを通す。

### Task 3: サイト説明の同期

**Files:**
- Modify: `src/data/practical-case.ts`
- Modify: `src/app/downloads/page.tsx`
- Modify: `scripts/validate-practical-core-pages.tsx`

- [ ] 配布物の説明を5年連動・数式チェック・勘定科目対応へ更新する。
- [ ] 教育用モデルと実案件判断の区別を明記する。
- [ ] ページ検証を実行する。

### Task 4: 完了前検証と公開

**Files:**
- Modify: generated static output only through the existing build process

- [ ] Excel監査、主要ページ検証、言語検証、lint、buildを実行する。
- [ ] 生成Excelを再読込し、数式エラー、外部リンク、5年差額を確認する。
- [ ] 変更をコミットしてmainへpushする。
- [ ] GitHub Pagesの成功と公開URLのHTTP 200を確認する。

