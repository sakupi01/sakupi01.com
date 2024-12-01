---
title: "🎄Open UI Advent Calendar: Day 4 / Customizable Select Element Ep.2"
excerpt: "Form Controlが抱える課題と、Customizable Select Element提案の契機"
date: "2024-12-4"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の4日目の記事です。
:::

## レンダリング技術の発展とForm Controlの拡張性

### ほとんどのForm Controlのスタイリングが可能に

OSへの技術的な依存が解消されて、ブラウザレンダリングエンジンによる描画がおこなわれるようになったことに加え、CSS3の登場により、ほとんどのForm Controlに対してスタイリングが可能になりました。

例えば、以下の要素ではスタイリングが可能です。

- `<form>`
- `<fieldset>`、`<legend>`
- `<input>` （type = text, url, email） `<input type="search">` 以外
- `<textarea>`
- ボタン（`<input>` と `<button>` の両方とも）
- `<label>`
- `<output>`

しかし、レンダリングのOSへの依存が解消されてからも、`<select>`などの「入力時になんらかの特殊要素を必要とするもの」に関しては、スタイリングが困難なままでした。

### CustomizableでないForm Controlたち

CustomizableでないForm Controlが存在する根幹の原因は、1995年にHTML2.0に定義されたForm Controlの仕様まで遡ります。

- [RFC 1866 - Hypertext Markup Language - 2.0  - Forms](https://datatracker.ietf.org/doc/html/rfc1866#section-8)

[Ep.1](https://blog.sakupi01.com/dev/articles/2024-openui-advent-3)でも見たように、当初の仕様では、HTMLドキュメントにデータを入力する方法、そのデータを使用してアクションを実行する方法のみが定義され、Form Controlの具体的な構築方法は各ブラウザに委ねられていました。

標準化されていなければ、クロスブラウザの互換性を保つことができないため、Form Controlをスタイラブルにする改善を加えることも現実的ではなくなります。

Form Controlに欠けていたものは、一貫したスタイルの実現だけではありません。例えば、`<video>`や`<audio>`などの要素はcontrols属性を持ち、再生/停止のコントロールを表示/非表示することはできますが、これをスタイリングしたり内部のDOMを制御することはできません。

```html
<audio controls src="/hoge.mp3"></audio>
```

初期の仕様策定の段階で、具体的な実装方法が詰められることがなく、各ブラウザで実装が進められてきた結果、スタイルと拡張性が著しくかけたままのForm Controlが多く存在しています。

かといって、ネイティブForm Controlを使用せずにイチから実装しようとすると、アクセシビリティやパフォーマンス、セキュリティなど、非常に多くの考慮事項が発生します。
もし仮に、完璧なARIAロールを持ち合わせ、パフォーマンスもセキュリティも問題ないようなカスタムForm Controlを実装できたとしても、長期的にその独自Form Controlが動作するかというと、それは保証されていません。

独自Form Controlを構築する上で必要だった実装の一部が、いつの日かWebプラットフォームから廃止されてしまうリスクも考えられます。アクセシビリティの要件もアップデートされ続けます。独自で実装したものを中長期的に運用していくコストは、非常に高いと言えるでしょう。

## Form Controlの抱える問題を解決する動き

Open UIのChairであるGreg Whitworthが、何がForm Controlの中でも扱いにくいのか、それはどうしてなのかを1,400人の回答者を対象に行いました。

https://www.gwhitworth.com/posts/2019/form-controls-components/

- どのForm Controlを独自で実装したか
  1. `<select>`
  2. `<input type="checkbox">`
  3. `<input type="date">`

![re-created-form-controls](/re-created-form-controls.png)

- どうして独自で実装したか
  1. スタイリングできなかったから
  2. 機能拡張したかったから
  3. クロスブラウザでの一貫性がなかったから

![reasons-re-creation](/reasons-re-creation.png)

- どのForm Controlが最も扱いにくいか
  1. `<select>`
  2. `<input type="date">`
  3. `<input type="file">`

![hardest-form-controls](/hardest-form-controls.png)

このサーベイの結果から、`<select>`に関する扱いにくさは特に顕著だとわかります。独自実装している理由としては、スタイリングや機能拡張、クロスブラウザでの一貫性が挙げられています。

この問題に立ち向かうべく、Customizable Select Elementが提案されました。

***

それでは、また明日⛄

See you tomorrow!

### Appendix

- [Tim Berners-Lee: WorldWideWeb, the first Web client](https://www.w3.org/People/Berners-Lee/WorldWideWeb.html)
- [https://web.sfc.keio.ac.jp/~hagino/dis23/01.pdf](https://web.sfc.keio.ac.jp/~hagino/dis23/01.pdf)
- [https://www.w3.org/MarkUp/html-spec/html-spec_toc.html](https://www.w3.org/MarkUp/html-spec/html-spec_toc.html)
- [https://developer.mozilla.org/ja/docs/Learn/Forms/Styling_web_forms](https://developer.mozilla.org/ja/docs/Learn/Forms/Styling_web_forms)
- [Styling form controls with CSS, revisited | 456 Berea Street](https://www.456bereastreet.com/archive/200701/styling_form_controls_with_css_revisited/)
- [20 Years of CSS](https://www.w3.org/Style/CSS20/)
- [CSS Properties Index · Jens Oliver Meiert](https://meiert.com/en/indices/css-properties/)
