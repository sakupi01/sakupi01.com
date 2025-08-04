---
title: "🎨 CSS Advent Calendar: Day 4 / The Initial Cascade"
excerpt: "CSS Advent Calendar Day 4"
date: 2025-08-04
update: 2025-08-04
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---
## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 4 日目の記事です。
:::

これから数回に分けて CSS の歴史を振り返るにあたり、Cascade Layers 以前の Cascade がどんなものであったかを軽くおさらいしておきます。

その前にまず、CHSS の提案を確認しておきます。
まだ CSS に入らないのか、、、という感じですが、CHSS には Cascade 基礎となる重要な要素が盛りだくさんなので、しっかり目を通しておこうと思います。

---

1994年当時、 Web には見た目を制御する手段は存在していませんでした。そんな中、Mosaic で画像のレンダリングが可能になり、「Web が巨大な Fax Machine になってしまう」と、Håkon は強い危機感を抱いていました。

> "It was like: 'Darn, we need something quick, otherwise they're going to destroy the HTML language."
>
> [Interview with Håkon Wium Lie. The inventor of CSS explains how it…](https://medium.com/net-magazine/interview-with-h%C3%A5kon-wium-lie-f3328aeca8ed)

この切迫感から、彼がわずか 1〜2週間で書き上げたのが、CHSS の提案です。

## The Cascade in CHSS

CHSS は「Cascade のための提案」と言ってもいいほど、Cascade が主要なトピックになっています。（史上初めて Cascade が登場したプロポーザルでもあるので）

- [Cascading HTML Style Sheets -- A Proposal](https://web.archive.org/web/20231228175110/https://www.w3.org/People/howcome/p/cascade.html)

そんな世界で初めての Cascade では、User StyleSheet と `<LINK>` での外部スタイルシートが考慮されます。

> The proposed scheme supplies the brower with an ordered list (cascade) of style sheets. The user supplies the initial sheet which **may** request **total control of the presentation**, but -- more likely -- hands most of the **influence** over to the style sheets referenced in the incoming document.

> `<LINK REL="style" HREF="http://NYT.com/style">`
>
> The LINK element is used to indicate the URL of the style sheet. Multiple style sheets can be referenced from the same document, and will be appended to the cascade and merged as they are encountered.

つまり、User StyleSheet を最低レイヤーとして、その後に `<LINK>` でロードされた Author StyleSheet が順次追加される「積み重ね」の構造を作る、これが Cascade です。User StyleSheet が基盤となり、基本的には後続の Author StyleSheet が上書きする形で利用することが想定されています。

ただし、各スタイルシートの実際の影響力は、[後述する方法](#weighted-influence:~:text=このパーセンテージは、スタイルシートレベルで適用することも可能)によって調整されます。

### Weighted Influence

Cascade の次に注目したいのが「Influence」です。

初めてこのプロポーザルを見た時、以下のコードブロックを見て驚いたことを覚えています。

```css
h1.font.size = 24pt 100%
```

スタイルにパーセンテージがついている！？

パーセンテージは、そのスタイルが「どの程度の影響力を持つのか」を示します。
例えば、ここでは 100% の影響力を持つことが示されているので、同一スタイルシート内で必ず適用されるということになります。

---

異なるスタイルシート間でスタイルが競合した場合の処理についても記述があります。

ここで面白いのが、font size のような連続的な値においては、異なるスタイルシート間で競合した場合、**重み付けで平均が計算される**ということです。
例えば以下のように、`h2.font.size` は 40% の影響力を持ち、`h2.font.size` は 60% の影響力を持つとして、それぞれ異なるスタイルシートで宣言されているとします。

```css title="stylesheetA"
h2.font.size = 20pt 40%
```

```css title="stylesheetB"
h2.font.size = 24pt 60%
```

重み付けされるということは、`h2` の font size は `h2.font.size = (20pt * 40% + 24pt * 60%) / (40% + 60%)` と計算され、最終的な font size は **22.4pt** になります。

---

さらに、このパーセンテージは、スタイルシートレベルで適用することも可能です。

例えば、以下のような指定をすると、スタイルシートのロードタイミングに依らず、`stylesheetA` < `stylesheetB` というカスケードの順序になります。つまり、何も指定されていなければ、`stylesheetB` のスタイルが `stylesheetA` のスタイルを上書きできるということです。

ただし、以下のように特定のプロパティに対して順序を上書くようなパーセンテージを指定した場合は、そのプロパティ間で優先順位が調節されます。

```css
/* stylesheetA.css */
20%
h1.color = red 40%
```

```css
/* stylesheetB.css */
40%
h1.color = red 20%
```

### Specific Statements

CHSS では、現 CSS と似た形の「詳細度」も考慮されています。

```css
40%
font.family = times
h1.font.family = helvetica 100%
```

まず、このスタイルシートはデフォルトで 40% の影響力を持つことを示し、特に指定されていなければ全てのプロパティに対してその影響力が適用されます。ただし、`h1.font.family` のように、より詳細な指定をしている場合はその指定が優先されます。

:::note{.message}

Out of Cascade

<details>

<summary>Cascade 以外にも面白い特徴がいくつか含まれていたため、コラム的にいくつか取り上げます</summary>

- Environment Variables

すでに環境に応じたスタイルの適用も考慮していた点でも、CHSS は先進的でした。

```css
60% 
AGE > 3d ? background.color = pale_yellow : background.color = white
DISPLAY_HEIGHT > 30cm ? <http://NYT.com/style> : <http://LeMonde.fr/style>
```

上記のコードは、「ドキュメントが 3日以上経過している場合、背景色は淡い黄色に、それ以外の場合は白にする」「表示領域の高さが 30cm 未満の場合は NYT スタイルを、それ以外の場合は LeMonde スタイルを適用する」ことを示した条件式です。

- The speech property

視覚的なメディアだけでなく、音声出力も最初から考慮していたことも、面白い点です。

> The initial proposal is very conscious about employing properties that work on screens and on speech synthesisers, for example. Something about the volume and the personality of the voice that reads to you, those were parts of the initial proposal. We kind of saw a world coming but we didn't know exactly what it would look like."
>
> (Interview with Håkon Wium Lie)

```css
speech.*.weight = 35db
speech.em.weight = 40db
```

</details>
:::

## Backgrounds

これらの CHSS の特徴は、「可能な限り Author と User 間で **soften the tension** しよう」とした思想の如実な現れです。

特に「Influence」に関しては、MIT Media Lab での「未来のテレビ」のアイデアに触発されたものだったというインタビューがありました。
暴力性や政治的傾向で内容のコントロールをする、つまり、視聴者が「このニュース番組はもっと中立的な視点で見たい」とか「子供と一緒に見るから暴力シーンは控えめにしたい」といった調整が可能になるのでは？という考えを Cascade に応用させたというものです。（今のところそんな面白い未来にはなっていませんが・・・）

> It was inspired by an idea from the MIT Media Lab: TVs in the future would not have controls for brightness and color, but for sex and violence, or left-wing and right-wing, perhaps.
>
> [Dev.Opera — CSS: It was twenty years ago today — an interview with Håkon Wium Lie](https://web.archive.org/web/20240105013339/https://dev.opera.com/articles/css-twenty-years-hakon/)

この概念を視覚化した図まで提案に含められており、「Influence」がスライダーのように調整するものとしてイメージされていたことが伺えます。

```md
        User            Author
Font   o-----x--------------o 64%
Color  o-x------------------o 90%
Margin o-------------x------o 37%
Volume o---------x----------o 50%
```

> Here, x represents the handles of slide bars. The output of this interaction is the percentage values that are attached to the statements in the user's style sheet.
>
> [Cascading HTML Style Sheets -- A Proposal](https://www.w3.org/People/howcome/p/cascade.html)

## Why this is never happened?

この提案に鋭い批判でリプライしたのが、Bert Bos でした。彼はのちに、Håkon W Lie とともに CSS (Cascading Style Sheets) の共同設計者となる人物です。

> "The idea that two designs can be averaged to come up with an intermediate style seems utterly wrong to me. What happens when my blue-on-yellow style is combined with somebody else's yellow-on-blue? Do I get green-on-green? Or who wants to look at a page with Avant-garde titles over Helvetica[pretty normal font-family] paragraphs?"
>
> 2つのデザインを平均化して中間的なスタイルを作り出すという考えは、私には全く間違っているように思える。私の青地に黄色のスタイルが他の人の黄色地に青のスタイルと組み合わされたらどうなる？緑地に緑となるのか？奇抜なタイトルの上に Helvetica の段落が載ったページを誰が見たいと思うんだ？
>
> [WWW-Talk Oct-Dec 1994: Re: Cascading HTML style sheets -- a proposal](https://web.archive.org/web/20230925111836/https://www.w3.org/Style/History/www.eit.com/www.lists/www-talk.1994q4/0158.html)

この批判を受け、Influence は複雑すぎて採用の障壁になると Håkon 自身も認識し、最終的に CSS では削除されることになりました。

---

勘のいい方ならお気づきかもしれませんが、今回見た CHSS の提案には、CSS の Cascade に通づる要素が多分に含まれていました。

明日はいよいよ、CSS の Cascade を見ていきます。

## Appendix

- [Håkon's page](https://www.w3.org/People/howcome/)
- [Cascading HTML Style Sheets -- A Proposal](https://www.w3.org/People/howcome/p/cascade.html)
- [PhD Thesis: Cascading Style Sheets](https://www.wiumlie.no/2006/phd/#ch-problems)
- [Interview with Håkon Wium Lie. The inventor of CSS explains how it…](https://medium.com/net-magazine/interview-with-h%C3%A5kon-wium-lie-f3328aeca8ed)
- [Dev.Opera — CSS: It was twenty years ago today — an interview with Håkon Wium Lie](https://web.archive.org/web/20240105013339/https://dev.opera.com/articles/css-twenty-years-hakon/)

---

<advent-calendar-2025 />
