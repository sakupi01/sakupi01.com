---
title: "🎄Open UI Advent Calendar: Day 10 / Customizable Select Element Ep.8"
excerpt: "Customizable Select Elementの関連仕様: `appearance: base-select;` - 選択された`<option>`のデフォルトチェックマークのスタイルはどうやって決まったのか"
date: "2024-12-10"
beginColor: 'from-red-500'
middleColor: 'via-lime-500'
endColor: 'to-green-700'
category: 'dev'
tags: ['openui', 'advent calendar']
status: 'published'
---
## 目次

## はじめに

:::note{.message}
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の10日目の記事です。
:::

[Customizable Select Element Ep.8](https://blog.sakupi01.com/dev/articles/2024-openui-advent-8)では、`<selectmenu>`を経て、`<selectlist>`から`<select>`に至るまでの経緯をお話ししました。

端的にまとめると、初期Explainerで使用されていた`<selectmenu>`は、主にUIパターンの観点から混乱を招くことが懸念され、Open UI内での議論を以って`<selectlist>`に変更されました。

その後、`<selectlist>`の実装の方針やProgressive Enhancementの観点から、`<select>`の機能を拡張する形で実装した方が良いのではないかという議論が行われ、2024/9月に`<select>`としてRFCが発表されるに至ります。

https://developer.chrome.com/blog/rfc-customizable-select

## Customizable Select Elementの関連仕様

### 各パーツの定義

CSEの各パーツは、RFCが出された時点から大きく変化しています。
（2024/12/9現在）

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

- `<button>`: 選択肢のポップオーバーを開閉するボタン要素
- `::picker-icon`: ボタン要素右の矢印アイコン
- `<selectedcontent>`: 選択されているOptionの内部HTMLのクローンを作成する要素
- `::picker(select)`: `<select>`内の`<button>`以外の要素を含むポップオーバー部分
- `<option>`: 選択肢の要素
- `option::checkmark`: 選択されているOptionを示すチェックマーク部分
- `<option>:checked`: 選択されているOptionを示す擬似クラス

### `appearance: base-select;`

`<select>`をCSEにOpt-inするには、CSS`appearance`プロパティを使用します。以下のように、`<select>`と`::picker(select)`に`appearance: base-select;`を指定することで、`<select>`をCSEにアップグレードすることができます。

```css
select, ::picker(select) {
  appearance: base-select;
}
```

```html
<select>
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>
```

上記のHTMLとCSSで、CSEがOpt-inされ、`<select>`が**CSEデフォルトのスタイル**になります。

![CSEデフォルトのスタイル](/default-cse.png)
*CSEデフォルトのスタイル*

ここで気になるのが、「何を以てこのデフォルトのスタイルになったのか」です。

#### 選択された`<option>`のチェックマーク

CSEデフォルトのスタイルでは、選択された`<option>`にチェックマークがついています。チェックマークは、CSEでなくても（`appearance: base-select;`を設定しない`<select>`でも）ついていますが、CSEのデフォルトスタイルを決める段階では、「チェックマークが必要か」「どういった実装にするべきか」という議論が行われました。

- [selectlist: Should the "checked" option have a checkmark next to it? · Issue #863 · openui/open-ui](https://github.com/openui/open-ui/issues/863)

***

まず、「チェックマークが必要か」に関してです。

チェックマークを提供しないことになった場合、コントラスト比の観点から[アクセシビリティの問題が生じる可能性があるとの指摘](https://github.com/openui/open-ui/issues/863#issuecomment-1749825505)がありました。

チェックマークがなく、選択肢ポップオーバーの背景色とポップオーバー内部の背景色のコントラスト比が低い場合、選択された要素を明示するために非常に強い色の背景色をつけるなどの対策が必要になります。そうなった場合、フォーカスインジケータとのコントラスト比が低くなる可能性が出てきます。

つまり、**「チェックマークを提供しない」という選択肢をとった場合、「選択肢ポップオーバーの背景色 vs ポップオーバー内部の背景色 vs フォーカスインジケータのボーダー色」という3つの色のコントラスト比のバランスを考慮する必要がある**ということになります。
その点、チェックマークを提供すると、選択された要素を明示することができるため、選択肢ポップオーバーの背景色とポップオーバー内部の背景色のコントラスト比を気にする必要がなくなり、幾分かコントラスト比の考慮が緩和されるということです。

加えて、単一選択`<select>`の時点で、チェックマークを考慮しておくと、チェックマークの提供が必ず必要になってくる複数選択`<select>`の実装においても役立つという[理由](https://github.com/openui/open-ui/issues/863#issuecomment-2103160295)がありました。

***

次に、「どういった実装にするべきか」に関して追っていきます。
チェックマークをどのようにUAスタイルシートに実装するかに関して、[Issue](https://github.com/openui/open-ui/issues/863)の時点では以下のように実装されることが望ましいとされました。

```css
option::marker {
  content: '\2713' / '';
}
option:not(:checked)::marker {
  visibility: hidden; /* visibility: hiddenにすることで幅を保てる */
}
```

チェックマークが擬似要素で実装されているのは、DOMにチェックマークを実装するのではなく、CSS擬似要素で実装することで、ユーザがより簡単に上書きや削除する（カスタマイズする）ことが可能だからです。

擬似要素と言っても、`::before`や`::after`は更なるスタイリングを施すために用いたいというケースも考えられるため、新しい擬似要素が定義されることになりました。

> RESOLVED: create new pseudo elements for checkmark and dropdown icon for base appearance select instead of using ::before and ::after in the UA stylesheet
> https://github.com/w3c/csswg-drafts/issues/10908#issuecomment-2371836734

その上で、次に注目すべき点は、擬似要素の`content`が`'\2713' / ''`となっていることです。

筆者は知らなかったのですが、`content`プロパティはスラッシュ（`/`）区切りでaltテキストを指定することができ、これが明示してある場合は、`content`プロパティの前半が表示され、後半はaltテキストとしてATに読み上げられるようです。（ブラウザによってaltテキストは表示もされるそうですが、未確認です）

- [content - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/content#alternative_text)

上記の実装により、ATは`content`プロパティによる読み上げをせず、選択された`<option>`のchecked属性による読み上げのみしてくれるので、重複した読み上げが起こりません。

加えて、絵文字の「✔︎」などを使用するのではなく、標準化されたUnicodeでチェックマークを表現することにより、OSの慣習に追従した、一貫性のある表示を実現できます。

> RESOLVED: support checkmark next to checked option, implemented via the content property on the ::marker pseudo element. The UA should set a Unicode character by default, which isn't read out by screen reader.
> https://github.com/openui/open-ui/issues/863#issuecomment-2127775634

***

上記の議論時点では`::marker`でしたが、一旦Chromiumには付け焼き刃的に`::before`で[実装され](https://chromium-review.googlesource.com/c/chromium/src/+/5578818)、RFC公開時点ではそのまま`::before`で、2024/12現在では`::checkmark`に変わり、下記のUAスタイルシートが[実装](https://chromium-review.googlesource.com/c/chromium/src/+/6043233)されています。

> RESOLVED: Name the pseudo-element ::checkmark
> https://github.com/w3c/csswg-drafts/issues/10908#issuecomment-2489173316

```css
select option::checkmark {
  content: '\2713' / '';
}
select option:not(:checked)::checkmark {
  visibility: hidden;
}
select::picker-icon {
  /* margin-inline-start pushes the icon to the right of the box */
  margin-inline-start: auto;
  display: block;
  content: counter(fake-counter-name, disclosure-open);
}
```

![chrome canaryで`::checkmark`のUAスタイル](/ua-style-checkmark.png)
*chrome canaryで`::checkmark`のUAスタイル*

CSEのデフォルトスタイルに関しては、以下のIssueで現在進行形で更新が重ねられており、ChromiumではこのIssueの変更に追従する形で実装が進められているようでした。

- [[css-ui] UA stylesheet for appearance base `<select>` · Issue #10857 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10857)

***

Issueによると主に以下の項目に着目できそうで、今回はその一部であるチェックマークに関して取り上げました。

- [ ] `appearance: base-select;`の見た目は、どのようにして決まったのか
  - [x] 選択された`<option>`のデフォルトチェックマーク
  - [ ] ポップオーバーを開閉するボタン要素右の矢印アイコン
  - [ ] ボタン要素や選択肢ポップオーバーの色
  - [ ] その他のスタイル

上記Issueに記されているデフォルトスタイルになった背景について、次回からも引き続き見ていこうと思います。

それでは、また明日⛄

See you tomorrow!

### Appendix

- [5983471: Rename `<selectedoption>` to `<selectedcontent>`](https://chromium-review.googlesource.com/c/chromium/src/+/5983471)
- [6024158: Update customizable select UA styles](https://chromium-review.googlesource.com/c/chromium/src/+/6024158)
- [6065538: Rename ::select-arrow to ::picker-icon](https://chromium-review.googlesource.com/c/chromium/src/+/6065538)
