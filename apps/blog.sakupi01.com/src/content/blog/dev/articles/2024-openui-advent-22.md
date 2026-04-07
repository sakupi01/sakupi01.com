---
title: "🎄Open UI Advent Calendar: Day 22 / Customizable Select Element Ep.20"
excerpt: "Customizable Select Elementのまとめ"
date: 2024-12-22
update: 2024-12-22
category: "dev"
tags: ["openui", "advent calendar"]
status: "published"
---

## Table of Contents

## はじめに

:::note{.message}
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の 22 日目の記事です。
:::

今回は、20 日をかけて連載してきた、Customizable Select Element についてまとめる、シリーズの最終エントリです。

## Customizable Select Elementまとめ

Ep.1 から Ep.19 にかけて、Customizable Select Element の提案に関連する仕様の変遷を追ってきました。

- [Ep.1](https://blog.sakupi01.com/dev/articles/2024-openui-advent-3):
  - Prologue: Customizable Select Element。HTML Form Control の歴史から、Form Control のスタイルは CSS から制御することができず、ブラウザや OS に依存していたことを振り返る。
- [Ep.2](https://blog.sakupi01.com/dev/articles/2024-openui-advent-4):
  - ブラウザ戦争の激化と、OS に依存したコントロールの問題の顕在化。打開する動きとして、WaSP による Web 標準の台頭への動き、モダンブラウザの登場、より柔軟なスタイリングを可能にする CSS3 の登場へ。
- [Ep.3](https://blog.sakupi01.com/dev/articles/2024-openui-advent-5):
  - Web 標準化の動きが進んでもなお、Customizable でない Form Control の紹介。Customizable Select Element 提案の契機となるサーベイ結果。
- [Ep.4](https://blog.sakupi01.com/dev/articles/2024-openui-advent-6):
  - Greg や Mason による一連の調査を踏まえ、Domenic が Open UI で CSE の初期提案を行う。
- [Ep.5](https://blog.sakupi01.com/dev/articles/2024-openui-advent-7):
  - Open UI で CSE の Research が行われる。同時期に MS で`<selectmenu>`Explainer の作成。Explainer に基づいて、`<selectmenu>`が Intent to Prototype に。
- [Ep.6](https://blog.sakupi01.com/dev/articles/2024-openui-advent-8):
  - `<selectmenu>`が`<selectlist>`にリネーム。既存の UI パターンとの混乱を避けるため。
- [Ep.7](https://blog.sakupi01.com/dev/articles/2024-openui-advent-9):
  - `<selectlist>`が`<select>`にリネーム。`<selectlist>`/`<listbox>`は`<select>`/`<datalist>`の組み合わせでも実現可能＆Progressive Enhancement の観点を考慮したため。
- [Ep.8](https://blog.sakupi01.com/dev/articles/2024-openui-advent-10):
  - 現状の CSE デフォルトスタイルの紹介。ここから、`appearance: base-select;`の見た目はどう決まったのかを探る。Ep.8 では、選択された`<option>`のデフォルトチェックマークのスタイルの決定背景について。
- [Ep.9](https://blog.sakupi01.com/dev/articles/2024-openui-advent-11):
  - `::picker-icon`のデフォルトスタイルの決定背景について。
- [Ep.10](https://blog.sakupi01.com/dev/articles/2024-openui-advent-12):
  - `::picker(select)`のデフォルトスタイル。特に、デフォルト Color から探る system-color/ color-scheme/ prefers-color-scheme の関係。
- [Ep.11](https://blog.sakupi01.com/dev/articles/2024-openui-advent-13):
  - `<selectedcontent>`提案のきっかけとなった Issue の紹介。選択された`<option>`の value とスタイルを反映する初期の仕組みとして、`part`属性と`slot`属性。
- [Ep.12](https://blog.sakupi01.com/dev/articles/2024-openui-advent-14):
  - `part`属性を CSE の UA 実装で使用することの問題。`part`属性を`behavior`属性にリネーム。Greg が、`<option>`の value のみならず、`<option>`の内部コンテンツ自体を`<selectedcontent>`に反映する仕様を示唆する。
- [Ep.13](https://blog.sakupi01.com/dev/articles/2024-openui-advent-15):
  - `<option>`の内部コンテンツ自体を`<selectedcontent>`に反映する方法の検討。`innerHTML`を使用して内部コンテンツを反映する方法は見送り。`slot`属性と`behavior`属性を用いた、value とスタイルの反映のみ可能なまま。
- [Ep.14](https://blog.sakupi01.com/dev/articles/2024-openui-advent-16):
  - `slot`属性と`behavior`属性使用への疑念。WHATWG の Domenic と、Open UI 側の間で議論が白熱する。結果として、「選択された`<option>`を`<button>`にスロットしてカスタマイズできるようにする」唯一の手段であった、`slot`属性と`behavior`属性が使用廃止へ。
- [Ep.15](https://blog.sakupi01.com/dev/articles/2024-openui-advent-17):
  - `slot`属性と`behavior`属性が使用廃止を受けて、新しい CSE Anatomy が考案される。選択された`<option>`の子 Node を、`cloneNode()`で、`<selectedoption>`の Light DOM にクローンする手法が提案される。これは、HTML 史上初となる、UA から Light DOM へ変更を加える実装の契機となるもの。
- [Ep.16](https://blog.sakupi01.com/dev/articles/2024-openui-advent-18):
  - Light DOM へのクローン追加実装か、はたまた Shadow DOM にするのか。WHATWG のみならず、CSSWG と合意形成がなされ、Light DOM へのクローン追加実装で確定。加えて、`<selectedcontent>`の実装に関する議論の現状、特に「クローンタイミング」に関する懸念を深掘る。
- [Ep.17](https://blog.sakupi01.com/dev/articles/2024-openui-advent-19):
  - 「同期タイミング」「マイクロタスクタイミング」「CEReaction タイミング」、３つの異なるクローンタイミングのうち、どれを採用するのか問題。この時点では、パフォーマンスの面で優れた「マイクロタスクタイミング」が有力に。
- [Ep.18](https://blog.sakupi01.com/dev/articles/2024-openui-advent-20):
  - 「CEReaction タイミング」でのクローンが検討されるも、WHATNOT での議論の結果、「同期タイミング」でクローンを作成する方針に切り替わる。加えて、`<option>`内がリッチコンテンツの場合における、`cloneNode()`の制限を紹介。
- [Ep.19](https://blog.sakupi01.com/dev/articles/2024-openui-advent-21):
  - そもそも「Node 変更検知のタイミング」を UA 側でコントロールする必要があるのか？という、Jake の問題提起に基づき、デフォルトでは変更検知でのクローンはせず、更新をトリガーする方法を別で提供する方法が採用される。`cloneNode()`の制限については、現在も議論中。

## やり残したこと

この全 20 シリーズを通して追うことができた CSE の仕様は、おおよそ以下くらいです。

- `appearance: base-select;`を指定することによる、CSE デフォルトの見た目
  - 選択された Option にはチェックマークがつく
    - [selectlist: Should the "checked" option have a checkmark next to it? · Issue #863 · openui/open-ui](https://github.com/openui/open-ui/issues/863)
  - ドロップダウン Icon のデフォルトの見た目
    - [[css-ui] Pseudo-elements for checkmark and dropdown icon for appearance base `<select>` · Issue #10908 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10908)
  - `::picker(select)`のデフォルト色
    - [[css-ui] Colors to use for appearance base `<select>` · Issue #10909 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10909)
  - その他デフォルトスタイルに関して：[[css-ui] UA stylesheet for appearance base `<select>` · Issue #10857 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10857)
- `<selectedcontent>`には、選択された要素のクローンが作成された背景
  - [[select] Should the inner HTML & styles of the selected option be copied into selected-value? · Issue #571 · openui/open-ui](https://github.com/openui/open-ui/issues/571)
  - [Naming of the selected value element · Issue #808 · openui/open-ui](https://github.com/openui/open-ui/issues/808)
  - [select: Naming of `<selectedoption>` · Issue #1112 · openui/open-ui](https://github.com/openui/open-ui/issues/1112)
- 選択された`<option>`の変更を検知し、クローンを`<selectedcontent>`に反映するタイミングに関して
  - [How to implement and shape API for `<selectedoption>` element for `<select>` · Issue #10242 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10242)
  - [Timing of cloning for the `<selectedoption>` element · Issue #10520 · whatwg/html](https://github.com/whatwg/html/issues/10520)

主に次のようなトピックはやり残してしまいました。

- 現状の`<select>`を使用しつつ、段階的に移行できる手段として`appearance: base-select;`を提供している
- なぜ CSS で CSE を Opt-in するようにしたのか
  - [Styling form control pickers · Issue #10440 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10440#issuecomment-2332063450)
  - [Comment1 on Customizable `<select>` element · Issue #9799 · whatwg/html](https://github.com/whatwg/html/issues/9799#issuecomment-1789202391)
  - [Comment2 on Customizable `<select>` element · Issue #9799 · whatwg/html](https://github.com/whatwg/html/issues/9799#issuecomment-1926411811)
- `::picker(select)`が Top Layer であることを示す`:open`の追加に関して
  - [[Popup] How should the "popup is top layer" CSS pseudo class behave, and what should it be called · Issue #470 · openui/open-ui](https://github.com/openui/open-ui/issues/470#issuecomment-1138868669)
  - [[selectors] Add `:open` or `:top-layer` pseudo class · Issue #7319 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/7319)
  - [[selectors-4] Should we have `:open` and `:closed`? · Issue #11039 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/11039)
- `<select>`の Content Model に関する検討
  - [HTML parser changes for customizable `<select>` · Issue #10310 · whatwg/html](https://github.com/whatwg/html/issues/10310)
  - [Relax `<select>` parser by josepharhar · Pull Request #10557 · whatwg/html](https://github.com/whatwg/html/pull/10557)
- `<select>`の`multiple`、`size`属性はサポートの可能性
  - [stylable select: What should we do about the `multiple` and `size` attributes? · Issue #977 · openui/open-ui](https://github.com/openui/open-ui/issues/977#issuecomment-1910874971)
  - [`<select>` with size > 1 is not specified · Issue #153 · openui/open-ui](https://github.com/openui/open-ui/issues/153)
  - [select-v2](https://github.com/openui/open-ui/labels/select-v2)として、これから議論が進みそう？

その他、CSE に関する表層の Issue は以下にまとまっています。

<https://github.com/whatwg/html/issues/9799>

また、本エントリ執筆時点での各ベンダの Standard Positions は次の通りです。

- WebKit
  - [Customizable select element · Issue #386 · WebKit/standards-positions](https://github.com/WebKit/standards-positions/issues/386)
  - [Relax `<select>` parser · Issue #414 · WebKit/standards-positions](https://github.com/WebKit/standards-positions/issues/414)
- Mozilla
  - [Customizable select element · Issue #1060 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1060)
  - [Relax `<select>` parser · Issue #1086 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1086)
  - [HTML `selectedcontent` element · Issue #1142 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1142)

## Epilogue: Customizable Select Element

歴史的経緯から、スタイル設定や機能の拡張に関しての制限が大きく、これまで多くの開発者を悩ませてきた`<select>`は、CSE の提案によって大きく変わりつつあります。

その過程で、UA からの Light DOM 変更や、Popover API、Anchor Positioning の提案など、これまでの Web では実現が不可能だった機能に対する標準化の議論がなされてきました。

進化的な仕様を多く包含したこの提案は、Form Control のほんの 1 要素である`<select>`をカスタマイズ可能にするだけではなく、これまでの仕様では実現が難しかったさまざまな Web の新機能を実現する、大きな一歩となり得ます。

CSE のを構成する仕様の策定は現在進行形で行われています。最後の機能が Intent to Ship になるのが待ち遠しいですね！

---

それでは、また明日⛄

See you tomorrow!

### Appendix

- [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)
- [Add `<selectedcontent>` element by josepharhar · Pull Request #528 · w3c/html-aria](https://github.com/w3c/html-aria/pull/528)
- [Define the `<selectedcontent>` element by josepharhar · Pull Request #10633 · whatwg/html](https://github.com/whatwg/html/pull/10633)
- [[html-aam] Addition: selectedoption element by scottaohara · Pull Request #2344 · w3c/aria](https://github.com/w3c/aria/pull/2344)
- [5370555: Implement <selectedoption> for StylableSelect](https://chromium-review.googlesource.com/c/chromium/src/+/5370555)
