---
title: "🎨 CSS Advent Calendar: Day 5 / Cascade for Cascading Style Sheets - Behind the Scenes"
excerpt: "CSS Advent Calendar Day 5"
date: 2025-08-05
update: 2025-08-05
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 5 日目の記事です。
:::

今回はいよいよ "CSS" の Cascade についてです。

CSS は CHSS を前身として、Hakon Wium Lie と Bert Bos によって 1995 年に提案されました。提案最初の Editors Draft は以下とされています。

- [Cascading Style Sheets: a draft specification](https://www.w3.org/Style/CSS/draft1.html)

最初の Working Draft (First Public Working Draft) は同年の後半に公開されています。

- [Cascading Style Sheets, level 1](https://www.w3.org/TR/WD-css1-951117.html)

そして、以下が CSS1 の最終形態で 1996年12月に、W3C の Recommendation として勧告されたものです。

- [Cascading Style Sheets, level 1](https://www.w3.org/TR/CSS1/)

今回は、この最終形態の CSS1 の仕様をもとに、Cascade の裏側を解釈してみようと思います。

## The Cascade

「単一のスタイルシートがプレゼンテーションに「Influence」すること以上に、「複数のスタイルシートが相互に影響して「Influence」するために、なぜ『Cascade』という方法論である必要があるのか」ということを、CSS の仕様では、**「Modularity」** と **「Balance」** に分けて説明しています。

## Modularity for the Cascade

Modularity が可能にすることは、「スタイルシートの統合による、冗長性の排除」です。
`@import` を使うことで、別のスタイルシートの内容を継承して取り込む以下の記法のことです。

```css
@import url(http://www.style.org/punk);
@import url(http://www.style.org/funk);

H1 { color: red }     /* override imported sheets */
```

ただし、競合が発生した場合、`@import` されたスタイルシートの優先度は、`@import` 元のスタイルシートの優先度よりも低くなるというのも考慮されています。

CHSS でも、「LINK のスタイルシートは読み込み順に優先度が決まる」という記述がありましたが、`@import` はその延長線上の考え方です。

## Balance

Modularity は「同一オリジンでのスタイルシートの統合」の話でしたが、Balance は基本的に「異なるオリジンでのスタイルシートの統合」の話です。

オリジンの種別としては、この時点では２種類が触れられています。「User」 と 「Author」 です。User は、Web ページを閲覧する人（読者）、Author は、Web ページを作成する人（開発者）を指します。

User と Author という異なるオリジンから、同じ場所にスタイルを Influence 可能にするとなると、どちらも同じスタイルシート言語を使うことが妥当になります。

> both readers and authors can influence the presentation through style sheets. To do so, they use the same style sheet language thus reflecting the philosophy of the web: everyone can become a publisher.
>
> [Cascading Style Sheets, level 1](https://www.w3.org/TR/WD-css1-951117.html#cascade)

そうした時に、User/Author 間で競合が起きた場合はどうするかを考える必要があります。

> Conflict resolution is **based on each style declaration having a weight**. By **default, the weights of the reader's declarations is less that the weights of declarations in incoming documents**. I.e., if there are conflicts between the style sheets of an incoming document and the reader's personal sheets, the incoming declarations will be used.

デフォルトでは、User スタイルシートの優先度は、Author スタイルシートの優先度よりも低くなるように設定されます。その上で、Author オリジンではスタイルシートのロード順（`@import`の親から順、`<LINK>` のロード順）に優先度が高くなります。この「デフォルトでは User < Author スタイル」の考え方も CHSS と同じです。

### `!important`

ただし、CHSS になかったものとして、`!important` キーワードが導入されました。

```css
H1 { color: black ! important; background: white ! important }
P  { font-size: 12pt ! important; font-style: italic }
```

`!important` を用いると、その宣言の優先度を上げることができます。

:::.note{.memo}

FUN FACT: The `!legal` keyword

最初の CSS1 の Editors Draft では、`!important` と合わせて `!legal` というキーワードが提案されていました。

[Cascading Style Sheets: a draft specification](https://www.w3.org/Style/CSS/draft1.html)

```css
P  { font-size: 12pt ! legal "IATA regulations" }
```

`!legal "some comment"` は、「このスタイルが法的な理由を持つ」ことを示すキーワードです。`!legal` は、「法的に有効なスタイル」を指定するためのものです。
`!legal` とすることで、そのスタイルが法的な理由を持つスタイルであることを示し、適切なコメントをつけるというものです。

これは基本的に Author が UA に対して suggest するもので、`!legal` のスタイルが適用されていない場合（UA にスタイル能力がなかったり、ユーザがスタイルシートの適用を無効にしている場合など）は、UA がユーザに警告を出すことが想定されていました。

:::

CHSS では、これをパーセンテージで「どの程度影響力があるか」を表現していましたが、CSS1 では `!important` を用いて、「**どちらの方が**影響力があるか」という 0/100 で影響力を表現するようになります。「最終的には単一の宣言のみしか採用されない」ということを考えると、パーセンテージで範囲を持つ意味はなかったのです。

この `!important` のオリジン間での優先度に関しては、以下のような記述があります。

> A reader rule with an important declaration will override an author rule with a normal declaration. **An author rule with an important declaration will override a reader rule with an important declaration.**

「Author `!important` が User `!important` よりも優先される」

この先に勧告される CSS2 の Working Draft でも、この定義は変更されていませんでした。

- [Assigning property values, Cascading, and Inheritance](https://www.w3.org/TR/1998/WD-css2-19980128/cascade.html#important-rules)

## I am `!important` ! Please DO NOT override me

しかし、1998年に勧告された CSS2 の Proposed Recommendation で、この定義に関して劇的な見直しが行われることになります。

- [Cascading Style Sheets, Level 2](https://www.w3.org/TR/1998/PR-CSS2-19980324/)

> CSS attempts to **create a balance of power** between author and user style sheets.

> ... **for balance**, an "!important" declaration (the keywords "!" and "important" follow the declaration) takes precedence over a normal declaration. Both author and user style sheets may contain "!important" declarations, and **user "!important" rules override author "!important" rules**.

> Note. This is **a semantic change** since CSS1. In CSS1, **author "!important" rules took precedence over user "!important" rules.**
> [Assigning property values, Cascading, and Inheritance](https://www.w3.org/TR/1998/PR-CSS2-19980324/cascade.html#important-rules)

この記事を読んでいる人であればご存知だと思いますが、これが現在の Cascade の形です。

CSS1, CSS2 の Working Draft まで、 「Author `!important` が User `!important` よりも優先される」という定義でしたが、CSS2 の Proposed Recommendation を以て、この順序が変更されました。
「User `!important` が Author `!important` よりも優先される」という定義は、CSS の最初から存在していたわけではなく、CSS1 最初の提案から約 3 年後に変更されたものです。

仕様にもある通り、これは単なる仕様変更ではなく、**「a semantic change」**と明記されています。
Author `!important` が User `!important` よりも優先されるという、**常に Author の権限が大きかった** 時代から、**User の権限が大きくなる** 可能性を持てるようになりました。**「a balance of power」**が User と Author の間で取れるようになったのです。

---

こうした背景を踏まえると、`!important` が Cascade においてどういう意味を持つべきとされているのかが見えてきます。

もちろん、`!important` を用いれば、同一オリジン間での優先度を上げることもでき、そういった使い方をすることもできます。例えば、拡張機能など、いかなる状況でも詳細度を上げなければどうしようもない局面においては、`!important` を用いて「最大限の影響力」を表現をするのは仕方がありません。

しかし、`!important` はあくまで「balance」を取るために導入されたものであり、non-`!important` な宣言に対しても、「balance」を取る目的で利用されることが望まれています。

> **for balance**, an "!important" declaration takes precedence over a normal declaration.

それゆえ、他の宣言を無理矢理上書きする目的で `!important` を用いることは、理念に反した使い方をしているということを承知しておきたいです。

さらに、異なるオリジンのスタイルを `!important` を用いて上書きすることにおいては、より危険な「バランスを崩す」行為だと筆者は考察しています。

そもそもなぜ「balance」が必要だったのかというと、それまでどう頑張っても User が Author よりも必ず優先される方法がなかったからです。
「User が Author よりも優先される手段」として `!important` を導入することで、User のスタイルを Author のスタイルから絶対に上書きされないように、バランスをとる。つまり、`!important` は User にとっての **「守り」の手段**です。

それゆえ、例えば Author から `!important` を用いて User の non-`!important` なスタイルを上書きすることは、本来 `!important` が「守り」の手段であることに反し、「攻め」の手段として不本意な使われ方をしていることになります。

`!important` を用いて、何かを「上書き」する場合は、仕様の想定に反した使い方をしている可能性があることを、ぜひ念頭に置いておきたいものです。

## Appendix

- [Cascading Style Sheets: a draft specification](https://www.w3.org/Style/CSS/draft1.html)
- [CSS history](https://www.w3.org/Style/CSS/history.html)
- [Thinking about style sheets](https://www.w3.org/Style/mail/kh-2-may-95.html)
