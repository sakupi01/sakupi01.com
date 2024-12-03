---
title: "🎄Open UI Advent Calendar: Day 4 / Customizable Select Element Ep.2"
excerpt: "Form Controlが抱える課題と、Customizable Select Elementが提案の契機"
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

[Customizable Select Element Ep.1](https://blog.sakupi01.com/dev/articles/2024-openui-advent-3)では、Form Controlの歴史について触れ、Form ControlのスタイルはCSSから制御することができず、ブラウザやOSに依存していたことを振り返りました。

## ブラウザエンジンの発展と、Web標準の台頭、より柔軟なスタイリングの可能性

### OSに依存したレンダリング

1990年代後半から2000年代初頭にかけてのWebブラウザは、OSに強く依存していました。
各OSは独自のUIガイドラインと、それに対応するネイティブコントロールを持っており、ブラウザは、これらのネイティブコントロールをそのまま使用することで、OSと一貫性を保ったUIを提供していました。つまり、ブラウザはOSネイティブなレンダリングエンジンを利用していたわけで、同じWebページでも異なるOS上で表示すると、Form Controlの見た目が大きく異なっていたのです。（参考: [Ep3. ###Form Controlにおけるスタイリングの制限](https://blog.sakupi01.com/dev/articles/2024-openui-advent-3#form-controlにおけるスタイリングの制限) ）

Webの普及につれて、この状況は徐々に課題となっていきました。
同じコンテンツが異なるOSで異なる見た目になる問題を解決するべく、多くのWebブラウザが登場し、OSに依存しない形で独自のレンダリングエンジンを持つようになりました。

しかし、この動きは、Web標準化という観点からは必ずしも良い方向に進んでいたわけではありません。

### The Browser Wars

MosaicのライセンスがMSに供与され、それをベースとしてMSがIEをリリース。その前年に、Netscape社のNetscape Navigatorはv1.0をリリースしていました。

このMSとNetscape間で、サポートする機能の優位性に関する競争が激化。両ブラウザがWeb標準に対する独自の解釈を持ったまま、独自機能を次々と開発した結果、今度はブラウザ間で一貫性の問題が生じる状況が生まれました。

この時期は俗に「ブラウザ戦争」と呼ばれています。（正確には「第一次ブラウザ戦争」）

「Netscapeでは動作するが、IEでは動作しない」（その逆も然り）という状況が起こり、「このサイトは...で表示するのが最適」というバッジを貼って開発する状況になっていました。

### Web標準の台頭: Web Standards ProjectによるWeb標準化の推進

この状況を打開するために、Web標準化の動きが活発化しました。

有志によって、[WaSP（Web Standards Project）](https://www.webstandards.org/)が立ち上げられ、W3Cの仕様を推奨事項ではなく「標準」とすることで、W3Cの仕様に準拠したブラウザの開発が各社に働きかけられました。

（恒常的に標準をサポートしようとし続けてきた）Operaを踏まえると、2000年にリリースされたIE 5は、W3Cの勧告をある程度なレベルでサポートしており、これはIEにとってもWeb標準化にとっても非常に大きなマイルストーンでした。

加えて、WaSPがNetscapeに働きかけ、Netscape Navigatorのv5.0を標準に準拠したものにするよう促し、これは後のFirefoxの基礎となりました。

<details>
<summary>Doctype Switchingに見る、段階的標準化の具体例</summary>

IEは5.xになっても、Box Modelを独自で実装していたため、CSS標準に則って実装していたNetscapeとは異なる見た目になっていました。

- CSS標準: width = コンテンツ幅
- IE5.x: width = コンテンツ幅 - (padding + border)

この差分を解消するために「Box Model Hack」と呼ばれる、異なるブラウザ間のBox Modelの解釈の違いを吸収する方法が編み出されました。

- [Box Model Hack](https://tantek.com/CSS/Examples/boxmodelhack.html)
  - IEが`voice-family`プロパティを正しくパースできないことを利用して、意図した幅を実現する

```css title="css"
/* 
標準ブラウザ: 最終的なwidth: 300pxが適用
IE5.x: 最初のwidth: 400pxが維持される 
*/
div.content { 
  width: 400px;  /* 最初に幅を設定 */
  voice-family: "\"}\"";  /* IE5.xが正しく解釈できないプロパティを挿入 */
  voice-family: inherit;  /* 継承してパーサの状態をリセット */
  width: 300px;  /* 標準ブラウザで利用される最終的な幅を定義 */
}
```

かといって、IE5.xが突然「CSS標準に準拠した実装にします！」とすると、それまでIE5.xで正常に動作していた何十万、何百万というサイトが崩れてしまうことになります。

そこで、後方互換性を保つために[Doctype Switching](https://www.w3.org/html/wg/wiki/DoctypeSwitching)が生まれ、ブラウザに「どのモードで解釈するか」を指示できるようになりました。
これにより、仕様に準拠した記法への段階的な移行が可能になりました。

- Standardsモード（標準準拠モード）: W3Cの標準に準拠したモード
- Quirksモード（後方互換モード）: 旧来ブラウザと互換性のあるモード

</details>

WaSPにより、Web技術の標準化が推進され、ブラウザベンダーは標準に準拠したブラウザを段階的に開発するようになり、その中で自ずとOSネイティブなレンダリングエンジンから独立していくようになります。

### CSSの発展とモダンブラウザの登場

Web標準化が推進されたことにより、ブラウザはCSSを用いて、より柔軟に要素のスタイルを制御できるようになりました。

[Ep3.でも触れた](https://blog.sakupi01.com/dev/articles/2024-openui-advent-3##form-controlにおけるスタイリングの制限)ように、[CSS2.2](https://www.w3.org/TR/CSS22/conform.html#conformance)の時点では、Form Controlに対するスタイリングは実験的な機能として定義されていました。

しかし、CSS3では、例えば`padding`の定義されている、[CSS Box Model ModuleのConformanceの項](https://drafts.csswg.org/css-box/#w3c-conformance)には、そのような記述はされていません。（※ CSS3では、異なる機能を扱いやすいチャンクに分割するModules構造の仕様となりました。）

MDNにも[CSS property compatibility table for form controls](https://developer.mozilla.org/en-US/docs/Learn/Forms/Property_compatibility_table_for_form_controls)といったページがあることから、完全ではないながらも、Form Controlに対するスタイリングはCSS3で実現可能とされたと言えるでしょう。

そして、2000年代中期に入ってからは、Firefox、Safari、Chromeなどのモダンブラウザが登場し、これらはCSS3の機能を積極的にサポートするようになりました。

こうした一連の活動により、ブラウザはOSに依存するレンダリングから、レンダリングエンジンを搭載したブラウザでの、CSS3によるより柔軟なスタイリングが可能となりました。

***

それでは、また明日⛄

See you tomorrow!

### Appendix

- [CSS Properties Index · Jens Oliver Meiert](https://meiert.com/en/indices/css-properties/)
- [The history of the Web - W3C Wiki](https://www.w3.org/wiki/The_history_of_the_Web)
- [History of the Web Standards Project - The Web Standards Project](https://www.webstandards.org/about/history/)
- [Call for action on Vendor Prefixes - The Web Standards Project](https://www.webstandards.org/2012/02/09/call-for-action-on-vendor-prefixes/index.html)
- [Prefix or Posthack – A List Apart](https://alistapart.com/article/prefix-or-posthack/)
- [Box Model Hack](https://tantek.com/CSS/Examples/boxmodelhack.html)
- [IE7とFirefox2のDOCTYPEスイッチ | コリス](https://coliss.com/articles/build-websites/operation/css/84.html)
