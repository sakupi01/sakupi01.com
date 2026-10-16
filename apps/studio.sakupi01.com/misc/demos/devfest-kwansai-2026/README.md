# DevFest Kwansai 2026 demo

「Web UI 2026 Updates & What's Coming!」(2026-10-18、Track C 13:50-14:15) のデモ。
イベントのタイムテーブルを題材に、章ごとに 2026 年の Web UI 機能を足していく。タイムテーブル、お気に入り、セッションページは、同じ文書のまま中身を差し替えて切り替える SPA (2 章の Platform Driven SPA)。

## 起動

```sh
python3 serve.py
```

`http://127.0.0.1:3720/` で開く。標準ライブラリだけで動く。フォントも `fonts/` から配信する。ネットワークを使うのは登壇者の写真だけ (下を参照)。

セッションとお気に入りは SQLite (`data/devfest.sqlite`) に持つ。`serve.py` が起動時に、DB がなければ `data/seed.json` から作る。DB は git に入れない。seed を直したときと、お気に入りを全部消して 0 件から始めたいときは、DB を消してから起動し直す。

- `/favs/`: `serve.py` は、スケルトンと差し込む場所の目印 (`<?start name="board-cards">`〜`<?end>`) までをすぐ送る。そのあと DB からこの利用者のお気に入りを読み、カードの HTML を作って `<template for="board-cards">` で送る (Out-of-Order Streaming)。DB の読み取りは一瞬なので、DB や API の待ち時間の代わりに 3 秒待つ (`STREAM_DELAY_SECONDS`)。Network タブの `favs/` の Response で、後半のテンプレートが見える
- SPA の切り替え: `shared/router.js` が Navigation API の `navigate` イベントで遷移を受け取り、`X-Partial: page` 付きで同じ URL を fetch する。`serve.py` はページの中身 (`<?start name="page">` から最後の `<?end>` まで) を `<template for="page">` で返し、router.js がそれを `document.body.streamAppendHTMLUnsafe()` に流し込む。favs は中身 (スケルトン) のあとに `<template for="board-cards">` を 3 秒遅れで送る。URL を直接開いたときと再読み込みは、`serve.py` が完全なページを返す
- `?off=webmcp`: 不安定な機能を切る kill switch。WebMCP のツールの登録を止める。開いたページにだけ効き、リンク先には引き継がれないので、`/favs/?off=webmcp` のように直接開く。感想フォームのツールは切れない
- 共通ナビは各ページに直接書く。ページの範囲の外にあるので、SPA で切り替えても差し替わらずに残る
- お気に入りは DB に、利用者ごとにセッションの id の並び (お気に入りにした順) で保存する。利用者は `serve.py` が発行する cookie `devfest_user` (匿名の id) で見分ける。API は `GET` / `PUT /api/favorites` (id の配列)。本番前に、cookie を消すか DB を消すと 0 件から始められる
- 感想は DB の `feedback` テーブルに、評価と答え (JSON)、送ったのが人かエージェントか (`via`) を保存する。API は `POST /api/feedback`。条件を満たさない答え (★3 以下なのに「良かったところ」など) は 400 で断る。返すのは件数、平均、エージェント経由の件数だけで、他の人の感想の本文は返さない。既存の DB にも起動時にテーブルを足す
- カードはドラッグのほか、「前へ」「後ろへ」ボタンでキーボードだけでも並べ替えられる。♥ でお気に入りから外す
- 登壇者の写真は `img.gdgs.jp` (connpass のイベントページと同じ画像) を直接読み込む。会場のネットワークが使えないと写真は出ない (名前と所属は出る)

## ページ

| URL                       | 中身                                                                                                            | 章      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| `/`                       | 入口。timetable へ移る                                                                                          | -       |
| `/timetable/`             | タイムテーブル (`<table>`)、Temporal によるタイムゾーン切り替え、各セッションの ♥ とセッションページへのリンク  | 導入、1、2 |
| `/favs/`                  | お気に入り。♥ を押したセッションを Grid Lanes で並べる。`<session-card>`、ドラッグ & ドロップ、絞り込み、WebMCP | 1、2、3 |
| `/session/?id=session-05` | セッションページ。写真、タイトル、名前がタイムテーブルやお気に入りから View Transitions で移ってくる。下に感想フォームを Responsive iframe で埋め込む | 1、2、3 |
| `/feedback/?id=session-05` | 感想フォーム。セッションページの iframe の中に入る (SPA の切り替えの対象外の、別の文書)。答えに応じて質問が増減する。WebMCP の declarative API のツール | 3 |

## ブラウザ

- Chrome Canary: `--enable-experimental-web-platform-features` を付けて起動する。全章の実演に使う
- Chrome stable (154 / 155): text-fit、Gap Decorations、customizable select、focusgroup、interest invokers、Temporal、Responsive iframe は動く。Grid Lanes、Navigation Matching、WebMCP は縮退する。`streamAppendHTMLUnsafe()` がないので、SPA の切り替えはせず、ページごとに読み込む (155 で実測)
- 未対応のブラウザでは各機能が「ない」状態に縮退する。セッションの中身 (タイトル、登壇者、写真、説明文) は `/sessions.json` から JS で組み立てるので、JS がないと、表のセルは空になり (`<noscript>` の案内が出る)、お気に入りのカードは隠れたままになる
- 公開版 (studio の静的配信) には `serve.py` がないので、`/sessions.json` と API が読めず、セッションの中身とお気に入りは出ない。お気に入り、セッションページ、感想フォームに「ローカルで `python3 serve.py` を起動して開いてください」と出る。SPA の切り替えもせず、ページごとに読み込む (静的配信は部分の応答を返さないため)

## 章ごとの見どころ

| 章                    | 画面                                         | 機能                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 主なファイル                                                                                                                                       |
| --- | --- | --- | --- |
| 導入と Temporal | timetable | `PlainDate` + `PlainTime` + タイムゾーン → `ZonedDateTime`、`withTimeZone()`、`until()` | `timetable/timezone.js` |
| 1 見た目 | timetable、favs、session | Corner Shape (`squircle` / `scoop`。セッションのリンクのフォーカスリングも形に沿う)、text-fit (お気に入りのカードとセッションページのタイトル)、`<meta name="text-scale">`、customizable select (タイムゾーンの選択肢に旗と、その地域での開場時刻)、`if()` と typed `attr()` (お気に入りのカードの色と列) | `timetable/layout.css`、`favs/card.css`、`favs/layout.css`、`session/layout.css`、`shared/common.css` |
| New Layout System | favs | Grid Lanes (落としたカードだけ `data-lane` で列に固定)、Gap Decorations (カードの間の区切り線。`rule-visibility-items: between` で、両側にカードがある隙間だけに引く) | `favs/layout.css`、`favs/card.css` |
| 2 Platform Driven SPA | timetable / favs / session の切り替え | Navigation API (`intercept()`) で同じ文書のまま切り替える。中身は `<template for="page">` を `streamAppendHTMLUnsafe()` で差し込む (Declarative Partial Updates)、同じ文書の View Transitions (セルやカードがセッションページへ形を変え、タイトル、写真、名前も移る)、お気に入りの board の表示の切り替えと並べ替えは board だけの element-scoped View Transitions (アニメーションの途中でもボタンを押せる)、`@location` / `@navigation` / `:link-to()`、Out-of-Order Streaming (スケルトンからカードへ)、新しい HTML の挿入メソッド (ページの差し替えと、saku の登壇が終わるまでの残り時間。安全版の `streamAppendHTML()` は `<template for>` を取り除いて差し替えが起きなかったため `Unsafe` 版を使う)。最後に、宣言的な SPA (route map) と、Persistent iframes / `preserve` をスライドだけで紹介 | `shared/router.js`、`shared/navigation.css`、`timetable/countdown.js`、`serve.py` |
| 3 AI | session (の iframe の中の feedback)、favs | Responsive iframe (感想フォーム。答えに応じて質問が増減し、iframe の高さが追従する。送信後は縮む)、WebMCP。imperative API (`document.modelContext.registerTool()`) で favs の `search_sessions` / `add_favorite` / `remove_favorite` (favs を表示している間だけ登録)、declarative API (`<form toolname>`) で感想フォームの `submit_session_feedback` | `feedback/*`、`session/feedback-frame.js`、`favs/webmcp.js`、`serve.py` |
| スライドでは扱わない (デモにはある) | favs | Web Components (`<session-item>`、`<session-card>`、`<like-button>`)、JSON modules (`import … with { type: "json" }`)、Container Size Query、`@property`、`contrast-color()`、`moveBefore()`、SQLite と API で保存するお気に入り、`:has()` の絞り込みと 0 件の案内、range、focusgroup、interest invokers + anchor positioning | `favs/*`、`shared/session-item.js`、`shared/favorites.js`、`shared/like-button.js`、`data/seed.json` |

## 実装で分かったこと (2026-10-06、Chrome 157 Canary)

- `@location` の `base-url: stylesheet` は、stylesheet ではなく document を基準に解決され、`:link-to()` が一致しなかった。全ページが 1 階層下にあるので、`base-url: document` と `url-pattern("../favs/")` で書いている
- `@navigation (at: …)` は「いまのページ」には一致しなかった。いまのページのリンクは、`body` のクラスと `:link-to()` の組み合わせで選んでいる
- ページごとに読み込むとき (MPA) は、`@navigation (to: …)` は旧ページ、`@navigation (from: …)` は新ページで、遷移の最中に効く
- WebMCP の `executeTool()` は、第 2 引数に JSON 文字列ではなくオブジェクトを取る
- `window.requestResize()` は iframe に埋め込まれていない文書で呼ぶと `NotAllowedError` になるので、埋め込まれているときだけ呼ぶ
- focusgroup の `toolbar` は、矢印キーを値の変更に使う select や range とは同居させない (矢印キーが部品の操作に取られる)。ボタンだけの表示切り替えに付けている
- Grid Lanes では `reading-flow: grid-order` が効かなかった (`order` で並べ替えても Tab 順は DOM 順のまま)。お気に入りは `order` を使わず、DOM の順番で並べている
- 新しい HTML の挿入メソッドの安全版 (`streamAppendHTML()`、`appendHTML()`) は、Sanitizer で `<template for>` を取り除き、目印の差し替えが起きなかった。`Unsafe` 版 (`streamAppendHTMLUnsafe()`) では差し替わる (Chrome 157 Canary、2026-10-08)
- WebMCP の `executeTool()` の第 1 引数は、ツールの名前ではなく `getTools()` が返すオブジェクト (2026-10-07)
- WebMCP の declarative API では、disabled の項目がツールの入力 (JSON Schema) から外れる。項目を disabled にしたり戻したりするとツールの定義が変わり、実行中の呼び出しは「Tool execution cancelled, since tool definition was updated」で取り消される。感想フォームの条件付きの質問は hidden で隠している (2026-10-13)
- checkbox のまとまりの説明は、checkbox ではなく fieldset の `toolparamdescription` から読まれる (2026-10-13)
- エージェントが値を入れると、項目ごとに `input` / `change` が起きる。人が送信を押すと submit の `agentInvoked` は true で、`respondWith()` の値がツールの結果になる。送信直後に同じタスクで `toolname` を外すと、結果が届く前に取り消されるので、次のタスクで外す (2026-10-13)
- 同じ origin の iframe の中の declarative なツールは、トップの文書の `getTools()` にも出る (2026-10-13)
- SPA (同じ文書) の遷移では、`@navigation (to: …)` も `(from: …)` も、View Transition が終わるまで一致した。spike (handler がカードの流し込みの終わりまで待つ作り) では、handler がまだ終わっていなくても、transition が終わると一致しなくなった (2026-10-13)
- `document.body.streamAppendHTMLUnsafe()` で流し込んだ `<template for="page">` の中に別の目印 (`<?start name="board-cards">`) があっても、後から流れてくる `<template for="board-cards">` で差し替わる。差し替えに使われた template は body に残らない (2026-10-13)
- custom element が定義済みのところへ流し込むと、子要素が届く前に `connectedCallback` が呼ばれる。`<session-card>` は「中身が空なら組み立てる」としていたので、SPA でカードの中身が 2 重になり、View Transition が `Unexpected duplicate view-transition-name` で飛んだ。組み立ては、JS でカードを作るとき (`favs.js` の `cardFor()`) だけ `build()` を呼ぶ形にした (2026-10-13)
- element-scoped View Transitions (`element.startViewTransition()`) は、名前付きの要素が消える更新で `InvalidStateError: … Prepaint layout check failed` になり、アニメーションが飛ばされる。最小のページでも再現し、document 全体の transition では起きない (Chrome 157 Canary と Chrome 155、2026-10-13)。そのため、ページの切り替え (前のページの要素が消える) は document 全体のまま、要素が消えない board の表示の切り替えと並べ替えだけを scoped にした
- WebMCP の `registerTool(tool, { signal })` は、signal を abort すると `getTools()` から消える。favs を離れるときにツールを外すのに使う (2026-10-13)
- キーボードでの並べ替えは `Element.moveBefore()` で行う。`before()` / `after()` は要素を一度外すので、押したボタンからフォーカスが外れる

## ファイル構成

直下には入口 (`/`) とサーバーだけを置く。2 ページ以上で使うものは `shared/` に、1 ページだけで使うものはそのページのディレクトリに置く。

| ファイル                                                        | 役割                                                                                                                                                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html` | 入口。timetable へ移る (`<meta http-equiv="refresh">`) |
| `serve.py`                                                      | サーバー。SQLite の DB、`/sessions.json`、お気に入りの API、`/favs/` のストリーミング、SPA の切り替え用のページの中身 (`X-Partial: page`)、`/api/countdown` (残り時間を毎秒送り続ける)、`/api/feedback` (感想の保存と集計) |
| `data/seed.json`                                                | 30 セッションのデータ (タイトル、登壇者、写真、時刻、形式、説明文)。`serve.py` が DB を作るときの元。DB (`data/devfest.sqlite`) は git に入れない                                                            |
| `fonts/`                                                        | M PLUS Rounded 1c (SIL OFL 1.1、`fonts/OFL.txt`)                                                                                                                                                             |
| `shared/style.css`                                              | CSS の入口。全ページがこの 1 枚を読み込む。layer の順番を宣言し、各ページの CSS も含めて `@import … layer()` で振り分ける                                                                                    |
| `shared/tokens/primitives.css`                                  | 生の値 (`--p-`、色は OKLCH) と `@property` の登録                                                                                                                                                            |
| `shared/tokens/semantic.css`                                    | 役割の名前 (`--s-`)。名前はリポジトリの stylelint (`custom/token-scope`) が property ごとに許す接頭辞に合わせる                                                                                              |
| `shared/base.css`                                               | reset、要素の既定スタイル、`@font-face`                                                                                                                                                                      |
| `shared/common.css`                                             | 2 ページ以上で使う部品。セッションの中身、♥、トラックの色 (`[data-track]` が `--track-strong` / `--track-soft` を渡す)、customizable select のフォーム (`.select-form`)、保存の失敗の知らせ (`.save-status`) |
| `shared/navigation.css`                                         | ページ間の遷移 (View Transitions、`@location`、`@navigation`、共通ナビ)                                                                                                                                      |
| `shared/router.js` | SPA の切り替え (2 章)。Navigation API で遷移を受け取り、ページの中身を `streamAppendHTMLUnsafe()` で差し込み、同じ文書の View Transitions で包む。ページごとの JS の `init(signal)` を呼び、ページを離れたら signal を abort する |
| `shared/overrides.css`                                          | 各 demo 共通の判定表示 (checker) の配置を、この demo 向けに上書きする                                                                                                                                        |
| `shared/session-item.js`                                        | `<session-item>`: タイムテーブルのセル (`variant="cell"`) とセッションページ (`variant="detail"`) を `/sessions.json` (`serve.py` が DB から返す) から組み立てる。部品は `<session-card>` も使う             |
| `shared/favorites.js`、`shared/like-button.js`                  | お気に入りの保存 (`/api/favorites`、別のタブには `BroadcastChannel` で知らせる) と、♥ ボタンの custom element `<like-button>` (タイムテーブルとセッションページ)                                             |
| `timetable/layout.css`、`favs/layout.css`、`session/layout.css` | 各ページ固有のレイアウト。`body` のクラスで範囲を限定する。`session/layout.css` だけは common.css の部品を大きく見せ直すので、`components.session` の layer に入れる                                         |
| `timetable/timezone.js`                                         | Temporal でのタイムゾーン変換                                                                                                                                                                                |
| `timetable/countdown.js`                                        | saku の登壇が終わるまでの残り時間。`/api/countdown` のレスポンスを `streamAppendHTMLUnsafe()` につなぐ                                                                                                       |
| `favs/card.css`                                                 | `<session-card>` のスタイル。document と shadow DOM の両方で読み込む                                                                                                                                         |
| `favs/session-card.js`、`favs/favs.js`                          | カードの定義 (中身は `serve.py` が DB から作って流す。後から足したカードだけ `/sessions.json` から組み立てる) と、ドラッグ & ドロップ、お気に入りから外す                                                    |
| `favs/board-filter.js`                                          | 時間帯の絞り込みと表示の切り替え                                                                                                                                                                             |
| `favs/webmcp.js` | WebMCP のツール (imperative API) |
| `session/feedback-frame.js` | 感想フォームの iframe の `src` を `?id` から決める。`frame-sizing` 未対応のときは、`postMessage` で届いた高さを iframe に設定する |
| `feedback/index.html`、`feedback/layout.css`、`feedback/feedback.js` | 感想フォーム。条件付きの質問の出し入れ、`POST /api/feedback` への送信、WebMCP の declarative API (`toolname`) と `respondWith()` |
| `feedback/embed.js` | iframe に埋め込まれたとき、高さの変化を埋め込み先に伝える (Responsive iframe の `requestResize()`、未対応なら `postMessage`) |
| `session/index.html`                                            | セッションページ。`<session-item variant="detail">` が `?id` のセッションを組み立てる                                                                                                                        |

layer の順番は `base, global, layout, components, checker, overrides`。後ろほど優先される。

linter (stylelint) がまだ知らない新しい構文 (`if()`、`@location`、`::picker(select)`、`corner-shape` など) は、構文が仕様どおりであれば使い、該当行かファイルの先頭で理由を書いて lint を外している。

## spike の結果

2026-10-05 に確かめた結果。

- Canary: Chrome 157 に `--enable-experimental-web-platform-features` を付けて、Playwright で判定と操作をした
- Stable: Chrome 154 (flag なし)
- Safari: Technology Preview は未インストールのため未確認。Safari 26.4 も未確認

| 機能                            | Canary 157 | Stable 154 | 判定と使い方                                                                                                                                                                                                         |
| ------------------------------- | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation Matching             | 動く       | 動かない   | 採用。`@location` と `@navigation (to: …)` が遷移の最中に効き、`a:link-to()` も一致する。`:navigation-source` も解釈される (仕様草案の `:nav-source` は不可)                                                         |
| ページをまたぐ View Transitions | 動く       | 動く       | 採用。`pageswap` と `pagereveal` の両方で transition が発生した                                                                                                                                                      |
| element-scoped View Transitions | 動く       | 動く       | 一部だけ採用 (2026-10-13 に Chrome 155 で確認)。お気に入りの board の表示の切り替えと並べ替えに使う。名前付きの要素が消える更新では飛ばされるので、ページの切り替えには使わない |
| Declarative Fragments           | 動く       | 動かない   | 不採用 (2026-10-13。共通ナビは SPA で差し替える範囲の外にあり、断片を取り込むのが最初の読み込みのときだけになるので、各ページに直接書くことにした)。Chrome 154 は `<template for>` を処理するが `src` は使わず、template の中身を入れる。`<template for src>` が断片を取り込む。外部の断片の script を既定で無効化する処理は未実装なので、断片に script を入れない |
| Out-of-Order Streaming          | 動く       | 動く       | 採用。既存デモの自己チェックが全項目通る                                                                                                                                                                             |
| HTML-in-Canvas                  | 動く       | 動かない   | 不採用 (2026-10-11 に共有画像ページごと外し、2026-10-13 に使い道を見直したうえで入れないと決めた)。新しい形の API (`<canvas content="drawable">`、子に `drawable`、`onpaint`、`drawElementImage()`) は Canary で動いた                                                  |
| text-fit                        | 動く       | 動く       | 採用。`text-fit: grow per-line-all`                                                                                                                                                                                  |
| Gap Decorations                 | 動く       | 動く       | 採用。grid に `row-rule` / `column-rule`。favs に付ける                                                                                                                                                              |
| Grid Lanes                      | 動く       | 動かない   | 採用。Canary でも本番表示できる                                                                                                                                                                                      |
| focusgroup                      | 動く       | 動く       | 採用。`focusgroup="toolbar"` で矢印キーの移動を確認した。`focusgroup` プロパティは無いので、判定は属性の有無ではなく挙動で見る                                                                                       |
| WebMCP                          | 動く       | 動かない   | 採用。API は `document.modelContext.registerTool()` (`navigator.modelContext` ではない)                                                                                                                              |
| rangegroup                      | 動かない   | 動かない   | 不採用。Intent to Prototype は出ているが、Blink の runtime feature にまだ定義がない。range を 2 本並べ、Brecht De Ruyte の Web Components 版 POC をスライドで紹介する                                                |
| Incremental Font Transfer       | 一部       | 動かない   | 不採用 (直前に再確認)。下の注を参照                                                                                                                                                                                  |

### Incremental Font Transfer の詳細 (2026-10-05)

- flag: runtime feature `IncrementalFontTransfer` は status が `test` で、experimental flag には含まれない。`--enable-blink-features=IncrementalFontTransfer` で有効にする
- 有効にすると `CSS.supports("font-tech(incremental)")` が true になり、`src: url(…-IFT.woff2) format("woff2") tech(incremental)` の `@font-face` が読み込まれる
- ただし [IFT デモ](https://garretrieger.github.io/ift-demo/) の `NotoSansJP-HighFreq-IFT.woff2` で試すと、取得されたのは初期フォント (約 34KB) だけで、足りない字形を補うパッチの取得が起きなかった。CDP の `CSS.getPlatformFontsForNode` で見ると、IFT のフォントで描かれたのは 1 行あたり 5 字だけで、残りはシステムのフォント (Hiragino Mincho) にフォールバックしていた
- 実装途中 ([crbug 498722796](https://issues.chromium.org/issues/498722796)) なのか、デモのフォントのエンコード版と実装の版が合っていないのかは未確定
- IFT デモ本体は Rust 製の JS / Wasm クライアントでパッチを当てるので、ブラウザの実装の確認には使えない
- `tech(incremental)` を書くと stylelint は未対応でエラーにするが、構文は仕様どおりなので、使う場合は該当行だけ lint を外す
