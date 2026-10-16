# Web UI 2026 Updates & What's Coming! スライド原稿

DevFest Kwansai 2026 (2026-10-18、Track C 13:50-14:15)。導入のあと、1. 見た目、New Layout System (Grid Lanes と Gap Decorations)、2. Platform Driven SPA、3. AI の順に話し、最後に Modern Web Guidance を紹介する。当日の Google Slides と同じ順。デモの章 (README.md の「章ごとの見どころ」) と同じ順。

- ブラウザの状況は MDN の browser-compat-data (BCD) で確かめた (2026-10-09。Navigation API と同じ文書の View Transitions は 2026-10-13)。BCD に載っていない機能は、Chrome の記事と、このデモで実測した結果 (README.md の「spike の結果」) を書く
- Baseline は Chrome、Edge、Firefox、Safari の全部の stable で使えるかどうか。1 つでも欠けると Limited availability

---

# 導入: タイムテーブルと Temporal

## Temporal

- 日付と時刻の新しい標準 API。`Date` の置き換え
- 「日付だけ」(`PlainDate`)、「時刻だけ」(`PlainTime`)、「タイムゾーン付きの瞬間」(`ZonedDateTime`) を型で分けて扱える
- タイムゾーンの変換は `withTimeZone()`、差は `until()` で取れる
- デモ: タイムテーブルの時刻を、選んだタイムゾーンに変換する

```js
const EVENT_DATE = Temporal.PlainDate.from("2026-10-18");
const OPENING = Temporal.PlainTime.from("09:30");

// 日付 + 時刻 + タイムゾーン = Zoned Date Time
const opening = EVENT_DATE.toZonedDateTime({
  timeZone: "Asia/Tokyo",
  plainTime: OPENING,
});

opening
  .withTimeZone("Europe/London")
  .toPlainTime()
  .toString({ smallestUnit: "minute" });
// "01:30"
EVENT_DATE.until(opening.withTimeZone("America/New_York").toPlainDate()).days;
// -1
```

/_ note: `toZonedDateTime()` で「会場の日付と時刻」を 1 つの瞬間にし、`withTimeZone()` で別の地域の壁時計の時刻に読み替える。日付がずれる地域は `until()` の日数で「(-1日)」を出している (timetable/timezone.js) _/
/_ Baseline: Limited availability。Chrome 144、Edge 144、Firefox 139。Safari は Technology Preview のみ _/
/_ 参考: https://developer.chrome.com/blog/new-in-chrome-144 _/

---

# 1. 見た目

## Corner Shape

- `border-radius` で決めた角の範囲の「形」を、`corner-shape` で変えられる
- `round` (今までの丸)、`squircle`、`scoop` (内側にえぐれる)、`bevel`、`notch` など
- 角の形に沿ってボーダー、影、フォーカスリングも描かれる
- デモ: セッションのセルとカードは `squircle`、休憩は `scoop` (チケットの切り込みのような角)

```css
td.session,
.session-link {
  border-radius: 16px;
  corner-shape: squircle;
}

td.break {
  corner-shape: scoop;
}
```

/_ note: `.session-link` にも同じ角を付けているので、Tab で移ったときのフォーカスリングが squircle の形で出る。未対応のブラウザは `@supports (corner-shape: squircle)` の外の丸い角のまま _/
/_ Baseline: Limited availability。Chrome 139、Edge 139。Firefox と Safari は Technology Preview _/
/_ 参考: https://developer.chrome.com/blog/implementing-corner-shape _/

## text-fit

- テキストの各行を、入れ物の幅いっぱいまで拡大 (または縮小) する
- `grow` / `shrink`、`per-line-all` (行ごとに合わせる)、上限の倍率を指定できる
- 見出しを幅に合わせるための JS や、文字数ごとの `font-size` の調整が要らなくなる
- デモ: お気に入りのカードのタイトルとセッションページのタイトル

```css
/* セッションページのタイトル: 各行を幅いっぱいまで。最大 2 倍 */
.session-detail .title {
  text-fit: grow per-line-all 200%;
}
```

/_ note: 列の幅が狭いお気に入りのカードでは、大きくなりすぎないよう 150% を上限にしている (card.css) _/
/_ Baseline: Limited availability。Chrome 150、Edge 150。Firefox、Safari は未対応 _/
/_ 参考: https://developer.chrome.com/blog/new-in-chrome-150 _/

## OS の文字サイズに合わせる: `<meta name="text-scale">`

- OS の文字サイズの設定に合わせて、ルートの `font-size` (= `rem` の基準) が拡大縮小する。効果が大きいのはモバイル (今までは OS の設定が無視されていた)
- `rem` / `em` で組んだページなら、何もしなくても OS の文字の大きさの設定に追従する
- テキストの自動拡大 (モバイル) は止まる
- ブラウザの文字サイズの設定は、meta がなくても以前から `rem` に効いている (デスクトップでは meta による違いはほぼない)

```html
<meta name="text-scale" content="scale" />
```

```css
/* html の font-size は書かない。rem の基準は、OS の設定に合わせてブラウザが決める */
:where(html) {
  --s-font-size-sm: 0.85rem;
  --s-font-size-base: 1rem;
  --s-font-size-xl: 1.4rem;
}
```

/_ note: デモの全ページの head に meta を入れ、文字の大きさのトークンを全部 rem で定義している (shared/tokens/semantic.css)。`html { font-size: 16px }` のように絶対値で上書きすると、OS の設定に合わせた拡大縮小が打ち消される (MDN の Usage summary)。`env(preferred-text-scale)` と併用すると倍率が 2 回かかるので、併用しない _/
/_ Baseline: Limited availability。Chrome 146、Edge 146。Firefox、Safari は未対応 _/
/_ 参考: https://developer.chrome.com/blog/new-in-web-ui-io26 _/

## Customizable select

- `appearance: base-select` で、`<select>` のボタンも選択肢の一覧 (`::picker(select)`) も CSS で作り込める
- `<option>` の中に画像や任意の HTML を置ける
- 選んだ値の表示は `<selectedcontent>` に複製される
- デモ: タイムゾーンの選択肢に、旗とその地域での開場時刻を並べる

```html
<select name="timeZone">
  <button><selectedcontent></selectedcontent></button>
  <option value="Europe/London">
    <span class="flag">🇬🇧</span>
    <span class="zone">Europe/London</span>
    <span class="opening">開場 01:30</span>
  </option>
</select>
```

```css
select,
::picker(select) {
  appearance: base-select;
}
```

/_ note: 開場時刻は Temporal で計算して入れる。選んだ値 (selectedcontent) では開場時刻を隠し、一覧でだけ見せる _/
/_ Baseline: Limited availability。Chrome 135、Edge 135、Safari 27。Firefox は 149 で flag の裏 _/
/_ 参考: https://developer.chrome.com/blog/a-customizable-select _/

## `if()` と typed `attr()`

- `if()`: 1 つの宣言の中で、条件 (`style()` クエリ、メディアクエリ、`supports()`) に応じて値を選べる
- typed `attr()`: HTML の属性を、型 (`<custom-ident>`、`<integer>`、`<color>` など) を付けて、どのプロパティでも読める
- 組み合わせると、「属性で状態を渡し、見た目は CSS が決める」ができる。JS はクラスや style を書き換えなくてよい
- デモ: お気に入りのカード。色はトラックの属性から、列はトラック別の表示かドラッグで落とした列から決める

```css
:host {
  --track: attr(data-track type(<custom-ident>), none);
  --lane: attr(data-lane type(<integer>), auto);

  --track-color: if(
    style(--track: a): var(--s-color-track-a-soft) ;
      style(--track: b): var(--s-color-track-b-soft) ;
      else: var(--s-color-surface-base)
  );
  background: var(--track-color);
  grid-column: if(
    style(--view: track): var(--track-column) ; else: var(--lane)
  );
}
```

/_ note: favs.js はドラッグで落としたカードに `data-lane="2"` を付けるだけ。列の位置、色、トラック別の配置は全部この宣言で決まる。2 章の View Transitions でも、typed `attr()` で id をそのまま `view-transition-name` にしている _/
/_ Baseline: Limited availability。if() は Chrome 137、Edge 137 のみ。typed attr() (`type()`) は Chrome 133、Edge 133、Firefox 155。Safari は Technology Preview _/
/_ 参考: https://developer.chrome.com/blog/if-article, https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/attr _/

---

# New Layout System

## Grid Lanes

- Pinterest や Google Keep のような石積み (masonry) のレイアウトを、`display: grid-lanes` で作れる
- 列 (lane) の定義は grid と同じ `grid-template-columns`。アイテムは、そのとき一番短い列に順に入る
- アイテムを特定の列に固定することもできる (`grid-column`)
- デモ: お気に入りのカード。ドラッグで落としたカードだけ、落とした列に固定する

```css
.board {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(min(18ch, 100%), 1fr));
  gap: 16px;
}
```

/_ note: Grid Lanes は DOM の順に短い列へ詰めるので、DOM で並べ替えても見た目の位置は線の位置と一致しない。デモでは落とした列を `data-lane` で固定している (1 章の if() と typed attr() のスライド) _/
/_ Baseline: Limited availability。Safari 26.4。Chrome は stable 未対応 (Canary 157 で `--enable-experimental-web-platform-features` を付けると動く)。Firefox は未対応 _/
/_ 参考: https://developer.chrome.com/blog/masonry-update _/

## Gap Decorations

- grid、flexbox、multi-column の隙間 (gap) に線を引ける。`column-rule` が grid と flexbox でも使え、`row-rule` と `rule` が増えた
- `rule-visibility-items` で、隙間の両側にアイテムがあるかどうかに応じて、線を引く隙間を選べる
- 線のために border や疑似要素を使わなくてよい
- デモ: お気に入りのカードの間の区切り線。カードが増えると線も増える

| プロパティ    | 線を引く場所                        | 備考                                                                                  |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `column-rule` | 列と列の間の隙間 (横書きでは縦の線) | multi-column の段の区切り線として以前からある。grid と flexbox でも使えるようになった |
| `row-rule`    | 行と行の間の隙間 (横書きでは横の線) | 新しく追加                                                                            |
| `rule`        | 両方                                | `column-rule` と `row-rule` をまとめて指定する一括指定                                |

値は `border` と同じく、太さ、線の種類、色 (例: `2px dashed gray`)。

`rule-visibility-items` は、隙間のどこに線を引くかを、隙間の両側にアイテムがあるかどうかで決める (`column-rule-visibility-items` と `row-rule-visibility-items` の一括指定)。

| 値                | 線を引く隙間                                        |
| ----------------- | --------------------------------------------------- |
| `all`             | すべての隙間 (アイテムがなくても引く)               |
| `around`          | 両側のどちらかにアイテムがある隙間                  |
| `between`         | 両側の両方にアイテムがある隙間                      |
| `normal` (初期値) | grid では `all`、multi-column では `between` と同じ |

```css
.board {
  display: grid-lanes;
  gap: 16px;
  rule: 2px dashed var(--s-color-border-strong);
  rule-visibility-items: between;
}
```

/_ note: `all` (既定) だと空いている列の間にも線が出る。`between` にすると、両側にカードがある隙間だけになる _/
/_ Baseline: Limited availability。Chrome 149、Edge 149。Firefox、Safari は未対応 _/
/_ 参考: https://developer.chrome.com/blog/gap-decorations-stable _/

---

# 2. Platform Driven SPA

## Navigation API で遷移を受け取る

- ページ内のリンクを押すと、`navigation` に `navigate` イベントが届く。`intercept()` を呼ぶと、ブラウザは文書を読み込み直さず、渡した handler を遷移として扱う
- URL、履歴 (戻る / 進む)、遷移後のフォーカスとスクロールは、ブラウザが管理する。`history.pushState()` と `popstate` を組み合わせて書かなくてよい
- デモ: タイムテーブル、お気に入り、セッションページを、同じ文書のまま切り替える。URL を直接開いたときと再読み込みは、サーバーが完全なページを返す

```js
navigation.addEventListener("navigate", (e) => {
  const name = pageFor(new URL(e.destination.url));
  if (!name || !e.canIntercept || e.hashChange) return;
  e.intercept({ handler: () => show(name, e.destination.url, e.signal) });
});
```

/_ note: `show()` は次のスライドの差し替え。Navigation API か `streamAppendHTMLUnsafe()` がないブラウザでは受け取らず、ページごとに読み込む (Chrome stable 155 はこちらで動く。2026-10-13 のデモでの実測)。ページごとの JS は `init(signal)` にしてあり、ページを離れるときに signal を abort して、イベントや WebMCP のツールの登録を外す (shared/router.js) _/
/_ Baseline: Newly available (2026 年 1 月)。`intercept()` は Chrome 105、Edge 105、Firefox 147、Safari 26.2 _/
/_ 参考: https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API _/

## Declarative Partial Updates: ページの中身だけ差し替える

- サーバーは、ページの中身だけを `<template for="page">` で返す。JS は fetch の body を `streamAppendHTMLUnsafe()` につなぐだけで、`<?start name="page">`〜`<?end>` の差し替えはブラウザが行う
- 差し替える中身にも目印を入れておくと、次の遷移でもう一度差し替えられる
- デモ: 3 ページとも、共通ナビの後ろの範囲を差し替える

```html
<!-- 各ページ: 共通ナビの後ろが、差し替える範囲 -->
<body>
  <nav class="site-nav">…</nav>
  <?start name="page">
  <main>…</main>
  <?end>
</body>

<!-- SPA で切り替えるときにサーバーが返す (X-Partial: page) -->
<template for="page"><?start name="page"><main>…</main><?end></template>
```

```js
// 短くしたもの。実際の router.js は、チャンクごとに書き込む
const response = await fetch(url, { headers: { "X-Partial": "page" } });
await response.textStream().pipeTo(document.body.streamAppendHTMLUnsafe());
```

/_ note: 差し替えたページの範囲の中に、お気に入りのカードの目印 (`<?start name="board-cards">`) があっても、後から届く `<template for="board-cards">` でそのまま差し替わる (Chrome 157 Canary、2026-10-13 実測) _/
/_ Baseline: なし。`<template for>` は Chrome 150。挿入メソッドは「新しい HTML の挿入メソッド」のスライド _/
/_ 参考: https://developer.chrome.com/docs/web-platform/declarative-partial-updates _/

## Declarative Partial Updates: Out-of-Order HTML Streaming

- サーバーは、先にページの骨組みとスケルトンを送り、データがそろってから `<template for>` を同じレスポンスの続きとして送る
- 後から届いた `<template for="name">` を、HTML の parser が前の目印 (`<?start name>`〜`<?end>`) に差し込む。JS は要らない
- 別のリクエストの往復も、JS の読み込みを待つ時間もない
- デモ: お気に入り。`serve.py` が DB からカードの HTML を作って流す。直接開いたとき (文書の続きとして送る) も、SPA で切り替えたとき (`<template for="page">` の続きとして送る) も、カードは後から `<template for="board-cards">` で届く

```html
<!-- 先に送る: favs/index.html の </main> まで -->
<main class="board">
  <?start name="board-cards">
  <div class="skeleton-card" aria-hidden="true">…</div>
  <?end>
</main>

<!-- 後から送る: serve.py が DB から作る -->
<template for="board-cards">
  <session-card id="session-11" …>…</session-card>
</template>
```

```python
self.wfile.write(head)    # </main> まで (スケルトン)
self.wfile.flush()
cards = "".join(render_card(s) for s in load_sessions(conn, load_favorites(conn, user_id)))
self.wfile.write(f'<template for="board-cards">{cards}</template>'.encode())
self.wfile.write(tail)    # 残りの HTML
```

/_ note: Network タブの favs/ の Response の末尾で、後から届いた `<template for>` が見える。React の Suspense などのストリーミング SSR は、同じことを隠した div とインラインの script で実現している _/
/_ Baseline: なし。Chrome 150 で出荷。Chromium の `DocumentPatching` flag が M149 (Chromium のマイルストーン 149。M は版の番号) の branch では experimental、M150 の branch で stable になっている。Chrome stable 154 でも動く (デモでの実測)。Firefox、Safari は未対応 _/
/_ 根拠: https://chromestatus.com/feature/5111042975465472 (Ship の milestone が 150)、https://chromium.googlesource.com/chromium/src/+/refs/branch-heads/7871/third_party/blink/renderer/platform/runtime_enabled_features.json5 (M150 の branch) _/
/_ 参考: https://developer.chrome.com/docs/web-platform/declarative-partial-updates _/


## Declarative Partial Updates: 新しい HTML の挿入メソッド

- HTML を DOM に入れるメソッドを、「場所 + HTML」の名前でそろえ直した: `setHTML`、`appendHTML`、`prependHTML`、`beforeHTML`、`afterHTML`、`replaceWithHTML`
- それぞれに、Sanitizer を通す安全版と、通さない `Unsafe` 版がある
- `stream…()` 版は `WritableStream` を返し、届いた分から順に解釈して描画する。流した `<template for>` も目印を差し替える
- デモ: SPA のページの差し替えと、saku の登壇が終わるまでの残り時間。どちらも、サーバーが流す HTML を JS がつなぐだけ

```js
const response = await fetch("/api/countdown");
await response.textStream().pipeTo(document.body.streamAppendHTMLUnsafe());
```

```html
<!-- サーバーが 1 秒ごとに送る -->
<template for="countdown"
  ><?start name="countdown">saku の登壇終了まで あと 9 日 15 時間 11 分 31
  秒<?end></template
>
```

/_ note: 差し替えると目印ごと置き換わるので、中身にも `<?start>`〜`<?end>` を入れて次の回に備える。安全版の `streamAppendHTML()` は `<template for>` を取り除き、差し替えが起きなかったので `Unsafe` 版を使っている (Chrome 157 Canary、2026-10-08 実測)。流すのは自分のサーバーが作った HTML で、文字はサーバー側でエスケープしている _/
/_ Baseline: なし。Chrome 148 以降で `chrome://flags/#enable-experimental-web-platform-features` を有効にすると使える。chromestatus では Chrome 157 で出荷予定。Chromium の `NewHTMLSettingMethods` flag は M155、M156 の branch では experimental のままで、main (M157) で stable になっている。発表日 (2026-10-18) の Chrome stable では flag が要る _/
/_ 根拠: https://chromestatus.com/feature/5054329641893888 (Ship の milestone が 157)、https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/platform/runtime_enabled_features.json5 _/
/_ 参考: https://developer.chrome.com/docs/web-platform/declarative-partial-updates _/


## 同じ文書の View Transitions

- `document.startViewTransition()` で、差し替えの前と後を撮って、アニメーションにする
- ページごとに読み込むときの View Transitions と同じ `view-transition-name` の付け方が、そのまま使える
- 流し込みは `update` の中で始める (今の画面を撮ったあと)。`update` は、ページの差し替え (最初の `</template>`) を書き終え、そのページの JS を初期化したところで終える。お気に入りのカードを待つ 3 秒の間、画面を止めない
- デモ: タイムテーブルのセル → セッションページで、枠、タイトル、写真、名前が移る

```js
const transition = document.startViewTransition({
  update: async () => {
    // 今の画面を撮ったあとで流し込みを始める
    const { pageWritten } = stream(response, signal);
    await pageWritten; // 最初の </template> を書き終えた
    document.body.className = "session-page";
    await start("session"); // ページの JS の init(signal)
  },
  types: ["session"],
});
```

```css
/* 3 ページで同じ id (session-05、session-05-title …) を持たせ、そのまま名前にする */
.timetable-page td.session,
.session-page .session-detail,
[id^="session-"][id$="-title"],
.avatar[id],
.name[id] {
  view-transition-name: attr(id type(<custom-ident>));
}
```

/_ note: SPA で切り替えると、カードの custom element (`<session-card>`) は定義済みのまま流し込まれるので、子要素が届く前に文書につながる。「中身が空なら組み立てる」処理が動いて中身が 2 重になり、同じ `view-transition-name` が 2 つできて transition が飛んだ。組み立ては、JS でカードを作るときだけにしている (Chrome 157 Canary、2026-10-13 実測) _/
/_ Baseline: Newly available (2026 年 1 月)。`startViewTransition()` の `update` と `types` は Chrome 125、Edge 125、Firefox 147、Safari 18.2 _/
/_ 参考: https://developer.chrome.com/docs/web-platform/view-transitions/same-document _/

## Element-scoped View Transitions

- `element.startViewTransition()` で、その要素の中だけを撮ってアニメーションにする
- 止まるのは、その要素 (scope) の中だけ。外の部分は描画が続き、クリックも届く。document 全体で行うと、`update` の間は画面全体の描画が止まり、アニメーションの間はクリックが届かない
- scope が違えば、複数の transition を同時に動かせる。scope の外の要素の重なり順も保たれる
- デモ: お気に入りの board の表示の切り替えと並べ替え。アニメーションの途中でも、絞り込みや表示のボタンを押せる

```js
// favs/board-filter.js (短くしたもの)
board.startViewTransition(() => {
  board.dataset.view = button.dataset.view;
});
```

/_ note: 違いの動画: document 全体と scoped を並べて撮った。アニメーションを 2.5 秒に伸ばし、途中で「すべて」を押す。document 全体では押しても届かず「トラック別」のまま、scoped ではすぐ届いて「すべて」に戻る (Chrome 157 Canary、2026-10-13 撮影)。`update` の間の 300 ms で数えた requestAnimationFrame は、scoped が 38 回、document 全体が 1 回 _/
/_ note: ページの切り替えは document 全体のまま。ページの範囲だけを scope にすると、名前付きの要素 (前のページのセルなど) が消える更新で transition が飛ばされる (`InvalidStateError: … Prepaint layout check failed`)。最小のページでも再現し、document 全体なら起きない (Chrome 157 Canary と Chrome 155、2026-10-13 実測)。要素を消す scoped transition がときどき飛ぶという報告: https://github.com/GoogleChrome/modern-web-guidance-src/pull/1594 _/
/_ Baseline: なし。`Element.startViewTransition()` は Chrome 147、Edge 147。Firefox、Safari は未対応 (MDN BCD、2026-10-13) _/
/_ 参考: https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions _/

## Navigation Matching (`@location` / `@navigation` / `:link-to()`)

- URL に名前を付け (`@location`)、「どこからどこへの遷移か」でスタイルを変えられる (`@navigation`)
- `:link-to()` で「このページへのリンク」を CSS で選べる。今いるページのリンクを、JS も `aria-current` もなしで強調できる

```css
@location --favs {
  base-url: document;
  pattern: url-pattern("../favs/");
}

.favs-page .site-nav a:link-to(--favs) {
  background: var(--s-color-text-primary);
}

/* お気に入りへ向かう遷移のときだけ、見出しを左へ流す */
@navigation (to: --favs) {
  ::view-transition-old(page-title) {
    animation: slide-out-to-start 0.4s ease both;
  }
}
```

/_ note: SPA (同じ文書) の遷移では、`(to:)` も `(from:)` も、View Transition が終わるまで一致した。お気に入りのカードを流し続けている間 (遷移の後) は一致しない (Chrome 157 Canary、2026-10-13 実測)。ページごとに読み込むときは、`(to:)` が旧ページ、`(from:)` が新ページで効く。`base-url: stylesheet` は Canary 157 で一致しなかったので `document` にしている (2026-10-06 実測) _/
/_ Baseline: なし。CSS Navigation Level 1 の草案。Chrome Canary 157 で `--enable-experimental-web-platform-features` を付けると動く。Chrome stable 154 では動かない (デモでの実測) _/
/_ 参考: https://drafts.csswg.org/css-navigation-1/ _/


## What's Coming: 宣言的な SPA

- いまは、遷移の受け取り (`intercept()`) と、差し替えの fetch を JS で書いている
- Declarative Partial Updates の route matching の explainer (提案を説明する文書) は、これを HTML で宣言する案を挙げている。`<script type=routemap>` に URL のパターンを書き、`"mode"` で同じ文書の遷移にし、`"patchSource"` で差し替えの取得先を指定すると、ブラウザが受け取りから差し替えまで行う
- CSS 側の `@location` / `@navigation` (Navigation Matching のスライド) は、同じ explainer の CSS 部分にあたる

```html
<script type=routemap>
 {"rules": [
    {"name": "settings", "pattern": {"pathname": "/dashboard/settings" } }
 ]}
</script>
```

/_ note: コード例は explainer のもの。route map、要素を開閉する `route` 属性、差し替えの取得 (`patchSource`) は、explainer の中でも「将来の拡張」の扱い _/
/_ 状態: explainer の段階。explainer によると、Chromium は前向きで試作を進めている。Gecko と WebKit の公式な反応はまだない _/
/_ 参考: https://github.com/WICG/declarative-partial-updates/blob/main/route-matching-explainer.md _/

## What's Coming: ページを移っても iframe を残す

- SPA で切り替えても、ページの範囲を差し替えるので、その中の iframe は作り直される。感想を書きかけのまま別のページへ移ると、書いた内容は消える (3 章の感想フォーム)
- Persistent iframes: `<persistentwidget>` 要素。同じ origin の別の文書へ移ったとき、移った先にも同じ `id` と `src` の `<persistentwidget>` があれば、中の文書を読み込み直さずに引き継ぐ
- Declarative Partial Updates の `preserve` 属性: `<template for>` で範囲を差し替えるとき、同じ `preserve` の値を持つ iframe は差し替えずに残す。こちらは同じ文書の中の部分更新が対象

```html
<!-- 移る前のページと、移った先のページの両方に書く -->
<persistentwidget id="assistant" src="/assistant.html"></persistentwidget>
```

```html
<main>
  <?start name="page">
  Some text
  <iframe src="chat.html" preserve="chat"></iframe>
</main>

<!-- 差し替えても chat の iframe は読み込み直さない -->
<template for="page">
  Some other text
  <iframe src="chat.html" preserve="chat"></iframe>
</template>
```

/_ note: `<persistentwidget>` を引き継ぐには、同じ origin への遷移であること、移った先の最初の描画までに要素があること (`<link rel="expect" blocking="render">` で待たせる) などの条件がある。コード例はどちらも explainer のもの _/
/_ 状態: Persistent iframes は Chromium で Intent to Prototype (2026-08-26)。`preserve` は WICG の declarative-partial-updates リポジトリにある草案で、実装は確認できていない。Canary 157 のバイナリに `PersistentWidgetAPI` という文字列はあるが、有効にする方法と動作は確かめていない _/
/_ 根拠: https://www.mail-archive.com/blink-dev@chromium.org/msg17313.html (Intent to Prototype: Persistent Widgets)、https://chromestatus.com/feature/5155555348971520 _/
/_ 参考: https://github.com/WICG/persistent-iframes, https://github.com/WICG/declarative-partial-updates/blob/main/preserve-explainer.md _/

---

# 3. AI

## Responsive iframes

- iframe の高さを、埋め込んだ文書の中身の高さに合わせられる。`postMessage` で高さを送る JS が要らない
- 埋め込む側は `frame-sizing: content-height`、埋め込まれる側は `<meta name="responsive-embedded-sizing">` で許可する
- 埋め込まれる側は、中身の高さが変わったら `window.requestResize()` で測り直しを頼む
- デモ: セッションページの感想フォーム。★4 以上を選ぶと「良かったところ」、★3 以下を選ぶと「物足りなかったところ」の質問が出る。質問が増えるたびに iframe が伸び、送信後の「ありがとう」の表示で縮む

```css
/* 埋め込む側 (session/layout.css) */
.feedback-frame {
  frame-sizing: content-height;
}
```

```html
<!-- 埋め込まれる側 (feedback/index.html) -->
<meta name="responsive-embedded-sizing" content="allow-origins=*" />
```

```js
// 埋め込まれる側 (feedback/embed.js を短くしたもの): 高さが変わるたびに測り直しを頼む
// 埋め込まれていない文書で呼ぶと NotAllowedError になるので、埋め込まれているときだけ
if (window.parent !== window) {
  new ResizeObserver(() => window.requestResize()).observe(
    document.documentElement
  );
}
```

/_ note: 質問の出し入れは `interpolate-size: allow-keywords` で高さを transition している。iframe もフレームごとに追従して、なめらかに伸び縮みする _/
/_ note: 埋め込まれる文書が meta で許可しない限り、高さは合わない。Google フォームのような他者の文書は、こちらから meta を足せない (読み込み後に JS で足しても効かない) _/
/_ note: 感想は fetch で送り、iframe の中では別の文書へ遷移しない。遷移した先の文書から `requestResize()` を呼んでも縮まなかったため (Chrome 154 と Canary 157 で実測) _/
/_ Baseline: Limited availability。Chrome 154、Edge 154。Firefox、Safari は未対応 _/
/_ 参考: https://developer.chrome.com/blog/responsive-iframes _/

## WebMCP: imperative API

- ページの操作を、AI エージェント向けのツールとして公開する (`document.modelContext.registerTool()`)
- ツールは名前、説明、入力の JSON Schema、実行する関数を持つ。エージェントは画面を読み取らずに、そのツールを呼べる
- 人が使う画面と同じ処理を呼べば、エージェント専用の UI やエンドポイントを作らなくてよい
- デモ: お気に入りのページで、お気に入りを探す / 加える / 外すツール

```js
await document.modelContext.registerTool({
  name: "add_favorite",
  description: "指定した id のセッションをお気に入りに加える",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  execute: async ({ id }) => request(id, "favorite-request"),
});
```

/_ note: `request()` は、人がボタンを押したときと同じイベントをボードに送り、サーバーへの保存が終わってから結果を返す。`executeTool()` の第 1 引数は名前ではなく `getTools()` が返すオブジェクト (2026-10-07 実測) _/
/_ Baseline: なし。Chrome は Chrome 149 から origin trial。このデモは origin trial のトークンを入れていないので、stable 154 では動かない。Canary 157 では `--enable-experimental-web-platform-features` を付けると動く (デモでの実測) _/
/_ 根拠: https://developer.chrome.com/docs/ai/webmcp (「The WebMCP origin trial starts in Chrome 149」) _/
/_ 参考: https://developer.chrome.com/docs/ai/webmcp, https://developer.chrome.com/docs/ai/webmcp/imperative-api _/

## WebMCP: declarative API

- `<form>` に `toolname` と `tooldescription` を付けると、そのフォームがツールになる。入力の JSON Schema は、フォームの項目 (`name`、`<select>` の選択肢、`required`) からブラウザが作る
- エージェントが呼ぶと、ブラウザがフォームに値を入れる。入れている間、フォームに `:tool-form-active`、送信ボタンに `:tool-submit-active` が付く
- `toolautosubmit` を付けなければ、送信は人が押す。そのときの submit イベントは `agentInvoked` が true で、`respondWith()` で結果をエージェントに返せる
- デモ: 感想フォーム。エージェントに「★5、デモが良かった、と送って」と頼むと、質問が開きながら値が入る。人が確かめて送信を押す

```html
<form toolname="submit_session_feedback"
  tooldescription="このページのセッションの感想を送るフォームに入力する">
  <select name="rating" required toolparamdescription="5 段階の評価">…</select>
  <fieldset toolparamdescription="良かったところ。評価が 4 以上のときだけ答える">
    <label><input type="checkbox" name="liked" value="demo" /> デモ</label>
  </fieldset>
</form>
```

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = send(event.agentInvoked ? "agent" : "human");
  if (event.agentInvoked) event.respondWith(result);
});
```

/_ note: 条件付きの質問は、disabled ではなく hidden で隠す。disabled の項目はツールの入力から外れる。そのため質問が出るたびにツールの定義が変わり、実行中の呼び出しが「定義が更新された」として取り消された (Canary 157、2026-10-13) _/
/_ note: checkbox のまとまりの説明は、checkbox ではなく fieldset の `toolparamdescription` から読まれた (Canary 157、2026-10-13) _/
/_ note: 送信が済んだら `toolname` を外してツールの登録をやめる。同じタスクで外すと、`respondWith()` の結果が届く前に呼び出しが取り消されたので、次のタスクで外している (Canary 157、2026-10-13) _/
/_ Baseline: なし。Chrome は Chrome 149 から origin trial。このデモは origin trial のトークンを入れていないので、stable 154 では動かない。Canary 157 では `--enable-experimental-web-platform-features` を付けると動く (デモでの実測) _/
/_ 根拠: https://developer.chrome.com/docs/ai/webmcp (「The WebMCP origin trial starts in Chrome 149」) _/
/_ 参考: https://developer.chrome.com/docs/ai/webmcp, https://developer.chrome.com/docs/ai/webmcp/declarative-api _/

## WebMCP: ツールの作り方

- 人が使う画面と同じ処理を呼ぶ。お気に入りは ♥ と同じイベント、感想は同じフォームと同じ API (`POST /api/feedback`)。WebMCP がなくても画面はそのまま動く
- 外に出ていく操作は、人が確かめてから実行する。感想フォームには `toolautosubmit` を付けない
- いまのページで使えるツールだけを出す。お気に入りのツールはお気に入りのページだけ、感想のツールは送信するまで
- 入力の厳密な検証はコードで行い、原因をエージェントに返す。条件を満たさない答えは送らず、`not_sent` で伝える
- 他の人の感想の本文は、エージェントにも画面にも出さない。エージェントに返すのは、送れたかどうか、セッションの id と名前、送らなかった項目だけ。画面に出すのは件数、平均、エージェント経由の件数だけ
- 人とエージェントの使われ方を分けて測る。`agentInvoked` を DB に残し、「うちエージェント経由 n 件」を出す

/_ 参考: https://developer.chrome.com/docs/ai/webmcp/best-practices, https://www.rumvision.com/blog/what-does-webmcp-mean-for-website-performance-and-rum/ _/

---

# おわりに: Modern Web Guidance

## Modern Web Guidance

- コーディングエージェントに、新しい Web の機能と書き方を教えるための skill 集。Chrome チームが出している (Microsoft Edge チームも協力)
- エージェントは古い書き方 (学習した時点の書き方) に戻りがち。今日の機能のように新しいものほど、そのままでは使ってもらえない
- 機能ごとの書き方、Baseline の状況、未対応のブラウザでの縮退 (progressive enhancement) をまとめてある。エージェントは手元の検索で必要なガイドだけを読む
- Claude Code、Google Antigravity、GitHub CLI (`gh skill`)、Vercel の Skills CLI から入れられる

```sh
npx modern-web-guidance@latest install
```

```sh
# Claude Code
/plugin marketplace add GoogleChrome/modern-web-guidance
/plugin install modern-web-guidance@googlechrome
```

/_ note: リポジトリの README では、212 の機能と 180 の用途を扱っている。検索は手元の TensorFlow.js のモデルで行い、ネットワークにも API キーにも頼らない。preview の段階で、ライセンスは Apache-2.0 _/
/_ 参考: https://github.com/GoogleChrome/modern-web-guidance, https://developer.chrome.com/docs/modern-web-guidance _/
