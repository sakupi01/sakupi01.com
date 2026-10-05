# DevFest Kwansai 2026 demo

「Web UI 2026 Updates & What's Coming!」(2026-10-18、Track C 13:50-14:15) のデモ。
イベントのタイムテーブルを題材に、章ごとに 2026 年の Web UI 機能を足していく。

## 起動

```sh
python3 serve.py
```

`http://127.0.0.1:3720/` で開く。標準ライブラリだけで動き、ネットワークは使わない (フォントも `fonts/` から配信する)。

## ページ

| URL           | 中身                                                                                  | 章      |
| ------------- | ------------------------------------------------------------------------------------- | ------- |
| `/`           | まとめページ。下の 2 ページを Responsive iframe で埋め込む                            | 3       |
| `/timetable/` | タイムテーブル (`<table>`) と Temporal によるタイムゾーン切り替え                     | 0、1、2 |
| `/board/`     | Grid Lanes のセッションボード。`<session-card>`、`if()` の注目枠、ドラッグ & ドロップ | 2、3、5 |

## ブラウザ

- Chrome Canary: `--enable-experimental-web-platform-features` を付けて起動する
- Safari Technology Preview: Grid Lanes と Temporal の本番表示に使う
- 未対応のブラウザでは各機能が「ない」状態に縮退し、表とカードは読める

## ファイル構成

| ファイル                                                 | 役割                                                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `style.css`                                              | 入口。layer の順番を宣言し、下の CSS を `@import … layer()` で振り分ける                                        |
| `tokens/primitives.css`                                  | 生の値 (`--p-`、色は OKLCH) と `@property` の登録                                                               |
| `tokens/semantic.css`                                    | 役割の名前 (`--s-`)。名前はリポジトリの stylelint (`custom/token-scope`) が property ごとに許す接頭辞に合わせる |
| `base.css`                                               | reset、要素の既定スタイル、`@font-face`                                                                         |
| `common.css`                                             | 2 ページ以上で使う部品                                                                                          |
| `card.css`                                               | `<session-card>` のスタイル。document と shadow DOM の両方で読み込む                                            |
| `layout.css`、`timetable/layout.css`、`board/layout.css` | 各ページ固有のレイアウト。`body` のクラスで範囲を限定する                                                       |
| `embed.js`                                               | iframe に埋め込まれたとき、高さの変化を埋め込み先に伝える                                                       |
| `showcase.js`                                            | まとめページの iframe の高さ表示と、`frame-sizing` 未対応時の高さ設定                                           |
| `timetable/timezone.js`                                  | Temporal でのタイムゾーン変換                                                                                   |
| `board/session-card.js`、`board/board.js`                | カードの定義と、ボードの操作                                                                                    |
| `fonts/`                                                 | M PLUS Rounded 1c (SIL OFL 1.1、`fonts/OFL.txt`)                                                                |

layer の順番は `base, global, layout, components, checker`。後ろほど優先される。

## spike の結果

2026-10-05 に確かめた結果。

- Canary: Chrome 157 に `--enable-experimental-web-platform-features` を付けて、Playwright で判定と操作をした
- Stable: Chrome 154 (flag なし)
- Safari: Technology Preview は未インストールのため未確認。Safari 26.4 も未確認

| 機能                            | Canary 157 | Stable 154 | 判定と使い方                                                                                                                                                 |
| ------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Navigation Matching             | 動く       | 動かない   | 採用。`@location` と `@navigation (to: …)` が遷移の最中に効き、`a:link-to()` も一致する。`:navigation-source` も解釈される (仕様草案の `:nav-source` は不可) |
| ページをまたぐ View Transitions | 動く       | 動く       | 採用。`pageswap` と `pagereveal` の両方で transition が発生した                                                                                              |
| Declarative Fragments           | 動く       | 未確認     | 採用。`<template for src>` が断片を取り込む。外部の断片の script を既定で無効化する処理は未実装なので、断片に script を入れない                              |
| Out-of-Order Streaming          | 動く       | 未確認     | 採用。既存デモの自己チェックが全項目通る                                                                                                                     |
| HTML-in-Canvas                  | 動く       | 動かない   | 採用。新しい形の API (`<canvas content="drawable">`、子に `drawable`、`onpaint`、`drawElementImage()`)。PNG 書き出しと canvas 内 input へのフォーカスも動く  |
| text-fit                        | 動く       | 動く       | 採用。`text-fit: grow per-line-all`                                                                                                                          |
| Gap Decorations                 | 動く       | 動く       | 採用。grid に `row-rule` / `column-rule`。board に付ける                                                                                                     |
| Grid Lanes                      | 動く       | 動かない   | 採用。Canary でも本番表示できる                                                                                                                              |
| focusgroup                      | 動く       | 未確認     | 採用。`focusgroup="toolbar"` で矢印キーの移動を確認した。`focusgroup` プロパティは無いので、判定は属性の有無ではなく挙動で見る                               |
| WebMCP                          | 動く       | 動かない   | 採用。API は `document.modelContext.registerTool()` (`navigator.modelContext` ではない)                                                                      |
| rangegroup                      | 動かない   | 動かない   | 不採用。未知の要素 (`HTMLUnknownElement`) として扱われる。range を 2 本並べ、`<rangegroup>` はスライドで紹介する                                             |
| Incremental Font Transfer       | 動かない   | 動かない   | 不採用。`font-tech(incremental)` が false。スライドで紹介する                                                                                                |
