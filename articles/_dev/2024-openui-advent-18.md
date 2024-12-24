---
title: "🎄Open UI Advent Calendar: Day 18 / Customizable Select Element Ep.16"
excerpt: "Customizable Select Elementの関連仕様: `<selectedcontent>` - Light DOMへのクローン追加実装に関して、CSSWGとの合意形成。UAによるLight DOMへのNodeクローンタイミングに関する懸念を深掘る"
date: "2024-12-18"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の18日目の記事です。
:::

[Ep.15](https://blog.sakupi01.com/dev/articles/2024-openui-advent-17)では、`<selectedoption>`を用いて、宣言的に選択された`<option>`の中身をLight DOMにクローンする提案が、合意を得た詳細についてお話ししました。

「Light DOMはAuthorの領域であり、UAによって変更されるべきではない」という制約に対して、今回その境界を越える提案が可決されたことによって、HTML史上初となる、UAからLight DOMへの変更を加える実装がなされていきます。

その初の試みとなる`<selectedoption>`は、もちろん実装上の課題も多く、その解決策を模索する議論が続いています。
今回からは、その関連Issueを中心に、`<selectedoption>`の実装に関する議論の現状を追っていきます。

***

※ `<selectedoption>`は、2024/12現在、`<selectedcontent>`にリネームされています。
混乱を避けるため、本エントリからは最新版の`<selectedcontent>`と表記します。

> RESOLVED: rename the selectedoption element to selectedcontent
> https://github.com/openui/open-ui/issues/1112#issuecomment-2450527487

- [select: Naming of `<selectedoption>` · Issue #1112 · openui/open-ui](https://github.com/openui/open-ui/issues/1112)
- [[Customizable select] Rename selectedoption to selectedcontent by brechtDR · Pull Request #1124 · openui/open-ui](https://github.com/openui/open-ui/pull/1124)
- [Rename `<selectedoption>` to `<selectedcontent>` by chromium-wpt-export-bot · Pull Request #49046 · web-platform-tests/wpt](https://github.com/web-platform-tests/wpt/pull/49046)

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

## `<selectedcontent>`の実装に関するIssueまとめ

2024/12現在、`<selectedcontent>`の実装に関するIssueは以下の通りです。そのうちのいくつかは、現在進行形で議論が続いています。
（※ 時系列で列挙）

1. [How to implement and shape API for `<selectedoption>` element for `<select>` · Issue #10242 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10242)
2. [Timing of cloning for the `<selectedoption>` element · Issue #10520 · whatwg/html](https://github.com/whatwg/html/issues/10520)
3. [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)
4. [selectlist: Animating changes in the selected value · Issue #824 · openui/open-ui](https://github.com/openui/open-ui/issues/824)
5. [select: clarifying what should be used as the chosen value · Issue #1117 · openui/open-ui](https://github.com/openui/open-ui/issues/1117)
6. [select: Should `<selectedoption>` update when selecting the already-selected option · Issue #1119 · openui/open-ui](https://github.com/openui/open-ui/issues/1119)

これらの中でも、筆者が特に注目している、「クローンタイミング」に関する1~4のIssueに焦点を当てて、その内容について深掘っていきます。

## How to implement and shape API for `<selectedoption>` element for `<select>`

本格的な実装に移る前に、実装の方針をより具体的に固めるためのIssueがCSSWGに出されました。

Open UIでの議論は、WHATWGの見解をもとにLight DOM実装でいくという[議論結果](https://github.com/openui/open-ui/issues/571)となりました。しかし、Light DOMで実装するか、Shadow DOMで実装するかで、CSSの受ける影響が大きいため、CSSWGからの意見を募るIssueが持ちかけられたということです。

:::note{.info}
👍🏻 この時点で固まっている仕様

- 選択された`<option>`で、`cloneNode()`をCallする
- 選択された`<option>`の、`<option>`を除く`<option>`内の全てのDOMをクローンする
- `<selectedcontent>`を用いて、宣言的な方法で、クローンされたDOMを`<selectedcontent>`内に追加する
- 選択された`<option>`が変更されるたびに、`<selectedcontent>`内のDOMを更新する

:::

上記の仕様を実現するために、以下のようなマークアップになることが固まっています。

```html
<select>
  <button type=popover>
    <selectedoption></selectedoption>
  </button>
  <datalist>
    <option>
      <img src="country1.jpg">
      <span>Country 1</span>
    </option>
    <option>
      <img src="country2.jpg">
      <span>Country 2</span>
    </option>
  </datalist>
</select>
```

未確定なのが、「クローンされたDOMを`<selectedcontent>`内に追加する実装」の部分です。これには2通りの実装方法が考えられます。

### `<selectedcontent>`をLight DOMで実装した場合

WHATWGの見解に従い、`<selectedcontent>`をLight DOMとし、その子Nodeを`cloneNode()`の結果で置換する方法です。

この方法であれば、Authorは`selectedcontent`セレクタを直接利用できるため、`<option>`と`<selectedcontent>`を別々にスタイルできます。
全てがLight DOMの管理下のため、UAでのCSS追加実装は不要です。

```css
selectedcontent > span {
  display: none;
}
```

### `<selectedcontent>`をShadow DOMで実装した場合

Shadow DOMで実装する場合、`<selectedcontent>`をUA Shadow Rootとし、その子Nodeを`cloneNode()`の結果で置換する方法です。

UA Shadow Rootの中は、（`<input>`の内部`<div>`はスタイルできない、など）Authorスタイルシートからアクセスできないため、新しい擬似要素を定義してAuthorにスタイリングする術を提供する必要があります。そのため、CSSに新しいシンタックスを追加する必要が出てきます。

```css
selectedcontent::selectedcontent-content > span {
  display:none;
}
```

それだけでなく、Light DOM を動的に UA の Shadow Rootに挿入するとなると、一度[廃止](https://groups.google.com/a/chromium.org/g/blink-dev/c/PNTt4oFXt8c/m/C1bS0ityBAAJ?hl=ja)された過去のある[Sanitizer APIの再実装](https://github.com/WICG/sanitizer-api/blob/main/explainer.md)が完了することも条件となります。

***

これに関して、Open UIとCSSWGのJoint Sessionで懸念点の洗い出しが行われました。

https://lists.w3.org/Archives/Public/www-style/2024Jul/0011.html

まず、Shadow DOMでの実装については、Sanitizer APIの実装とCSSの新しいシンタックスが必要になるため、Light DOMでの実装が優先して議論されます。

Light DOMで実装する場合に、主に「クローンのタイミング」に関する懸念点が挙げられました。

初期の案では、クローンする子Nodeが動的に変更された場合は、最初はMutationObserverで実装されることになっていました。

[MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)は、マイクロタスクで変更を検知するAPIです。そして、マイクロタスクは、タスクが空になるまで、非同期的に実行される[仕様](https://html.spec.whatwg.org/multipage/webappapis.html#microtask)になっています。

:::note{.memo}
📝マイクロタスク

マイクロタスクは、マイクロタスクを呼び出す関数が実行された後にコールスタックが空になった後にのみ実行される短い関数です。MutationObserver API や Promise の then() メソッドなどの引数に渡すコールバック関数がマイクロタスクとして扱われます。

（参考）
> A microtask is a short function which is executed after the function or program which created it exits and only if the JavaScript execution stack is empty, but before returning control to the event loop being used by the user agent to drive the script's execution environment.
> https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
:::

ここで問題なのが、Layout Flash時の再クローンでした。Layout Flash時とは、スタイルやDOMの変更があった場合に、Layout Treeが**同期的に**再計算されるタイミングです。

非同期的に変更検知を行うMutationObserverでは、Layout Flash時に同期的に変更を検知することができません。つまり、Layout treeとの整合性を保つためには、同期的なMutationObserverが必要になります。

Mozillaの[Emillio](https://github.com/emilio)は、Geckoは、独自の同期的なMutationObserverを持っているので、Layout Flash時の変更を検知してクローンできると主張します。しかし、他のブラウザエンジンがそれを実装するにはMutationObserverのポリフィルが必要です。

この議論により、Light DOMでの仕様策定が一旦は決行されることになりましたが、具体的なクローン・再クローンのタイミングは未だ決まっておらず、議論結果によってはLight DOMでの実装が見直される可能性もあるという結論に至りました。

> RESOLVED: Move forward with the light dom cloning api shape and discuss timing in the issue

次回から、現状採用されている、Light DOMでの実装の中でも肝となる、「どのタイミングでクローンするのか」の議論を具体的に見ていきます。

***

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
