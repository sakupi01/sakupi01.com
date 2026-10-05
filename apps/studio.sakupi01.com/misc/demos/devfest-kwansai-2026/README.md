# DevFest Kwansai 2026 demo

「Web UI 2026 Updates & What's Coming!」(2026-10-18、Track C 13:50-14:15) のデモ。
イベントのタイムテーブルを題材に、章ごとに 2026 年の Web UI 機能を足していく。

## 起動

```sh
python3 serve.py
```

`http://127.0.0.1:3720/` で開く。標準ライブラリだけで動き、ネットワークは使わない (フォントも `fonts/` から配信する)。

- `/board/?slow`: 文書の後半 (集計の `<template for>`) を 1.5 秒遅れて送る。Out-of-Order Streaming を目で見せるときに使う
- `?off=canvas,webmcp`: 不安定な機能を切る kill switch。`canvas` は共有画像の HTML-in-Canvas、`webmcp` はツールの登録を止める

## ページ

| URL           | 中身                                                                                                    | 章      |
| ------------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `/`           | まとめページ。timetable と board を Responsive iframe で埋め込む                                        | 3       |
| `/timetable/` | タイムテーブル (`<table>`) と Temporal によるタイムゾーン切り替え                                       | 0、1、2 |
| `/board/`     | Grid Lanes のセッションボード。`<session-card>`、`if()` の注目枠、ドラッグ & ドロップ、絞り込み、WebMCP | 2、3、5 |
| `/share/`     | 共有画像。カードとフォームを HTML-in-Canvas で描いて PNG にする。board の注目枠のカードからリンクで開く | 4       |

## ブラウザ

- Chrome Canary: `--enable-experimental-web-platform-features` を付けて起動する。全章の実演に使う
- Chrome stable (154): text-fit、Gap Decorations、customizable select、focusgroup、interest invokers、Temporal、Responsive iframe は動く。Grid Lanes、Navigation Matching、HTML-in-Canvas、WebMCP は縮退する
- 未対応のブラウザでは各機能が「ない」状態に縮退し、表とカードは読める
- Speculation Rules の prerender は、Playwright など DevTools が接続した状態では Chrome が止める (`PrerenderingDisabledByDevTools`)。本番前に、DevTools の Application > Speculative loads で手で確かめる

## 章ごとの見どころ

| 章                    | 画面              | 機能                                                                                                                                                                                       | 主なファイル                                           |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 0 導入と Temporal     | timetable         | `PlainDate` + `PlainTime` + タイムゾーン → `ZonedDateTime`、`withTimeZone()`、RFC 9557 の文字列、`until()`                                                                                 | `timetable/timezone.js`                                |
| 1 見た目              | timetable、board  | Corner Shape (`squircle` / `scoop`)、text-fit (注目枠のタイトル)、`<meta name="text-scale">`、Gap Decorations (board の列の区切り線)                                                       | `timetable/layout.css`、`card.css`、`board/layout.css` |
| 2 Platform driven SPA | timetable → board | ページをまたぐ View Transitions (セルがカードへ形を変える)、`@location` / `@navigation` / `:link-to()`、Declarative Fragments (共通ナビ)、Out-of-Order Streaming (集計)、Speculation Rules | `navigation.css`、`partials/site-nav.html`、`serve.py` |
| 3 セッションボード    | board、`/`        | Web Components、Grid Lanes、`if()`、`@property`、customizable select、`:has()` の絞り込み、range、focusgroup、interest invokers + anchor positioning、Responsive iframe                    | `card.css`、`board/*`、`embed.js`、`showcase.js`       |
| 4 HTML-in-Canvas      | share             | `<canvas content="drawable">`、`drawElementImage()`、`toBlob()`                                                                                                                            | `share/*`                                              |
| 5 AI                  | board             | WebMCP (`document.modelContext.registerTool()`) の `search_sessions` / `feature_session`                                                                                                   | `board/webmcp.js`                                      |

## 実装で分かったこと (2026-10-06、Chrome 157 Canary)

- `@location` の `base-url: stylesheet` は、stylesheet ではなく document を基準に解決され、`:link-to()` が一致しなかった。全ページが 1 階層下にあるので、`base-url: document` と `url-pattern("../board/")` で書いている
- `@navigation (at: …)` は「いまのページ」には一致しなかった。いまのページのリンクは、`body` のクラスと `:link-to()` の組み合わせで選んでいる
- `@navigation (to: …)` は旧ページ、`@navigation (from: …)` は新ページで、遷移の最中に効く
- WebMCP の `executeTool()` は、第 2 引数に JSON 文字列ではなくオブジェクトを取る
- `window.requestResize()` は iframe に埋め込まれていない文書で呼ぶと `NotAllowedError` になるので、埋め込まれているときだけ呼ぶ
- focusgroup の `toolbar` は、矢印キーを値の変更に使う select や range とは同居させない (矢印キーが部品の操作に取られる)。ボタンだけの表示切り替えに付けている

## ファイル構成

| ファイル                                                                     | 役割                                                                                                            |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `style.css`                                                                  | 入口。layer の順番を宣言し、下の CSS を `@import … layer()` で振り分ける                                        |
| `tokens/primitives.css`                                                      | 生の値 (`--p-`、色は OKLCH) と `@property` の登録                                                               |
| `tokens/semantic.css`                                                        | 役割の名前 (`--s-`)。名前はリポジトリの stylelint (`custom/token-scope`) が property ごとに許す接頭辞に合わせる |
| `base.css`                                                                   | reset、要素の既定スタイル、`@font-face`                                                                         |
| `common.css`                                                                 | 2 ページ以上で使う部品                                                                                          |
| `card.css`                                                                   | `<session-card>` のスタイル。document と shadow DOM の両方で読み込む                                            |
| `layout.css`、`timetable/layout.css`、`board/layout.css`、`share/layout.css` | 各ページ固有のレイアウト。`body` のクラスで範囲を限定する                                                       |
| `navigation.css`                                                             | ページ間の遷移 (View Transitions、`@location`、`@navigation`、共通ナビ)                                         |
| `partials/site-nav.html`                                                     | Declarative Fragments で各ページに取り込む共通ナビ                                                              |
| `embed.js`                                                                   | iframe に埋め込まれたとき、高さの変化を埋め込み先に伝える                                                       |
| `showcase.js`                                                                | まとめページの iframe の高さ表示と、`frame-sizing` 未対応時の高さ設定                                           |
| `timetable/timezone.js`                                                      | Temporal でのタイムゾーン変換                                                                                   |
| `board/session-card.js`、`board/board.js`                                    | カードの定義と、ドラッグ & ドロップ                                                                             |
| `board/board-filter.js`                                                      | 時間帯の絞り込みと表示の切り替え                                                                                |
| `board/webmcp.js`                                                            | WebMCP のツール                                                                                                 |
| `share/share.js`                                                             | HTML-in-Canvas の描画と PNG 保存                                                                                |
| `serve.py`                                                                   | ローカル配信 (`?slow` の遅延送信つき)                                                                           |
| `fonts/`                                                                     | M PLUS Rounded 1c (SIL OFL 1.1、`fonts/OFL.txt`)                                                                |

layer の順番は `base, global, layout, components, checker`。後ろほど優先される。

linter (stylelint) がまだ知らない新しい構文 (`if()`、`@location`、`::picker(select)`、`corner-shape` など) は、構文が仕様どおりであれば使い、該当行かファイルの先頭で理由を書いて lint を外している。

## spike の結果

2026-10-05 に確かめた結果。

- Canary: Chrome 157 に `--enable-experimental-web-platform-features` を付けて、Playwright で判定と操作をした
- Stable: Chrome 154 (flag なし)
- Safari: Technology Preview は未インストールのため未確認。Safari 26.4 も未確認

| 機能                            | Canary 157 | Stable 154 | 判定と使い方                                                                                                                                                          |
| ------------------------------- | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation Matching             | 動く       | 動かない   | 採用。`@location` と `@navigation (to: …)` が遷移の最中に効き、`a:link-to()` も一致する。`:navigation-source` も解釈される (仕様草案の `:nav-source` は不可)          |
| ページをまたぐ View Transitions | 動く       | 動く       | 採用。`pageswap` と `pagereveal` の両方で transition が発生した                                                                                                       |
| Declarative Fragments           | 動く       | 未確認     | 採用。`<template for src>` が断片を取り込む。外部の断片の script を既定で無効化する処理は未実装なので、断片に script を入れない                                       |
| Out-of-Order Streaming          | 動く       | 未確認     | 採用。既存デモの自己チェックが全項目通る                                                                                                                              |
| HTML-in-Canvas                  | 動く       | 動かない   | 採用。新しい形の API (`<canvas content="drawable">`、子に `drawable`、`onpaint`、`drawElementImage()`)。PNG 書き出しと canvas 内 input へのフォーカスも動く           |
| text-fit                        | 動く       | 動く       | 採用。`text-fit: grow per-line-all`                                                                                                                                   |
| Gap Decorations                 | 動く       | 動く       | 採用。grid に `row-rule` / `column-rule`。board に付ける                                                                                                              |
| Grid Lanes                      | 動く       | 動かない   | 採用。Canary でも本番表示できる                                                                                                                                       |
| focusgroup                      | 動く       | 動く       | 採用。`focusgroup="toolbar"` で矢印キーの移動を確認した。`focusgroup` プロパティは無いので、判定は属性の有無ではなく挙動で見る                                        |
| WebMCP                          | 動く       | 動かない   | 採用。API は `document.modelContext.registerTool()` (`navigator.modelContext` ではない)                                                                               |
| rangegroup                      | 動かない   | 動かない   | 不採用。Intent to Prototype は出ているが、Blink の runtime feature にまだ定義がない。range を 2 本並べ、Brecht De Ruyte の Web Components 版 POC をスライドで紹介する |
| Incremental Font Transfer       | 一部       | 動かない   | 不採用 (直前に再確認)。下の注を参照                                                                                                                                   |

### Incremental Font Transfer の詳細 (2026-10-05)

- flag: runtime feature `IncrementalFontTransfer` は status が `test` で、experimental flag には含まれない。`--enable-blink-features=IncrementalFontTransfer` で有効にする
- 有効にすると `CSS.supports("font-tech(incremental)")` が true になり、`src: url(…-IFT.woff2) format("woff2") tech(incremental)` の `@font-face` が読み込まれる
- ただし [IFT デモ](https://garretrieger.github.io/ift-demo/) の `NotoSansJP-HighFreq-IFT.woff2` で試すと、取得されたのは初期フォント (約 34KB) だけで、足りない字形を補うパッチの取得が起きなかった。CDP の `CSS.getPlatformFontsForNode` で見ると、IFT のフォントで描かれたのは 1 行あたり 5 字だけで、残りはシステムのフォント (Hiragino Mincho) にフォールバックしていた
- 実装途中 ([crbug 498722796](https://issues.chromium.org/issues/498722796)) なのか、デモのフォントのエンコード版と実装の版が合っていないのかは未確定
- IFT デモ本体は Rust 製の JS / Wasm クライアントでパッチを当てるので、ブラウザの実装の確認には使えない
- `tech(incremental)` を書くと stylelint は未対応でエラーにするが、構文は仕様どおりなので、使う場合は該当行だけ lint を外す
