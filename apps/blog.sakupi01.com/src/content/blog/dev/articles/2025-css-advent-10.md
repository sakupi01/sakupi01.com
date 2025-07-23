---
title: "🎨 CSS Advent Calendar: Day 10 / Interoperability in CSS, &c."
excerpt: "CSS Advent Calendar Day 10"
date: 2025-08-10
update: 2025-08-10
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 10 日目の記事です。
:::

CSS エコシステム動向における手始めとして、ブラウザ/ブラウザベンダの動向をみていきます。

Web で最初の標準化団体である W3C が発足したのは 1994年10月で、CHSS が提案されたのも同年の 10月。W3C が発足した当初は、まだまだ標準化団体としての影響力が弱く、ベンダが実装を試行錯誤せずを得なかったのも頷ける時期です。

歴とした”標準”やガイドラインがない中、各ベンダは牧歌的な機能実装を繰り返していたといえます。結果として、UA Style を含め、互換性をよそに機能開発が優先され、俗にいう「ブラウザ戦争」の時代につながります。

## The Browser Wars, Standards Emergence

ブラウザ戦争に関しては、 [🎄Open UI Advent Calendar: Day 4 / Customizable Select Element Ep.2](https://blog.sakupi01.com/dev/articles/2024-openui-advent-4) でも述べましたが、「MS の IE」 vs 「Netscape Communications の NN (Netscape Navigator)」 という構図で機能実装の競争が激化した出来事です。当時のメジャーなベンダが独自解釈で仕様を実装に移した結果、開発に支障をきたすほど一貫性の問題が顕著に現れました。

ここで発足したのが [WaSP（Web Standards Project）](https://www.webstandards.org/) で、W3C の仕様を推奨事項ではなく「標準」として位置付け、仕様に準拠したブラウザの開発が各社に働きかけられました。
WaSP の活動の影響も相まって、2001年近辺には IE vs NN のブラウザ戦争は終結したと言われています。仕様が「推奨」ではなく「標準」としての立ち位置を取れるようになったのは、2000年台に入ってやっとのことでした。

とはいえ、この後も IE、NN を OSS 化した Firefox、Opera、Safari、Chrome といったブラウザが群雄割拠し、主導権を巡って混迷を極めた時代が続きます。

## Vendor Prefixes

この頃に誕生したのが、ベンダプレフィクスです。

試験的に非標準な CSS や JS API に各ブラウザの接頭辞をつけて実装することで、標準化が進むまでの間、各ブラウザの実験的な実装を可能にするものです。実験的に提供する機能に `**-moz-**transition` や `**moz**RequestAnimationFrame` などとすることで、理論上は Author 側コードを壊すことなく、新しい機能の取り入れが可能です。好き勝手独自機能として実装していた時代からは一定進歩したと言えるのかもしれません。

しかし、実験的な提供が目的でであったにも関わらず、ベンダプレフィクスは開発者間で根強く普及してしまいます。

実験としての意味を失い、標準化が進むまでの間に、非標準の書き方のみが広く普及してしまうと、最終的に標準化された記法を導入してもらうことが困難になるという、ベンダにとっては自分で自分の首を絞めるような結果を招くことになりました。

標準化団体としても、ベンダプレフィクスの乱用を防ぐために、以下のようなガイドラインを設けるなどの取り組みを行ってはいたようですが、ベンダプレフィクスが性善説の上に成り立つ仕組みであることに変わりはありませんでした。

- [CSS Vendor Prefixes [CSS Working Group Wiki]](https://wiki.csswg.org/spec/vendor-prefixes)

こうした実験的な機能の利用を、feature flags / さまざまなビルドの提供 / Origin Trials で「**ブラウザレベルで制御**できる」という、健全な形が取れるようになったのは、つい最近のことです。
Vendor Prefix の問題点や、その解決策としての Origin Trials については、以下が参考になります。

- [Web 標準化のフィードバックサイクルを円滑にする Origin Trials について | blog.jxck.io](https://blog.jxck.io/entries/2016-09-29/vender-prefix-to-origin-trials.html)

## UA Styles

UA Style に関しても、各ブラウザがそれぞれの UA StyleSheet を持っています。これも、 Web の黎明期から今日のモダンブラウザまで、変わらず乖離し続けているものの一つです。

1989年に CERN で Tim が World Wide Web を提案してから、CHSS が 1994年に提案されるまでに、すでに複数のブラウザが誕生していました。
例えば、1990年に登場し、世界で初めてパブリックからのアクセスが可能になったブラウザである line-mode browser は、以下のような見た目を持っていました。スタイル言語が存在しない時代ながらも、パラグラフ間に間隔があったり、文字が緑だったり、マージンがあったりします。

![line-mode browser](../../../../assets/images/line-mode.png)

このように、スタイル言語の登場以前にも、すでにそれぞれのブラウザがそれぞれのデフォルトスタイルを持ってページを表示していました。

ただし、Author が意図的にスタイルを適用することはこの時点ではできなかったため、 CHSS/CSS が登場し、Author スタイルを適用できるようになったことは、これまでに説明してきた通りです。

とはいえ、「標準」を機能させる基盤が整っていない状況の中、ブラウザ戦争が起こり、モダンブラウザが登場し、そこで UA StyleSheet がCSS として初めて定義されたのは CSS2 の仕様からでした。

- [Cascading Style Sheets (CSS) Level 2](https://drafts.csswg.org/css2/#html-stylesheet)

その間、ブラウザは独自の UA StyleSheet を持ち続け、Author はそれに依存してスタイルを適用してきました。Day8 でもみたように、UA StyleSheet は、生の HTML ページの見た目を想像以上に整えている重要なスタイルシートです。
標準が影響を持つ以前に、ブラウザは増え、広く普及しました。そのデフォルトの見た目に最も影響を与えるスタイルを統一したいという思いはずっと根底に存在していますが、完璧に均すには、リスクが大きすぎる状況になっていました。

今では推奨される [UA StyleSheet](https://html.spec.whatwg.org/multipage/rendering.html#rendering) が HTML Living Standard に定義されて、W3C や WHATWG が推奨するドラフトも「仕様」として機能するまでには至ってます。

しかしそれでも、UA StyleSheet の差分は依然として存在し、ブラウザ間で一貫した見た目にするための様々な”ハック”が存在してきました。

## Reset/Normalize/Remedy ... CSS

### Reset CSS

2006年に Eric Meyer によって発表された Reset CSS の思想は、UA StyleSheet の差分の影響を受けないよう、全ての UA スタイルをリセットするという手法です。これは、今後登場する多くの Reset 系 スタイルシート に影響を及ぼすものとなります。

- [Reset Reasoning – Eric’s Archived Thoughts](https://meyerweb.com/eric/thoughts/2007/04/18/reset-reasoning/)

> with a “reset” style sheet, we can make that default look more consistent across browsers, and thus spend less time fighting with browser defaults.

Reset CSS はブラウザ間の差分をなくすことを前提としつつ、`<strong>` や `<em>` など、**全ての** HTML 要素に対して UA Style をリセットするという、少々 Opinionated な思想を含んだものでした。

> There’s another reason **I want** to reset a whole lot of styles on a whole lot of elements.  Not only do **I want** to strip off the padding and margins, but **I also want** all elements to have a consistent font size, weight, style, and family.  Yes, **I want** to remove the boldfacing from headings and strong elements; **I want** to un-italicize em and cite elements.
>
> **I want** all this because I don’t want to take style effects for granted.

現在では、全ての UA Style をリセットせずとも、「Opinionated なアプローチをとりながら均す」ようなスタイルシートを、俗に「Reset CSS」と呼ぶ傾向にあります。

- Examples of Reset CSS
  - [CSS Tools: Reset CSS](https://meyerweb.com/eric/tools/css/reset/)
  - [Tantek’s CSS Reset Undohtml](https://tantek.com/log/2004/undohtml.css)
  - [HTML5 Reset Stylesheet | HTML5 Doctor](https://html5doctor.com/html-5-reset-stylesheet/)
  - [YUI 2: Reset CSS](https://yui.github.io/yui2/docs/yui_2.9.0_full/reset/)
  - [Reboot · Bootstrap](https://getbootstrap.com/docs/4.0/content/reboot/)
  - [sanitize.css](https://csstools.github.io/sanitize.css/)
  - [Formalize CSS](https://formalize.me/)
  - [Preflight - Base styles - Tailwind CSS](https://tailwindcss.com/docs/preflight)
  - ...

初期 Reset CSS のように「全てをリセットする」というアプローチは、今でいう `all: initial;` に近い考え方です。 UA StyleSheet の差分が顕著な時代は有効でしたが、UA StyleSheet の差分が次第に小さくなってくると、「全てをリセットする」ことは、むしろ Author がする際の負担になるようになりました。

### Normalize CSS

Normalize CSS は、ブラウザ間のデフォルトスタイルの差分を解消し、より一貫性のあるスタイルを提供することを目的としたスタイルシートです。

Reset CSS が全てのスタイルをリセットするのに対し、Normalize CSS は各要素のデフォルトスタイルをできるだけ保持しつつ、ブラウザ間の差分を調整するのが主な目的です。

- Examples of Normalize CSS
  - [Normalize.css](https://necolas.github.io/normalize.css/)
  - [sindresorhus/modern-normalize: 🐒 Normalize browsers' default style](https://github.com/sindresorhus/modern-normalize)

nicolas Normalize の後継として出てきた modern-normalize をみると、Normalize する行数がかなり減っているのがわかります。

### CSS Remedy

Reset や Normalize とはすこし毛色の違うものとして、CSS Remedy があります。

Jen Shimmons をはじめ、CSSWG のメンバーが中心となって「今 UA StyleSheet の技術負債解消するとしたら、こういうスタイルシートになるよね」というモチベーションで作られたものです。

- [jensimmons/cssremedy: Start your project with a remedy for the technical debt of CSS.](https://github.com/jensimmons/cssremedy)

ブラウザ間での CSS 実装に一貫性持てたとしても、「それが**ベストプラクティスで**一貫しているとは限らない」ですが、今から UA StyleSheet をベストプラクティスで大統一しようものなら、多大な影響を与えてしまいます。
そのため、CSS Remedy は、「CSSWG 的なベストプラクティスに則った UA Style を Author 判断で利用可能にする」ための手段として考案され始めました。

全てではないですが、現在の UA スタイル には、Mosaic など過去に栄冠を得たブラウザの UA StyleSheet の影響を強く受けているものがあります。これまでの CSS 仕様や現在の HTML Living Standard が推奨する [`body { margin: 8px;}`](https://html.spec.whatwg.org/multipage/rendering.html#rendering:~:text=then%20a%20default%20value%20of%208px%20is%20expected%20to%20be%20used%20for%20that%20property%20instead.) なんかはその顕著な例で、そこには「Mosaic がそうだったから」以外の何の理由もないことが知られています。

そうした「過去を引き継いだ以外の理由がないスタイル」ではなく、現在のベストプラクティスに則った UA Style を再定義することを目的としています。

> ‘Because that’s what Mosaic did’ is exactly the kind of reasoning CSS Remedy is trying to leave behind.
>
> ---Eric Meyer

:::note{.info}

Incomplete List of Mistakes in the Design of CSS

UA StyleSheet よりも広いスコープですが、”CSS の技術的負債” をまとめた WG Wiki も存在します。

- [Incomplete List of Mistakes in the Design of CSS [CSS Working Group Wiki]](https://wiki.csswg.org/ideas/mistakes)

:::

---

過去のブラウザの”技術的負債”から重ねられてきた試行錯誤は、多くあります。

結果として”技術的負債”や”爪痕”となった「Vendor Prefix」 や 「UA StyleSheet の差分」 に対して、「初期からちゃんとベンダ間で慎重に議論を詰めておくべきだった」とか、「我先にと普及を優先しすぎだった」とか、今なら真っ当な批判はいくらでもできるかもしれません。

今は、標準が「標準」として認知され、互換性に対するさまざまな取り組みが根を張った結果、一貫した体験、より良いデザイン、機能を求めることに焦点が当てられるようになってきました。しかし、そもそもコンテンツが普及しなければ、そういう需要も生まれなかったとも考えられます。

標準の地盤も確立していなかった時代に、ベンダが実装を足踏みしていたら、テキストコンテンツであった HTML は広がり、Web はここまで試行錯誤でき、発展し得たのかということも、考えとしては持っておきたいものです。

## Appendix

- [Is Vendor Prefixing Dead? | CSS-Tricks](https://css-tricks.com/is-vendor-prefixing-dead/)
- [Unfixed – Eric’s Archived Thoughts](https://meyerweb.com/eric/thoughts/2012/02/09/unfixed/)
- [Body Margin 8px | Miriam Eric Suzanne](https://www.miriamsuzanne.com/2022/07/04/body-margin-8px/)
- [A look at CSS Resets in 2018 | bitsofcode](https://bitsofco.de/a-look-at-css-resets-in-2018/)
- [Killer Collection of CSS Resets | Perishable Press](https://perishablepress.com/a-killer-collection-of-global-css-reset-styles/)
