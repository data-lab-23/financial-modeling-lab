# Search Visibility Design

## Goal

Finance Modeling Labを、新URLでGoogleに発見・理解されやすくし、「三表モデル Excel」「DCF Excel」「類似会社 選定」の検索意図に対して、実務で作業を完了できるページとして提示する。

## Scope

- 全体へWebSite・Organization構造化データを追加する。
- 環境変数でGoogle Search Consoleの所有権確認メタタグを出力できるようにする。
- 三表モデル、DCF、類似会社選定のtitle、description、H1、本文を検索意図に合わせる。
- 三表モデルへ数値例、Excel数式、誤り、確認手順、完成Excelへの導線を追加する。
- DCFハブへ著者、更新日、参考資料、Article・BreadcrumbList構造化データを追加する。
- サイトマップの実更新日とREADMEのSearch Console手順を更新する。

## Constraints

- キーワードの不自然な反復や大量の薄いページ追加は行わない。
- Valuation、Enterprise Value、Equity Value、Base / Upside / Downsideは従来の表記方針を維持する。
- Search Consoleの確認トークンはリポジトリへ保存せず、GitHub Actionsの変数から渡す。
- FAQ構造化データは既存ページだけに維持し、全ページへ機械的に追加しない。

## Success Criteria

- 静的HTMLにWebSite、Organization、Article、BreadcrumbListが適切に出力される。
- 所有権確認トークンを設定したビルドでGoogle verificationメタタグが出力される。
- 主要3ページのtitle、H1、本文、内部リンクが同じ検索意図を明確に表す。
- sitemap.xmlの主要3ページが2026-07-25更新になる。
- SEO検証、編集情報検証、静的出力検証、lint、本番ビルドが成功する。

