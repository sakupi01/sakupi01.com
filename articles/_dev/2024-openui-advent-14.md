---
title: "🎄Open UI Advent Calendar: Day 14 / Customizable Select Element Ep.12"
excerpt: "Customizable Select Elementの関連仕様: `<selectedcontent>` - `part`属性をCSEのUA実装で使用することの問題から、`part`属性を`behavior`属性にリネームへ。`<option>`のvalueのみならず、内部コンテンツ自体を`<selectedcontent>`に反映する仕様策定の示唆"
date: "2024-12-14"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の14日目の記事です。
:::

[Ep.11](https://blog.sakupi01.com/dev/articles/2024-openui-advent-13)では、`<selectedcontent>`とはどんな要素なのか、その契機となったIssueの紹介、`part`属性と`slot`属性についてお話ししました。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

### `part`属性を使用することの問題

[Ep.11](https://blog.sakupi01.com/dev/articles/2024-openui-advent-13)でも述べたように、`<selectmenu>`内の`<slot>`で置き換える要素をカスタマイズ可能にしたい場合、その要素に`part`属性を追加する必要があります。これは、`::part()`を使用して、Shadow DOMにスタイルを適用するためです。

しかし、`<selectmenu>`自体が別のShadow Rootにラップされていた場合はどうでしょうか？

Issueでは、例えば、`<my-custom-select>`という別のCustom ElementのShadow Root内に`<selectmenu>`がある場合、その中の`<div slot="button" part="button">`が`<my-custom-select>`の外部からスタイル適用される可能性があるとしています。

CSSで`my-custom-select::part(button)`というセレクタを使用すると、`<my-custom-select>`のShadow Root内の要素へのスタイル適用を許してしまうことになります。

```html
<my-custom-select>
  <template shadowroot=open>
    <selectmenu>
      <div slot="button" part="button">Custom button</div>
      <option>Cat</option>
      <option>Dog</option>
    </select>
  </template>
</my-custom-select>

<style>
  my-custom-select::part(button) {
    /*This will match the button inside the custom element*/
    background-color: red;
    padding:20px;
  }
</style>
```

- [[Enabling Custom Control UI] The use of "part" clashes with custom elements containing <selectmenu> · Issue #483 · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/483)

この問題を解決するために、`part`属性ではない別の属性名の立案が求められ、Open UI内での議論へ波及します。

### Rename `part` to `behavior`

- [[SELECT] The use of "part" clashes with custom elements containing <selectmenu> · Issue #354 · openui/open-ui](https://github.com/openui/open-ui/issues/354)

Open UI内での議論では、以下のような`part`の代替案となる属性名が提案されます。

- component
- subcomponents
- segments
- behavior
- controlpart
- componentpart
- controlsubpart
- controlledpart
- as

https://github.com/openui/open-ui/issues/354#issuecomment-954161227

最終的に`behavior`属性が採用されることになり、WPTにも反映されることになります。

- [3258284: [SelectMenu] Use behavior content attribute instead of part for applying controller code](https://chromium-review.googlesource.com/c/chromium/src/+/3258284)

### 要素をCloneしてカスタマイズ可能にする`<selectedcontent>`の提案

さて、ここまでで、[`<selectedcontent>`の背景](https://blog.sakupi01.com/dev/articles/2024-openui-advent-13#selectedcontentの背景)で述べたIssue提案時の状態になりました。

- [[select] Should the inner HTML & styles of the selected option be copied into selected-value? · Issue #571 · openui/open-ui](https://github.com/openui/open-ui/issues/571)

Issueの期待は、「選択された`<option>`のスタイルが、`<select>`自体のスタイルよりも優先されて表示されるようにするべき」というものだったのに対し、`behavior`属性と`slot`属性を用いると、`<selectmenu>`内の要素をカスタマイズ可能にすることができます。

その際に問題なのが、「選択された`<option>`をどう`<select>`自体のスタイルよりも優先させるか」つまり、「`<option>`の内部をどう`<select>`のボタンに持ってくるか」という部分でした。

仮に、「`<option>`の内部」を「選択された`<option>`のvalueのみ」というスコープに留めると、`<option>`要素が選択された際に、`<slot name="selected-value">`に、選択された`<option>`のvalueを反映することでカスタマイズを可能にする、というワークアラウンドが考えられている、とGregは述べています。

```html
<selectmenu>
  <div slot="button">
    <button behavior="button">Open</button>
    <span behavior="selected-value" slot="selected-value"></span>
  </div>
  <option style="color: blue;">Option 1</option>
  <option style="color: red;">Option 2</option>
  <option style="color: green;">Option 3</option>
</selectmenu>
```

```js
let s = document.querySelector('selectmenu');
let sv = document.querySelector('[behavior=selected-value]');
let possibleOptions = document.querySelectorAll('option');

s.addEventListener('change', () => {
  possibleOptions.forEach((option) => {
    if(option.value == s.value) {
      sv.style.color = option.style.color;
    } 
  });
});
```

しかし、上記は単なる限定的な範囲でのワークアラウンドに過ぎず、`<select>`のボタン部分に反映できるのは、選択された`<option>`の**valueのみ**です。

もともとこのIssueを出した人が、「選択された`<option>`のスタイルが、`<select>`自体のスタイルよりも優先されて表示されるようにするべき」の達成期待値をどこまで持っていたかは不明ですが、その時点での`<selectmenu>`では、`<option>`に任意のコンテンツ/スタイルを設定できるように仕様が固まりつつあったため、「`<select>`のボタン部分には、選択された`<option>`のvalueに限らず、`<option>`内のコンテンツを反映できる方法を考えるべきか？」と、Gregから、Issueの返信として意見が募られます。

すべてのコンテンツを複製して反映するのか、複製するとしたらデフォルトなのか、オプトインなのか、それとも複製せずにvalueだけを反映するのか、このIssueを皮切りに議論が展開されていくことになります。

***

それでは、また明日⛄

See you tomorrow!

### Appendix
