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

Chrome Canary と Safari TP で各機能が動くかを確かめた結果。

| 機能                            | Chrome Canary | Safari TP | 判定と代替 |
| ------------------------------- | ------------- | --------- | ---------- |
| Navigation Matching             |               |           |            |
| ページをまたぐ View Transitions |               |           |            |
| Declarative Fragments           |               |           |            |
| HTML-in-Canvas                  |               |           |            |
| text-fit                        |               |           |            |
| Gap Decorations                 |               |           |            |
| rangegroup                      |               |           |            |
| focusgroup                      |               |           |            |
| WebMCP                          |               |           |            |
| Incremental Font Transfer       |               |           |            |
