---
title: "🎨 CSS Advent Calendar: Day 8 / Basics of Style Resolution"
excerpt: "何重ものフィルタリングと計算処理を経て、適用されるスタイルが決定するまでの仕組み"
date: 2025-08-08
update: 2025-08-08
category: "dev"
tags: ["web", "ui", "css", "html", "standards", "advent calendar"]
status: "published"
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 8 日目の記事です。
:::

前回までで、Level4 時点での Cascade について一通り解説してきました。

今日からは、一旦 Cascade から離れ、 CSS の基本処理について見ていきます。

ここでは、今後の内容に直結する実際にレンダリングエンジンで CSS がどのように処理されるのか、最低限の範囲を確認しておく温度感で進めます。

実際にレンダリングエンジンで CSS がどのように処理されるのかの中でも、特に「Style Resolution」にフォーカスするため、Layout や Paint などのレンダリングの過程は、今回は割愛します。

## Style Resolution

document 内の各要素に対して、ブラウザはその要素に適用される**すべての CSS プロパティ**に値を割り当てます。たった1つの `<h1>` でも 638 個 の CSS プロパティ（2025/07/19 時点：[Current Property Names](https://www.w3.org/Style/CSS/all-properties.en.html)）が当たっており、何かしらの値を持っています。

ここで導出される「何かしらの値」は Filtering、 Cascading、Defaulting といった、 Style Resolution の一連の結果です。

:::note{.info}

📝 用語の整理

普段曖昧になってしまいがちな用語について、あらかじめ確認しておきます。

- **Style Sheet**: Style Sheet は、 Style Rule の集合から構成されます。
- **[Style Rule](https://www.w3.org/TR/css-syntax-3/#style-rule)**: Selector List の後に波括弧（`{}`）で囲まれたブロックが続き、中に Style Declaration が包含される規則。例えば以下は、典型的な Style Rule です。（"Rule" というと、 Style Rule のほかに [At-rules](https://www.w3.org/TR/css-syntax-3/#at-rules) や [@charset Rule](https://www.w3.org/TR/css-syntax-3/#charset-rule) も存在します。）

```css
/* Style Rule */
p > a {
  color: blue; /* Declaration = Name (Property): Value; */
  text-decoration: underline; /* Declaration = Name (Property): Value; */
}

/* At-rule */
@font-face {
  font-family: "MyFont"; /* Declaration = Name (Descriptor): Value; */
  src: url("myfont.woff2") format("woff2"); /* Declaration = Name (Descriptor): Value; */
}
```

- **[Style Declaration](https://www.w3.org/TR/css-syntax-3/#declaration)（宣言）**: 「**Name**」の後にコロン（`:`）が続き、「**Value**」が続く形式のもの。セミコロン（`;`）で区切られる。上記の例だと、波括弧中一行一行 が Style Declaration に該当します。Style Declaration は、Property Declaration と Descriptor Declaration に 2 分されます。
  - **[Property](https://www.w3.org/TR/css-cascade-5/#css-property)（プロパティ）**: Declaration のなかでも、Style Rule における Declaration。上記の例だと、`color: blue;` や `text-decoration: underline;` が Property に該当します。
  - **[Descriptor](https://www.w3.org/TR/css-syntax-3/#css-descriptor)（記述子）**: Declaration のなかでも、At-rule における Declaration。上記の例だと、`font-family: 'MyFont';` や `src: url('myfont.woff2') format('woff2');` が Descriptor に該当します。
  - [GOOD TO KNOW!] どちらも同様の構文（Name + `:` + Value + `;`）で宣言される構文構造で混同しやすいですが、**「適用対象」と「出現する文脈」が異なります**。 Property は直接**要素に**スタイルを適用するのに対し、Descriptor は At-rules で定義される「何か」（font の定義など）を記述します。直接要素にスタイルを適用するorしないが異なるので、区別されます。
- **Value（値）**: Name に対して指定される具体的な値。上記の例だと、`blue`、 `underline`、`'MyFont'` や `url('myfont.woff2')  format('woff2')` が Value に該当します。

この辺りは普段書くとき気にしないことが多いかと思いますが、仕様を読んでいると明確に記述が異なるので、知っておくと面白いかもしれません。
今回は仕様に沿って説明していく上で、これらの用語を使っていくと思うので、あらかじめ確認しておきました。

[W3C Process Document](https://www.w3.org/policies/process/#RecsCR)

:::

```html
<div class="card">
  <h2>タイトル</h2>
</div>
```

```css
/* UA Stylesheet */
h2 {
  font-size: 1.5em;
  margin: 0.83em 0;
  color: CanvasText;
}

/* Author Stylesheet */
.card h2 {
  colr: blue; /* typo */
  font-size: 24px;
  margin-top: 16px;
}

h2 {
  color: red;
  font-weight: bold;
}
```

この `<h2>` 要素に対して、ブラウザは Filtering → Cascading → Defaulting の順で処理を行い、最終的にすべてのプロパティに値を決定します。以下のセクションで、この例を使って各段階を見ていきます。

### Filtering

**[Filtering](https://www.w3.org/TR/css-cascade-4/#filtering)** とは、CSS 仕様上の「CSS 文法上の誤りがあるものを排除する」ことを、主たる目的とする過程です。

ブラウザの実装では、パーサがトークンを読み進める段階で、プロパティ名の検証、値の妥当性チェックなどを行います。例えば、Chromium では [CSS パーサ](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/parser/)が各宣言を解析する際に、[プロパティのメタデータ](https://chromium.googlesource.com/chromium/blink/+/refs/heads/main/Source/core/css/CSSProperties.in)（受け入れ可能な値の型、初期値など）と照合して妥当性を判断しています。

ここでのチェックには、known property name（文法的に正しいプロパティ名）に match するかどうかやプロパティとして正しいかどうかのほかに、「そもそも Style Sheet に入っているか」や「Style Rule に包含されているか」などのチェックもあります。要は 「CSS 的に正しいかどうか静的に確認」する処理です。その結果として、値が [declared value](#1-declared-values) として抽出され、適用外の値は **invalid at parse-time** となります。

```css
/* 有効値が declared values として残る*/

/* UA Stylesheet からの declared values */
h2 {
  font-size: 1.5em;
  margin: 0.83em 0;
  color: CanvasText;
}

/* Author Stylesheet からの declared values */
.card h2 {
  /* colr: blue;      invalid at parse-time として無視される（プロパティ名が不正） */
  font-size: 24px;
  margin-top: 16px;
}

h2 {
  color: red;
  font-weight: bold;
}
```

Filtering の結果、単一の要素に適用可能な「declared value のリスト」が得られます。

### Cascading

Filtering の結果、単一の要素に対して複数の宣言が適用された場合、[Cascading](https://www.w3.org/TR/css-cascade-4/#cascading) でその競合を解決しなければなりません。

```css
/* 競合する declared values list */
/* 競合解決の末生き残るものが、ascaded values */

/* font-size: 1.5em;    UA Stylesheet */
font-size: 24px; /* Author Stylesheet (.card h2) */

/* color: CanvasText;   UA Stylesheet */
color: red; /* Author Stylesheet (h2) */
```

Author/User/UA Stylesheet、その中でもインラインスタイルや `@import` でのスタイル読み込みなど、さまざまなソースからすべてのスタイルを集約し、最終的に唯一の宣言を採用する必要があります。Author StyleSheet で何も指定していなくとも、ほとんどのブラウザで UA StyleSheet が適用されていることを鑑みると、この過程は必須と言っても良いでしょう。

Cascading の過程で、単一の宣言を採用するアルゴリズムが、 Cascading Sorting Order です。こうして宣言を単一に絞ることで、後続の [Value Processing](#value-processing) において値を単一に絞って計算していくことができます。Cascading の結果、単一に絞られた値は、**[cascaded value](#2-cascaded-value)** となります。

Cascade に関しては、このアドベントカレンダーでも多分に触れてきました。詳細は、[Day3](2025-css-advent-3)~[Day5](2025-css-advent-5) を参照して下さい。

### Defaulting

Cascading の結果として cascaded value が得られましたが、すべてのプロパティが cascaded value を持つとは限りません。例えば、Author/User/UA Stylesheet で宣言されていないプロパティは、cascaded value を持ちません。

```css
/* e.g, cascaded value が存在しないプロパティ */
display: ?;
font-family: ?;
line-height: ?;
```

しかし、レンダリングを行うためには、**すべての要素のすべてのプロパティが必ず値を持つ必要があります**。[Defaulting](https://www.w3.org/TR/css-cascade-4/#defaulting) は、cascaded value が存在しない場合に適切な値を決定する過程です。

```css
/* Defaulting の結果 */

/* cascaded value のまま */
font-size: 24px;
margin: 0.83em 0;
margin-top: 16px;
color: red;
font-weight: bold;

display: block; /* UA Stylesheet で設定される（h2 の場合） */
font-family: serif; /* initial value */
line-height: normal; /* initial value */
```

#### Initial Values

すべての CSS プロパティには **[initial value](https://www.w3.org/TR/css-cascade-4/#initial-value)** が定義されています。これは、そのプロパティが一切宣言されていない場合のデフォルト値です。

例えば：

- `color` の initial value は `CanvasText`（通常黒）
- `display` の initial value は `inline`
- `font-size` の initial value は `medium`

:::note{.memo}
💡 FUN FACT

UA Stylesheet によって設定される値と仕様に定義される initial value は異なります。例えば、`<div>` の `display` は UA Stylesheet によって `block` に設定されますが、`display` プロパティ自体の initial value は `inline` です。
:::

#### Inheritance

CSS のプロパティは、**[inherited property](https://www.w3.org/TR/css-cascade-4/#inherited-property)** と **non-inherited property**（仕様にはないが、敢えて対照的に書く） の 2 つに分類されます。

**Inherited property**：

- cascaded value がない場合、親要素の [computed value](#4-computed-value) を継承する
- ルートの場合は、[initial value](#initial-values) を使用する

```css
/* 親要素 */
.parent {
  color: blue; /* inherited property */
}

/* 子要素には color の宣言がない → 親の blue を継承 */
.child {
  /* color は自動的に blue になる */
}
```

**Non-inherited property** の場合：

- cascaded value がない場合、親要素ではなく、[initial value](#initial-values) を使用する

```css
/* 親要素 */
.parent {
  border: 1px solid black; /* non-inherited property */
}

/* 子要素には border の宣言がない → initial value (none) を使用 */
.child {
  /* border は自動的に none になる */
}
```

:::note{.info}

<details>
<summary>Explicit Defaulting</summary>

CSS には、明示的に defaulting の動作を制御する[keywords](https://www.w3.org/TR/css-cascade-4/#defaulting-keywords)が用意されています。

**[`initial`](https://www.w3.org/TR/css-cascade-4/#valdef-all-initial)**: プロパティを initial value にリセット

```css
.element {
  color: initial; /* CanvasText になる */
}
```

**[`inherit`](https://www.w3.org/TR/css-cascade-4/#valdef-all-inherit)**: 親要素から値を継承（non-inherited property でも強制的に継承）

```css
.child {
  border: inherit; /* 親の border 値を継承 */
}
```

**[`unset`](https://www.w3.org/TR/css-cascade-4/#valdef-all-unset)**: プロパティの性質に応じて動作

- inherited property → `inherit` として動作
- non-inherited property → `initial` として動作

```css
.element {
  color: unset; /* inherited なので inherit として動作 */
  border: unset; /* non-inherited なので initial として動作 */
}
```

**[`revert`](https://www.w3.org/TR/css-cascade-4/#valdef-all-revert)**: Cascade Origin を 1 つ戻す

```css
.element {
  display: revert; /* Author → User → UA の順で値を探す */
}
```

**[`revert-layer`](https://www.w3.org/TR/css-cascade-5/#valdef-all-revert-layer)**: Cascade Layer を 1 つ戻す（CSS Cascading and Inheritance [Level 5](https://www.w3.org/TR/css-cascade-5/) の内容）

```css
@layer base, theme;

@layer theme {
  .element {
    color: revert-layer; /* theme layer → base layer の値を使用 */
  }
}
```

これらのキーワードは、Cascading の過程で通常の値と同様に処理されるのですが、最終的な値の決定は Defaulting の段階で行われます。

</details>
:::

### Value Processing

ここまで、Filtering → Cascading → Defaulting と値が処理されてきました。仕様では、これらの処理を含めた値の変遷を **[Value Processing](https://www.w3.org/TR/css-cascade-4/#value-stages)** としてまとめています。

CSS の値は、以下の 6 つの段階を経て最終的な表示値に変換されます。

#### 1. [Declared Values](https://www.w3.org/TR/css-cascade-4/#declared)

要素に適用されるすべてのプロパティ宣言を収集した段階の値。[Filtering](#filtering) の結果。
1 つの要素に対して、0 個以上の宣言値が存在する可能性がある。

```css
/* 複数の宣言値が存在する例 */
p {
  color: blue;
} /* 宣言値 1 */
.text {
  color: red;
} /* 宣言値 2 */
#content p {
  color: green;
} /* 宣言値 3 */
```

#### 2. [Cascaded Value](https://www.w3.org/TR/css-cascade-4/#cascaded)

[Cascading](#cascading) によって、複数の宣言値から 1 つが選ばれた値。各プロパティごとに、最大で 1 つの cascaded value が存在する。

```css
/* 上記の例で、#content p セレクタが最も詳細度が高いので... */
/* cascaded value: green */
```

#### 3. [Specified Value](https://www.w3.org/TR/css-cascade-4/#specified)

[Defaulting](#defaulting) を経て、すべてのプロパティに値が割り当てられた段階。この段階で、すべての要素のすべてのプロパティが**必ず 1 つの値を持つ。**

- cascaded value がある → それを使用
- cascaded value がない → [Defaulting](#defaulting) で決定
  - inherited property → 親の [computed value](#4-computed-value) を継承
  - non-inherited property → [initial value](#initial-values) を使用

#### 4. [Computed Value](https://www.w3.org/TR/css-cascade-4/#computed)

親との相対的な値や依存関係を解決した値。この段階での主な処理は以下のようになる。

- 親との相対単位の絶対化（`em` → `px` など）
- keywords の解決
- `currentColor` などの値の解決
- `var()` などの **CSS Functions の置換**

```css
.parent {
  font-size: 16px;
}
.child {
  font-size: 1.5em; /* specified: 1.5em → computed: 24px */
  width: 50%; /* specified: 50% → computed: 50%（親のサイズはまだ不明）*/
}
```

:::note{.memo}
⚠️ **[IACVT（Invalid At Computed-Value Time）](https://www.w3.org/TR/css-variables-1/#invalid-at-computed-value-time)**

`var()` 関数の置換はこの段階で行われます。置換後の値が無効な場合、IACVT となります：

```css
:root {
  --not-a-color: 16px;
}
p {
  background-color: var(--not-a-color);
  /* computed 段階で 16px に置換 → 色として無効 → IACVT */
  /* result: unset として扱われる */
}
```

:::

#### 5. [Used Value](https://www.w3.org/TR/css-cascade-4/#used)

Layout を完了して実際に利用される値。

```css
.parent {
  width: 800px;
}
.child {
  width: 50%; /* computed: 50% → used: 400px */
  height: auto; /* computed: auto → used: 実際の高さ（e.g. 200px）*/
}
```

要素にプロパティが適用される場合のみ、used value が存在する。例えば、`display: inline` の要素には `width` の used value は存在しない。

#### 6. [Actual Value](https://www.w3.org/TR/css-cascade-4/#actual)

表示環境の制約を考慮した最終的な値。

```css
.element {
  border-width: 0.5px; /* used: 0.5px → actual: 1px（デバイスが対応していない場合）*/
  opacity: 0.999; /* used: 0.999 → actual: 1（精度の制限など）*/
}
```

## Phew! Sum Up!

今回は、以下の 5 段階の処理を解説しました。

1. **Declared → Cascaded**: 複数の宣言から 1 つを選択
2. **Cascaded → Specified**: すべてのプロパティに値を割り当て
3. **Specified → Computed**: 親との相対値を絶対化、IACVT の導出など
4. **Computed → Used**: window などを含めた Layout に基づく計算
5. **Used → Actual**: 環境的な制約への適応をさせる

競合解決や値の補完などを行いながら、異なる環境やコンテキストで最適な表示を実現する過程を経て、ブラウザを介して我々の目にみえる形で CSS が適用されているわけです。

## Appendix

- [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3)
- [Inside look at modern web browser (part 3)](https://developer.chrome.com/blog/inside-browser-part3)
- [CSS property value processing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Value_processing)
- [CSS Style Calculation in Blink](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/css/style-calculation.md)
- [Reduce the scope and complexity of style calculations](https://web.dev/articles/reduce-the-scope-and-complexity-of-style-calculations)
- [CSS Foundations: What is IACVT?](https://www.bram.us/2024/02/26/css-what-is-iacvt/)

---

<advent-calendar-2025 />
