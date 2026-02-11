---
title: "🎨 CSS Advent Calendar: Day 19 / Cascade Layers in real world use"
excerpt: "Cascade Layers に付随して議論されたトピックと、Cascade Layers の具体的なユースケース"
date: 2025-08-19
update: 2025-08-19
category: "dev"
tags: ["web", "ui", "css", "html", "standards", "advent calendar"]
status: "published"
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 19 日目の記事です。
:::

前回は Cascade Layers が提案された背景、現在の形に至るまでの主要な議論を解説しました。
今回は、付随して議論されたトピックを紹介し、Cascade Layers の具体的なユースケースを示すエントリとできればと思います。

## `revert-layer` to revert layered properties

Cascade Level4 には `revert` キーワードがあり、前の Origin にロールバックできました。
Cascade Layers でも、同じ発想で前のレイヤーの値にロールバックする `revert-layer` が提案されました。

- [[css-cascade] `revert-layer` keyword in style attribute · Issue #6743 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/6743)

以下の例は theme レイヤのスタイルを default レイヤのスタイルに選択的にロールバックしています。
このように、`revert-layer` は特定の条件で下位レイヤーのスタイルにロールバックしたい場面で利用が考えられます。

```css
@layer default {
  h3 {
    background-color: revert-layer; /* revert to UA style */
    color: rebeccapurple;
  }
}

@layer theme {
  h3 {
    color: maroon;
  }
  .no-theme {
    color: revert-layer;
  } /* revert to default layer rebeccapurple */
}
```

関連して、前の Cascade Layer で定義された値を取得し、式の中でインプレースに使えるようにする `revert-layer()` 関数も提案されています。

例えば、ベースの tokens レイヤーを参照しながら、theme レイヤーの同じトークンでダークモード対応を実装したいケースを考えます。
`revert-layer()` 関数を用いると、以下のように書くことができます。

```css
/* design token base layer */
@layer tokens {
  --primary-bg: white;
  --primary-bg-dark: black;
}

/* theme layer */
@layer theme {
  --primary-bg: light-dark(
    revert-layer(--primary-bg),
    /* 前レイヤーの値 (white) を取得 */ var(--primary-bg-dark)
      /* ダークモード時は black */
  );
}
```

このような場合に `var()` で対応しようとなると問題があるため、`revert-layer()` が存在します。

`var()` は、[Computed Value](https://drafts.csswg.org/css-cascade-5/#computed-value) を導出する computed-value time で引数の Custom Property を参照します。
それと同時に、同名の Custom Property の値解決も computed-value time で行われます。
その結果、 `--primary-bg` が自身を参照してしまい、循環参照になります。

- 参考： [Unlocking Parent Style Inheritance✨/ Nested で Dynamic で Adoptive なスタイルを実現する `inherit()` | @sakupi01.com](https://blog.sakupi01.com/dev/articles/css-inherit#background)

```css
/* NG: 循環参照になってしまう例 */
@layer theme {
  --primary-bg: light-dark(
    var(--primary-bg),
    /* 解決中の --primary-bg 自身を参照 → 循環参照 */ var(--primary-bg-dark)
  );
}
```

対して、`revert-layer()` は `var()` と異なるタイミングで Value Resolution を行います。

[inherit()](https://blog.sakupi01.com/dev/articles/css-inherit#how-inherit-overcomes-the-pain-points) と同じ仕組みだとすると、computed-value time での評価は行わず、前レイヤーで確定した Computed Value を後から参照するため、循環参照を回避できます。
（なお、現段階で仕様には明記されているわけではありません。）

また、`revert-layer()` は CSS Function であるため、Custom Properties の値としても利用可能です。

- [[css-values] Functional counterparts of other CSS-wide keywords (`revert-layer()`, `revert-rule()`) · Issue #11773 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/11773)
- [[css-cascade-6] Enable `revert-layer` layer limiting and fallback values · Issue #10416 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10416)

## The Common Use-case

ここまでで、Cascade Layers に関連した機能を紹介してきました。
ここからは、Cascade Layers の一般的なユースケースをいくつか紹介していきます。

Day18 で挙げた [詳細度バトル問題](/https://blog.sakupi01.com/dev/articles/2025-css-advent-18#the-difficulties) の解決策として、具体的に Cascade Layers がどのように作用するかといった内容も含みます。

### Style Concerns Layering - official way for ITCSS

Cascade Layers のユースケースとして最も想像に易いのは、[ITCSS（Inverted Triangle CSS）](https://blog.sakupi01.com/dev/articles/2025-css-advent-14#itcss---scalable-and-maintainable-css-categories)のようなレイヤリングを行う CSS アーキテクチャの実現でしょう。

[Day14](https://blog.sakupi01.com/dev/articles/2025-css-advent-14#itcss---scalable-and-maintainable-css-categories) でも触れたように、ITCSS のようなレイヤリングを行う CSS アーキテクチャは、詳細度や `!important` で優先度をコントロールして、各レイヤーとマッチさせることを推奨してきました。

Cascade Layers を使用することで、このアプローチを標準の方法で明示的に書くことができます。

```css
@layer settings url(settings.css);
@layer tools url(tools.css);
@layer generic url(generic.css);
@layer elements url(elements.css);
@layer objects url(objects.css);
@layer components url(components.css);
@layer utilities url(utilities.css);
```

### Safely Define & Override Specific Defaults

実際に開発をしていると、「詳細度を低く保ちたいが、特定の条件下でのみ適用したいデフォルトスタイル」や「汎用性を持ちたいが、特定の条件下最も高い優先度が必要な汎用スタイル」といった相反する要件を持つ局面に遭遇することがあります。

それぞれ例えば以下のような状況が考えられます。

- Case: 詳細度を低く保ちたいが、特定の条件下でのみ適用したいデフォルトスタイル

リセットやデフォルトスタイルは基盤として位置するので、詳細度を低く保ちたいですが、特定の条件下でのみ適用したいデフォルトは高い詳細度になってしまうという状況があります。

```css
/* 基本的にはデフォルトは詳細度が低い */
input {
  border: 1px solid gray;
}

/* 特定条件のデフォルトには高い詳細度が必要になる */
input[type="text"]:invalid:not(:focus):not(:placeholder-shown) {
  /* Specificity: 0-4-1 → 非常に高い！ */
  border-color: red;
}

/* override が難しくなる */
.form-input {
  /* Specificity: 0-1-0 */
  border-color: blue; /* !important を使うなど */
}
```

しかし、こうしたデフォルトスタイルの指定は、UA StyleSheet にも存在します。
UA はその性質上、Class や ID が利用できないため、デフォルトを作成するために、UA は属性、疑似クラス、セレクタネストを駆使することになります。

e.g. [Chromium UA Style](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/html/resources/html.css) の Customizable Select などは詳細度が非常に高い

```css
select:-internal-list-box:not(:focus) option:checked:enabled:hover,
select:-internal-list-box:not(:focus) option:checked:enabled:active {
  background-color: -internal-auto-base(
    light-dark(#cecece, #545454),
    color-mix(in lab, currentColor 10%, transparent)
  );
}
```

ただし、UA StyleSheet は UA Origin であるため、`!important` な場合を除いて Author Origin のスタイルが常に優先されます。
そのため、UA の詳細度は基本的に Author Origin では問題なく上書きできることになります。

Cascade Layers では、この UA < Author の関係に類似したレイヤー構造を、 Author Origin 内で作成できる仕組みとも捉えられます。

e.g. Author Origin 内で詳細度の高いデフォルトスタイルでも、Cascade Layers で低レイヤーなので問題ない

```css
@layer defaults {
  input[type="text"]:invalid:not(:focus):not(:placeholder-shown) {
    margin: 10px;
  }
}
```

- Case: 汎用性を持ちたいが、特定の条件下最も高い優先度が必要なスタイル

ユーティリティクラスは「どこでも使える汎用性」が売りですが、特定箇所においてのみ最も高い優先度が必要になるケースでは、`!important` をつけて対処することが多いのではないでしょうか。

```css
/* コンポーネントスタイルの詳細度が高くなっている状態 */
.form .form-body .form-input {
  /* Specificity: 0-3-0 */
  margin: 20px;
}

/* ユーティリティクラス（汎用的だが優先したい）が効かない */
.mt-0 {
  /* Specificity: 0-1-0 */
  margin-top: 0; /* !important を使うなど */
}
```

ユーテリティクラスはレイヤーの末端に来ることが想定されるため、Utility Layer に当たるレイヤーのスタイルのオーバーライドを許可したい場合は、全体として ITCSS のようなレイヤリングを行う旨みが出てきます。

e.g. 全体的なレイヤリングができていると、末端レイヤーのオーバーライドが `!important` 頼りでなくなる

```css
@layer components {
  /* 上記のように @layer defaults を定義していれば、シンプルなセレクタで OK */
  .form-input {
    margin: 20px;
  }
}

@layer utilities {
  /* Layer レベルでオーバーライド可能 */
  .mt-0 {
    margin-top: 0;
  }
}
```

### Integration with CSS Libraries and Frameworks

[Day18](https://blog.sakupi01.com/dev/articles/2025-css-advent-18#the-difficulties) でも示したよう、サードパーティのスタイルと共存する際、CSS Modules や CSS in JS を用いても詳細度が競合する可能性がありましたが、Cascade Layers を用いると、より明示的にサードパーティのスタイルとの優先順位を管理できるようになります。

- e.g. サードパーティの詳細度事情に踏み込まずに、上書き/除外設定が可能になる

```css
/* third-party.css */
button .btn {
  /* 詳細度 0-1-1 */
  padding: 15px !important; /* あるいは高い詳細度 */
}
```

```css
@layer third-party url(third-party.css);

/*CSS Modules のスタイル */
import styles from './Button.module.css';
.button {   /* 詳細度 0-1-0 */
  padding: 10px; /* unlayered style > third-party layer なので優先される */
  background: blue;
}
```

### Use for refactoring

リファクタリングでは、既存のスタイルの詳細度を下手に変更すると予期しない箇所が壊れるリスクがあります。

Cascade Layers を使うと、既存のすべてのスタイルを `@layer legacy` などとして最下層に閉じ込め、その上に新しいレイヤーを作ることができます。
これにより、既存コードの詳細度を一切変更することなく、新しいスタイルで段階的に上書きしていけます。
レガシーコードに手を加えずに安全にスタイルを刷新できるため、リファクタリングのリスクを大幅に軽減できます。

```css
/* レガシーコードを最下層のレイヤーに配置 */
@layer legacy url(legacy-style.css);

/* リファクタ用の新しいコードを上位レイヤーに */
@layer modern {
  /* new rules... */
}
```

ただ、一見安全そうに見えるこのアプローチですが、`!important` の扱いに注意を払う必要があります。

レガシースタイルが最下層のレイヤーに配置されるということは、レガシーの `!important` が最も強力になることになります（`!important` のレイヤー順序は逆転するため）。

これに関しては、legacy から `!important` の利用を手動なりトランスパイラなりで抽出し、別のレイヤーに配置するなどの少々トリッキーな対策が必要かもしれません。

```css
@layer legacy-normal {
  /* normal legacy rules */
}
@layer legacy-important {
  /* !important legacy rules */
}
@layer modern {
  /* new rules... */
}
```

## Polyfilling Cascade Layers?

Cascade Layers に最も近いであろうポリフィルを実現する方法を紹介します。
2025/8 現在、Cascade Layers は Baseline Widely Available となっており、安定的なサポートが期待でるため、ポリフィルの必要性は低く、参考程度の情報として捉えていただければと思います。

Cascade Layers は Specificity の上、Style Attribute の下に定義されるため、`#ID` を使用して詳細度を高めることで、Cascade Layers に最も近い位置でポリフィルすることが可能であると言えます。

例えば、以下のようにスタイルに `#ID` を利用し、HTML 側にも `#ID` を付与したコンテナを追加します。
`#ID` は繰り返すことで詳細度が加算されるため、`#ID` の詳細度で擬似的に Cascade Layers を実現できます。

```css
#reset <selector > {
  /* reset layer */
} /* Specificity: 1-0-0 */
#base#base <selector > {
  /* base layer */
} /* Specificity: 2-0-0 */
#components#components#components <selector > {
  /* component layer */
} /* Specificity: 3-0-0 */
```

ただ、この方法では、すべての要素を `#ID` 付きコンテナで包む必要があるため、HTML 側にも大幅に変更を加える必要があります。

`#ID` で詳細度を上げつつ、`#ID` 以外の該当セレクタを選択できれば良いので、`:is()` を利用します。
実際の HTML 要素に `#ID` が存在しなくても、`:is()` で詳細度だけを借りられる仕組みを利用したものです。

```css
:is(#r, <selector >) {
  /* reset layer */
} /* Specificity: 1-0-0 */
:is(#b#b, <selector >) {
  /* base layer */
} /* Specificity: 2-0-0 */
:is(#c#c#c, <selector >) {
  /* component layer */
} /* Specificity: 3-0-0 */
```

HTML を一切変更せずに、Cascade Layers の優先順位をエミュレートするには、`:is()` を利用しつつ、`#ID` を利用して詳細度を上げれば良いでしょう。

---

Day18/Day19 を通して、Cascade Layers の提案・策定背景や、具体的なユースケースを通して、Cascade Layers がどういった問題にどういったメンタルモデルで対処しようとしているのかを紹介してきました。

Cascade Layers が DOM ツリーフラグメントを跨いだスタイル優先順位の解決策として機能するのに対し、特定の DOM ツリーフラグメントに結び付けられた解決策が「CSS Scope (a.k.a `@scope`)」です。

スコープなしのレイヤー、レイヤーなしのスコープ、それぞれにユースケースが存在し、両者は補完的に機能できます。

次回は、DOM ツリーのフラグメントに基づいてスタイルの適用範囲を制限する「`@scope`」について、Cascade Layers との関係性も含めて詳しく見ていきたいと思います。

## Appendix

- [[css-cascade] Custom Cascade Layers (formerly "custom origins") · Issue #4470 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4470)
- [[css-cascade][css-syntax] New `!revertable` flag to mark a declaration as "can be reverted when IACVT" · Issue #10443 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10443)
- Cascade Layers の提案にあたって検討された代替案
  - [[css-cascade] What are the proper "levels" for managing Cascade Layers? · Issue #4969 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4969)
  - [comment - [css-cascade] Custom Cascade Layers (formerly "custom origins") · Issue #4470 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4470#issuecomment-577300816)

---

<advent-calendar-2025 />
