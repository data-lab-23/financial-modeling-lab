# AdSense収益化設計

## 目的

財務モデリング教材の可読性と信頼性を維持しながら、Google AdSenseを全ページで利用できる配信基盤を追加する。

## 配置方針

- AdSenseの共通スクリプトはルートレイアウトから一度だけ読み込む。
- 手動広告は全ページの本文終了後に1枠置き、長文記事には編集情報後にも1枠置く。
- ヘッダー、ナビゲーション、Excelダウンロードボタン、入力フォームの近くには置かない。
- 広告には小さく「広告」と表示し、本文や編集コンテンツと区別する。
- publisher IDまたはslot IDが未設定の場合、スクリプトも広告枠も出力せず、空白も残さない。

## 設定

- `NEXT_PUBLIC_ADSENSE_CLIENT`: `ca-pub-`から始まるpublisher ID
- `NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT`: 記事末尾用の広告slot ID
- `ADSENSE_PUBLISHER_ID`: `ads.txt`生成用の数値publisher ID

GitHub Actionsは上記をRepository Variablesから受け取る。秘密情報ではないが、コードへ値を直書きしない。

## 対象

- 通常の財務モデリング記事、DCF講座、運転資本講座は記事末尾広告とページ末尾広告の対象
- そのほかのページはページ末尾広告の対象
- 自動広告はAdSense管理画面から追加で有効化できる

## 法務・透明性

- プライバシーポリシーに第三者配信広告、Cookie、広告パーソナライズ、オプトアウトを追記する。
- フッターに「広告について」への導線を追加する。
- publisher IDがある場合のみ、正しいGoogle形式の`ads.txt`を静的生成する。
- EEA・英国・スイス向け同意管理はAdSense管理画面のGoogle認定CMPで設定する運用とする。

## 検証

- ID未設定時に広告関連DOMが出ない。
- ID設定時にAdSense script、広告枠、client、slotが出る。
- 各記事シェルに広告枠が一つだけある。
- privacy、README、workflow、`.env.example`に必要設定がある。
- production build後の出力でbasePath、広告タグ、`ads.txt`を確認する。
