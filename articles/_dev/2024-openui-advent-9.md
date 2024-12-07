---
title: "🎄Open UI Advent Calendar: Day 9 / Customizable Select Element Ep.7"
excerpt: "`<selectmenu>`のその後：`<selectlist>`から`<select>`に至るまで"
date: "2024-12-9"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の9日目の記事です。
:::

[Customizable Select Element Ep.6](https://blog.sakupi01.com/dev/articles/2024-openui-advent-8)では、`<selectmenu>`が改名され、`<selectlist>`に至るまでの経緯をお話ししました。

## `<selectmenu>`のその後：`<selectlist>`から`<select>`に至るまで

主に既存のUIパターンとの混乱を避けるための様々な考慮がなされ、`<selectmenu>`は`<selectlist>`にリネームされました。

本格的に`<selectlist>`の運用が始まる中で、whatwg/htmlに、`<select>`のHTML/CSSに関するIssueとPRをまとめたIssueが開かれました。

- [Customizable `<select>` element · Issue #9799 · whatwg/html](https://github.com/whatwg/html/issues/9799)
![現在は`<select>`だが、その前の`<selectlist>`時代に開かれている](/select-wrapped-issue.png)
*現在は`<select>`だが、その前の`<selectlist>`時代に開かれている*

そして、このIssueを皮切りに、`<select>`から`<selectlist>`への移行が検討されていくことになります。

まずその口火を切ったのが、AppleでWHATWGの[Anne van Kesteren](https://x.com/annevk)でした。その後の会話からすると、以下の提案はAnneとJoey Arharを含むcolleaguesの間で話し合われ、それをAnneが代表してここにまとめていることがわかります。

提案の内容は以下です。

> Thank you for bringing this proposal to the WHATWG Joey! I thought this would be a good opportunity to outline how colleagues and I feel about extending HTML in this area. In particular, we feel that new and existing form controls:
>
> - Should look the same as the operating system controls by default.
> - Should be fully styleable by web developers.
> - Should generally attempt to follow existing HTML element patterns.
> - Should not be redundant with existing HTML form controls.
> - Should work on a wide variety of platforms, including those with very small screens, no mouse or touch, etc.
> - Should be fully accessible.
> - Should not have any l10n or i18n shortcomings.
>
> We understand that **the select element can’t address a variety of scenarios due to parser limitations, but the select element could address them in combination with the datalist element.** **One of our big worries with complete duplication is that we end up not solving the problems with the existing controls and that the duplicated controls will have a variety of shortcomings the older controls did not have.**
> https://github.com/whatwg/html/issues/9799#issuecomment-1770254871

このコメントの内容を理解する前に、まず、CSEが別要素として仕様策定されるべきだと判断された根拠を振り返ってみましょう。

CSEのExplainerは、当初MS内で検討が始まりましたが、その過程の中で以下のような議論が交されていました。

> @mfreed7 pointed out that we'd need to deal with the fact that the custom attribute could be added/removed dynamically, which adds complexity. Parsing is particularly concerning here, since the attribute would change the parsing rules for the subtree of the `<select>`. Is there any scenario where a `<select>` could have script change it to custom when we're in the middle of parsing its subtree?

つまり、**Opt-inするための属性の有無によって`<select>`のパースのされ方が変わることになるので、パース中にOpt-inするための属性を動的に追加/削除された場合、正しい挙動を再現する実装が難しい**ということでした。

```js title="e.g. optionに任意の要素を正常に追加することができる"
const combobox = document.createElement('select');
document.body.appendChild(combobox);
combobox.addAttribute('newbehavior','true'); // Opt in!
combobox.innerHTML = '<option><img src="cat.jpg">Cat</option><option><img src="dog.jpg">Dog</option>';
// Here, we have a fancy, new <select> with images of cats and dogs
// https://github.com/whatwg/html/issues/5791#issuecomment-671477100
```

```js title="e.g. タイミングの問題で、optionに任意の要素を追加することができない"
const combobox = document.createElement('select');
document.body.appendChild(combobox);
combobox.innerHTML = '<option><img src="cat.jpg">Cat</option><option><img src="dog.jpg">Dog</option>';
combobox.addAttribute('newbehavior','true'); // Opt in, but a little late
// Boo! No images here, because we opted in after innerHTML, and the parser removed the <img> tags.
// https://github.com/whatwg/html/issues/5791#issuecomment-671477100
```

- [Opt-in for `<select>` customizability · Issue #364 · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/364)
- [Opt-in for `<select>` customizability · Issue #5791 · whatwg/html](https://github.com/whatwg/html/issues/5791)

これによって、CSEは別要素として実装される方向に舵が切られました。

対して、先ほどの[Anneのコメント](https://github.com/whatwg/html/issues/9799#issuecomment-1770254871)からは、別要素で実装することで考えられる別の問題点が挙げれられています。

> the select element can’t address a variety of scenarios due to parser limitations, but the select element could address them in combination with the datalist element. One of our big worries with complete duplication is that we end up not solving the problems with the existing controls and that the duplicated controls will have a variety of shortcomings the older controls did not have.
>
> select要素はパーサーの制限によりさまざまなシナリオに対応できないが、datalist要素と組み合わせることで対応できる。
> 最大の問題は、既存のControl（つまり`<select>`）の問題はそのままになり、複製されたControl（つまり`<selectlist>`）には、`<select>`にはなかったさまざまな欠点が生じる可能性があることです。

CSEは`<select>`を”完全に”カスタマイズ可能にすることを目指しているので、`<select>`の中に入れる要素やその構造も制限されないようにしなければなりません。

しかし、当初考えられていた「`<select>`にOpt-in属性を追加する方法」では、パースタイミングの問題により、`<select>`の中に入れる要素が制限されてしまう可能性がありました。

そのため、`<select>`とは別要素として実装する必要があるという結論に至ったのですが、「`<selectlist>`の中に入れるポップアップ内の任意要素は`<listbox>`でラップする」というのが当時の`<selectlist>`の仕様でした。

```html title="当時のselectlistの例"
<selectlist>
  <button type="selectlist">
    <selectedoption></selectedoption>
    <span>Felids</span>
  </button>
  <listbox>
    <input type="search">
    <div tabindex="-1">
      <option value="Asian golden cat">Asian golden cat</option>
      <option value="Bay cat">Bay cat</option>
      <option value="Marbled cat">Marbled cat</option>
    </div>
  </listbox>
</selectlist>
```

- [Open UI's selectlist demos](https://microsoftedge.github.io/Demos/selectlist/index.html)

しかし、これは既存の`<select>`と`<datalist>`との組み合わせで実現可能であるとAnneは主張します。

加えて、`<selectlist>`という別要素として実装した場合、既存の`<select>`と`<datalist>`の問題は解消されません。Progressive Enhancementの観点からも、`<select>`を採用を検討したいとのことでした。

さまざまな意見が交換された結果、Anneの提案通り、2023/12の段階で以下のようにまとまることになります。

1. Reusing the `<select>` element will work: `<select>`はCSEの実現に利用できる
2. We can change the parser for `<select>` to allow particular new child tags like `<button>` and `<datalist>`: `<select>`のパーサーを変更して（緩めて）、`<button>`や`<datalist>`などの新しい子要素を許可できる
3. We can work incrementally, first by making these parser changes in the spec etc.: まずは仕様などでパーサーの変更を行い、段階的に進めることができる
4. Using `<datalist>` as a child of `<select>` will work to replace the listbox with custom content: `<select>`の子要素として`<datalist>`を使用することで、listboxをカスタムコンテンツで置き換えることができる

---

このWHATWGでの議論の結果を以て、Open UIでも正式に`<selectlist>`/`<listbox>`から`<select>`/`<datalist>`を使用することに決定され、[Open UIのselectlistのExplainer](https://open-ui.org/components/selectlist/)も`<select>`に変更されました。

- [selectlist feedback from apple · Issue #970 · openui/open-ui](https://github.com/openui/open-ui/issues/970)

> I updated the explainer to be `<select>` instead of `<selectlist>`: https://open-ui.org/components/selectlist/
> https://github.com/whatwg/html/issues/9799#issuecomment-1885356884

`<selectlist>`から`<select>`への変更理由は、最近web dot devから発表されたRFCでも触れられています。

- [Enhance the existing <select> element | Request for developer feedback: customizable select  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/rfc-customizable-select#enhance_the_existing_select_element)

[Allow <button> and <datalist> in <select> by chromium-wpt-export-bot · Pull Request #43640 · web-platform-tests/wpt](https://github.com/web-platform-tests/wpt/pull/43640)

***

また良い長さになってしまったので終わってしまうんですが、Anneの提案以降に議論された`<select>`に至る過程が興味深いものだったので、また書くかもしれません。
今度は、そんなCustomizableな`<select>`の現状を見ていきたいと思います。

それでは、また明日⛄

See you tomorrow!

### Appendix

- [Two levels of customising `<selectlist>` | hidde.blog](https://hidde.blog/custom-select-with-selectlist/)
- [Open UI's selectlist demos](https://microsoftedge.github.io/Demos/selectlist/index.html)
