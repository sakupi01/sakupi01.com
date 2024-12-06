---
title: "🎄Open UI Advent Calendar: Day 10 / Customizable Select Element Ep.8"
excerpt: "Customizable Select Element"
date: "2024-12-10"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の10日目の記事です。
:::

## Customizable Select Elementの現時点での挙動

まず、現時点でCSEがどのような見た目、挙動をしているのかを確認してみます。

### 各パーツの定義

![selectの各パーツの定義](/select-anatomy.png)
*selectの各パーツの定義 - 出典: [Request for developer feedback: customizable select  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/rfc-customizable-select?hl=en)*

### デモ

2024/12/4現在、Chrome Canary 130以上でExperimental Web Platform Featuresを有効化して試すことができます。
試してみて、わかったことを色々と書きます。

- オプトインするには`<select>`,`::picker(select)`に`apperance: base-select`を指定
  - CSEのデフォルトの見た目になる
  - 現状の`<select>`を使用しつつ、段階的に移行できる手段として`apperance: base-select`を提供している
- `<select>`にのみ`appearance: base-select;`を指定して、buttonのみスタイルすることも可能
  - `::picker(select)`（ドロップダウン部分）のみに適用することはできない
- `<select>`の中で`<button>`を使うと、その外の要素が`::picker(select)`に入る
  - `<button>`が複数あった場合、一番初めの`<button>`以外は`::picker(select)`に入る
- [記事](https://developer.chrome.com/blog/rfc-customizable-select?hl=ja#limitations_and_accessibility_notes)によると、`<select>`の中には`<div>`、`<span>`、`<option>`、`<optgroup>`、`<img>`、`<svg>`、`<hr>`などインタラクティブじゃない要素が許可されている
  - `<button>`も別にサニタイズされるわけじゃなさそう。ただ、推奨されていないだけかも......
- ドロップダウンはTop Layerにくる
  - Popover APIを使用している？
  - `::picker(select)`のドロップダウンじゃないとき（Top Layerを使用していないとき）は、`<select>`が存在するHTMLドキュメント内に限らず、ディスプレイの任意の箇所からクリックが外されたらドロップダウンが閉じる
  - `::picker(select)`のドロップダウンのときは、`<select>`が存在するHTMLドキュメント内でフォーカスが外されたときに限ってドロップダウンが閉じる

![Chrome Canary 133でのdemo](/cse-demo.png)
*Chrome Canary 133でのdemo*

![ドロップダウンはTop Layerにくる](/top-layer-dropdown.png)
*ドロップダウンはTop Layerにくる*

https://codepen.io/sakupi01/pen/YPKyOyP

これまでの`<select>`に`apperance: base-select`を指定することで、デフォルトの見た目も、カスタマイズ性も、挙動も変わることがわかりました。

---

このように、一部機能は実装されていますが、まだまだ策定段階で議論が続いています

***

それでは、また明日⛄

See you tomorrow!

### Appendix
