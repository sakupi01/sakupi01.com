---
title: "🎨 CSS Advent Calendar: Day 17 / Specificity Architecture is what CSS Architecture is"
excerpt: "「詳細度設計」としての「CSS アーキテクチャ」、その未来’"
date: 2025-08-17
update: 2025-08-17
category: "dev"
tags: ["web", "ui", "css", "html", "standards", "advent calendar"]
status: "published"
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 17 日目の記事です。
:::

CSS は「hints/suggestions」として Cascade と共に生まれ、「optional」な存在でありながらも、Web のビジュアルを支える技術として欠かせない存在となりました。

この柔軟な性質こそが CSS の強さであり、同時に我々が「どう CSS と向き合うか」について考えを広げられた源泉でもあったように思います。

## Scoping and Layering

SPA の隆盛と「アプリケーションとしての Web」が拡大していく中で、さまざまな CSS 設計方法論が考案され、Web フロントエンドエコシステム周りの対応も講じられてきました。

テンプレートエンジンにデータを埋め込むような MPA の形式から、コンポーネントという Structure と Style の最小単位に State を流し込んだものを敷き詰めて、一つのページを構築するのが、特に宣言的 UI 登場以降の Web フロントエンド開発では主流の方法となりました。

スタイルの設計においては、「コンポーネント」として捉えるアプローチから、スタイルの最小単位としては "別の捉え方" があるのではないか、という「ユーティリティファースト」のような視点まで、多様な思想が生まれました。

コンポーネントベースやユーティリティベースなど、スタイルの最小単位に粒度はあるものの、「ページ」を前提として設計されてきた CSS の影響範囲を、要はどう **「スコーピング」** すべきかという共通項を持って、思想や時代にあった解決策が提示されてきました。

また、Reset や Normalize、デザイントークン、サードパーティのライブラリなど、「プロジェクト全体」として共通で握っておきたいスタイルの多様化に伴い、
汎用性が低いものから順に積み上げていくという **「Author Origin 全体のレイヤリング」** という手法も確立されました。

"敷き詰め" のための「スコーピング」と "積み上げ" のための「レイヤリング」は、宣言的 UI 時代の Web アプリケーション構築を支える重要な設計論として成熟し、もはやこれら無くして CSS を書くということは日頃の開発において考えられなくなっているのではないでしょうか。

## Specificity Architecture is what CSS Architecture is

「スコーピング」と「レイヤリング」を扱う中で、これまでに説明してきた方法論を俯瞰すると、我々は一貫して **「詳細度」** の議論をしてきたように思います。

「スコーピング」に関しては、OOCSS や BEM、CSS Modules や 無数の CSS in JS、ユーティリティファーストなどのアプローチが存在してきました。
思想や方法は違いますが、同じ詳細度になるよう「Class/Attribute セレクタ」でスコーピングする手法を巡ってきたことに変わりありません。

Shadow DOM など標準側での手法も存在はしはしますが、import や [adopt](https://web.dev/articles/constructable-stylesheets) しない限り、内部のスタイルは外部グローバルスタイルを参照できません。
ShadowDOM-WebComponents を使うと Cascade から eject されたような感覚になるのは、Shadow DOM の強力なカプセル化の特性によるものです。
[Day16](https://blog.sakupi01.com/dev/articles/2025-css-advent-16) で触れたよう、スタイル共有手法など、Web Components 周りは現在進行形でなされている議論が多く、
これまでに Shadow DOM によるカプセル化が現場に普及した実感はあまりありませんでした。

ITCSS に代表される「レイヤリング」に関しても、`@import` の順序はもとより、ユニバーサルセレクタに指定するのか、要素レベルに指定するのか、「Class/Attribute セレクタ」を使って優先度をどう管理するのかなど、詳細度を意識した設計が根底にありました。

---

こうしてみると、我々が扱ってきたのは、「詳細度」の中でも Reusable で Customizable な **「Class/Attribute セレクタ」** だけだったことに気づかされます。

つまり、ここ十数年の CSS 設計の根源はずっと **Class/Attribute セレクタ** にあり、「CSS 設計の方法論」is **「どのようにして Class/Attribute セレクタと関わるべきか」** として語られてきました。

そしてこの間に、「詳細度」を駆使しながら、エコシステムが時間をかけてゆっくりと成熟・定着させてきた CSS 設計のプラクティスは主に以下でしょう。

- Component で影響範囲を最小限に保って開発したい
- 他との衝突を防ぐため、各詳細度はできるだけ一定に・低く保ちたい
- グローバルなスタイル、特に Utility Class/変数、サードパーティのスタイルを括り、コントロールしたい

[Day3](https://blog.sakupi01.com/dev/articles/2025-css-advent-3) でも触れたように、CSS は 「Cascade」 とともに生まれ、
hints であり suggestions であり balance をとるという特性を軸に考えられてきました。

ただ、我々がアプリ時代の Web を開発する上で求めていたプラクティスを満たすには、Cascade のなかで最も柔軟な「詳細度」で太刀打ちしてきたのがこれまででした。

Web がアプリとしての特性をもち始めたときから、時代の変化とともにプラクティスがアップデートされていくうちに、本来 CSS が特性として持っていた「Cascade」の一部、「詳細度」に重心が乗る構図になりました。

そして、自分以外の誰か/エコシステムとコラボレーションした「Collaborative Web」な開発が一般化するにおいて、上のプラクティスを「詳細度」だけで抱えるには荷が重すぎるようになりました。

我々が CSS -- Cascade をうまく "扱えてこなかった" のではなく、CSS も Cascade を扱うための機能を提供してこなかったわけでもありません。

「ユースケースの変化」に対する ”現状” が ”扱いづらさ” として各ターニングポイントで露見し、最終的に「苦悩の結果」として**次につながる種**を生んできたひとつの例が、
「CSS 詳細度コントロール時代」だったのだと思います。

## Cascade should be lit up, now

ユースケースは変化し、我々の CSS プラクティスは「詳細度」で語り尽くせなくなりました。

ただっ広い「Cascade」の一部である「詳細度」に留まらず、CSS の根幹である「Cascade」を活かしつつ、我々の今のプラクティスを満たすための手段が必要です。

こうした背景を踏まえて、Miriam Suzanne が提唱したのが、[Custom Origins](https://github.com/w3c/csswg-drafts/issues/4470)（のちの Cascade Layers）と、[CSS Scope](https://css.oddbird.net/scope/explainer/) でした。

---

<advent-calendar-2025 />
