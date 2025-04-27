---
title: "🎄Open UI Advent Calendar: Day7 / Customizable Select Element Ep.5"
excerpt: "Open UIでCSEのResearchが行われる。同時期にMSで`<selectmenu>`Explainerの作成。Explainerに基づいて、`<selectmenu>`がIntent to Prototypeに"
date: 2024-12-07
update: 2024-12-07
beginColor: 'from-red-500'
middleColor: 'via-lime-500'
endColor: 'to-green-700'
category: 'dev'
tags: ['openui', 'advent calendar']
status: 'published'
---
## Table of Contents

## 🎄はじめに

:::note{.message}
🎄 この記事は[OpenUI Advent Calendar](https://adventar.org/calendars/10293)の 7 日目の記事です。
:::

[Customizable Select Element Ep.4](https://blog.sakupi01.com/dev/articles/2024-openui-advent-6)では、Greg と Mason による調査結果を受けた、Domenic による Open UI 内での初期提案について見ていきました。

今回から、これまでにどのような提案が議論され、実装されてきたのか、または議論中なのかを見ていきます。

CSE は、現状の形になる前に命名の変遷を辿ってきました。
初めは`<selectmenu>`だったものが、`<selectlist>`になり、今となっては`<select>`です。
最初に、この変遷の経緯を確認していきます。

## `<selectmenu>`としての初期提案

### Open UI Propsalのステージ

まず、Open UI での Proposal の進み方を確認しておきます。
Open UI では、Proposal の策定段階が 5 つの Stage に分けられており、次のように区分されます。

| Stage | 目的 | 入る基準 | 出る基準 |
|-------|------|----------|----------|
| 0: Research | **調査内容を共有し、アイデアを統合できる状態にする** | Proposalが出され、Issueが開かれている | Champion(そのテーマの責任者)が決まり、歴史的経緯の研究調査とProposalが2人のOpen UI EditorまたはChairによってApproveされる |
| 1: Editor's Draft | **Open UI内でコンポーネントのExplainerに合意し、確定させる** | Usecase、Structure、Property、Behaviorなどをカバーする初期Draftが作成されている | 仕様がOpen UI EditorまたはChairによってレビューおよびApproveされる |
| 2: Community Draft | **ステークホルダー（WHATWG, ARIA, CSSWG, 他開発者など諸関係者）からのレビューを受け、フィードバックを取り入れる** | Open UIがEditor's Draftを外部グループや個人からの追加レビューのためにApproveしている | ARIA、I18n、プライバシー、WHATWG、CSSWG、ブラウザ実装者、他Web開発者、Library Authorなどのステークホルダーからの承認 |
| 3: Recommendation | **Proposalを最終状態に導く** | Championがステークホルダーと合意を形成している | Web Platformに追加するかどうかの決定。Webコンポーネントが実装されたり、仕様が標準化団体に渡ったりする。[適合度テスト](https://wpt.fyi/results/?label=experimental&label=master&aligned)が行われ、Specが作成される。実装されるがまだExperimentalな状態。 |
| 4: Finished | **コンポーネントが実装されたことを示す** | コンポーネントが安定した実装または仕様を持っている | N/A |

*参考: [Open UI Working Mode](https://open-ui.org/working-mode/)*

よって、CSE の PR では Stage 0: Research 段階のものが最も古く、それが以下に当たります。

- [Add initial curated page and research for `<select>` by wdencker · Pull Request #19 · openui/open-ui](https://github.com/openui/open-ui/pull/19)

この PR が Research として十分な内容を含むと認められたとき、Stage 1: Editor's Draft、つまり Explainer の作成が始まります。

### `<selectmenu>`Explainerの作成

CSE の Explainer は、[Dan Clark](https://github.com/dandclark)によって[MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers)の中で考案が始まりました。

- [MSEdgeExplainers/ControlUICustomization/explainer.md at main · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/ControlUICustomization/explainer.md)

当時 MS 内で Explainer を作成過程で議論されていたのが、`<select>`をカスタマイズ可能とする際のオプトイン方法でした。オプトインを、属性によって制御するのか、はたまた新しい要素を作成するのか。それぞれのメリット・デメリットが MS・WHATWG で検討されました。

- [Opt-in for `<select>` customizability · Issue #364 · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/364)

最初の問題提起をした Dan の主張を簡単にまとめると、

- `<select>`をカスタマイズ可能にするには、互換性を保つためにオプトインさせる必要があり、２通りの方法がある

1. `custom`属性を付与する方法

- 例えば、`<input type="range">`をカスタマイズ可能にしたいとなった場合、`<input>`は HTML パーサによって子に DOM の追加が制限されているため、`<range>`などの新しい要素を実装する必要がある
- しかし、`<select>`は HTML パーサが子に DOM の追加を特に制限していないため、カスタマイズ可能にするために新しい要素を作成する必要はない
- よって、`<select custom="">`のような属性を用いてオプトインすると良いと考えているが、以下に挙げる問題もある
  - `custom`属性の有無によって`<select>`のパースの仕方を変えることになるので、パース中に`custom`属性を動的に追加/削除された場合の正しい挙動を再現する実装が難しそう
- （おそらく、もし今後の話：）`<input>` をカスタマイズ可能にするとなった時、新しい要素を作成することになるので、`<select>`に対してだけ`custom`属性を導入するのは一貫性がない

2. `<selectmenu>`のような新しい要素を導入する方法

- `custom`属性を使うのではなく、新しい要素を導入する方法もあるが、次のような問題がある
  - 命名はどうするのか。`<selectmenu>`はどうか？
  - 既存の`<select>`とほぼ同等の機能を持つ新要素に対する抵抗感を招く可能性がある

***

これは最初 MS 内で議論された内容でしたが、WHATWG にも提案が持ち込まれ、より多くの関係者を交えた議論となります。

- [Opt-in for `<select>` customizability · Issue #5791 · whatwg/html](https://github.com/whatwg/html/issues/5791)

ここでの議論の結論としては、以下です。

- `<input>` + `<datalist>`によって実現される Combobox のような形式にも適応できるようにする
- `<option>`に任意の HTML を指定できるようにする
- `<select>`の各部品はカスタマイズ可能にする
- ポップアップ（ドロップダウン部分）は window の範囲を超えないようにする
- **以上の機能を持った`<select>`を、新しい要素として実装する**

この「新しい要素」が`<selectmenu>`となって、MS の Explainer を元に実装着手が意思表示されます。

- [Intent to Prototype: Customizable `<select>` Element](https://groups.google.com/a/chromium.org/g/blink-dev/c/9TcfjaOs5zg/m/WAiv6WpUAAAJ)

こうして、一旦は仕様が固まった`<selectmenu>`でしたが、どうして`<selectlist>`に改名され、最終的に`<select>`になったのか、次回以降で見ていきます。

***

それでは、また明日⛄

See you tomorrow!

### Appendix

- [Request for developer feedback: customizable select  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/rfc-customizable-select#enhance_the_existing_select_element)
- [topic: forms, select&addition/proposal](https://github.com/whatwg/html/issues?page=1&q=is%3Aissue+label%3A%22topic%3A+select%22%2C%22topic%3A+forms%22+created%3A%3E%3D2020+label%3Aaddition%2Fproposal)
