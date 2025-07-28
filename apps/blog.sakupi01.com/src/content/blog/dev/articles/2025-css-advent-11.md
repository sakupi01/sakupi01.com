---
title: "🎨 CSS Advent Calendar: Day 11 / The Birth of Responsive Design"
excerpt: "CSS Advent Calendar Day 11"
date: 2025-08-11
update: 2025-08-11
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 11 日目の記事です。
:::

2007年1月9日 の MacWorld で Steve Jobs が iPhone を発表した瞬間は、Web デザインにおける歴史が動いた瞬間でした。

- Steve Jobs Announces the iPhone for the First Time - YouTube

<https://www.youtube.com/shorts/QnbPRmzK2IA>

デスクトップ PC とはかけ離れた操作/画面/機能特性を持つデバイスの登場に、 Web は適応を迫られるようになりました。

これまでにも述べてきたように、Web は根底では「あらゆるデバイスでコンテンツが損なわれないよう」に設計されてきました。
しかし、CSS は ”柔軟な Web デザイン” ができるほど発達していたわけではありません。
Media Queries や Responsive Units は、この問題を解決するためにのちに登場する機能です。

CSS 自体に適応性のサポートが十分でなかったのであれば、デザイナや開発者側が Web デザインをする上で「適応性」を強く意識することがなかった/できなかったのも当然のことでした。

## Printed Design vs. Web Design

Web というメディアでデザインする上で、エコシステム（デザイナや開発者）側が「解釈/実践してきたもの」と標準（Web プラットフォーム）側が「思い描いてきたもの」には、大きな乖離が生まれていました。

当時は、 DTP（Desktop Publishing）出身の人が Web デザインに参画するケースが多かったため、Printed Design（印刷物に施されるデザイン）に近い Fixed なデザインが多くありました。
ポスターや新聞などをイメージして欲しいのですが、Printed Design の前提には以下のような特徴があります。

- 固定のキャンバス
  - 固定のフォント/フォントサイズ/ etc...
  - 固定の幅/高さ/余白/行間/ etc...
  - 固定の色
  - 固定の etc...
- 目で見て情報が伝わる人向け（逆に、視覚以外での認知が難しい）

つまり、**全てが固定値**という制約ゆえ、基本的に**全て固定値でデザインできる**のが、 Printed Design です。

対して、 Web は以下のような特徴を持ちます。

- さまざまなデバイス/OS/ブラウザ/ブラウザバージョン/設定/ネット環境/解像度 etc...
- さまざまなユーザ（右手/左手、視覚障害/聴覚障害/認知障害/運動障害/色覚異常 etc...）

つまり、**全てが可変**と言っても言い過ぎでないくらいには、”多様なキャンバス”の上でデザインする必要があります。

Web において ”キャンバス” を事前に予測することはほぼ不可能で、ユーザの意図次第で途中でデバイスの向きを変えたり、設定を変更したりすることもできます。
世界中で「このブログを読んでいる人」という超限定的な範囲でさえも、読んでいるデバイスが違ったり、文字サイズやコントラストを変えていたり、もしかすると読み上げ機能を使っていたりで、全く同じ状況で読めていることはそうそうないと思います。
相当な偶然がない限り、全く同じ”キャンバス”は存在しません。

そんな、「**未知のキャンバス**」の上でデザインすることこそが、**Web デザイン**です。

> The control which designers know in the print medium, and often desire in the web medium,
> is simply a function of the limitation of the printed page.
> **We should embrace the fact that the web doesn’t have the same constraints, and design for this flexibility.**
> But first, we must 'accept the ebb and flow of things.'
>
> ー John Allsopp, [“A Dao of Web Design”](https://alistapart.com/article/dao/)

**「キャンバスが既知か未知か」という、Printed Design と Web Design の唯一かつ最大の違い**は、iPhone の登場によって顕著になりました。

従来の PC ディスプレイに比べて、サイズの小さいデバイスが登場しただけでなく、タッチ操作やジェスチャ、限られたマシンスペックなど、
これまでの Web デザインでは考慮されていなかった要素が一気に加わったからです。

また、iPhone は、すでに一般に普及していた携帯電話の上位互換のような存在となるのもあり、PC を所有していなかった一般の人々が Web を使い始める契機にもなりました。Web におけるデザインが、「未知のキャンバス」への対応をより一層迫られるようになったのです。

そこでとられたのが、「モバイルデザイン」というアプローチです。

## Mobile Design

モバイルデザインは特に、「モバイルかデスクトップか」を区別して、モバイルデバイスに特化したデザインを行うことを指します。
レイアウトやタイポグラフィ、パフォーマンス etc.. において、物理的属性の異なるモバイル/デスクトップ間でウェブサイトがうまく動作するようにすることを目的としていました。

ただ、モバイルデザインは、**モバイルにおいての見た目**をデザインするものです。

リクエストと共に流れてくる情報から、サーバ側で端末/ブラウザ/バージョンを検出して、モバイル向けの見た目のサブドメインにリダイレクトするなどといった手法を取るのが「モバイルウェブデザイン」のやり方でした。
よって、モバイルデザインは、端末に**適応可能**な見た目を実装する以前、あくまで「**最低限**のソリューション」として利用されていたものです。

モバイル以外の端末（タブレットや Watch など）が後続して出現することを考慮すると、無限の 「whatever デザイン」が生まれることになります。

そんな「モバイルデザイン」の限定的なカバー範囲を懸念して拡張したのが、「レスポンシブデザイン」です。

## Responsive Design

レスポンシブデザインは、モバイルデバイスを含む様々な端末やデバイスサイズに**適応可能**（レスポンシブ）なよう**デザインする手法**のことを指します。

レスポンシブといえば、そもそも HTML や UA Style は基本的にレスポンシブに組まれています。
Author CSS を含まない HTML only のページを作成し、ウィンドウサイズを変更すると、ブラウザは View Port 幅に合わせてコンテンツを自動的に Re-Flow（再フロー）します。コンテンツは見切れたりしません。

しかし、そこに当時のレスポンシブでない CSS を用いた Web デザイン（つまり、Printed Design）が入り、”特定のキャンバス”を想定したサイズや位置を表現すると、 レスポンシブなページとは言えなくなります。

実は、レスポンシブデザインの前段となる考え方は、ブラウザの CSS サポートが整ってきた 2000年前後から存在していました。iPhone 登場以前の 2001年に、WaSP にいた John Allsopp が執筆した [A Dao of Web Design](https://alistapart.com/article/dao/) や、[Interactive architecture](https://alistapart.com/article/fluidgrids/)は、レスポンシブデザインの先駆けとなった考え方です。

> “a multiple-loop system in which one enters into a conversation; a continual and constructive information exchange.”
> Emphasis mine, as I think that’s a subtle yet powerful distinction:
> rather than creating immutable, unchanging spaces that define a particular experience, they suggest inhabitant and structure can—and should—**mutually influence each other**.
>
> [Interactive architecture](https://archive.org/details/interactivearchi0000foxm) : Fox, Michael, 1967 August 22- : Internet Archive

しかし、当時はまだ CSS のポテンシャルを引き出せていない実装が多かったり、CSS 自体も、複雑なデザインをレスポンシブに再現するための機能が不足していました。
よって、この考え方はすぐには広まりませんでした。

現に、CSS2.1 までは、クライアントサイドでのマルチデバイスのケアは `<link>` の media 属性での判別のみに留まっていました。

```html
<link rel="stylesheet" type="text/css" href="core.css"
  media="screen" />
<link rel="stylesheet" type="text/css" href="print.css"
  media="print" />
```

レスポンシブデザインという用語が最初に登場したのは、2010 年に Ethan Marcotte が A List Apart に執筆した [Responsive Web Design](https://alistapart.com/article/responsive-web-design/) であると言われています。（なので、正確には「レスポンシブウェブデザイン」）

Responsive Web Design で特筆すべき点は、CSS3 で策定が始まった MediaQueries の使用です。

[Responsive Web Design](https://alistapart.com/article/responsive-web-design/) は、[A Dao of Web Design](https://alistapart.com/article/dao/) や [Interactive architecture](https://alistapart.com/article/fluidgrids/) の考え方を、MediaQueries を利用して実装に落とし込みます。
Responsive Web Design では、レイアウトに CSS の float を使用し、MediaQuery で View Port 幅をクエリし、breakpoints に応じてレイアウトを作成することが推奨されていました。

---

”レスポンシブ” という考え方自体は、[Responsive Web Design](https://alistapart.com/article/responsive-web-design/) 以前にもあったものですが、具体的な実装手法が登場したことにより、レスポンシブデザインは業界に広まり出します。
そして、標準側においても、レスポンシブデザインの設計を容易にする機能が組み込まれていくことになります。

---

ただ、レスポンシブデザインは、Web における「適応性」に対する解決策の一つに過ぎません。

Web がこの先より一般化していく中で、スマホ以外の端末やさまざまな支援技術、環境で Web を利用するユーザが増えていきます。

つまり、あらゆる人間が Web の「潜在ユーザ」となり得、その嗜好/能力/環境/etc を「インクルード」して Web をデザインまたは設計することが重要になってきます。

ただ「レスポンシブ」なだけでなく、「アクセシブル」であったり、「インターナショナル」であったりする、
あらゆる潜在ユーザを「インクルード」した「インクルーシブデザイン」という考え方が後に謳われるようになるのも、モバイルデバイスの登場が契機だったと言えるでしょう。

## Appendix

- [A Dao of Web Design – A List Apart](https://alistapart.com/article/dao/)
- [Responsive Web Design – A List Apart](https://alistapart.com/article/responsive-web-design/)
- [Responsive web design | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
