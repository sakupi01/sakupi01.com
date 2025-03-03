---
title: "🎄Open UI Advent Calendar: Day 20 / Customizable Select Element Ep.18"
excerpt: "Customizable Select Elementの関連仕様: `<selectedcontent>` - 「同期タイミング」でクローンを作成の方針で決定。`cloneNode()`の制限が浮き彫りになる"
date: 2024-12-20
beginColor: 'from-red-500'
middleColor: 'via-lime-500'
endColor: 'to-green-700'
category: 'dev'
tags: ['openui', 'advent calendar']
status: 'published'
---
## 目次

## はじめに

:::note{.message}
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の20日目の記事です。
:::

[Customizable Select Element Ep.16](https://blog.sakupi01.com/dev/articles/2024-openui-advent-18)からは、`<selectedcontent>`のクローン実装における、技術的背景をお話ししています。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

[Ep.17](https://blog.sakupi01.com/dev/articles/2024-openui-advent-19)では、Light DOMへのクローンが、「マイクロタスクを使用した、MutationObserverのコールバック内で実装する方向」で提案されていました。これにより、パフォーマンス面で優れた実装が可能になるというのが主な理由でした。

今回は、その議論の続きを見ていきます。

## Timing of cloning for the `<selectedoption>` element

一度は、マイクロタスクでの実装に舵を切りましたが、同期的なCEReactionsを使った実装にも、未だ議論の余地が残されたままでした。

> Jarhar: I've thought some more about this, and I think I understand how we could leverage CEReactions to only do one clone per script call to a DOM api which performs a mutation.
>
> もう少し考えてみた結果、ミューテーションを行うDOM APIの呼び出し毎に、1回のクローンを行うCEReactionsを使用する方法がわかったと思う。
>
> I could create a special kind of MutationObserver which instead of queueing a microtask looks to see if there is a CE reactions stack present, and tells that CE reactions stack to "notify" this MutationObserver when it is popped. If there is no CE reactions stack present, then just clone synchronously.
>
> CEReactionが存在するかどうかを見て、そのCEReactionsスタックがポップされたときにこのMutationObserverに「通知」するようにする特別な種類のMutationObserverを作成できる。CEReactionsスタックが存在しない場合は、同期的にクローンする。
>
> I also wonder if using CEReactions like this is just an internal optimization to run clones less often and is functionally the same as just synchronously cloning every time, in which case we could make the spec a lot simpler and keep it in the DOM spec. Maybe doing anything with MutationObservers is also just an optimization, and we could just add steps to the insertion/removal/attributechange steps in the HTML spec to do the cloning when appropriate...?
>
> このようにCEReactionsを使用することが、クローン実行回数を減らして内部最適化する手段で、同期的に毎回クローンするのと機能的に同じであれば、はるかに簡単に仕様を作成でき、DOM仕様として扱うことができる。MutationObserversを使用することも最適化なのですが、適切なときにクローンを行うため、CEReactionsのinsertion/removal/attributechangeステップをMutationObserversのHTML仕様に追加するだけで済むかもしれません...?
> [comment](https://github.com/whatwg/html/issues/10520#issuecomment-2341730370)

つまり、AuthorスクリプトからDOM APIを利用したミューテーションが行われるたびに、CEReactionsタイミングで、1回だけクローンを作成する方法があると述べています。
具体的には、MutationObserverでマイクロタスクをキューに入れる代わりに、[CEReactionsスタック](https://triple-underscore.github.io/HTML-custom-ja.html#custom-element-reactions-stack)にキューが存在するかどうかを確認し、存在する場合はそのCEReactionsがコールスタックからpopされる際に、変更を「通知」する特別なMutationObserverを作成することができると述べています。もし、CEReactionsスタックにキューが存在しない場合は、そのまま同期的にクローンを作成します。

このようにCEReactionsとMutationObserverを組み合わせることで、CEReactionsタイミングで最適化しながらクローンしつつ、仕様をシンプルに保つ方法を検討していました。

この提案に対して、以下の議論がWHATNOTで行われます。結果としては、CEReactionsタイミングを使用せず、「同期的に」クローンを作成することを検討する方針に変更されました。

<https://github.com/whatwg/html/issues/10601>

:::note{.memo}

📝 WHATNOT

WHATNOTは、WHATWGのIssueをトリアージする、隔週のTeleconです。
[agenda+](https://github.com/whatwg/html/labels/agenda%2B) ラベルがついたIssueがアジェンダで、これに基づいた議論が行われます。

:::

「同期的に」という表現は、CEReactionsのタイミングを使用することを意味するのではなく、DOMの変更が発生したときに即座にクローンを作成することを指しています。つまり、CEReactionsタイミングや非同期のマイクロタスクを待たずに、変更が行われたその場でクローンを作成するということです。

### CEReactionsの問題

[CEReactions](https://triple-underscore.github.io/HTML-custom-ja.html#custom-element-reactions)は、[Custom Elementsのライフサイクルコールバック](https://triple-underscore.github.io/HTML-custom-ja.html#concept-custom-element-definition-lifecycle-callbacks)（`connectedCallback`や`attributeChangedCallback`）が呼び出される際に発火します。これらのコールバックは、通常、DOM操作が行われた直後に同期的に実行されます。しかし、特定の条件においては、これらのコールバックの実行が遅延されることもあります。

> The way in which custom element reactions are invoked is done with special care, to avoid running author code during the middle of delicate operations. Effectively, they are delayed until "just before returning to user script". This means that for most purposes they appear to execute synchronously, but in the case of complicated composite operations (like cloning, or range manipulation), they will instead be delayed until after all the relevant user agent processing steps have completed, and then run together as a batch.
>
> CEReactionsは、特定の操作中に予期しないタイミングで実行されないように、特別な配慮のもとで呼び出されます。具体的には、ユーザースクリプトに制御が戻る直前まで遅延されます。これにより、ほとんどの場合、同期的に実行されるように見えますが、**Nodeのクローン作成やRange操作のような複雑な操作の場合、関連する処理がすべて完了するまで遅延され、一括してバッチ処理として実行されます。**
>
> Additionally, the precise ordering of these reactions is managed via a somewhat-complicated stack-of-queues system, described below. The intention behind this system is to guarantee that custom element reactions always are invoked in the same order as their triggering actions, at least within the local context of a single custom element. (Because custom element reaction code can perform its own mutations, it is not possible to give a global ordering guarantee across multiple elements.)
>
> これらの反応の正確な順序は、スタックとキューのシステムを通じて管理される。この管理方法の背後にある意図は、 少なくとも単一のカスタム要素内では、反応がそれを引き起こした操作の順序通りに実行されることを保証することである。 （ただし、カスタム要素の反応が他の要素に対する変更を行う可能性があるため、複数の要素にまたがるグローバルな順序を保証することはできない）
>
> [HTML Standard - Custom Element Reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions)

CEReactionsを用いると、MutationObserverと違って、[同期的なクローンができるとされていました](http://localhost:3000/dev/articles/2024-openui-advent-23#同期的なmutationobserver-cereactions-mutationobserverの提案)。
しかし今回、上記のようなCEReactionsの懸念が浮き彫りになり、よりシンプルで予測可能な動作を実現できる「同期的な」クローンを作成する実装方針となります。

> I created a spec pr for selectedoption which has synchronous timing here: #10633

この段階で、選択された`<option>`変更時に、**同期的に**`cloneNode()`を呼び出すことが決まったように思えました。しかし今度は、`cloneNode()`の挙動にかかる制限について問題提起されます。

## `cloneNode()`の挙動

`cloneNode()`は、メソッドが呼び出されたNodeの複製を返します。`cloneNode(true)`とすることで、`<option>`の子Nodeサブツリーを一括クローンできます。

> The cloneNode() method of the Node interface returns a duplicate of the node on which this method was called. Its parameter controls if the subtree contained in a node is also cloned or not.

しかし、`cloneNode()`は、インラインリスナを含む属性や値をすべてコピーしますが、`addEventListener()`で追加されたイベントリスナや、要素プロパティ（例：`node.onclick = someFunction`）に割り当てられたイベントリスナはコピーしません。

- クローンされるもの（例）
  - 要素の属性: id, class, src などの属性とその値。
  - 要素の子Node: `cloneNode(true)` を使用した場合、すべての子ノードもクローンされる
- クローンされないもの（例）
  - イベントリスナ: `addEventListener()` を使って追加されたイベントリスナや、node.onclick = someFunction のようにプロパティとして設定されたイベントリスナ。
  - `<canvas>` の描画内容: `<canvas>`の描画内容はクローンされない

> Cloning a node copies all of its attributes and their values, including intrinsic (inline) listeners. It does not copy event listeners added using `addEventListener()` or those assigned to element properties (e.g., node.onclick = someFunction). Additionally, for a `<canvas>` element, the painted image is not copied.
>
> [Node: cloneNode() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode)

```html
<body>
    <div id="original" class="example" onclick="alert('Inline listener!')">
        <p>Original Node</p>
    </div>

    <script>
        // イベントリスナを追加
        const original = document.getElementById('original');
        original.addEventListener('click', () => alert('EventListener!'));

        // プロパティとしてリスナを追加
        clone.onclick = () => alert('Property listener!');

        // ノードをクローン
        const clone = original.cloneNode(true);
        clone.id = 'clone';
        document.body.appendChild(clone);

        // 結果:
        // - インラインリスナは動作する（"Inline listener!" が表示される）
        // - addEventListener で追加したリスナは動作しない
        // - プロパティとして追加したリスナは動作しない
    </script>
</body>
```

### なぜ属性や値はクローンされ、プロパティはクローンされないのか？

なぜ、属性や値と、プロパティでクローンの挙動が異なるのでしょうか？

JSXを記述する機会が増えた昨今、属性とプロパティの使い分けが曖昧になってきているかもしれません。しかし、DOMの操作においては、属性とプロパティの違いを意識することが重要です。

- 属性 (Attributes): HTML の一部として定義されており、DOM の静的な構造の一部です。そのため、`cloneNode()` はこの構造をクローン可能です。（参考：[HTML attribute reference - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)）

- プロパティ (Properties): JavaScript によって動的に追加されるもので、DOM の動的な状態を表すのに用いられます。プロパティはオブジェクトのインスタンスに依存しており、`cloneNode()` は新しいオブジェクトを生成するため、元のオブジェクトのプロパティはコピーされません。（参考：[Property (JavaScript) - MDN Web Docs Glossary: Definitions of Web-related terms | MDN](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript)）

`cloneNode()`は、あくまでもHTML管轄のデータをクローンするもので、JavaScript管轄のデータはクローンされません。
こうした、属性とプロパティの違いを理解すると、`cloneNode()`で実現できないことが見えてくるはずです。

### `cloneNode()`の制限

以下のXの投稿では、`<option>`の中に、`<my-thing>`といった内部的にfetchを行うWeb Componentsを配置した場合、`cloneNode()`はfetchを再度実行することになるため、`<option>`を選択するたびにデータフェッチが走ることを指摘しています。これは、`cloneNode()` が新しいオブジェクトを生成し、新しい内部状態を持ったCustom Elementsが再度構築されるためです。

> I'm curious to see if anyone hits the mistake where they write something like `<option><my-thing></my-thing></option>` where my-thing makes an API call when rendering to get data to display, and then every time you pick an option that request runs again
>
> — Elliott Sprehn (@ElliottZ) [September 18, 2024](https://x.com/ElliottZ/status/1836512040120123593)

それだけでなく、例えば、JSを使って描画された`<canvas>`の内容はクローンされません。`<iframe>`の場合は、`src`の再読み込みが発生します。CSS Animationsは、新しく構築された要素として再開されるため、アニメーションが最初から再生されます。

***

`cloneNode()`というソリューションは、一見するとNodeの複製という観点ではシンプルですが、Web ComponentsやJavaScriptによる動的なDOM操作を行う要素が絡む場合、その制限が浮き彫りになりました。

同期的なクローンタイミングの問題と`cloneNode()`制限を踏まえ、今後さらに問題が具体化していきます。

それでは、また明日⛄

See you tomorrow!

### Appendix

- [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)
- [Add `<selectedcontent>` element by josepharhar · Pull Request #528 · w3c/html-aria](https://github.com/w3c/html-aria/pull/528)
- [Define the `<selectedcontent>` element by josepharhar · Pull Request #10633 · whatwg/html](https://github.com/whatwg/html/pull/10633)
- [5370555: Implement <selectedoption> for StylableSelect](https://chromium-review.googlesource.com/c/chromium/src/+/5370555)
- [JS Visualizer 9000](https://www.jsv9000.app/)
- [Accessibility Object Model | aom](https://wicg.github.io/aom/explainer.html)
- [HTML Standard - Custom Element Reaction](https://html.spec.whatwg.org/#concept-custom-element-reaction)
- [In depth: Microtasks and the JavaScript runtime environment - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
- [HTML attributes vs DOM properties - JakeArchibald.com](https://jakearchibald.com/2024/attributes-vs-properties/)

Standard Positions

- WebKit
  - [Customizable select element · Issue #386 · WebKit/standards-positions](https://github.com/WebKit/standards-positions/issues/386)
- Mozilla
  - [Customizable select element · Issue #1060 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1060)
