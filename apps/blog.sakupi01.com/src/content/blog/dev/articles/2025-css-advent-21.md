---
title: "🎨 CSS Advent Calendar: Day 21 / A Quick History of Web Design & Design Tools"
excerpt: "Responsive Web Design までの歴史から見る、Web の制約と特性とデザインの理想"
date: 2025-08-21
update: 2025-08-21
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 21 日目の記事です。
:::

本連載の終盤では、Web における UI の特性と今後の Web Design のあり方について、考察していきます。

その前談となる本エントリでは、Web Design の歴史を振り返り、これまで Web Design における「思考の変換」がどのようにされてきたのかを振り返ります。

## A Quick History of Web Design

Web におけるこれまでのデザインの歴史を解釈すると、**レイアウトとコンテンツにおけるデザイン思想史**として語ることができます。

詳細に入る前に、これまでの Web Design 史の Overview を提示しておきます。

![Web Design 史の Overview](../../../../assets/images/web-design-timeline.png)

### Flow Layout

CSS も JavaScript もまだ登場していなかった時代、Web で使えるのは HTML のみでした。
この時代にページのレイアウトとして利用できたのは、現在の CSS 仕様でいうところの「[Normal Flow](https://www.w3.org/TR/CSS2/visuren.html#normal-flow)」です。
Box（コンテナ）が Content を参照し、Content が Box を参照する「レイアウトにおいて Box とその Content が互いに参照し合う関係性にある集合」のことを [Flow](https://www.w3.org/TR/CSS2/visuren.html#normal-flow:~:text=The%20flow%20of%20an%20element%20A%20is%20the%20set%20consisting%20of%20A%20and%20all%20in%2Dflow%20elements%20whose%20nearest%20out%2Dof%2Dflow%20ancestor%20is%20A.) と呼びます。
Normal Flow では、 Inline 要素はインライン方向、つまり writing-mode の方向に配置され、Block 要素は、段落方向に配置されます。

例えば以下のシンプルな HTML の画面幅を伸縮させると、それに応じてコンテンツが wrap されたり、段落は別の行に配置されています。
このレイアウトは、HTML が Normal Flow に従って、Box とその Content が互いに参照し合うために可能なものです。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="raOdZdr" data-pen-title="Untitled" data-user="sakupi01" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakupi01/pen/raOdZdr">
  Untitled</a> by saku (<a href="https://codepen.io/sakupi01">@sakupi01</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

Normal Flow による Web のデフォルトのレイアウト、いわゆる 「**Flow Layout**」が Web Design における最初のレイアウトです。

### Table Layout

その次に Web Design に変化を起こすのが、 HTML Table の登場です。

Table には Columns/Rows があり、ヘッダがあり、セルがあることで、表形式のデータを表現する目的があります。
当時のデザイナは、この二次元構造を画像やコンテンツの配置に利用することで、Flow Layout ではできなかった二次元的なレイアウトを実現できるのではないかと考えました。
これが「**Table Layout**」の時代です。

![Table Layout](../../../../assets/images/table-layout.png)
*出典： [Tables for Layout? Absurd. - The History of the Web](https://thehistoryoftheweb.com/tables-layout-absurd/)*

ただし、Table Layout では、Table の構造に依存したレイアウトのみしか実現できず、二次元構造よりも複雑な見た目を実現したいという欲求が発生します。

加えて当時は、ブラウザ戦争の影響によるブラウザ間の互換性の問題もありました。
IE で動作しても Netscape では動作しない、またその逆もあるという状況です。
資金的余裕があれば、IE と Netscape の両方に対応した Web サイトを作ることができましたが、そうでない場合は、どちらか一方のブラウザへの対応を迫られるということが起こっていました。
問題の原因として、実装する上での詳細を仕様が握れていなかったことがあったため、Chrome や Firefox などのモダンブラウザが登場してもなお、Web Design をする上で**互換性の問題が大きい**ままでした。

### Flash Web Design

このような状況の中で、「どのブラウザでも動作し、思い描いたデザインを実現できる」手段が「Flash」でした。

Flash では、画像や図形、文字、音声、動画などを組み合わせ、タイムラインに沿って変化するアニメーションを組むことができ、ユーザの操作や入力を動作に反映させることもできました。
Flash の制御に使われたのが、Adobe が JavaScript を拡張したものである ActionScript でした。

Flash は Adobe が提供するプラグインソフトである「Flash Player」を組み込んだ Web ブラウザ上で動作するものです。
よって、Flash は、当時のブラウザ間の互換性の問題を解決し、デザイナが思い描いた通りのデザインを実現できる手段として利用されました。
これが、「**Flash Web Design**」の時代です。

Flash によってデザインされた Web サイトは、例えば以下のようなページに残っています。

- [Flash Websites - Web Design Museum](https://www.webdesignmuseum.org/flash-websites)
- [Beautifl - Flashのギャラリーサイト](https://beautifl.net/)
- [Japanese Flash Web Design Archives - かつての優れたFlashサイトコレクション](https://tters.jp/jfwda)

Flash の問題として、ブラウザのプラグインとして動作するため、コンテンツのレンダリングにブラウザの処理を利用できないことがありました。
つまり、Flash はブラウザと対話できないため、画面幅に応じたレイアウトやスクロールバーの出現の制御など、ブラウザが本来担うレンダリング処理の恩恵が全く受けられなかったということです。
加えて、Flash によって作られたコンテンツはセキュリティ、パフォーマンス、SEO、アクセシビリティなどの担保が難しいことも問題として露見しました。

そんな中 iPhone は、Flash をサポートしないという方針を打ち出しました。
モバイルタッチ操作と相性が悪かったり、Flash Player はモバイルデバイスのバッテリを著しく消耗させたり、脆弱性が多く、セキュリティリスクが高かったりしたことが主要な理由です。

「Thoughts on Flash」では、Appleが、Steve Jobs の記名で、Apple の Flash についての考え方を説明されています。
Flash ではなく HTML5 を推奨するといった内容で、Flash の問題点を指摘したものです。

- [Thoughts on Flash - Apple](https://web.archive.org/web/20100630153444/http://www.apple.com/hotnews/thoughts-on-flash/)

HTML5 などの Web 技術が発展し、動画の再生やアニメーションの作成など Flash Player でしか実現できなかった機能が、Flash を利用せずに実現できるようになったことで、Web 標準に基づいた開発の重要性が広く認識され始めました。

そして、やはり Web Design は "Web" を使ってなされるべきだという考え方に収束していきます。

### Float Web Design

そこで Table の次に注目された Web 標準機能が CSS Float でした。

Float は本来、画像の周りにテキストを回り込ませるための機能です。
しかし、当時の CSS にはレイアウトのための専用機能が存在しなかったため、この Float を「hack」として転用し、ページ全体のレイアウトを構築する手法が考えられました。

Float によるレイアウトには、大きく分けて「Fluid」と「Fixed」の 2つのアプローチが存在しました。

#### Fluid Layout with Float

パーセンテージベースの「Fluid Layout」は、 Web の本質的な特性である「流動性」を尊重しようとする試みでした。

```css
.container {
  width: 100%;
}
.sidebar {
  float: left;
  width: 45%; /* container 内コンテンツ合計で 100% 以内になるよう指定する */
}
.main-content {
  float: right;
  width: 45%; /* container 内コンテンツ合計で 100% 以内になるよう指定する */
}
```

Fluid Layout の利点は、様々な画面サイズに柔軟に対応できることでした。
コンテンツは利用可能な幅に応じて流動的に調整されます。

しかし、実際にはデザイン上の課題が多く残る手法でもありました。

- 大きな画面では行長が極端に長くなり、読みづらくなる
- 固定サイズの画像がレイアウトを破壊する可能性がある
- 画面サイズによって見た目が大きく変わってしまう

Jen Simmons も当時を振り返り、次のように述べています。

> So a lot of people were advocating very hard that fluid web design was the core essence of the web, and that's how we should be doing it.
> But there were a lot of other people who were saying—and I was one of these people—**it's ugly**.
>
> Jen Simmons [An Event Apart video - YouTube](https://www.youtube.com/watch?v=jBwBACbRuGY)

#### Fixed Layout with Float

Fluid Layout の課題を受けて、「Fixed-Width Layout」、という選択肢が登場します。
これは、ピクセル単位で幅を固定することで、その範囲で思い描いた Float Web Design を実現しようとするものです。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="azvYRGv" data-pen-title="Fixed-Width Layout" data-user="sakupi01" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakupi01/pen/azvYRGv">
  Fixed-Width Layout</a> by saku (<a href="https://codepen.io/sakupi01">@sakupi01</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

しかし、Fixed-Width Layout 上でのデザインでは、小さな画面では横スクロールが発生し、大きな画面では不自然な余白が生まれ、多様なデバイスに対応できないという問題がありました。

### Responsive Web Design

2010年に Ethan Marcotte が提唱した「[Responsive Web Design](https://alistapart.com/article/responsive-web-design/) は、「Fluid vs Fixed」の論争に終止符を打ち、マルチデバイスにサイトを対応させるための解決策となるものでした。

Responsive Web Design は3つの技術要素から構成されます。

1. **Flexible Grid**: パーセンテージベースの流動的なグリッドシステム
2. **Flexible Images**: コンテナに合わせて伸縮する画像とメディア
3. **Media Queries**: ブレークポイントでレイアウトを切り替える仕組み

Responsive Web Design は、モバイルデバイスの急速な普及という時代背景にマッチし、「One Web」という理念のもと、単一のコードベースであらゆるデバイスに対応できる手法として広く採用されました。

### Limitation of Responsive & Dependency to Framework

しかし、Responsive Web Design も万能ではありませんでした。
Float を使った複雑なレイアウトは脆弱で、少しの変更でレイアウト全体が崩れる可能性があったからです。

この危険性に対して、 Bootstrap や Foundation といった CSS Framework で、レイアウトのルールを握る手段が生まれました。
Framework は安定したレイアウトシステムを提供しましたが、同時に Web サイトが画一的に見えてしまうという問題も生むことになりました。

さらに、Responsive Web Design の実装において、基本的にデザイナは 3つの静的なカンプ（Mobile/Tablet/Desktop）を作成し、開発者がその間を Media Query で補間するという作業フローが定着しました。
これは **「離散的」なアプローチ**であり、「連続的」に変化する画面サイズに対して、段階的な対応しかできませんでした。

### Thoughts of Web Design has been changing in between...

ここまでの歴史を振り返ると、デザインと Web というメディア間の進化のせめぎ合いで、Web Design の思想転換が起こってきたことがわかります。

**1. グラフィックデザインの理想**

- ピクセルパーフェクトな表現
- 印刷物のような精密なコントロール
- デザイナの意図を100%再現

**2. Web メディアの制約と特性**

- デバイス、ViewPort、設定、etc の多様性
- 互換性
- アクセシビリティとセマンティクス
- パフォーマンスと SEO

Table Layout 時代は、グラフィックデザインの理想を Table のセル構造で実現しようとしました。
Flash 時代は、Web の制約から完全に逃れることでデザインの理想を追求しました。
Float Layout 時代は、CSS の hack を駆使して Fluid と Fixed 両者の妥協点を探りました。
Responsive Web Design 時代は、Web の多様性を受け入れつつ、段階的な適応でデザインの一貫性を保とうとしました。

つまり、「**アートとしてのデザイン**」と「**Web というメディアとしてのデザイン**」の交差の中で、Web Design の思想転換が起こってきたのです。

## Appendix

- [Transcript: Intrinsic Web Design with Jen Simmons – The Big Web Show](https://zeldman.com/2018/05/02/transcript-intrinsic-web-design-with-jen-simmons-the-big-web-show/)
- [328: Jen Simmons on Intrinsic Web Design - ShopTalk](https://shoptalkshow.com/328-jen-simmons-intrinsic-web-design/)
- [Patterns Day: Jen Simmons - adactio](https://adactio.com/journal/14889)
- [The ideal viewport doesn't exist](https://viewports.fyi/)
- [Five years of Figma](https://www.figma.com/five-years-of-figma/)
- [Adobe Flash](https://developer.mozilla.org/ja/docs/Glossary/Adobe_Flash)
- [Flash Tutorial: Create A Simple Flash Website -HD- - YouTube](https://www.youtube.com/watch?v=vqKIwTF2Zk4)
- [How to Program in Flash (Basic Actionscript 2.0): 10 Steps](https://www.wikihow.tech/Program-in-Flash-%28Basic-Actionscript-2.0%29)

---

<advent-calendar-2025 />
