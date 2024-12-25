---
title: "🎄Open UI Advent Calendar: Day 12 / Customizable Select Element Ep.10"
excerpt: "Customizable Select Elementの関連仕様:  `appearance: base-select;` - `::picker()`のデフォルト色から深掘る、system-color/ color-scheme/ prefers-color-schemeの関係"
date: "2024-12-12"
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

[Ep.9](https://blog.sakupi01.com/dev/articles/2024-openui-advent-11)では、`<option>::checkmark`が現状の見た目となった背景について、[Ep.10](https://blog.sakupi01.com/dev/articles/2024-openui-advent-12)では、ポップオーバーを開閉するボタン要素右の矢印アイコン`::picker-icon`について深掘りました。 今回は、CSEがデフォルトで使用する「色」の関連技術について理解を深めていきます。

![2024/12/9時点でのselectの各パーツの定義](/select-anatomy.png)
*2024/12/9時点でのselectの各パーツの定義*

## Customizable Select Elementの関連仕様

CSEの主に`::picker()`部分のデフォルトカラーには`<system-color>`が使用されています。

### `<system-color>`キーワードとは

`<system-color>`は、**ユーザのカラーテーマ設定や`color-scheme`によって適用される色が決まるキーワード**です。

身近な例として、`<textarea>`要素の背景色である「Field」やその文字色である「FieldText」などがあり、多くのシステムカラーが定義されています。

![system-colorの例](/system-colors.png)
*system-colorの例*

- [CSS Color Module Level 4](https://drafts.csswg.org/css-color/#css-system-colors)

この`<system-color>`にどのような色が適用されるかは、**ユーザのカラーテーマ設定や`color-scheme`によって変化**します。

### `color-scheme`プロパティ

`color-scheme`プロパティは、**ページ実装者（以下、Author）が設定したカラーテーマ**を反映できるCSSプロパティです。

`<select>`のみならず、多くのForm Controlやスクロールバーなどは、歴史的背景からAuthorによるスタイルが困難なものばかりです。
そうしたAuthor スタイルシートからスタイルが困難な要素が、カラーテーマに対応できるよう、`color-scheme`プロパティが存在しています。

> While the prefers-color-scheme media feature allows an author to adapt the page’s colors to the user’s preferred color scheme, many parts of the page are not under the author’s control (such as form controls, scrollbars, etc). The color-scheme property allows an element to indicate which color schemes it is designed to be rendered with. These values are negotiated with the user’s preferences, resulting in a used color scheme that affects things such as the default colors of form controls and scrollbars. (See § 2.2 Effects of the Used Color Scheme.)
> https://drafts.csswg.org/css-color-adjust/#color-scheme-prop

`color-scheme`プロパティは以下のような値を取ります。

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

### `@media(prefers-color-scheme: <light | dark>)`

`color-scheme`でAuthorが設定したカラーテーマを反映できるのに対し、`@media(prefers-color-scheme: <light | dark>)`を使用すると、**ユーザが設定したカラーテーマ**を、`prefers-color-scheme`を用いてページに反映することができます。

> The prefers-color-scheme media feature reflects the user’s desire that the page use a light or dark color theme.
> https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme

例えば、Macのシステム設定などで、OSにユーザが設定したカラーテーマがダークテーマだった場合、`@media(prefers-color-scheme: dark)`中に記述した、ダークテーマのCSSが適用されます。

```css
@media (prefers-color-scheme: light) {
  :root {
    color: var(--light);
    background-color: var(--light-bg);
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    color: var(--dark);
    background-color: var(--dar-bg);
  }
}
```

このように、`prefers-color-scheme` Media Queryを用いると、ユーザがブラウザやOSに適用したカラーテーマを、コンテンツに反映することができます。反映させるのはあくまでAuthorで、 Author が`prefers-color-scheme`を CSS でクエリして、そこにスタイルをあてて始めてコンテンツに反映されます。ユーザがカラーテーマ変えたからといって、Media Queryにスタイルが当たっていなければ、ページのスタイルが変わるとは限りません。

`color-scheme` は、Author が要素やページ自体に対して、対応しているカラーテーマを宣言するプロパティです。例えば、ユーザがOSにはダークテーマを設定してる場合に、AuthorがページにDark/Light切り替え機能を用意して、`color-scheme: light` を設定すれば全体を light に、`color-scheme: dark` を設定すれば全体を dark にすることができます。

### カラースキーマの計算方法

ユーザは、ChromeのAutomatic Dark Modeを用いて、Color Schemeを変更することができます。

:::note{.memo}
📝 カラーテーマを設定する方法は、例えば以下のような方法があります。

1. ユーザがPreferred Color Scheme を変更する設定：Mac OSのシステム設定
2. ユーザがPreferred Color Scheme を変更する設定：ChromeのPreferrs Color Scheme
3. ユーザがColor Schemeを変更する設定：ChromeのAutomatic Dark Mode
4. AuthorがPreferred Color Schemeを要素に反映する設定: prefers-color-scheme Media Query
5. AuthorがColor Schemeを要素・ページに反映する設定: color-scheme

:::

`color-scheme`はAuthorが適用する色を決めるCSSプロパティですが、ユーザがColor Schemeを変更する設定していた場合、実際に適用される色はどのようにして決まるのでしょうか？

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

1. ユーザの設定した色が`color-scheme`によってサポートされる場合：ユーザの設定したColor Schemeが適用される
2. そうでない場合、つまり`color-scheme`で「only」を使用せずに「light/dark」が適用されている場合：ユーザの設定したColor Schemeで上書き適用される
3. そうでない場合、つまり`color-scheme`に「only」を使用して「light/dark」が適用されている場合：`color-scheme`の色が適用され、ユーザの設定したColor Schemeでは上書きできない
4. 上記いずれでもない場合：[`color-scheme: normal;`](https://drafts.csswg.org/css-color-adjust-1/#valdef-color-scheme-normal)の色が適用される。ページデフォルトの色が[`<meta name="color-scheme" content=<"dark" | "light">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme)で指定されている場合はその色が適用され、指定されていない場合はページデフォルトの色（通常はライトテーマ）が適用される

### `light-dark()`関数

2024年のCSS新機能として登場した、`light-dark()`関数は、`@media(prefers-color-scheme: <light | dark>)`を使用せずとも、`color-scheme`を要素に反映することができるCSS関数です。

```css

:root {
  color: light-dark(var(--light), var(--dark));
  background-color: light-dark(var(--light-bg), var(--dark-bg));
}

```

`color-scheme`のテーマに依存した色の変更は、ブラウザがUAスタイルシートに定義している`<system-color>`の利用でのみ可能でしたが、`light-dark()`関数の登場により、Authorの定義した色が`color-scheme`プロパティのテーマに依存して変更可能になりました。

> System colors have the ability to react to the current used color-scheme value. The light-dark() function exposes the same capability to authors.

`light-dark()`関数は、`color-scheme`がライトテーマか不明な場合は第一引数の`<color>`値を、ダークテーマの場合は第二引数の`<color>`値を適用します。

***

上記で理解した、カラースキーマの適用順序を`light-dark()`関数で確認できるデモを作成しました。長いのでCopepenリンクのみ記載します。

デモ：

https://codepen.io/sakupi01/pen/MYgjvwy

***

このように、`<system-color>`キーワードを使用すると、ユーザのカラーテーマ設定や`color-scheme`の値を反映した色でレンダリングされ、UAスタイルシート外部の設定と調和を保てます。この目的のために、`<system-color>`は定義（あるいは、既存実装から共通化して仕様化）され、UAスタイルシートで利用されているのです。

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

加えて、ボタン部分を表す、`<select>`の色に関しては、以下の議論の結果、`<select>`には透明な`background-color`を使用し、`color`, `border-color`は親要素から継承するという決定がなされました。

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

今回は、ボタン要素や選択肢ポップオーバーの「色」に関して取り上げました。

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
