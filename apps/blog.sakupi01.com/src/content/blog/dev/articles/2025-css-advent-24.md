---
title: "🎨 CSS Advent Calendar: Day 24 / The Future of Web UI is Declarative. - How Design System can bridge Imperative Design?"
excerpt: "CSS Advent Calendar Day 24"
date: 2025-08-24
update: 2025-08-24
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 24 日目の記事です。
:::

[Day23](/dev/articles/2025-css-advent-23) では、CSS が Declarative であること、その特徴を活かした Declarative な Design をすることで、Declarative であるという CSS の性質に基づいた、Fault Tolerant で柔軟性を備えたデザインが可能になると述べました。

Declarative なマインドセットへのシフトに対して、デザインツールの現状はどうなっているのでしょうか？

## Design Tools

デザインツールと言っても様々ですが、今回論じたい内容はどのツールを取ってもほとんど変わらないため、ここでは Figma を例に話します。

Figma においては、Layer や Component, Property, Swap Component などといった形で、Component-driven に即したデザインを可能にする機能をうまく実装しています。

こうした「情報・データの整理」は、Web アプリケーションの得意とするところであり、デザインツールによって、コンポーネント単位でデザインの再利用が容易になりました。

![デザインツールの登場](../../../../assets/images/design-tool.png)

しかしながら、デザインツールで作成したコンポーネントが、コンポーネントの実装時にそのまま参照可能かというと、そうではありません。
なぜならば、そこにはデザインツールとブラウザの間で、目的と制約が異なるからです。

これまでに見てきたように、ブラウザでは、ユーザのあらゆる状況という「未知の変数」を入力として、CSS だけでも Value Processing や Cascade と、その他膨大な計算がレンダリングエンジンでなされており、それの計算結果が画面に出力されています。

そして、デザインツールがこの出力を完全に再現することは、現時点では困難です。

よって、デザインツールは静的なデザインの作成と管理に最適化されており、ブラウザは動的なコンテンツの実行と表示に最適化されている相補的な関係にあるため、デザインツールが CSS の代替として機能することは、理論的には不可能です。

## The Gap

Web Design という文脈において、CSS が「Declarative なツール」であれば、デザインツールは値やフレームサイズなどの表示要件を具体的に指示する「Imperative なツール」であるといえます。

そして、デザインツールと CSS のギャップは、CSS で Declarative に表現できることが増えるほど拡大するものです。

いくら Auto Layout や Grid、Hug/ Fill Container のような機能が Figma に追加されても、それらは ”Fake-” Flexbox/Grid/Intrinsic Sizing/etc であり、 CSS と同等に機能しません。

デザインツールは Imperative であるという制約とその目的から、Declarative な CSS の進化に追いつくことは困難です。
その差は年々拡大していく一方でしょう。

![デザインツールと CSS のギャップは年追うごとに肥大化する](../../../../assets/images/the-gap.png)

よって、皮肉なことに、デザインツールでは、CSS のポテンシャルを最大限に活かした「Declarative Design」を実現することはできません。

## Design System has to be Declarative

ここで、これまで本連載で触れてこなかった「Design System」という存在ついて触れておきます。
なぜならば、CSS とデザインの仲立ちとなる要素である Design System は、理論的には、この問題を打開するために役立つ可能性があるからです。

Design System の詳細をここで詳しく述べることはしませんが、要するに、Design System とは、デザインの一貫性を保ち、効率的なデザイン・開発を促進する要素の集合体です。
要素には、ガイドライン、コンポーネント、デザイントークンなどが含まれることが一般的です。

- [What Is a Design System | Design Systems 101 | Figma Blog](https://www.figma.com/blog/design-systems-101-what-is-a-design-system/)
- [WTF are Design Tokens? - YouTube](https://www.youtube.com/watch?v=q5qIowMyVt8&t=16s)

予め、Design System のコンポーネントやデザイントークンを「正しく」構築しておけば、あらゆる状況において一貫したデザインをすばやく展開することができます。
しかしこの、「正しい」という言葉には解釈の余地があります。

---

**Imperative な考え方**で Design System を構築すると、「正しい」は「緻密な」という意味合いになります。
デザインツールと強く結合した Design System では、Imperative な考え方の Design System になりやすいです。
この場合、特定の Viewport に基づいたピクセル値でのスペーシングや rem でのフォントサイズ、hex でのカラー指定など、デザインツールが表現できる範囲で「**緻密な Design System**」が定義されます。

**Declarative な考え方**で Design System を構築すると、「正しい」は「柔軟な」という意味合いになります。
Declarative であるという CSS の性質を利用した Design System は、Declarative な考え方の Design System になりやすいです。
この場合、あらゆる Viewport でもコンテナに対して違和感のないように変化するスペーシングや、コンテナの幅に応じて変化するフォントサイズ、ユーザの環境において最適な色域など、CSS の Declarative なポテンシャルを最大限に活かした「**Fault Tolerant で柔軟な Design System**」が定義されます。

例として、カードコンポーネントの作成を考えます。

Imperative な考え方のコンポーネントでは、出力結果の完璧さが問われます。
特定の Viewport に対して完璧なスタイルを実現するためには、「Media Queries」を利用してコンポーネントを構築するのが最適です。
よって、Imperative な Design System のコンポーネントでは、Media Queries の利用をしたり、モバイルと PC で異なるスタイルシートやデザイントークンを適用したりするでしょう。

一方、Declarative な考え方でコンポーネントを作ると、Viewport やデバイスによってスタイルシートを変更したくなることはありません。
なぜならば、その画面やデバイスでない場合に適用したスタイルが壊れてしまい、Fault Tolerant でないコンポーネントになるからです。
よって、Declarative な Design System では、コンテナに対して柔軟なコンテンツを宣言するために「Container Queries」を利用したり、`min()`, `max()`, `clamp()` などの関数を利用したりして、Viewport に依存したスタイルを避けるでしょう。

以下の例では、Media Queries を利用した Imperative なコンポーネントと、Container Queries を利用した Declarative なコンポーネントを示しています。

<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="MYaXoPw" data-pen-title="Media or Container" data-user="sakupi01" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakupi01/pen/MYaXoPw">
  Media or Container</a> by saku (<a href="https://codepen.io/sakupi01">@sakupi01</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

---

これら2つの Design System のアプローチは根本的に異なるものですが、いずれの成果物も「Design System」になり得ます。

もしデザイナや開発者が Imperative な考え方を持っていて、Figma が Single Source of Truth と考えられているなら、Imperative Design System の方が適しているかもしれません。

しかし、CSS や HTML の本質の観点からデザインを考えることができるチームがあるのであれば、Declarative Design System を構築できるポテンシャルがあると思います。

Web が本質的に制御できないものであることは、本連載でも度々触れてきました。

[Day23](/dev/articles/2025-css-advent-23) で詳しく述べましたが、Declarative Design の核心は、**前提に基づいた制御を排除**し、出力のための詳細を**ブラウザに委ねる**ための「**宣言をデザインする**」ことです。
Web の持つ「未知の変数」に対しても柔軟に・最適に対応することを目指す Declarative Design というマインドセットは、Web を前提とした Design System ならば目指すべきものであると、個人的には考えています。

とはいえ、Imperative なデザインツールによって構築されたデザインから、Declarative な Design System を構築するためには、どうすればよいのでしょうか？

## Design has to be Semantic

ここ数年で、CSS の機能は飛躍的に増え、Declarative な表現力は大幅に向上しました。

そんな CSS をフル活用した「Declarative な Design System」を構築するためには、CSS を使って「**何を**」Declare しているのかを明確にすることが大事です。

CSS は、レイアウト/コンポーネント/ステート/etc の、配置/形状/色/切り替え基準/etc にどういう「ルール」をもたせるのかを Declare する文法構造になっています。
仕様的にも、それが CSS Rules と呼ばれるチャンクに当たります。

では、その Declare する「ルール」はどのようにしたら決定できるのでしょうか？
レイアウト/コンポーネント/ステート/etc の、配置/形状/色/切り替え基準/etc に「**意味づけをする**」と、それを Declare する「ルール」に翻訳することができます。

ということは、デザインに「意味づけをする」と、Imperative であるデザインの本来の「意図」を、スタイルの「ルール」として、CSS がブラウザに Declare できるようになります。

つまり、デザインに「意味づけをする」と、**Imperative なデザインを、Declarative な見た目に翻訳できる**ようになるということです。

これにより、ブラウザが「デザインの意図」を CSS のルールとして解釈し、あらゆる状況において最適な見た目を「ユーザに伝える」ことができるようになります。

そして、この「意味づけ」をする語彙は、CSS が Declarative になればなるほど、CSS の機能が増えれば増えるほど幅が広くなっていきます。

例えば、「Input を 280px の幅にしたい！」というデザインがあった場合、そのデザインになった「意味」を解釈すると、 「Form の半分くらいの幅が心地良いから」という意図がわかるかもしれません。
ここまでくると、Container Size Queries を使って Declarative なデザインに翻訳できるかもしれません。
しかし、Container Size Queries が使えなければ、別の意味づけが必要です。
要は、**CSS が Declare できるレベルまで**、デザインの「意味」を解釈し続ける必要があるということです。

最も伝えたいことは、「**Declarative な Design System の構築は、Semantic なデザインにの上に成り立つ**」という考えです。

![Declarative な Design System の構築は、Semantic なデザインにの上に成り立つ](../../../../assets/images/semantic-design-declarative-design-system.png)

Container Queries や `:has()` の登場によって、「コンポーネントの設計の仕方が変わる」という主張もありますが、やるべきことは、これまでと本質的には変わらないと思います。

**デザインに適切な「意味づけ」をする**ことができており、新しい機能を用いた方が、その**意味をより適切に翻訳できる**のであれば、その機能を用いることで、デザインをより適切な形でブラウザに Declare できるようになる、ということです。

Container Queries が利用可能になったからといって、コンテナが固定幅のコンポーネントに対して、Container Queries に翻訳できるまでデザインを意味づけしても旨みがありません。

## The Future of Web UI is Declarative

本連載では CSS にフォーカスしてきましたが、Web UI 全般において、 Declarative な表現力はこれからも向上していくことが見込まれます。

State of CSS や What's New in Web UI/CSS などを俯瞰すると、この傾向は明らかです。

例えば、HTML においても、`<dialog>`, `<details>`, `<summary>`, Popover API などの機能が登場し、より多くの UI パターンがネイティブにサポートされるようになっています。
CSS においても、Cascade Layers, `@scope`, Container Queries, `:has()`, `subgrid`, `@property`, `@when` & `@else`, `@if`, `@function`, `@mixin`  など、Declarative な表現力を向上させる機能が次々と仕様策定/実装されています。

こうした機能を無為にせず、 Declarative な UI を構築していくためには、デザインと Web の本質的な違いを捉えた、Web Design におけるマインドセットの転換が必要です。

今回、Declarative な Web UI を実現する上でのマインドセットの一例として、デザインを Semantic に、Design System を Declarative に捉える方向性を示しました。
しかし、Web という流動的な変化を踏まえた Design 論法に特に正解はなく、これまでそうであったように、Web や社会の動きに合わせてゆっくりとスタイルが構築されていくものだと思います。

## Appendix

- [Adactio: Journal—Declarative design systems](https://adactio.com/journal/19131)
- State of CSS
  - [2022](https://2023.stateofcss.com/en-US/)
  - [2023](https://2024.stateofcss.com/en-US/)
  - [2024](https://2025.stateofcss.com/en-US/)
  - [2025](https://2026.stateofcss.com/en-US/)
- What's New in Web UI/CSS
  - [2022](https://developer.chrome.com/blog/insider-july-2022)
  - [2023](https://developer.chrome.com/blog/whats-new-css-ui-2023)
  - [2024](https://developer.chrome.com/blog/new-in-web-ui-io-2024)
  - [2025](https://developer.chrome.com/blog/new-in-web-ui-io-2025-recap)

---

<advent-calendar-2025 />
