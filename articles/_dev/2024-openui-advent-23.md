---
title: "🎄Open UI Advent Calendar: Day 23 / Global Design System Part1"
excerpt: "デザインシステムの開発を加速させる、堅牢で柔軟なGlobal Design Systemの提唱"
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

本アドベントカレンダーの締めくくりとして、Open UI内で最近プロジェクトとして確立した、「[Global Design System](https://github.com/openui/design-system)」を取り上げます。

## デザインシステムの開発を加速させる、堅牢で柔軟なGlobal Design System とは

Global Design Systemは、2024年初めに、Brad Frostによって提唱された、新しいレイヤーでのデザインシステムの概念です。2024年末現在、Global Design SystemはBrad個人ではなく、W3C Open UI Community Groupのプロジェクトとして動き始めています。

## 提案背景

ことの発端となったのは、今年初めに投稿されたBradの記事でした。ここで初めて、Global Design Systemの基本的な概念が提唱されます。（参考：[Global Design Systemにおける３つのコアメンタル](https://blog.sakupi01.com/dev/articles/2024-openui-advent-23#global-design-systemにおける３つのコアメンタル)）

- [A Global Design System | Brad Frost](https://bradfrost.com/blog/post/a-global-design-system/)

この記事を受けて、[Shop Talk](https://open.spotify.com/show/2PUoQB330ft0sTzSNoCPrH?si=rljg0AXLRaqlSLlgGbuxww) を運営するChris Coyierらが、Brad をゲストに招いて、記事に関する対談を行います。

https://open.spotify.com/episode/3Mp4aV1j44qzIZ4b7XSJmX?si=xXkP_LMIRUqqwTmUrTLVzA

対談では、基本的にBradの提唱記事に沿ったGDSのコンセプトが話されていました。その中で、GDSはBradが過去に提唱したAtomic DesignのAtomやMoleculeのレイヤーに位置するものとなることや、GDSがすべてのユースケースに対応する難しさに課題があることなどが議論されていました。

:::note{.memo}
📝 Frostapalooza

（Podcastのタイトルにある「Frostapalooza」は、Bradの40歳の誕生日企画として開催される音楽イベントのことでした...）

[FROSTAPALOOZA - A CONCERT/PARTY/HAPPENING ON AUGUST 17th, 2024](https://frostapalooza.bradfrost.com/)
:::
その後日記としてChrisは以下の記事を投稿します。

- [Thoughts on a Global Design System – Chris Coyier](https://chriscoyier.net/2024/02/05/thoughts-on-a-global-design-system/)

上記Podcastで上がった疑問も含めて、記事ではざっと以下のようなことが述べられています、これはGDSの概念をより確固たるものにする上で、非常にいい意味での批判となっていました。

- OSSのデザインシステムと何が違う？: 既存のOSSデザインシステムも抽象化された設計されているが、それが失敗しているとすれば、その理由は何か。
- 採用率の目標値は？: GDSがどの程度採用されるべきか、その理想的な割合は何か。
- どこまで対応するのか？: システムがあまりにも多くのニーズに応えようとすると、結局誰のニーズも満たさない可能性があるのではないか。
- 既存のコンポーネントの利用: もし完璧なコンポーネントが存在するなら、すでに広く使われているはず。
- Web Componentsの利用: Web Componentsは、まだ成熟しきっておらず、GDSの配布手段として適しているかどうか判断しかねる。
- スタイルの問題: スタイルがないことが要件となっているGDSにおいて、多くの人々はデザインシステムのデザイン性を求めているため、スタイルのないシステムに興味を持たない可能性があるのでは。
- 意思決定の難しさ: GDSが多くの組織に採用されるためには、非常に強力な原則とオーナーシップが必要。

Chrisの記事やコミュニティからのフィードバックを受け、Global Design Systemの概念を固めた上で、Bradは回答となる記事を改めて自身のブログに投稿します。（参考：[Global Design Systemにおける３つのコアメンタル](https://blog.sakupi01.com/dev/articles/2024-openui-advent-23#global-design-systemにおける３つのコアメンタル)）

- [What’s Next for a Global Design System | Brad Frost](https://bradfrost.com/blog/post/whats-next-for-a-global-design-system/)

こうして固まったGlobal Design Systemの概念を、BradはOpen UIのChairであるGregを中心に持ちかけます。Global Design Systemの概念は、ここで初めてOpen UIに打ち出されました。（2024/3/12）

- [A design system, component library for the web? · Issue #1017 · openui/open-ui](https://github.com/openui/open-ui/issues/1017)

***

元々は一個人の提案から始まったGlobal Design Systemですが、どうしてOpen UIのプロジェクトとして確立されるに至ったのでしょうか？そもそも、Global Design Systemの本質とは何なのでしょうか？

※ 以下、GDS = Global Design System とします

## Global Design Systemにおける３つのコアメンタル

GDSが本質的に何を目指すのかを理解し、これからどう動いてくのかを推測する上で、GDSのメンタルモデルを理解しておくことは重要です。

この節は、GDSの提唱者であるBradの記事やDiscordを含めたOpen UIでの議論をもとに、GDSのメンタルモデルを筆者が解釈してまとめたものになります。

https://bradfrost.com/blog/post/a-global-design-system/

https://bradfrost.com/blog/post/whats-next-for-a-global-design-system/

### HTMLの上に構築されるレイヤー

**GDSは、HTML（標準）の代替をとなるものではありません**。
HTMLをベースとして構築されるデザインシステムとHTMLレイヤーの間に欠けているものを埋めることが、GDSの役割です。

![HTMLレイヤー（標準）と各デザインシステムの間にギャップがあることで、共通部分の機械的な複製や、意図しない欠損が生じる可能性がある](/missed-layer-between-ds-and-html.png)
*HTMLレイヤー（標準）と各デザインシステムの間にギャップがあることで、共通部分の機械的な複製や、意図しない欠損が生じる可能性がある*

**組織が何度も構築&再構築しているコンポーネントの共通部分が、Web の適切な組織によって承認された成果物として管理され、それがHTMLと既存のデザインシステムの間のギャップを補完するレイヤーとなる**ことで、開発者はより効率的に堅牢なデザインシステムを構築できるようになります。

![HTMLレイヤー（標準）と各デザインシステムの間をGDSが埋めることで、より堅牢で信頼できるデザインシステムを、効率的に作成できる](/gds-layer.png)
*HTMLレイヤー（標準）と各デザインシステムの間をGDSが埋めることで、より堅牢で信頼できるデザインシステムを、効率的に作成できる*

つまり、競合する標準を作成することではなく、現状のHTMLと各デザインシステムとのギャップを埋めるために、新しいレイヤーを導入することが目標となります。

GDSが標準の一部でないことは、GDSの概要にも明記されています。

> A W3C Standard - The OpenUI Design System is an incubation for possible future enhancements to the web platform but they are not standardized components.
> [openui/design-system](https://github.com/openui/design-system)

### 特定の見た目と技術に依存しない、スタンドアロンなデザインシステムとなる

**GDSは、ブラウザデフォルトのスタイルのみを含むスタンドアロンなデザインシステム**です。言い換えれば、堅牢なセマンティクスと機能を提供し、かつ見た目の技術の柔軟性を保った、いわば「**特定の見た目と技術に依存しない、スタンドアロンなデザインシステム**」です。

故に、開発者はGDSをプロジェクトに取り込み、ブランドの**あらゆる**デザインや機能を、**あらゆる**言語・ライブラリ・フレームワーク（CSS、JS、JSX、Web Components、Tailwind、React、Vue、Angular etc）を用いて拡張できます。

前述したように、GDSの目標は、既存のデザインシステムの兄弟を作成することではなく、**既存システムを拡張するための、オフィシャルなレイヤー**を導入することです。

独自のブランドスタイルや言語に依存した3rd Party/組織のデザインシステムとGDSとの相違点は、”GDSの Brand&Tech Agnostic さ”にあります。

![OSSコンポーネントライブラリや独自デザインシステムは、そのコンテキストのみでしかGlobalではない](/individual-ds-vs-gds.png)
*OSSコンポーネントライブラリや独自デザインシステムは、そのコンテキストのみでしかGlobalではない*

共通コンポーネントには、必ず共通かつ一般的なセマンティクスと動作がありますが、スタイルは大きく異なります。

こうした、コンポーネントのコアとなるセマンティクスや機能を、イチから設計、構築、拡張、結合、テストして、独自デザインシステムを作成するのは、どう考えても非効率でした。そこで、GDSが適切な組織によって承認された堅牢なセマンティクスや動作を提供することで、それを拡張した、堅牢で信頼できる独自のデザインシステムを効率よく構築できるようになります。

堅牢なセマンティクスや動作を提供するデザインシステムに加え、開発者が独自の見た目や機能を組み合わせることで、独自デザインシステムを構築する良い例として、[Design System + CSS Zen Garden](https://bradfrost.com/blog/post/creating-themeable-design-systems/)が参考になります。

### 全てのUI要件の包括的なソリューションにはならない

GDSはそもそも、すべてのユースケースに対応するとを目的としていません。特定のコンポーネントのユースケースの**大部分に対応するソリューションを提供できれば、大きな成果として評価されます**。

例えば、クリックするとバックフリップして、SVGの星を撒き散らすようなボタンコンポーネントを作成する必要があるとしましょう。
こういった場合、開発者は、**素のHTML, CSS, JS**を構成して、独自のUIを作成すれば良いです。

先にも述べたように、**GDSは、HTML自体を拡張するのではなく、HTMLの上レイヤーに存在するというアプローチ**を取っています。
それゆえ、**HTML はGDSでカバーできないようなすべてのユースケースに対応できる必要があります**が、**GDS（特にWeb Components ライブラリ）は最も一般的と考えられるユースケースのみを対象にできます**。

つまり、開発者は、GDSを利用できる場面では利用し、そうでない場面ではビルトインのHTML, CSS, JSを駆使しすれば良いのです。

とはいえ、GDS自体は非常に保守的なものとし、真に一般的なユースケースに重点を置くためのリサーチと検討が重ねられた上で構築されます。

## Global Design Systemが提供するもの

こうしたメンタルモデルを持ったGDSは、具体的に以下のようなものを成果物として提供することが想定されています。

### 1. コンポーネントライブラリ

GDSのコンポーネントライブラリは、以下の6つの原則に則って作成されます。

> 1. **アクセシビリティやその他のフロントエンドのベストプラクティスの手段**であり、一般的な UI コンポーネントの”Single Source of Truth”となる
> 2. あらゆるブランドやデザインに合わせて**簡単にテーマを設定できる**ようにする
> 3. **直感的**に使用でき、一貫したAPI、論理的な構造、わかりやすい構文を開発者に提供する
> 4. **Interoperable**で、あらゆる Web サイトやアプリを強化できる
> 5. 言語、記述方法などの多様性に対応するために**国際化されている**
> 6. **ComposableかつExtensible**であるため、開発者は特別なハックをすることなく変更または拡張できる
>
> [A Global Design System | Brad Frost](https://bradfrost.com/blog/post/a-global-design-system/)

これらを達成するための技術的手段として、Web Componentsを用いることが提案されており、以下のような使用方法が想定されています。

```html
<w3c-button-group>
  <w3c-button variant="primary">Log In</w3c-button>
  <w3c-button>Cancel</w3c-button>
</w3c-button-group>
```

また、GDSのコンポーネントライブラリは、npmなどの3rd Party パッケージレジストリを通じて、開発者が利用できる形で提供される予定です。

### 2. デザインライブラリ

FigmaやSketchなどのデザインツールで構築されたデザインライブラリも、GDSの一部として提供されることが期待されます。

### 3. リファレンスサイト

GDSのコンポーネントライブラリやデザインライブラリに関するドキュメントは、リファレンスサイトとして提供されるとしています。

## デザイナーやエンジニアはどう変わるのか

GDSによって、デザインシステムを構築するチームは、**単なるコンポーネントの構築ではなく、デザインや機能のより深い側面に集中できるようになります**。

デザインシステムチームは、組織/製品レベルのコンテキストを包含したコンポーネントや、それに関するガイドラインなどを成果物として作成する必要が依然としてあり、それらがGDSによって吸収されることはありません。

***

Part2では、GDSとOpen UIの具体的なインテグレーションと、彼らが実現する未来についてお話しします。

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

Notable comments found in Didcord:

- [Should this be a design system only and not include a component library?](https://discord.com/channels/714891843556606052/1216793626290421814/1217243783226462350)
- [What would `<www-button>` do that html `<button>` doesn't do?](https://discord.com/channels/714891843556606052/1216793626290421814/1217820806306988062)
- [can you give us a list of 10 components you envision would be ideal for this, but wouldn't probably be a native HTML element?](https://discord.com/channels/714891843556606052/1216793626290421814/1218216435831017482)
