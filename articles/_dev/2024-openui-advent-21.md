---
title: "🎄Open UI Advent Calendar: Day21 / Customizable Select Element Ep.19"
excerpt: "Customizable Select Elementの関連仕様: `<selectedcontent>` - 子Node変更検知タイミングの仕様決定（現時点で）"
date: "2024-12-21"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の21日目の記事です。
:::

[Customizable Select Element Ep.16](https://blog.sakupi01.com/dev/articles/2024-openui-advent-18)からは、`<selectedcontent>`のクローン実装における、技術的背景をお話ししています。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

[Ep.19](https://blog.sakupi01.com/dev/articles/2024-openui-advent-21)では、CEReactionsタイミングでNode変更の検知をする問題から、同期的なタイミングでNode変更の検知をする方針に切り替えることが主張された経緯と、`cloneNode()`の制限についてお話ししました。

今回は、一連の議論の結果、現状の`<selectedcontent>`の仕様がどうなっているのかをみていく、`<selectedcontent>`の最終エントリです。

:::note{.info}
👍🏻 この時点で固まっている仕様

- 選択された`<option>`で、`cloneNode()`をCallする
  - **`cloneNode()`には、さまざまな制限がある（`<iframe>`はリロードになる、WCは再構築される、`<canvas>`はコピーされない、CSSアニメーションは再開される）**
- 選択された`<option>`の子Nodeをクローンする
- `<selectedcontent>`を用いて、宣言的な方法で、クローンされたNodeを`<selectedcontent>`のLight DOM内に追加する
- 選択された`<option>`が変更されるたびに、`<selectedcontent>`内のDOMを更新する
  - **変更検知タイミングの問題**
    - マイクロタスクタイミングで変更を検知する？
    - CEReactionsタイミングで変更を検知する？
    - 同期的に変更を検知する？

:::

「Nodeの変更検知タイミング」に関しては、元を辿れば、「`<option>`の子Nodeが変更された際、検知するか？しないのか？」というOpen UIでの問いかけから始まりました。

- [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)

WHATWGでの議論が長引き始めた今、そもそも「Node変更検知のタイミング」をUA側でコントロールする必要性自体が、疑問視されます。

https://github.com/whatwg/html/issues/10520#issuecomment-2418959922

## `<option>`変更時のクローンに関する整理と提案

上記[コメント](https://github.com/whatwg/html/issues/10520#issuecomment-2418959922)を投げかけたJakeは、自身のブログで、`<option>`変更時のクローンタイミングに関する整理と提案を行いました。以降のOption1~4は、彼のブログを参考に筆者がまとめたものです。

https://jakearchibald.com/2024/how-should-selectedoption-work

### Option1: デフォルトではクローンせず、更新をトリガーする方法を提供する（変更検知でのクローンをOpt-in）

この方法では、`<option>`が明示的に選択されたときであれば、`<selectedcontent>`にクローンされるようになります。しかし、のちに`<option>`の子NodeのDOMやスタイルが変更された際には、再クローンせず、”Out-of sync”な状態になります。

デフォルトでは子Nodeの変更を検知してクローンしない上に、”Out-of sync”な状態になったからといって、再クローンする手段がないわけではありません。

`<selectedcontent>`に対して、`resetContent()`を利用することで、Author側から再クローンをトリガーすることができます。

つまり、`<option>`が明示的に選択されたとき、または`resetContent()`が呼ばれたときに、`<selectedcontent>`へのクローンが行われることになります。

### Option2: 常に同期的にクローンする（変更検知でのクローンをOpt-out）

この方法では、`<option>`の子Nodeが変更されるたびに、常に`<selectedcontent>`の子Nodeを、`<option>`最新の子Nodeを`cloneNode()` した結果に置き換えます。

`<option>`内の全てのDOMをクローンするため、例えば、`<option>`内部の1つの要素の属性を変更しただけでも、`<selectedcontent>`内の全ての要素がクローンで置き換えられます。

クローンは同期的に行われるため、予想以上に頻繁に行われる恐れがあります。例えば、上記のReactの例で、`<option>Loading…</option>`がアイコン付きのオプションに変更される場合、`<selectedcontent>`内の変更は**3回**行われます。

- `<img>`が挿入される（すでに`alt`属性が設定されている）
- テキストが更新される
- `<img>`の`src`が更新される

例えば、以下のようなNodeの変更があったとしましょう。

```javascript
// 選択された<option>を取得
const selectedOption = select.selectedOptions[0];
// 選択された<option>最初の子Nodeを、選択された<option>自体にappend
selectedOption.append(selectedOption.firstChild);
```

この場合、`<option>`内の子Nodeは2回クローンされます。要素をappendするには、「削除」＆「挿入」という2回のTree変更が必要だからです。

例えば、`<option>`内の要素のスタイルを10回変更する場合、それぞれの変更はスタイル属性を更新するため、`<selectedcontent>`の子Nodeは10回クローンで置き換えられることになります。

また、`<option>`内の要素でCSS Animationsを使用する場合は、フレームごとに`element.style`が変更されます。つまり、`<selectedcontent>`の子Nodeは、フレームごとに再構築されることになります。

過度な変更検知だけでなく、`<option>`内の子Nodeの変更が、`<selectedcontent>`の子Nodeに反映したくない場合も考えられます。

例えば、`<option>`内の子Nodeと、`<selectedcontent>`の子Nodeは独立した要素であるため、それぞれに独立したスタイルを当てることができます。
しかし、例えば、JavaScriptを使って、`mouseenter`時に`element.style`を変更すると、`<selectedcontent>`に反映されてしまいます。`<option>`内の子Nodeと、`<selectedcontent>`の子Nodeを独立した要素として扱いたい場合、このような挙動は期待しないものとなるでしょう。

加えて、将来的に起こる問題も考えられます。
例えば、`<details>`は、開いた状態の時`<details open>`となる仕様になっています。つまり、`<details>`は自身の属性を変更します。
もし、選択された`<option>`内にこうした「自身を変更する要素」ある場合、変更が検知され、クローンが走り、`<selectedcontent>`内の`<details>`も開くことになります。

加えて、この自動的なクローンは`<option>`から`<selectedcontent>`への一方通行です。
`<selectedcontent>`で子Nodeを変更することに意味はなく、`<selectedcontent>`での手動の変更は、`<option>`の子Nodeが次回クローンされるときに上書きされてしまいます。

### Option3: debounceさせて、常に同期的にクローンする（変更検知でのクローンをOpt-out）

上記の方法とほとんど同じですが、`<option>`の子Nodeが変更されると、`<selectedcontent>`の子Nodeは、非同期の**マイクロタスクタイミングで**`cloneNode()`した結果に置き換えられるところに違いがあります。

同期ではなく、非同期のマイクロタスクタイミングで変更を検知することより、クローンの回数を大幅に減少させることができます。
Option2で挙げた例を参考にすると、`<option>`の子Nodeの変更は、マイクロタスクタイミングでまとめることができ、クローンは1回のみとすることができます。

しかし、この方法にも問題があります。

```javascript
// 選択された<option>を取得
const selectedOption = select.selectedOptions[0];
// <selectedoption>を取得
const selectedOptionMirror = select.querySelector('selectedoption');

selectedOption.textContent = 'New text';

// クローンが非同期で遅延されているため、trueにならないかもしれない
console.log(selectedOption.textContent === selectedOptionMirror.textContent);
```

このほかにも、Option2で挙げた大半の問題は残存します。以下のような問題は、Option3でも引き続き発生することになります。

- `<option>`の子Nodeが変更されるたびに、`<selectedcontent>`の全ての子Nodeがクローンで置き換えられることになる
- `<option>`内の子Nodeの変更が、`<selectedcontent>`の子Nodeに反映されないようにしたい場合に対応できない
- クローンは`<option>`から`<selectedcontent>`への一方通行

### Option4: ターゲットのDOM変更を行う

UAが`<option>`内の**各子Node**とそれに対応するクローンをリンクしておく方法です。元の要素の属性を変更すると、そのクローンの属性も更新され、**該当するクローンの属性のみが更新**されます。つまり、`<option>`の子Nodeがひとつ変更されるたびに、`<selectedcontent>`の全ての子Nodeがクローンで置き換えられることはなくなります。

挿入も同じで、選択された`<option>`に新しい要素が挿入されると、その要素はクローンされ、`<selectedcontent>`内の同等の位置に挿入されます。

ただ、この方法でも以下の問題は残ります。

- `<option>`内の子Nodeの変更が`<selectedcontent>`の子Nodeに反映されないようにしたい場合に対応できない
- クローンは`<option>`から`<selectedcontent>`への一方通行
  - ※ とはいえ、一方通行のミラーリングの挙動は、②や③とは異なる。クローンオプションでは、選択された`<option>`の変更は、`<selectedcontent>`内のコンテンツが「リセット」されるため、コンテンツが完全に新しいクローンで置き換えられます。一方、このオプションでは、DOMの変更がtargetになっているため、`<selectedcontent>`のコンテンツを手動で変更すると、よりフォークのようなものになります。

例えば、クローン要素の挿入は、UAでは`element.insertBefore`を使用して実装されます。参照している特定のNodeの前に新たなクローンを挿入するにあたって、`<selectedcontent>`の内容がAuthor側で変更されてしまうと、UA側でクローンの挿入が失敗する恐れがあります。

## 結論

Open UIでの議論の結果、最終的にはOption1が採用されることになり、「デフォルトでは子Nodeの更新を検知してクローンせず、`resetContent()`などの、更新をトリガーする方法を提供する」方針が採用されました。

> RESOLVED: dont observe mutations in option elements. only clone into selectedoption during parsing and when a new option becomes selected
>
> [The full IRC log of that discussion](https://github.com/openui/open-ui/issues/825#issuecomment-2436124668)

つまり、現状の`<selectedcontent>`は以下のような暫定仕様になっていると言えます。

:::note{.info}
👍🏻 この時点で固まっている仕様

- 選択された`<option>`で、`cloneNode()`をCallする
  - `cloneNode()`には、さまざまな制限がある（`<iframe>`はリロードになる、WCは再構築される、`<canvas>`はコピーされない、CSSアニメーションは再開される）
  - → 筆者の観測範囲では、議論は[このコメント](https://github.com/whatwg/html/issues/10520#issuecomment-2360511425)で止まっている
  - おそらく、[Allow slotting indirect children](https://github.com/whatwg/html/issues/10273)の結果に左右されるので、**議論途中**
- 選択された`<option>`の子Nodeをクローンする
- `<selectedcontent>`を用いて、宣言的な方法で、クローンされたNodeを`<selectedcontent>`のLight DOM内に追加する
- 選択された`<option>`が変更されるたびに、`<selectedcontent>`内のDOMは**更新しない**
- **代わりに、Authorが明示的に`resetContent()`などを呼び出すことで、`<selectedcontent>`内のDOMを更新できる**

:::

***

`cloneNode()`の制限の件など、未だに`<selectedcontent>`の仕様は策定中です。しかし、「選択された`<option>`の子Nodeの`<selectedcontent>`へのクローンタイミング」に関しては、長い議論を経てようやく落ち着く結論となりました。

次回は、Ep.1~Ep.19までで追ってきたCSEの現状をまとめます。

それでは、また明日⛄

See you tomorrow!

### Appendix

- [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)
- [Add `<selectedcontent>` element by josepharhar · Pull Request #528 · w3c/html-aria](https://github.com/w3c/html-aria/pull/528)
- [Define the `<selectedcontent>` element by josepharhar · Pull Request #10633 · whatwg/html](https://github.com/whatwg/html/pull/10633)
- [[html-aam] Addition: selectedoption element by scottaohara · Pull Request #2344 · w3c/aria](https://github.com/w3c/aria/pull/2344)
- [5370555: Implement <selectedoption> for StylableSelect](https://chromium-review.googlesource.com/c/chromium/src/+/5370555)

Standard Positions

- WebKit
  - [Customizable select element · Issue #386 · WebKit/standards-positions](https://github.com/WebKit/standards-positions/issues/386)
- Mozilla
  - [Customizable select element · Issue #1060 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1060)
