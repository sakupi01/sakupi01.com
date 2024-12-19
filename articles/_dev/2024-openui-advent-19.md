---
title: "🎄Open UI Advent Calendar: Day 19 / Customizable Select Element Ep.17"
excerpt: "Customizable Select Elementの関連仕様: UAによるLight DOMへのNodeクローン実装を深掘る"
date: "2024-12-19"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の19日目の記事です。
:::

[Customizable Select Element Ep.16](https://blog.sakupi01.com/dev/articles/2024-openui-advent-18)からは、`<selectedcontent>`が、どうして仕様に入ることになったのか、どういった技術的背景があるのかをお話ししています。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

[Ep.16](https://blog.sakupi01.com/dev/articles/2024-openui-advent-18)では、UAによるLight DOMへのNodeクローン実装について、CSSWGとの合意を得た詳細についてお話ししました。

今回からは、Light DOMでの実装の中でも肝となる、「どのタイミングでクローンするのか」の議論を具体的に見ていきます。

## Timing of cloning for the `<selectedoption>` element

前回までで、Light DOMへのNodeクローンはCSSWGとの合意を得ましたが、その実装については未確定でした。

:::note{.info}
👍🏻 この時点で固まっている仕様

- 選択された`<option>`で、`cloneNode()`をCallする
- 選択された`<option>`の、`<option>`を除く`<option>`内の全てのDOMをクローンする
- `<selectedcontent>`を用いて、宣言的な方法で、クローンされたDOMを`<selectedcontent>`の**Light DOM内に追加する**
- 選択された`<option>`が変更されるたびに、`<selectedcontent>`内のDOMを更新する

:::

具体的には、前回のCSSWGとOpen UIの[会合](https://lists.w3.org/Archives/Public/www-style/2024Jul/0011.html)の中で、「`<option>`の子Nodeを”どのタイミングで”クローンして、`<selectedoption>`に反映するのか」という議論が発散してしまいました。
そのため、今回以下のIssueがWHATWGに切り出されます。

- [Timing of cloning for the `<selectedoption>` element · Issue #10520 · whatwg/html](https://github.com/whatwg/html/issues/10520)

まず、クローンするタイミングの候補として、以下が挙げられました。

1. 同期的にクローンする
2. マイクロタスク実行時にクローンする
3. Custom Element Reaction実行時にクローンする

Jarharが行ったBlinkの初期実装では、マイクロタスクを使用したかったことから、そのタイミングで発火するMutationObserverを使用していました。

では、そもそもどうしてマイクロタスクで実行したかったのでしょうか？

### JS実行タイミングとブラウザレンダリングの仕組みの関係を理解する

マイクロタスクは、「マイクロタスクを呼び出す関数が実行された後、コールスタックが空になった後にのみ実行される短い関数」のことですが、詳細には、「**コールバックキュー**内の**タスクキュー**が空になった後にのみ実行される短いタスク」と説明することがきます。

「コールバックキュー」とは、非同期処理の結果をキューイングするためのキューで、コールバックキュー内のタスクを実行するためのキューが、「タスクキュー」です。

「タスクキュー」とは、文字通り、タスクのキューです。そのキューを構成するのが「タスク」で、MDNでは以下のように説明されています。

> A task is any JavaScript scheduled to be run by the standard mechanisms such as initially starting to execute a program, an event triggering a callback, and so forth. Other than by using events, you can enqueue a task by using setTimeout() or setInterval().
> https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth

つまり、タスクは「プログラムの実行開始やイベントが、コールバックをトリガーするなどの標準的なメカニズムにより実行されるよう、**スケジューリングされた JavaScript のこと**」です。

具体的なタスクの例としては、以下のようなものがあります。

- イベントハンドラの、コールバック関数
- `setTimeout()`や`setInterval()`で登録されたコールバック関数

そして、本題の「マイクロタスク」は「**コールバックキュー内のタスクキューが空になった後にのみ実行される短いタスク**」と説明できました。

例えば、DevtoolsのPerformanceタブでJavaScriptの実行順序を観察してみると、`dispatchEvent`というコールバックキュー内のタスクが実行された後に、「Run microtasks」でマイクロタスクが実行されていることがわかります。

![JSでのマイクロタスクの実行タイミング](/devtools-perf.png)
*JSでのマイクロタスクの実行タイミング*

そして、このマイクロタスクの実行タイミングが、ブラウザレンダリングの過程でどこに当たるのかを図で表すと以下のようになります。

![JS実行タイミングとレンダリングの相関図](/js-rendering-relationship.png)
*JS実行タイミングとレンダリングの相関図*

JavaScriptは、JavaScriptエンジンによって実行されます。同期的な処理はそのままJavaScriptエンジンにより実行されますが、非同期的に実行されるタスクは、一旦コールバックキューに入ります。その後、タスクキューのタスクから優先的に処理され、最後にマイクロタスクキューに入っているタスクが処理されます。

### マイクロタスクを使うメリット

つまり、マイクロタスクキューは、JS一連の実行タイミングの中でも最後に非同期実行されるキューです。
そのため、キューをうまく管理する実装（例えば、同じ`<option>`が選択された場合は、キューにpushしないなど）ができれば、パフォーマンスの点で優れた実装が見込まれます。
それをすでにある仕様で実現できるのが、MutationObserverであっため、初期のBlinkはMutationObserverでクローンタイミングを制御していました。

### 同期的なMutationObserver： CEReactions MutationObserverの提案

これに対して、Custom Elementの文脈で利用される`attributeChangedCallback`や`connectedCallback`などの「CEReactionタイミング」での変更を検知する、CEReactions MutationObserverの実装を提案する意見もありました。

CEReactionsは、Custom Elementのライフサイクルに関連するタイミングで発火するコールバック関数のことです。このタイミングを利用することで、Custom Elementのライフサイクルに合わせて**同期的に**クローンを行うことができます。

MutationObserverは、キューイングによるパフォーマンス向上が利点でしたが、CEReactionsは同期的な処理で、Layout Treeとの整合性を保つことができます。

CEReactionsを使った手法を主張するMozillaの[smaug](https://github.com/smaug----)は、以下のように述べています。

> The over-cloning would happen only if one mutates the content of the selected option, no? The normal case is that user selects one option and the contents get cloned once. So CEReaction or even more synchronous cloning might not be too bad in this case.
>
> ほとんどのケースでは、ユーザーは1つの`<option>`を選択し、コンテンツが1回だけクローンされる。したがって、CEReactionタイミングで同期的にクローンすればいいのでは？
>
> Microtasks were designed for MutationObserver, and the reason was to improve performance in cases when one does lots of DOM mutation all over the place. That is not quite the case here.
>
> マイクロタスクはほぼMutationObserverのために設計されたと言っても過言ではなく、目的は、あちこちでたくさんのDOM変更を行う場合にパフォーマンスを向上させることにある。ここではそいうケースじゃないだろうから使わなくていいのでは？

***

クローンタイミング実装の初期勘案では、主に２つの方法が挙げられましたが、Jarharは、最終的にマイクロタスクを使ったMutationObserverを使う方向を示します。

> I think we should go with microtasks instead of CEReactions for the following reasons:
>
> - MutationObservers already use microtasks, so trying to create an alternate type of CEReactions MutationObserver would be harder to spec and harder to implement.
> - -> MutationObserverはすでにマイクロタスクを使っているので、別のCEReactions MutationObserverを作成しようとすると、仕様を作成する必要があり、実装するのも難しい。
> - Performance will be better when imperatively building or modifying option elements due to fewer calls to clone all of the options contents into selectedoption elements.
> - → 選択された`<option>`の内容をクローンする回数を減らせるため、`<option>`を命令的に構築または変更する際のパフォーマンス向上が期待できる。
> - As @dandclark said in the call, it will be easier to understand how this works because it matches the author defined API of MutationObserver. I think this also increases the likelihood that this element is polyfillable.
> - → MutationObserverのAuthor定義APIと一致するため、どう機能するか理解しやすい。これにより、この要素がポリフィル可能である可能性も高まると思う。

以下が、これまでの議論結果を含めたBlinkでの再実装です。

- [5758741: Improve <selectedoption> performance](https://chromium-review.googlesource.com/c/chromium/src/+/5758741)

ここまでが、[議論](https://github.com/whatwg/html/issues/10520)の1/3程度の内容でした。

***

それでは、また明日⛄

See you tomorrow!

### Appendix

- [select: Should `<selectedoption>` respond to mutations in the selected `<option>` · Issue #825 · openui/open-ui](https://github.com/openui/open-ui/issues/825)
- [Add `<selectedcontent>` element by josepharhar · Pull Request #528 · w3c/html-aria](https://github.com/w3c/html-aria/pull/528)
- [Define the `<selectedcontent>` element by josepharhar · Pull Request #10633 · whatwg/html](https://github.com/whatwg/html/pull/10633)
- [[html-aam] Addition: selectedoption element by scottaohara · Pull Request #2344 · w3c/aria](https://github.com/w3c/aria/pull/2344)
- [5370555: Implement <selectedoption> for StylableSelect](https://chromium-review.googlesource.com/c/chromium/src/+/5370555)
- [JS Visualizer 9000](https://www.jsv9000.app/)
- [Accessibility Object Model | aom](https://wicg.github.io/aom/explainer.html)
- [HTML Standard - Custom Element Reaction](https://html.spec.whatwg.org/#concept-custom-element-reaction)
- [In depth: Microtasks and the JavaScript runtime environment - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)

Standard Positions

- WebKit
  - [Customizable select element · Issue #386 · WebKit/standards-positions](https://github.com/WebKit/standards-positions/issues/386)
- Mozilla
  - [Customizable select element · Issue #1060 · mozilla/standards-positions](https://github.com/mozilla/standards-positions/issues/1060)
