---
title: "いまさら聞けない CSS の「Shorthand」と「Longhand」って何が違うの？"
excerpt: "CSS を書き始めてからずっと知ってるようで、実は知らない Shorthand と Longhand。それぞれのもたらす影響を、その仕組みから理解を試みます。"
date: 2026-07-28
update: 2026-07-28
category: "dev"
tags: ["css", "standards"]
status: "published"
---

## Table of Contents

## はじめに

ところで、CSS の「Shorthand」と「Longhand」では何が違うのでしょうか。

「省略表示か否か」というのは確かにそうですが、だったらどうして冗長な方(ロングハンド)があるのでしょうか。簡潔な方があれば困りませんし、極端な場合スタイルシートの大きさも減らせるように思えます。
でも、ショートハンドは時に混乱を招きます。`font` のように、何の値をどの順番で指定したらいいのか迷うものには、ロングハンドを使いがちです。 `font-family` とか `font-size`、`font-weight` のように、修飾が多い方が確かにわかりやすいです。
では、 `font` は記法を覚えられる人向けのプロパティなのでしょうか。「いやいや、きっと保守性とか、、、意味を持って使い分けるためにある！」「なんか、基本ショートハンドを使っておけばいいって聞いた」としたら、具体的に何に気をつけながら、どういう意図でどちらを使うべきか、私たちはきちんと説明できるでしょうか？

以下のコードはどちらも背景を `tomato` にすることを意図していますが、両者が明確に異なる影響を与えるということを説明でき、レビューできちんと指摘できるでしょうか？

```css
.container {
  background: tomato;
}
```

```css
.container {
  background-color: tomato;
}
```

こういったことを仕組みから説明できるようにすることが本エントリのゴールです。

## ショートハンドは要素に対する「プロパティ」なのか

ショートハンドは「プロパティ」ですが、通常の「プロパティ」とは少し違った性質を持ちます（だからこそ、特に「ショートハンドプロパティ」と呼ばれている）。

全ての HTML 要素には、全ての CSS プロパティとその値が指定されていなければなりません。例えば、丸みのない単なる Heading でもレンダー前にはきちんと `border-radius` の値が確定される必要があります。私たちが明示的に Author スタイルシートで指定しなくても、ブラウザは全てのプロパティに対して値を確定させます。
これは DevTools を開くとわかります。CSS の全プロパティを全ての要素に指定したことがある人はいないと思います。しかし、レンダー時には、ブラウザはきちんと必要なプロパティを補ってくれているのです。

:::figure[Heading に対して明示的に指定していない `border-radius` が UA によって指定されている]
![Heading に対して明示的に指定していない `border-radius` が UA によって指定されている](../../../../assets/images/border-radius.png)
:::

しかし、この中にショートハンドプロパティは存在しません。つまり、**ショートハンドに初期値はありません**。ショートハンドは全てロングハンドに展開されることを意図して設計されているからです[^shorthand-expands-in-place]。

[^shorthand-expands-in-place]: A shorthand property sets all of its longhand sub-properties, exactly as if expanded in place. [CSS Cascading and Inheritance Module Level 5](https://drafts.csswg.org/css-cascade-5/#shorthand-property)

> Name: background
> Value: `<bg-layer>`#? , `<final-bg-layer>`
> **Initial: see individual properties**
> [CSS Backgrounds and Borders Module Level 3](https://drafts.csswg.org/css-backgrounds/#background)

つまり、以下のコードが最終的に直接要素に適用されることはありません。

```css
.container {
  background: tomato;
}
```

代わりに、`background` ショートハンドを構成するプロパティが適用されます。このとき、`background` で指定していないプロパティには、それぞれ仕様上の初期値が設定されます[^shorthand-initial]。

[^shorthand-initial]: When values are omitted from a shorthand form, **unless otherwise defined**, each “missing” sub-property is assigned its initial value. [CSS Cascading and Inheritance Module Level 5](https://drafts.csswg.org/css-cascade-5/#shorthand-property)

```css
.container {
  background-color: tomato;
  background-attachment: scroll;
  background-clip: border-box;
  background-image: none;
  background-origin: padding-box;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-size: auto;
}
```

## ショートハンドの持つ初期化作用と影響

つまり、ショートハンドで**明示的に指定していないプロパティは同時に初期化される**ということになります。そして、ショートハンドは複数のプロパティを集約している分、その影響範囲も自ずと広がります。

### ショートハンドの初期化を防げないパターン

ショートハンドの中には、構文上どうやっても値を指定できないサブプロパティを持つものがあります。指定する手段がない以上、そのサブプロパティの初期化は防げません。`border` ショートハンドはその一例です。

```css
.container {
  border: tomato thin solid;
}
```

`border` は以下のように展開されます。しかし、`border` の構文では `border-image` を書けないため、`border` を使うと同時に、**`border-image` は必ず初期化される**ことになります。

```css
.container {
  border-color: tomato;
  border-width: thin;
  border-style: solid;
  border-image: none;
}
```

このように、ショートハンドの構文では他の値を指定できず、初期値へのリセットだけが起こるサブプロパティは、仕様では reset-only sub-property と呼ばれます[^reset-only]。

[^reset-only]: Like other sub-properties, it is reset to its initial value by the shorthand when unspecified, but the shorthand might not include syntax to set the sub-property to any of its other values. [CSS Cascading and Inheritance Module Level 5](https://drafts.csswg.org/css-cascade-5/#shorthand-property)

さらに、`border-image` 自身も、`border-image-*` 系プロパティから構成されるショートハンドです。そのため、`border` 利用の影響は**全 `border-image-*` 系プロパティの初期化**につながります。

```css
.container {
  border-color: tomato;
  border-width: thin;
  border-style: solid;
  border-image-source: none;
  border-image-slice: 100%;
  border-image-width: 1;
  border-image-repeat: stretch;
}
```

### キーワード値が全てに影響するパターン

例外として、ショートハンドに `inherit` や `initial` などの CSS-wide キーワードを指定した場合は、reset-only のサブプロパティにもそのキーワードが設定されます。

例えば `border: inherit` と指定すると、`border-image` は初期値の `none` ではなく `inherit` になります。

```css
.container {
  border: inherit;
}
```

```css
.container {
  border-color: inherit;
  border-width: inherit;
  border-style: inherit;
  border-image-source: inherit;
  border-image-slice: inherit;
  border-image-width: inherit;
  border-image-repeat: inherit;
}
```

### `!important` が全てに影響するパターン

ショートハンドに付与した `!important` もキーワードと同様の性質を持ち、展開される**全ての**ロングハンドに対して `!important` は付与されることになっています。

```css
.container {
  border: tomato thin solid !important;
}
```

```css
.container {
  border-color: tomato !important;
  border-width: thin !important;
  border-style: solid !important;
  border-image-source: none !important;
  border-image-slice: 100% !important;
  border-image-width: 1 !important;
  border-image-repeat: stretch !important;
}
```

### 無効な任意代入関数が全てに影響するパターン

`var()` などの任意代入関数の失敗も、ショートハンドでは展開先の全てのロングハンドに影響します。

例えば、`border` の色をカスタムプロパティで指定したとします。

```css
.container {
  border: var(--border-color) thin solid;
}
```

もし `--border-color` がどこにも定義されていなかったり、`53%` などといった無効な値の場合、無効になるのは `border-color` だけではありません。**宣言全体が、`var()` が計算される時に無効** (IACVT: Invalid at Computed-Value Time) と判断され、`border` が展開する全てのロングハンドが `unset` 相当になります。実質的に以下のように書いたのと同じ状態になり、結果として枠線は一切表示されません。

```css
.container {
  border-color: unset; /* = currentColor */
  border-width: unset; /* = medium */
  border-style: unset; /* = none */
  border-image-source: unset;
  border-image-slice: unset;
  border-image-width: unset;
  border-image-repeat: unset;
}
```

パース時点では `var()` の中身を評価できないため、ショートハンドはどの値をどのロングハンドに振り分けるかを決められません。そこで仕様は、展開先の全ロングハンドにショートハンド全体の値を「置換待ちの保留値」(pending-substitution value) として持たせるとしています[^pending-substitution]。置換に失敗したときに展開された全ロングハンドが巻き添えになるのは、このためです。なお、任意代入関数がなぜパース時に評価されないのか、IACVT がなぜ避けたい挙動なのかは、[こちら](/dev/articles/ident-eager-parsing-behavior#任意代入関数-と-invalid-at-computed-value-time)を参照されたいです。

[^pending-substitution]: cf. [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/#pending-substitution-value)

そこで、`@property` で型と初期値を登録しておくことで、宣言全体の IACVT を防げます。

```css
@property --border-color {
  syntax: "<color>";
  inherits: false;
  initial-value: tomato;
}

.container {
  border: var(--border-color) thin solid;
}
```

`var(--border-color)` が置換される時点では、その値は必ず `<color>` として有効な値になります。型と値の不整合による失敗も、カスタムプロパティの中に閉じる仕組みです[^registered-iacvt]。よって、展開先が巻き添えで `unset` になることはありません。最悪でも `tomato` の枠線は残ります。

[^registered-iacvt]: Otherwise, attempt to parse the property's value according to its registered syntax. If this fails, the declaration is invalid at computed-value time and the computed value is determined accordingly. [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/#calculation-of-computed-values)

<baseline-status featureId="registered-custom-properties"></baseline-status>

---

このように、ショートハンドは単に値を指定すると同時に、**関連するプロパティを初期化する（副）作用**があり、それらは狭くない範囲に影響を及ぼすことになります。

では、ショートハンドとロングハンドが競合した場合、どちらがどのようにして優先されるのでしょうか。

## ショートハンドの値処理タイミング

CSS のプロパティと値は大体以下のような手順で処理されます。仕様ではこの手順を Value Processing と呼びます。ある HTML 要素に対してどの宣言が最終的に適用されるかは、この 1~3 のステップまでで決まります。

1. **Filtering**
2. **Cascading**
3. **Defaulting** (e.g. Inheritance)
4. Resolving
   …

- Value Processing | CSS Cascading and Inheritance Level 5
  - https://www.w3.org/TR/css-cascade-5/#value-stages

「Filtering」でプロパティと値（の組み合わせや適用条件）が有効か無効かをバリデーションし、「Cascading」でプロパティの競合を解決し、「Defaulting」で明示的に指定されなかったプロパティを継承したり初期値で埋めたりします。ざっくり説明すると、1~3 のステップで、ある要素に対して全ての CSS プロパティが補完される仕組みになっています。

カスケードがプロパティの競合を解決するものであれば、ショートハンドのロングハンドへの展開は**カスケードの前**に行われる必要があるという点が重要です。以下のような指定があるとします。

```css
.container {
  background-image: linear-gradient(to top, blue, tomato);
  background: tomato;
}
```

カスケードで競合解決するには、以下のように展開されていなければなりません。そして展開の結果、最初に指定したはずの `background-image` は無効になります。

```css
.container {
  background-image: linear-gradient(to top, blue, tomato); /* 無効化 */
  background-color: tomato;
  background-attachment: scroll;
  background-clip: border-box;
  background-image: none; /* 初期化 */
  background-origin: padding-box;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-size: auto;
}
```

冒頭に提示した以下のコードがどのように異なる効果を持つかは、もう明確なはずです。

```css
.container {
  background: tomato;
}
```

```css
.container {
  background-color: tomato;
}
```

最初のコードはショートハンドであり、必ず `tomato` の背景色が適用されます。しかし後者のコードでは、グラデーションかもしれませんし、画像の背景かもしれません。`background-image` が有効な可能性があるからです。

以上の性質を意図的に使い分け、指定順を判断できるか否かによって、ショートハンドへの印象は大きく異なるものになるでしょう。

## 既出のスタイルを初期化したい場合

ショートハンドの初期化性質は、全体的に全く異なるデザインに設定し直したい場合に役立ちます。例えば、アイコン画像とその配置を*リセットし*、単色の背景に切り替える場合は、ショートハンドを使うべきです。

```css
button {
  background: url("icon-star.svg") no-repeat 0.5rem center / 1rem rebeccapurple;
  &[aria-pressed="true"] {
    /* 背景を全体的に変える */
    background: teal;
  }
}
```

![デフォルトの背景。星の背景画像付きの rebeccapurple](../../../../assets/images/default-star-backed-button.png)

![星の背景画像をリセットし、背景全体を teal に上書きする](../../../../assets/images/pressed-without-star-backed-teal-button.png)

もちろん、リセットのためにショートハンドを一切使わず、全てのプロパティを毎回記述しても構いません。上記の例だと以下のように記述しても、同じ結果を得られます。

```css
button {
  background: url("icon-star.svg") no-repeat 0.5rem center / 1rem rebeccapurple;
  &[aria-pressed="true"] {
    /* 背景を全体的に変える */
    background-color: teal;
    background-attachment: scroll;
    background-clip: border-box;
    background-image: none;
    background-origin: padding-box;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
    background-size: auto;
  }
}
```

しかし、これだと漏れが生じる可能性があり、保守性に長けているとは言い難いでしょう。例えば `background-image` の行を書き漏らすと、`teal` の背景の上にアイコンが残ったままになります。

また、仕様への追従も難しいです。ショートハンドに内包される新しいプロパティが定義された場合、この仕様変更への追従は困難です。

<details>
  <summary>💡 仕様の初期値を活かしてミスを防ぐ</summary>

ショートハンドのリセット性質は「省略した分は仕様が埋めてくれる」というふうに解釈することもできます。特に、「指定し忘れがちなプロパティを補完してくれる」仕組みとしてショートハンドの利用を推奨しているものとして、Flexbox は有名です。

> Authors are encouraged to control flexibility using the flex shorthand rather than with its longhand properties directly, as the shorthand correctly resets any unspecified components to accommodate common uses.
> [CSS Flexible Box Layout Module Level 1](https://drafts.csswg.org/css-flexbox/#flex-common)

`flex` ショートハンドは「できる限り安全に、多くのレイアウトにワンホップで対応できる」よう、特別に省略時に入る値が調整されます[^flex-common-values]。
`flex: initial` は、（`flex-grow: 0`、`flex-shrink: 1`、`flex-basis: auto`）です。しかし、`flex: 1` とすると `flex: 1 1 0` に調整され、`flex-grow` と `flex-basis` が初期値から調整されているとわかります。また、`flex: 20%` とすると `flex: 1 1 20%` となり、`flex-grow` が `0` でなく `1` に調整されます。

[^flex-common-values]: cf. [Common Values of flex | CSS Flexible Box Layout Module Level 1](https://drafts.csswg.org/css-flexbox/#flex-common)

裏を返すと、ロングハンドを直接使った場合は、このチューニングの恩恵を受けられません。`flex` を使わない `flex-grow: 1` は `flex: 1 1 auto` 相当のため、コンテンツ量次第ではレイアウトが崩れる可能性が出てしまいます。CSS が大事にしている「デフォルトでデータの欠損を起こさない」原則[^content-should-be-viewable-default]を達成するためにも、CSS としての意図的な調整だと言えるでしょう。

[^content-should-be-viewable-default]: Content should be viewable and accessible by default [Web Platform Design Principles](https://www.w3.org/TR/design-principles/#css-content-should-be-visible)

さらに、`flex: initial` のデフォルトは、最も汎用性の高いレイアウトになるよう設定されています。`display: flex` と書くだけで、`flex: 0 1 auto` となり、以下のような多くのレイアウトに最小の宣言で到達できるよう設計されています。

- 中央寄せ：`.container { justify-content: center }`
- 均等配置：`.container { justify-content: space-between }`
- 等幅分割：`.item { flex: 1 }`
- 余白の均等配分：`.item { flex: auto }`
- 特定アイテムのみ伸ばす：`.item:last-child { flex: 1 }`
- 特定アイテムのみ分離：`.item:last-child { margin-left: auto }`

このように、ショートハンドの初期化作用はときに、予期しないデザインの結果を防ぎ、効率的にデザインを組む仕組みとしても機能するのです。

※ なお、DevTools で `flex: 1` を展開すると、`flex-basis` は `0` ではなく `0%` と表示されるはずです。仕様上は `0` ですが、ブラウザは互換性の観点から `0%` のまま実装しており、この差分をどちらに寄せるかは[現在も議論が続いています](https://github.com/w3c/csswg-drafts/issues/5742)。

</details>

## 特定のプロパティを意図的に変更したい場合

逆に、特定のプロパティを意図的に変更したい場合は、ロングハンドを利用できます。一部のデザインの微調整にはロングハンドが便利です。例えば、アイコンとその配置を*リセットせず*、背景色だけを変更する場合は、ロングハンドを使うべきです。

```css
button {
  background: url("icon-star.svg") no-repeat 0.5rem center / 1rem rebeccapurple;
  &:hover {
    /* background-color で背景色のみ変える。アイコンはそのまま */
    background-color: teal;
  }
}
```

![星の背景画像はそのままに、背景のみ teal にする](../../../../assets/images/hover-star-backed-teal-button.png)

もちろん以下のようにショートハンドを用いて書くこともできます。しかし、アイコンやその配置を変更したいとなった場合、これでは変更の箇所が2箇所になってしまい、保守性の低いコードになってしまうでしょう。

```css
button {
  background: url("icon-star.svg") no-repeat 0.5rem center / 1rem rebeccapurple;
  &:hover {
    /* background-color で背景色のみ変える。アイコンはそのまま */
    background: url("icon-star.svg") no-repeat 0.5rem center / 1rem teal;
  }
}
```

このように、ベースをショートハンドで定義してロングハンドで意図的に変更する手法は、保守性の向上にも役立ちます。特に、ショートハンド内に**同じ値を持つプロパティが複数ある場合**においては積極的に活用できます。

以下の例では、 `background-repeat` と `background-size` において同じ値が4回も繰り返し書かれています。つまり、`background-size` を変更しようと思った場合4箇所の変更が必要になります。

```css
.container {
  background:
    url("icon-star.svg") no-repeat top right / 5rem,
    url("icon-heart.svg") no-repeat top left / 5rem,
    url("icon-moon.svg") no-repeat bottom right / 5rem,
    url("icon-sun.svg") no-repeat bottom left / 5rem;
}
```

`background` はリスト指定できるプロパティです。CSS のリストでは、値が一箇所しか指定されていないものはその値を繰り返し利用することができます[^list-repeat]。よって、以下のように書くことができます。

[^list-repeat]: If a coordinating list property has too few values specified, its value list is repeated to add more used values. [CSS Values and Units Module Level 4](https://drafts.csswg.org/css-values-4/#linked-properties)

```css
.container {
  background:
    url("icon-star.svg") top right,
    url("icon-heart.svg") top left,
    url("icon-moon.svg") bottom right,
    url("icon-sun.svg") bottom left;
  background-repeat: no-repeat;
  background-size: 5rem;
}
```

すると、`background-repeat` と `background-size` を変更したいときは1箇所だけを変更することで対応できます。

<details>
  <summary>💡 曖昧なショートハンド</summary>

先ほどの `background` ショートハンドではスラッシュ (`/`) 区切りの指定が登場しました。

```css
.container {
  background:
    url("icon-star.svg") no-repeat top right / 5rem,
    url("icon-heart.svg") no-repeat top left / 5rem,
    url("icon-moon.svg") no-repeat bottom right / 5rem,
    url("icon-sun.svg") no-repeat bottom left / 5rem;
}
```

`background-size` の指定には必ずスラッシュが必要かつ、たとえ初期値（`0% 0%`）であっても `background-position` を直前に指定する必要があります。`<bg-position> / <bg-size>` となる必要があるのです。どうしてこんな構文が採用されているのでしょうか。

スラッシュ構文は「ショートハンドの曖昧さ」を解消するために使われることがあります。キーワードを用いて `center bottom` と指定されていれば、これは確実に `background-position` だとわかります。しかし、`50% 50%` となっていた場合はどうでしょうか。CSSパーサは、 `background-position` なのか `background-size` なのか判別できません。ショートハンドでは、CSS パーサはプロパティ名なしに値の意図を解釈しなければなりません。そこでスラッシュが必要になるケースがあるのです。

通常は、値の型からプロパティを判別できたり、順序で判別できたりします。

```css
.container {
  border: 1px solid blue; /* 型でプロパティを判別 */
  padding: 1px 5px 10px 3px; /* 順序でプロパティを判別 */
}
```

このようにスラッシュは、同じ種類の値が並ぶ曖昧さを解消してくれています。しばしばショートハンドの複雑性を増すように思える構文ですが、ショートハンド内で「値の型を他と混同しないかどうか」という感覚を持っておくと、より自然にスラッシュの要/不要を判断できるかもしれません。

</details>

ショートハンドにまとめることで保守性を向上できるケースもあります。`padding` はその一例です。例では余白を 5em から 1em に変更しようと思った場合、3箇所を変更する必要があります。

```css
.container {
  padding: 5em 0em 5em 5em;
}
```

しかし、以下のようにショートハンドを使ってまとめ、ロングハンドで意図的に上書きすることで、変更箇所を1箇所にまとめることができます。

```css
.container {
  padding: 5em;
  padding-inline-end: 0em;
}
```

同じタイミングで変更される同じ値のプロパティならば、ひとつにまとめて意図的にロングハンドで上書きすることで、保守性を向上できます。

## まとめ

stylelint などのような CSS lint ツールには、[ショートハンドによる上書きを禁止](https://stylelint.io/user-guide/rules/declaration-block-no-shorthand-property-overrides/)したり、[ショートハンドの利用を強制](https://stylelint.io/user-guide/rules/declaration-block-no-redundant-longhand-properties/)したりするものがあります。こういったlintルールを使う際は、ショート/ロングの正当な利用を絞ってしまう可能性にも、ぜひとも気をつけたいです。

筆者個人としては、ショートハンド or ロングハンドどちらを選ぶかは、そのデザインがどういう意図を持っているかに依存すると考えます。関連するプロパティをまとめて初期化する「完全に上書きするようなデザイン」ならショートハンド、既存のデザインを維持しながら「一部だけ変更するようなデザイン」ならロングハンドを選ぶ可能性が高いでしょう。

CSS の場合何かとケースバイケースなことが多く、必ずしも lint ツールで静的に決定づけられない判断が少なくない数あります。「ケースバイケース」の判断基準をこうして文書に残し、Agent Skills で文脈に応じた判断を仰ぐ方が、今の時代には合っているのかもしれません。
