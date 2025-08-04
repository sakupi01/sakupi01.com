---
title: "🎨 CSS Advent Calendar: Day 17 / CSS meets npm Ecosystem - the second shot ... Component-Based CSS"
excerpt: "「詳細度設計」としての「CSS アーキテクチャ」、その未来’"
date: 2025-08-17
update: 2025-08-17
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 17 日目の記事です。
:::

## Scoping and Layering

SPA の隆盛と「アプリケーションとしての Web」が拡大していく中で、さまざまな CSS 設計方法論が考案され、Web フロントエンドエコシステム周りの対応も講じられてきました。

テンプレートエンジンにデータを埋め込むような MPA の形式から、コンポーネントという Structure と Style の最小単位に State を流し込んだものを敷き詰めて、一つのページを構築するのが、特に宣言的 UI 登場以降の Web フロントエンド開発では主流の方法となりました。

Style に至っては、「コンポーネント」として捉えて設計するのか、スタイルの最小単位としては "別の捉え方" があるのではないか、といったトピックも物議を醸してきました。

コンポーネントベースやユーティリティベースなど、スタイルの最小単位に粒度はあるものの、「ページ」を前提として設計されてきた CSS の影響範囲を、要はどう **「スコーピング」** すべきかという共通項を持って試行錯誤がなされてきました。

また、Reset や Normalize、デザイントークン、サードパーティのライブラリなど、「プロジェクト全体」として共通で握っておきたいスタイルも多様化したため、
汎用性が低いものから順に積み上げていくという **「Author Origin 全体のレイヤリング」** も無視できないものになりました。

CSS の設計だけに焦点を当てると、"敷き詰め" のための「スコーピング」と "積み上げ" のための「レイヤリング」によって、宣言的 UI の Web アプリケーションは構築されてきました。

## Specificity Architecture is what CSS Architecture is

「スコーピング」と「レイヤリング」を扱う中で、これまでに説明してきた方法論を俯瞰すると、我々は一貫して **「詳細度」** の議論をしてきたように思います。

「スコーピング」に関しては、OOCSS や BEM、CSS Modules や 無数の CSS in JS、ユーティリティファーストなどのアプローチが存在してきました。思想や方法は違いますが、同じ詳細度になるよう「Class/Attribute セレクタ」でスコーピングする手法を巡ってきたことに変わりありません。

Shadow DOM や iframe など標準側での手法も存在はしはしますが、グローバルスタイルの継承すらできなくなるなど、コンポーネントスタイルのスコーピングをするためだけには少々 Extreme であり、現場に普及した実感はあまりありませんでした。

ITCSS に代表される「レイヤリング」に関しても、`@import` の順序はもとより、ユニバーサルセレクタに指定するのか、要素レベルに指定するのか、「Class/Attribute セレクタ」を使って優先度をどう管理するのかなど、詳細度を意識した設計が根底にありました。

こうしてみると、「詳細度」どころか、我々が扱ってきたのは、カスケードの中でも実質 **「Class/Attribute セレクタ」** だけだったことに気づきます。

詳細度を決定する要素は、「`#ID`」「Element Type」「ユニバーサルセレクタ（`*`）」が他にありますが、Reusable で Customizable なのは、実質 **Class/Attribute セレクタ** だけであるため、我々はそれをベースにした「方法論」を唱えるしかありませんでした。

CSS 設計の根源はずっと **Class/Attribute セレクタ** にあり、「CSS 設計の方法論」is **「どのようにして Class/Attribute セレクタと関わるべきか」** として語られてきました。

[Day3](https://blog.sakupi01.com/dev/articles/2025-css-advent-3) でも触れたように、CSS の根幹は Cascade の体現するところが大きいです。
しかし、CSS は Cascade という仕組みを Author が十分に利活用できる形で提供していませんでした。
それどころか、Author 側が Reusable で Customizable な CSS を設計するには、**詳細度以外の選択肢がほとんどありません**でした。

そしてここに、Day3 の末尾で触れた CSS の「扱いづらさ」や「苦悩の結果」の正体があると、筆者は考えています。

我々が CSS -- Cascade をうまく "扱えてこなかった" のではなく、異常なほど「扱う術が限られていた」ことのほうが、「苦悩の結果」として成された「CSS 詳細度コントロール時代」の本質として、ウェイトを占めているのだと思います。

## We've been mostly untouching Cascade for the whole time

CSS の根幹を為すただっ広い「Cascade」の中で、なぜ「詳細度」の中の「Class/Attribute セレクタ」しか扱えないのか。
他にもっと何かないのか......

こうした背景を踏まえて、Miriam Suzanne が提唱したのが、[Custom Origins](https://github.com/w3c/csswg-drafts/issues/4470)（のちの Cascade Layers）と、[CSS Scope](https://css.oddbird.net/scope/explainer/) でした。

---

<advent-calendar-2025 />
