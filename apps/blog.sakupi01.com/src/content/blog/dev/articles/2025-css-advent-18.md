---
title: "🎨 CSS Advent Calendar: Day 18 / Cascade Layers with background story"
excerpt: "Cascade Layers の背景と、Cascade Layers の提案に至るまでの経緯から考察するメンタルモデル"
date: 2025-08-18
update: 2025-08-18
category: "dev"
tags: ["web", "ui", "css", "html", "standards", "advent calendar"]
status: "published"
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 18 日目の記事です。
:::

OOCSS/BEM/SMACSS/ITCSS、CSS Modules、CSS in JS、ユーティリティファースト etc ...
プロダクトの性質やチームの成熟度、あるいは好みによって、どういった手法を取るのかに違いはあれど、
エコシステムが実らせてきた CSS 設計のプラクティスでは、主に以下の達成が考えられてきました。

1. Component で影響範囲を最小限に保って開発したい
2. 他との衝突を防ぐため、各詳細度はできるだけ一定に・低く保ちたい
3. グローバルなスタイル、特に Utility Class/変数、サードパーティのスタイルを括り、コントロールしたい

以上のプラクティスを達成するため、Cascade の中でも最も _Reusable_ で _Customizable_ な「Class/Attribute セレクタ」を意識しなくてもいいくらいには上手く使えるよう、諸ツールの発展がありました。
それでも上記のプラクティスが満たせない場合は、`!important` を用いて Origin&Importance レベルから上書きを試みるというのが、実際に行われていたところでもあると思います。

この一連の手法の根底となっていた Cascade が下図です。

<cascade-accordion disabled show-layers="false" show-scope-proximity="false"></cascade-accordion>

Cascade を俯瞰すると、UA / User / Author という、出自も関心も異なる３つのスタイルが「Origin」として定義され、「Importance」によって Balance が意識されることで「レイヤリング」をしていることが実態としてあることがわかります。

つまり、「Origin&Importance」 は、出自も関心も異なるスタイルを、「Origin」 として管理することで「Suggest」し合えるようにし、「Importance」を用いて「Balance」をとれるようにする、Cascade の中で何よりも優先度の高い仕組みであると言えます。
どんなに高い詳細度よりも、Cascade ではこのレイヤリングが優先して考えられます。

関心の異なるスタイルにおけるレイヤリングの権化とも言える「Origin」＆「Importance」という仕組み -- この仕組みを、単一の Origin 内にある 関心の異なるスタイル間でも、「Suggestion」と「Balance」をとるために利用できないか？という思想で提案されたのが「Cascade Layers」(当時は Cascade Origins) であるというのが、Explainer からの解釈です。

> In the same way that Cascade Origins help to balance styling concerns across stakeholders – layering browser defaults, user preferences, and document styles – it can be useful to have similar layering of concerns within a single origin.
>
> -- [CSS Cascade Layers Explainer](https://css.oddbird.net/layers/explainer/)

では、 詳細度のコントロールや、`!important` での優先度の上書きでは、どういったユースケースへの対応が難しく、Cascade Layers はどのようにそれを解決するものなのでしょうか。

## The Difficulties

現在の CSS では、レイヤー間の優先順位を管理するために、詳細度を慎重にコントロールする必要があります。

BEM や CSS Modules/CSS in JS で単一クラスセレクタで詳細度を一定に/低く保ったり、ITCSS などのルールベースで詳細度とレイヤーを一致させたりしたとしても、グローバルやサードパーティのスタイルの詳細度指定によっては、スタイルが容易に崩れてしまったり、上書きが難しくなる可能性は否めません。

以下などが例として考えられます。

- e.g. サードパーティの詳細度事情に踏み込んだ上書き/除外設定

```css
/* グローバルで読み込まれた third-party.css */
button .btn {  /* 詳細度 0-1-1 */
  padding: 15px !important;  /* あるいは高い詳細度 */
}

/* CSS Modules のスタイル */
import styles from './Button.module.css';
/* .Button_button_2x3fG のようにハッシュ化 */
.button {   /* 詳細度 0-1-0 */
  padding: 10px; /* 効かないので、!important をしたり詳細度をあげて上書きする */
  background: blue;
}
```

- e.g. レガシー（既存ページ）との共存

```css
/* 既存のページ */
/* legacy-theme.css (グローバル) */
#content .widget div {  /* 詳細度 1-1-1 */
  margin: 20px;
}

/* 刷新は CSS Modules */
import styles from './NewFeature.module.css';
/* CSS Modules のスタイル */
/* .NewFeature_container_2x3fG のようにハッシュ化 */
.container {  /* 詳細度 0-1-0 */
  margin: 0;  /* 効かないので、!important をしたり詳細度をあげて上書きする */
}
```

要は、単一のクラスセレクタで詳細度を低く保つ「クラスベースでルール」を運用してるのに、それ無視した詳細度の高い定義が混ぜられると破綻するため、詳細度では管理が難くなってしまいます。

## Goals of Cascade Layers

上述した問題は、「関心の異なるスタイルの優先度づけ」をする場合に発生する問題です。
「関心の異なるスタイルの優先度づけ」を UA/User/Author というスケールで既に実現している Cascade の 「Origin」 や 「Importance」の仕組みに目をつけたのが、 Miriam Suzanne でした。

Origin や Importance の仕組みに倣って、スタイルの順序や詳細度に依存せず、「**決定論的なスタイル順序**」を構築することを目的として設計されたのが Cascade Layers です。

> **Cascading origins & !important are designed to solve that same problem on a larger scale – balancing UA defaults, user preferences, document authors.**
>
> It’s a pretty clever solution, with !important providing much-needed counter-balance.
>
> But the primary tools available within a single origin are specificity and source order.
>
> The former is limited by the semantic requirements of selection, and the latter can be hard to control in all situations.
>
> There is a desire for **“deterministic style ordering”** based on a more explicit syntax.

Cascade Layers を用いることで、Customizable な Sub-Origin の「カスケードレイヤー」を持つことができます。
利用側からのコントロールが難しいサードパーティのスタイルでも、そのスタイル順序や詳細度に依存せず、より明示的な構文に基づいた「**決定論的なスタイル順序**」として管理することが Cascade Layers の目的です。

## How Layers should be placed in Cascade?

Cascade Layers 自体を Cascade のどこに配置し、Cascade の中で `!important` の扱いをどうするのかということも議論されなければなりません。

:::note{.message}

💡 FUN FACT - What is the proper name for this feature?

提案初期は「Custom Origins」と呼ばれていましたが、現在は 「Cascade Layers」として知られています。

「layer」というワードはデザインツールのレイヤー機能を連想させ、グラフィックデザインでの使われ方を想起させる親しみやすさがあるという Jen Simmons の主張がきっかけがありました。

> jensimmons: Talking with other folks the word layer is good. Invokes photoshop for some authors and way it's used in graphic design. Layer speaks for itself, it's a good word to have in there.
>
> [comment](https://github.com/w3c/csswg-drafts/issues/4981#issuecomment-628105429)

z-index のレイヤーや、Top Layer との混同の懸念もありましたが、最終的には「Cascade Layers」という名前が選ばれました。
:::

### Where Custom Origins should be placed?

#### Before/After Shadow Context?

Cascade Layers は当初は「Custom Origins」として既存の Author Origin の位置に配置するとされていました。

Author Origin の位置に配置できると、エンジンに既に実装されている Origin の Order Resolution ロジックを再利用できる可能性があり、実装上の負担が軽くなると期待されていたためです。（comments）

しかし、Shadow DOM との相互作用において、計算が複雑化する懸念がありました。

> emilio: Shadow DOM introduces a stack of origins; introducing this naively makes it a matrix, which is harder.
>
> [comment](https://github.com/w3c/csswg-drafts/issues/4470#issuecomment-577300816)

Shadow DOM は各コンポーネントが独自の Context を持つ階層構造を作ります（e.g. Light DOM → Shadow DOM 1 → Shadow DOM 2 のようにスコープ）。
もし Cascade Layers を Author Origin の位置に実装すると、「Layer × Context」のすべての組み合わせで Origin ができ、優先順位を決める必要が生じます。
例えば、3 つの Layer があり 3 つの Context があれば、各組がカスタム Origin を形成することになり、それぞれが `!important` を持つことも考えると、最大 18 の異なる Origin の優先順位を管理することになります。

| Layer↓ / Context→ | Light    | Shadow1  | Shadow2  |
| ----------------- | -------- | -------- | -------- |
| base              | Origin-A | Origin-B | Origin-C |
| theme             | Origin-D | Origin-E | Origin-F |
| reset             | Origin-G | Origin-H | Origin-I |

- [[css-cascade] How do Cascade Layers interact with Shadow DOM · Issue #4984 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4984)

レイヤーが Origin レベルにあると、全ての Context が問答無用でその影響を受けることになり、管理する Origin が肥大化するため、Cascade Layers を **Context（Shadow DOM）の後** に配置することで、この問題を解決しました。

この設計により、各 Context が排他的にレイヤーを持つことができ、Light DOM の `@layer reset` と Shadow DOM 内の `@layer reset` は完全に独立して動作できます。

#### Before/After Specificity?

Context（Shadow DOM）の後に Cascade Layer を配置することは決まりましたが、カスケードのどこに配置すればいいのかも決める必要がありました。

Cascade Level 4 では、 Style Attribute（インラインスタイル） は Specificity 内で無条件に最も優先されます。
つまり、 Style Attribute の優先度を変えるような位置に Cascade Layers を配置すると、Style Attribute を「無条件に最も優先されるもの」として扱ってきた**既存のコードが壊れてしまう**懸念がありました。

しかし、 Cascade Layers としては、**Style Attribute 以外の Specificity** の部分の優先順位を上回れれば、[クラスベースの詳細度バトル問題](#the-difficulties)の解決という文脈では十分です。

<cascade-accordion disabled show-layers="false" show-scope-proximity="false"></cascade-accordion>

後方互換性を保ちつつ、顕在化している問題に対処するには、上の図でいう **Style Attribute よりも低優先、それ以外の Specificity よりも高優先な位置**に Cascade Layers を配置することが最も妥当でした。
そのために、Cascade Layers 以降の仕様では、Specificity から Style Attribute が分離される構図になります。

- [[css-cascade] Where do Cascade Layers fit in the cascade? · Issue #5003 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/5003)

---

Shadow Context と Style Attribute の理由から、Cascade Layers の優先度は「Context と Style Attribute よりも低優先、Specificity よりも高優先」とされることになりました。

### Variations on important layering

Cascade Layers における `!important` の扱いについても、いくつかの候補が上がっていました。

- [[css-cascade] How do Cascade Layers interact with `!important`? · Issue #4971 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4971)

1. **Maintain**: 通常のスタイルと同じ順序を維持
2. **Reverse**: レイヤーの順序を逆転
3. **Intertwine**: レイヤーを交互に配置し、前のレイヤーの important なスタイルを次のレイヤーの通常スタイルで override できるように
4. **Customize**: 追加の構文を提供して important レイヤーの順序をカスタマイズ可能に

レイヤリング順序をコントロールでき、必要に応じたオーバーライドが引き続き可能なだけでなく、既存の Origin の動作と揃えることができる -- 最終的に「Reverse」が、Cascade Layers の `!important` の挙動として採用されたのは、こうした理由からです。

加えて、既存の Origin と動作を揃えることで、必須スタイルを「守る」ために `!important` を利用してマーキングするという本来の意図を維持し、Author に `!important` の適切な使用法を促すことができるというニュアンスも、議論では強調されていたように感じます。

> miriam: there's a need to escape your layer. That's a strong use case to say this one style is **required for this to work so you have to go to extra effort to override it which is what !important is for**.
>
> fantasai: If a library is using it for not important things that's bad on the library
>
> [comment](https://github.com/w3c/csswg-drafts/issues/4971#issuecomment-628115258)

以上の理由から、`!important` の挙動は最終的に Reverse になりました。
これは、Origins と同じように、`!important` レイヤーでは順序を逆転させる、つまり `!important` でない場合に一番優先度の低いレイヤーが、`!important` レイヤーでは最も優先度が高くなる（その逆も然り）ことを意味します。

---

こうした事情を踏まえて、 [CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/#cascade-sort) では Cascade Layers が含まれ、Cascade Sorting Order は以下のように完成されます。

<cascade-accordion disabled show-layers="true" show-scope-proximity="false"></cascade-accordion>

## Appendix

- [CSS Cascade Layers Explainer](https://css.oddbird.net/layers/explainer/)
- [cascade-layers.md](https://gist.github.com/mirisuzanne/4224caca74a0d4be33a2b565df34b9e7)
- [[css-cascade] Custom Cascade Layers (formerly "custom origins") · Issue #4470 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4470)
- [[css-cascade-5] Reconsider placement of unlayered styles, for better progressive enhancement? · Issue #6284 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/6284#issuecomment-937262197)
- [[css-cascade] What are the proper "levels" for managing Cascade Layers? · Issue #4969 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4969)

---

<advent-calendar-2025 />
