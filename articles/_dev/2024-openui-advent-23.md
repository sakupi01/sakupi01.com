---
title: "🎄Open UI Advent Calendar: Day 23 / Global Design System Part1"
excerpt: "Open UIが提唱する、Web標準ベースのDesign System：Global Design System とは"
date: "2024-12-23"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の23日目の記事です。
:::

本アドベントカレンダーの締めくくりとして、Open UIが提唱する「Global Design System」を取り上げます。

## Web標準ベースのDesign System、Global Design System とは

## 提案背景

ことのきっかけとなったのは、Global Design Systemを提唱する、Brad Frostの記事でした。（2024/1/9）

https://bradfrost.com/blog/post/a-global-design-system/

この記事を受けて、[Shop Talk](https://open.spotify.com/show/2PUoQB330ft0sTzSNoCPrH?si=rljg0AXLRaqlSLlgGbuxww) を運営するChris Coyierらが、Brad をゲストに招いて、記事に関する対談を行います。

https://open.spotify.com/episode/3Mp4aV1j44qzIZ4b7XSJmX?si=xXkP_LMIRUqqwTmUrTLVzA

その後日記としてChrisが投稿した以下の記事は、Bradの提案対していい意味で批判する内容となっていました。

https://chriscoyier.net/2024/02/05/thoughts-on-a-global-design-system/

Chrisの記事やコミュニティからのフィードバックを受け、Global Design Systemの概念を固めた上で、Bradは回答となる記事を自身のブログに投稿します。

https://bradfrost.com/blog/post/whats-next-for-a-global-design-system/

コミュニティからのフィードバックを受けて固まったGlobal Design Systemの概念を、Bradは、Open UIのChairであるGregを中心に持ちかけます。Global Design Systemの概念は、ここで初めてOpen UIに打ち出されました。（2024/3/12）

- [A design system, component library for the web? · Issue #1017 · openui/open-ui](https://github.com/openui/open-ui/issues/1017)

※ 以下、GDS = Global Design System とします

## なぜ、Open UIでGlobal Design Systemを議論するのか。どう、議論するのか

Open UIは、Web プラットフォームのInteroperabilityを実現するための技術の標準化を検討することに取り組む団体ですが、GDSはBrad個人がパブリックに提唱した概念です。

GDSに関するOpen UIの初めてのTeleconでは、GDSをOpen UIで議論することの正当性に関して話し合われます。

[最初のTelecon](https://github.com/openui/open-ui/issues/1017#issuecomment-1998149015)

Teleconの結果を受けて、Open UIでは、「Global Design System本体」と「Open UI から承認/提供された、GDSを実装するコンポーネントライブラリ」に分割するという提案がなされます。

- [comment](https://github.com/openui/open-ui/issues/1017#issuecomment-2109117089)

### Global Design System本体

### Open UI から承認/提供された、GDSを実装するコンポーネントライブラリ

> RESOLVED: Create a Global Design System workstream in Open UI and do not start from zero with a component library(s) (TBD)
> [IRC](https://github.com/openui/open-ui/issues/1017#issuecomment-2115955452)

これが、Global Design System が open-ui/open-ui とは別のリポジトリで動いている理由です。

[open-ui/design-system](https://github.com/openui/design-system)は、「Global Design System本体」の仕様を策定する時に動くリポジトリです。
そのため、xxの時は、ここを参照することになります。

対して、「Open UI から承認/提供された、GDSを実装する**コンポーネントライブラリ**」は、[openui/open-ui](https://github.com/openui/open-ui/) で検討されます。故に、GDSが提供するコンポーネントライブラリの、各コンポーネントの検討内容が知りたい場合は、[openui/open-ui](https://github.com/openui/open-ui/) を参照すれば良いはずです。

## Global Design Systemのコアメンタルモデル

以下の記事を解釈したものです。

https://bradfrost.com/blog/post/a-global-design-system/

まず、DSの定義はこれ。なので、こういうのを作る。

> A component library represented in code (e.g. Web Components, React, Angular, Vue, et al)
> A component library represented in design tools (e.g. Figma, Sketch, et al)
> Documentation (often in the form of a website) that outlines high-level guidelines, component-level details, processes (getting started, adopting, contributing, etc)
> https://discord.com/channels/714891843556606052/1216793626290421814/1217243783226462350

ただのアクセシブルでカスタマイズ可能なコンポーネントや、それを実現するための機能を提供するだけなら、Webで標準化できる。
DSにすることで、プロパティとかそういうのを使えるようにする。GDSは、それを使用側の要件に沿ってカスタマイズできるようにする。いわば、UIライブラリの標準バージョンを提供する。
https://discord.com/channels/714891843556606052/1216793626290421814/1217820806306988062

その際、特定のフレームワークに依存しない技術を用いたい。
> Web Components are a fantastic vehicle for delivering front-of-the-front-end code to any tech stack. I talk more about that here: https://bradfrost.com/blog/post/lets-talk-about-web-components/

どうして↑を実現するために、別の要素を作らないといけないの？たとえば、`<button>`にプロパティとかそういうのを使えるようにするんだったら`<button>`をラップする形で作ればいいじゃない。

> good question! The benefits of consumable components are many (I write about them here https://bradfrost.com/blog/post/frontend-design-react-and-a-bridge-over-the-great-divide/ and here https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/), but the gist is this:
> **Create a single source of truth for component markup, styles, and behavior** that gets delivered to consuming developers. Consuming developers interact with each component's API rather than having to author markup, styles, and presentational JavaScript themselves.
> **This creates a clearer distinction between front-of-the-front-end development and back-of-the-front-end development**, allowing front-of-the-front-end developers to own component internals and back-of-the-front-end developers to focus on logic, page-level stuff, cache invalidation, and the rest of it.
> **Bake in best practices** including semantics, accessibility, internationalization, performance, and other front-end best practices. These best practices are packaged up and delivered to developers, who get those best practices for free by using the component.
> **Connected** - Consumable UI components are connected, meaning that new versions of the components can be published (containing bug fixes, new features, etc). Developers update the components and receive those improvements
> Why can't this be built on top of regular <button> elements?
> T**hese are built using regular <button> elements under the hood! I think this is an important thing to underscore regarding this effort. Design system component libraries — including a Global Design System component library — use all the great native HTML, CSS, and JS features available to us; they just go a step further by composing them together in order to solve common problems.**

以下のような感じになる。ただのスタイルの抽象を提供するだけじゃない

```css
button {
  style: var(--sl-button);
}

```

```html
<button class="btn btn--primary">
  <svg ...>
  Search
</button>
```

```html
<oui-button variant="primary" text="Search" icon="search" iconPosition="before">
</oui-button>
```

CSS module scriptsはChromeにはshipされている

> I mean, if we built (or adopted or approved or whatever) a component, it should come along with a guideline/specification for how it works and why - I don't think they are mutually exclusive and I see value in doing it the way openui had kind of originally discussed and trying to lay out a thing which could have a web component reference implmentation, but maybe possibly also could have other independent implementations, maybe which weren't even web components.
> つまり、もし私たちがコンポーネントを作った（あるいは採用した、あるいは承認した、あるいは何であれ）なら、それがどのように機能するのか、そしてなぜそうなるのかについてのガイドラインや仕様書も一緒に提供されるべきだということです。
> https://discord.com/channels/714891843556606052/1216793626290421814/1217848396354682880

↑に該当するが、HTML要素として定義されるべきでない10このコンポーネントの例

> Form Controlsが大半
> https://discord.com/channels/714891843556606052/1216793626290421814/1218216435831017482

WCAGは完璧じゃない
> “should” work, isn't really 'established patterns': the patterns aren't user tested or AT tested necessarily, they may include features that aren't well supported or decisions that don't have broad consensus etc
> https://hidde.blog/whats-normative-in-wcag/
***

それでは、また明日⛄

See you tomorrow!

### Appendix

- [A Global Design System | Brad Frost](https://bradfrost.com/blog/post/a-global-design-system/)
- [Thoughts on a Global Design System – Chris Coyier](https://chriscoyier.net/2024/02/05/thoughts-on-a-global-design-system/)
- [What’s Next for a Global Design System | Brad Frost](https://bradfrost.com/blog/post/whats-next-for-a-global-design-system/)
- [A design system, component library for the web? · Issue #1017 · openui/open-ui](https://github.com/openui/open-ui/issues/1017)
- [Thoughts on a Global Design System](https://www.gwhitworth.com/posts/2024/my-thoughts-on-global-design-system/)
- [927: Thoughts on a Global Design System](https://bkardell.com/blog/927.html)
- [Open UI Component Certified Checklist - Google ドキュメント](https://docs.google.com/document/d/1eTSxCWd3yRMxTCAs3a74NzQ6C9gikYQLZeVdCMODwOg/edit?tab=t.0#heading=h.jjvcvbvmo8v1)
- [Comparing design systems to find the best qualities | hidde.blog](https://hidde.blog/re-global-design-system/)
- [Nue 1.0 (Beta) - Nue](https://nuejs.org/blog/nue-1-beta/)
- [Foundation for the Global Design System component library · Issue #1066 · openui/open-ui](https://github.com/openui/open-ui/issues/1066)
- [openui/design-system](https://github.com/openui/design-system)
- [Introducing new HTML elements that are pay-for-what-you-use · Issue #4697 · whatwg/html](https://github.com/whatwg/html/issues/4697)
- [Design Tokens Format Module](https://tr.designtokens.org/format/)
- [Front-of-the-front-end and back-of-the-front-end web development | Brad Frost](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/)
- [Let’s talk about web components | Brad Frost](https://bradfrost.com/blog/post/lets-talk-about-web-components/)
- [HTML is a Global Design System](https://designsystems.wtf/html-is-a-global-design-system/)
- [What's ‘normative’ in WCAG? | hidde.blog](https://hidde.blog/whats-normative-in-wcag/)
- [Definition of a "control"? · Issue #81 · openui/open-ui](https://github.com/openui/open-ui/issues/81)
- [601: Brad Frost on A Global Design System + Frostapalooza – ShopTalk](https://shoptalkshow.com/601/)
