---
title: "🎄Open UI Advent Calendar: Day 15 / Customizable Select Element Ep.13"
excerpt: "Customizable Select Elementの関連仕様: `<selectedcontent>` - `<option>`の内部コンテンツ自体を`<selectedcontent>`に反映する仕様の検討"
date: 2024-12-15
beginColor: 'from-red-500'
middleColor: 'via-lime-500'
endColor: 'to-green-700'
category: 'dev'
tags: ['openui', 'advent calendar']
status: 'published'
---
## Table of Contents

## はじめに

:::note{.message}
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の15日目の記事です。
:::

[Ep.12](https://blog.sakupi01.com/dev/articles/2024-openui-advent-14)では、`part`属性を使用することの問題、解決策として`behavior`属性の提案、そして、要素をCloneしてカスタマイズ可能にする`<selectedcontent>`の契機についてお話ししました。

![2024/12/9時点でのselectの各パーツの定義](../../../../assets/images/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

## Customizable Select Elementの関連仕様

### 選択された`<option>`のコンテンツを`<button>`に反映することの正当化

当時の`<selectmenu>`の仕様では、「`<slot name="selected-value">`に、選択された`<option>`のvalueを反映し、`behavior`属性で外部からShadow DOMのカスタマイズ可能にする」ということまで可能でした。（[Ep.12](https://blog.sakupi01.com/dev/articles/2024-openui-advent-14)参照）

しかしこれは、「`<option>`のvalueだけでなく、選択された`<option>`内要素自体のクローンを反映すべきだろうか？反映するとしたらどのような手法で行うべきだろうか？」という議論に波及します。

まず、これを実装するモチベーションとなるユースケースが考えられ、「アバター + 名前」、「名前のみ」、「国旗 + 国名」などの例が挙げられました。
「アバター + 名前」や「国旗 + 国名」のように「リッチなコンテンツの**完全な**クローン」となる場合もあれば、「名前のみ」のように「リッチなコンテンツの**一部の**クローン」となる場合も考えられます。
このユースケース調査により、完全なクローンを反映することのみならず、その一部のみを`<select>`に表示できるようにする必要があるという合意が取れました。

![国旗 + 国名](../../../../assets/images/flag-clone.png)
*国旗 + 国名*
![アバター + 名前](../../../../assets/images/avatar-clone.png)
*アバター + 名前*
![名前のみ（optionにアバターはあるが、buttonには反映されない）](../../../../assets/images/only-name-clone.png)
*名前のみ（optionにアバターはあるが、buttonには反映されない）*

### 選択された`<option>`のコンテンツを`<button>`に反映する方法の検討

その上で、どう実現するかについて議論され、以下の4つの方法が提案されました。

> 1. Clone innerHTML of the option and insert that into the selected value part and leverage CSS to hide what you don't want rendered
> 2. Provide an implicit slotting functionality
> 3. Provide an attribute that enables referencing what content you want cloned
> 4. Keep as it's currently defined which is to take the inner text of the option and insert that into the selected value part
>
> ***
>
> 1. `<option>`のinnerHTMLをクローンして`<button>`へ実際に挿入し、表示したくない部分はCSSで隠す
> 2. 選択された要素を暗黙的に`<button>`部分へスロットすることで実現する
> 3. 属性によって、クローンしたいコンテンツを参照する
> 4. `<option>`内のテキストを`<button>`に挿入する(現在の仕様のまま)
> <https://github.com/openui/open-ui/issues/571#issuecomment-1298712385>

まず、2の「選択された要素を暗黙的に`<button>`部分へスロットすることで実現する」方法を実現するには、ドロップダウンが開いている状態のとき、スロット元の選択された要素がドロップダウンの中に存在しつつ、button部分へスロットもされなければなりません。しかし、「スロットしつつ、スロット元にも表示する」を実現する機能は、現状の`<slot>`ではサポートされていません。

:::note{.memo}
📝 クローンとスロット:

これまでで何度かクローンという表現とスロットという表現を出したので、ここで一度整理しておきます。

- クローン: [DOMの仕様](https://dom.spec.whatwg.org/#ref-for-dom-node-clonenode%E2%91%A0)の一部。`Node.cloneNode()`を使って、DOMノード自体を他の場所に複製すること。”複製”なので、クローン元にも実態が残る。`clonable`なShadow DOM内の要素を複製することもできる。
- スロット: DOMの中でも、[Shadow DOMの仕様](https://dom.spec.whatwg.org/#shadow-tree-slots)の一部。Shadow Root内の`<slot>`を置いた箇所に、外部から要素を挿入するための仕組み。slot元の要素はslot先から参照され、slot先に実態はない。

:::

これに関しては、[Content Mirroring](https://github.com/openui/open-ui/issues/616)が実装されることで可能になりますが、実装の目処が立っていない（`selectmenu`を実装することよりもハードルが高い可能性がある）ので、採用は見送りたいということから深く議論されませんでした。

また、4の「`<option>`のinnerTextを`<button>`に挿入する」方法は、これからの議論で、innerHTMLをクローンする手法が適合しない・難しいと判断された場合の、最も妥当な選択肢という立ち位置になりました。

そこで、実際にクローンした要素を挿入することで、表示したいものとしたくないものを出し分けしやすく、開発のしやすさの観点からも最も優れている、1の「`<option>`のinnerHTMLをクローンして`<button>`へ実際に挿入し、表示したくない部分はCSSで隠す」方法について話し合われていきます。

### innerHTMLをクローンすることの問題

しかし、1をサポートする上での懸念が上がります。

まず、`<option>`内にIDが含まれている場合、そのIDが複製されることで、ページ内でIDの重複が発生します。それにより、JSがIDで`<option>`のコンテンツをクエリしている場合、innerHTMLをクローンすることでIDが重複し、クエリが壊れる可能性が指摘されました。

また、`<option>`自体をコピーせずに、`<option>`の子要素コンテンツをクローンするという実装をした場合、スタイルが壊れる可能性もありました。例えば、以下のようなCSSを書いて、`<option>`内のコンテンツ（`.redOption`）にスタイルを当てていた場合、`<option>`のコンテンツのみをクローンする実装では、クローンされた先でスタイルが当たりません。

```css
option .redOption { background-color: red }
```

そのため、`<option>`自体をクローンする実装にするのかというと、`<button>`内に`<option>`が存在することになり、あまりにも不自然です。

そして、`<option>`内にShadow Rootがある場合の取り扱いについても考慮されるべきという指摘がありました。単純なinnerHTMLでは、Shadow Root内のコンテンツが取得できないため、クローンされません。

現状は、以下のようなJavaScriptを用意することで、実現したいことは達成されるので、わざわざ標準化せずとも、ページ開発者自身が必要に応じてスクリプトを用いて実装することが可能です。開発者自身でオプトイン可能なことをここで標準化すると、`<selectmenu>`自体のShipが遅れてしまうというのが、Jarharの主張でした。

```js
selectmenu.addEventListener('change', () => {
  selectedvalue.innerHTML = selectmenu.selectedOption.innerHTML;
  selectedvalue.className = selectmenu.selectedOption.className;
});
```

これらの標準化の難しさを踏まえ、`<selectmenu>`では、選択された`<option>`のinnerHTMLのクローンを標準化すべきではないという結論に至りました。
当時の時点では、代わりに、開発者が必要に応じて、スクリプトを用いてこの機能を実装することが推奨されることになります。

> RESOLVED: Don't implement behavior to copy innerHTML from the selected option into the selected value for V1 of selectmenu
> <https://github.com/openui/open-ui/issues/571#issuecomment-1472206358>

将来的には、実装される可能性のある[Content Mirroring](https://github.com/openui/open-ui/issues/616)を用いて、オプトインの形でこの機能を提供する可能性があることにも触れられて、この議論自体は一旦この結論でまとまりました。

***

つまり、この時点では、選択された要素をクローンしてカスタマイズ可能にすることに関しては議論されたものの、何か新たに仕様策定されるといいうことはなく、`<selectmenu>`は引き続き、`slot`属性と`behavior`属性を使用してカスタマイズする方針のままでした。

そんな中提起された、`slot`属性と`behavior`属性への疑念が、ことを前に動かします。

***

それでは、また明日⛄

See you tomorrow!

### Appendix
