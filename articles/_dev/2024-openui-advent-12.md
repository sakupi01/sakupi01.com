---
title: "🎄Open UI Advent Calendar: Day 12 / Customizable Select Element Ep.10"
excerpt: "Customizable Select Elementの関連仕様"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の12日目の記事です。
:::

Customizable Select Element Ep.9から、 `appearance: base-select;`で提供される、CSEのデフォルトの見た目が決定された背景の議論をお話ししてきました。

Ep.9では、`<option>::checkmark`が現状の見た目となった背景について、Ep.10では、ポップオーバーを開閉するボタン要素右の矢印アイコン`::picker-icon`について深掘りました。 今回は、CSEがデフォルトで使用する「色」の関連技術について理解を深めていきます。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

## Customizable Select Elementの関連仕様

### `<system-color>`、`prefers-color-scheme`、そして`color-scheme`

UAスタイルシートに定義される一般的な色として、`<system-color>`キーワードがあげられます。
`<system-color>`キーワードを使用すると、ユーザやブラウザ、OSが設定したデフォルトの色選択を反映した色でレンダリングされるのため、`<system-color>`はUAスタイルシートで一般的に使用されています。

この`<system-color>`にどのような色が適用されるかは、**`prefers-color-scheme`や`color-scheme`によって変化**します。

### `@media(prefers-color-scheme: <light | dark>)`

`@media(prefers-color-scheme: <light | dark>)`を使用すると、**ユーザが**設定したカラーテーマである`prefers-color-scheme`をページに反映することができます。

> The prefers-color-scheme media feature reflects the user’s desire that the page use a light or dark color theme.
> https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme

例えば、ユーザのOSのカラー設定がダークテーマだった場合、`prefers-color-scheme`が使用されていれば、一般的には`@media(prefers-color-scheme: dark)`中に記述した、ダークテーマのCSSが適用されます。

### `light-dark()`関数

2024年のCSS新機能として登場した、`light-dark()`関数は、`@media(prefers-color-scheme: <light | dark>)`を使用せずとも、**ブラウザが**設定したカラーテーマを、スタイル可能な要素に反映することができるCSS関数です。

```css

:root {
  color: light-dark(var(--light), var(--dark));
  background-color: light-dark(var(--light-bg), var(--dark-bg));
}

```

[CSS Color Module Level 5の仕様](https://drafts.csswg.org/css-color-5/#light-dark)によると、`light-dark()`関数は`color-scheme`プロパティによってテーマを決めることができます。従来からこの機能を持っていたのは`<system-color>`でしたが、`light-dark()`関数の登場により、`color-scheme`プロパティのテーマに依存した色の変更が可能になりました。

> System colors have the ability to react to the current used color-scheme value. The light-dark() function exposes the same capability to authors.

`light-dark()`関数は、`color-scheme`がライトテーマか不明な場合は1番目の`<color>`値を、ダークテーマの場合は2番目の`<color>`値を適用します。

### `color-scheme`プロパティ

`color-scheme`プロパティを使用すると、**ブラウザが**設定したカラーテーマを、要素に反映することができるCSS関数です。

```css
/* OSのライトテーマのみをサポートする */
color-scheme: light;
/* OSのダークテーマのみをサポートする */
color-scheme: dark;
/* 両方サポートする */
color-scheme: light dark;
/* ライトテーマを強制する */
color-scheme: only light;
/* ダークテーマを強制する */
color-scheme: only dark;
/* ページデフォルトのカラーテーマを使用する */
color-scheme: normal;
```

***

このように、`prefers-color-scheme`はユーザが適用するカラーテーマであるのに対し、`color-scheme`はブラウザが適用するカラーテーマです。
そして、`prefers-color-scheme`に依存する`@media(prefers-color-scheme: <light | dark>)`は、「ユーザのカラーテーマ」を反映するのに対し、`color-scheme`に依存する`light-dark()`は、「ブラウザのカラーテーマ」を反映します。

### カラースキーマの計算方法

`color-scheme`は**ブラウザが**適用する色を決めるCSSプロパティですが、どのようにして実際に適用される色は決まるのでしょうか？

> To **determine the used color scheme** of an element:
>
> 1. If the user’s preferred color scheme, as indicated by the prefers-color-scheme media feature, is present among the listed color schemes, and is supported by the user agent, that’s the element’s used color scheme.
>
> 2. Otherwise, if the user has indicated an overriding preference for their chosen color scheme, and the only keyword is not present in color-scheme for the element, the user agent must override the color scheme with the user’s preferred color scheme. See § 2.3 Overriding the Color Scheme.
>
> 3. Otherwise, if the user agent supports at least one of the listed color schemes, the used color scheme is the first supported color scheme in the list.
>
> 4. Otherwise, the used color scheme is the browser default. (Same as normal.)
> https://drafts.csswg.org/css-color-adjust/#color-scheme-prop

つまり、以下の順番でどのような色が適用されるか決まります。

1. `prefers-color-scheme`の色が`color-scheme`によってサポートされる場合：`prefers-color-scheme`の色が適用される
2. そうでない場合で、`color-scheme`で「only」を使用せずに「light/dark」が適用されている場合：`prefers-color-scheme`の色が適用される
3. そうでない場合、つまり`color-scheme`に「only」を使用して「light/dark」が適用されている場合：`color-scheme`の色が適用される
4. 上記いずれでもない場合：[`color-scheme: normal;`](https://drafts.csswg.org/css-color-adjust-1/#valdef-color-scheme-normal)の色が適用される。ページデフォルトの色が[`<meta name="color-scheme" content="dark">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme)で指定されている場合はその色が適用され、指定されていない場合はページデフォルトの色（通常はライトテーマ）が適用される

上記の適用順序を確認できるデモを作成しました。長いのでCopepenリンクのみ記載します。

デモ：

https://codepen.io/sakupi01/pen/MYgjvwy

***

### `<system-color>`キーワード

`<system-color>`は、`light-dark()`関数と同様、**`color-scheme`によって適用される色が決まるキーワード**です。

身近な例として、`<textarea>`要素の背景色である「Field」やその文字色である「FieldText」など、多くのシステムカラーが定義されています。

![system-colorの例](/system-colors.png)
*system-colorの例*

- [CSS Color Module Level 4](https://drafts.csswg.org/css-color/#css-system-colors)

`<system-color>`キーワードを使用すると、`color-scheme`の値を反映して、UAスタイルシート外部の設定と調和できるため、`<system-color>`はUAスタイルシートで一般的に使用されているのです。

### ボタン要素や`::picker()`の色

そういうわけで、CSEの`::picker()`の色には、`<system-color>`を使用することに決まりました。

```css

::picker(select) {
  /* Same properties as popover and dialog */
  color: CanvasText;
  background-color: Canvas;
  border: 1px solid;
}
/* https://github.com/w3c/csswg-drafts/issues/10857 */
```

加えて、ボタン部分を表す、`<select>`の色に関しては、以下の議論の結果、`<select>`には透明な背景色を使用し、色は親要素から継承するという決定がなされました。

> RESOLVED: Use currentColor for borders, inherit the color, transparent background color (for in-page controls). Use system colors for pickers.
> https://github.com/w3c/csswg-drafts/issues/10909#issuecomment-2491769385

今回はそこまで追えなかったのですが、`<select>`の各状態に応じたスタイルも議論されており、現状は以下のような`<select>`のスタイルが提案されています。

```css
select {
  border: 1px solid currentColor;
  background-color: transparent;
  color: inherit;
}
select:enabled:hover {
  background-color: color-mix(in lab, currentColor 10%, transparent);
}
select:enabled:active  {
  background-color: color-mix(in lab, currentColor 20%, transparent);
}
select:disabled {
  color: color-mix(in srgb, currentColor 50%, transparent);
}

select option:enabled:hover {
  background-color: color-mix(in lab, currentColor 10%, transparent);
}
select option:enabled:active {
  background-color: color-mix(in lab, currentColor 20%, transparent);
}
select option:disabled {
  color: color-mix(in lab, currentColor 50%, transparent);
}

/* https://github.com/w3c/csswg-drafts/issues/10909#issuecomment-2491769385 */
```

***

今回はその一部であるボタン要素や選択肢ポップオーバーの色に関して取り上げました。

- [x] `appearance: base-select;`の見た目は、どのようにして決まったのか
  - [x] 選択された`<option>`のデフォルトチェックマーク
  - [x] ポップオーバーを開閉するボタン要素右の矢印アイコン
  - [x] ボタン要素や選択肢ポップオーバーの色
  - [ ] ~その他のスタイル~

その他のスタイルについては、現時点では不確定要素が多いため、今後確定してきた段階で調査していきたいと思います。

`appearance: base-select;`に関して、今回紹介した以外の、現状検討されているその他スタイルに関しては、[こちらのIssue](https://github.com/w3c/csswg-drafts/issues/10857#issue-2514699640)を参照ください。

それでは、また明日⛄

See you tomorrow!

### Appendix

- [CSS System Colors - Jim Nielsen’s Blog](https://blog.jim-nielsen.com/2021/css-system-colors/)
- [Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)
- [CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/)
- [CSS Color Adjustment Module Level 1](https://drafts.csswg.org/css-color-adjust-1/#color-scheme-prop)
- [Colors to use for appearance base `<select>`](https://lists.w3.org/Archives/Public/www-style/2024Oct/0012.html)
- [[css-ui] Colors to use for appearance base `<select>` · Issue #10909 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10909#issuecomment-2491769385)
