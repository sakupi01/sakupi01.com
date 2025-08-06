---
title: "🎨 CSS Advent Calendar: Day 15 / CSS meets npm Ecosystem - the second shot - Component Based CSS"
excerpt: "Declarative UI の登場による CSS エコシステムの変遷"
date: 2025-08-15
update: 2025-08-15
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 15 日目の記事です。
:::

エコシステムが築き上げてきたプリプロセッサ/PostCSS を筆頭とした CSS エコシステムの足場と、CSS アーキテクチャの模索の中で登場したのが「宣言的 UI」というパラダイムでした。

「宣言的 UI」の中で発達したエコシステムは、コンポーネント志向 UI -- 「コンポーネント志向 CSS」の開発を容易なものにし、Web フロントエンド開発に一気に浸透していくことになります。

現代の Web 開発において、コンポーネント志向は避けて通れない設計思想となりました。
しかし、その実装手法と CSS の関係は複雑な進化を遂げています。
今回は、React や Vue.js に代表されるコンポーネント指向フレームワークの普及により、CSS エコシステムがどのような変遷を辿ったのかを遡ります。

## Declarative UI and Component-Based Oriented Development

2013年の React 登場は、従来の HTML/CSS/JavaScript を分離する手法から、HTML/CSS/JavaScript をコンポーネントというチャンクへ統合するという逆行的とも見える変化をもたらしました。

この変化の背景には、動的に画面を描画する需要の増加がありました。
SPA で JavaScript を中心としたコーディングが増える中、HTML/CSS という異なるコンテキストを分割して管理するよりも、JavaScript で一元管理した方がコーディングしやすく、可読性も高く、さらにコンポーネントとして再利用性を高められるという判断がなされたのです。

その結果、「望ましい UI の最終形を宣言し、その更新手順はフレームワークに委ねる」（`UI = f(State);`）ことができるようになりました。

**「どのように（How）表示するか」ではなく「何を（What）表示するか」** のみを記述することを UI 実装のパラダイムとして唱えたのが、宣言的 UI です。

## CSS in Declarative UI

「手動で」再利用可能なスタイルを定義し、衝突しないよう命名規則を設け、それらによって関心の分離を実現していた従来の CSS アーキテクチャに、宣言的 UI という新たなパラダイムが加わります。

## CSS Modules

もともと CSS Modules は、webpack の [Tobias Koppers](https://github.com/sokra) によって実装され、
2015年4月に [css-loader 0.11.0で Experimental Feature としてリリース](https://github.com/webpack-contrib/css-loader/commit/d2c9c25721a711b0fe041c597b43646e82d9f145)された、css-loader の独自拡張の機能でした。

当初は「Placeholders」と呼ばれていて、仕様も実装から分離していませんでした。
記法も今と異なり、`.[className] {...}` のように角括弧で囲む必要がありました。

その後、2015年10月にかけて記法の微調整や新機能の実装、名称の変更などが行われ、現在の CSS Modules の形に近づいたのが、[History](https://web.archive.org/web/20250803035353/https://github.com/css-modules/css-modules/blob/master/docs/history.md) から読み取れます。

CSS Modules は、CSS ファイルのクラス名をユニークなものに変換する「仕様」です。

- [css-modules/css-modules: Documentation about css-modules](https://github.com/css-modules/css-modules)

いくら BEM などで命名規則を設けていても、（`!important` を使わない限り）基本的に Author Origin というただっ広いグローバル空間で CSS を書いている限り、Class 名の衝突は常に起こり得ます。

クラス名をユニークに変換してビルドすることで、CSS ファイルごとに確実な Class ベーススコープが生成され、機械的にグローバル空間での命名衝突が防がれます。

```js
// Button.module.css
.button {
  background-color: blue;
  padding: 10px;
}

// Button.jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Click me</button>;
}

// output
.button_123abc {
  background-color: blue;
  padding: 10px;
}

<button class="Button_button__1a2b3">Click me</button>
```

CSS Modules はあくまでも「仕様」です。
よって、これを実装しているツールは多く存在します。
webpack の `css-loader` や、PostCSS の `postcss-modules` などを筆頭に、Vite や Next.js などに同梱されているものが有名どころでしょう。

## CSS-in-JS

CSS in JS は 2014年に Christopher "vjeux" Chedeau によって[提唱](https://speakerdeck.com/vjeux/react-css-in-js)されました。

CSS のセレクタにおけるグローバル汚染の問題や、利用されなくなった CSS セレクタ削除の困難さ、CSS-JS 間で定数値の同期を保てない問題はもとより、
**同じ詳細度を持つルールが非同期的に読み込まれた際の非決定的な振る舞い**、さらには**コンポーネントの内部実装への外部からの干渉**といった、複数の問題に対処するために提案されました。

特に、非決定的な解決（Non-deterministic Resolution）に関しては、複数ファイルの非同期的な読み込みにおいて、
同じ詳細度では、適用順序がバンドル時に予測不可能になり、場合によって適用されるルールが変わるといった再現性のないバグを引き起こすというものです。
元々カスケードが読み込み順に忠実な単一ファイルを前提に設計されているために起こる問題であり、複数のスタイルシートが非同期に読み込まれる環境では、この前提が崩れてしまうことに起因します。

また、分離（Isolation）の問題は、コンポーネントの内部実装に対して外部から CSS セレクタを使って変更を加えることができるという「外部からコンポーネント内部へのアクセス」が問題となっていました。
CSS Modules などを使っていると、入れ子になった CSS セレクタに、HTML の構造がそのまま反映される現象が多発します。
マークアップはスタイルの規定について関心を持たない一方、CSS はマークアップの構造に関心を持てているということです。
結果、コンポーネントスタイルのカプセル化が実現できず、コンポーネント内部実装の変更が予期しない影響を及ぼすという問題を生む可能性がありました。
つまり、CSS のセレクタがコンポーネントの境界を無視して内部実装にアクセスできてしまうことが、この問題の本質としてありました。

- [React: CSS in JS - Speaker Deck](https://speakerdeck.com/vjeux/react-css-in-js)

CSS-in-JS は、これらの問題に対して、スタイルを JavaScript オブジェクトとして扱い、コンポーネント内に閉じ込めることで解決を図るという思想でした。

### styled-components

2016年に Glen Maddern によってリリースされた [styled-components](https://styled-components.com/) は、CSS-in-JS の先駆者的存在となったライブラリです。

styled-components のモチベーションは、[公式ドキュメント](https://styled-components.com/docs/basics#motivation)から以下が挙げられています。

- **Automatic critical CSS**: レンダーされたコンポーネントの必要最低限の CSS （Critical CSS）のみを抽出する
- **No class name bugs**: ユニークな Class 名を生成し、グローバルでの衝突を防ぐ
- **Easier deletion of CSS**: すべてのスタイルが特定のコンポーネントに結びつけ、クラス名が使われている場所を把握しやすくする。これは、コンポーネントが未使用の場合（ツールによって検出可能）に削除されると、そのスタイルもすべて削除されることも意味する
- **Simple dynamic styling**: JS の動的な値を自然に組み込める
- **Painless maintenance**: CSS と HTML/JS の Co-location によるメンテナンス性の向上
- **Automatic vendor prefixing**: 現在の標準に従って CSS を書け、必要な部分は内部でベンダプレフィクスが付与される

styled-components で特徴的なのは、CSS そのものを変数として表現し、コンポーネントと直接的に結びつける構造をとったことで、実質的にスタイルの影響範囲をコンポーネント内に閉じ込められるようになった点です。
また、CSS と JS の Co-location により、JavaScript の動的な値が自然に組み込めるようになった点も特筆すべき点でしょう。

```ts
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CustomButton = ({ primary, children }) => {
  return (
    <Button primary={primary}>
      {children}
    </Button>
  );
}
```

:::note{.message}

Thank you, styled-components!

しかし、React Server Components 対応への影響を主要な問題として、styled-components は 2025/3 にメンテナンスモードに入っています。
今後新たな機能の追加はされないようですが、既存機能に対するバグ修正などは継続して行うとしています。

- [Thank you - Open Collective](https://opencollective.com/styled-components/updates/thank-you)

:::

styled-components は、広義では「ランタイム CSS in JS」と呼ばれるアプローチで、CSS を JavaScript オブジェクトとして記述し、ランタイムで `<style />` に挿入することで、ユニークな Class 名をコンポーネントに結びつけます。

Emotion や styled-components はランタイムとして実行されるためパフォーマンス上のオーバーヘッドがありますが、
スタイル宣言をプリコンパイルしてランタイムコストなし（いわゆる「ゼロランタイム」）で利用できるライブラリもあります。
有名なところだと、 [Linaria](https://linaria.dev/) や、[Vanilla Extract](https://vanilla-extract.style/) などが挙げられます。

## "Selector Scope"

通常 CSS のセレクタにはスコープはありませんが、Class にハッシュ値を付与して Class 名をグローバルでユニークにし、スタイルのコンテキストを「擬似的に閉鎖」してしまうというアイディアは、しばしば「セレクタスコープ」や「擬似スコープ」と呼ばれます。

「セレクタスコープ」を生成する関連技術として、今回紹介した CSS Modules や CSS in JS 以外にも、Vue.js の [Scoped CSS](https://vue-loader.vuejs.org/guide/scoped-css.html) や、Angular の [View Encapsulation](https://angular.dev/guide/components/styling#style-scoping) 、Svelte の [Scoped styles](https://svelte.dev/docs/svelte/scoped-styles) などが挙げられます。

それぞれ思想が違えば、できることも違いますが、セレクタがグローバルであるという CSS の特性を「ユニークな Class 名」によって回避するという共通項を持っています。

その命名の管理をツールによって自動化することで、BEM の唱える「ブロック（コンポーネント）単位でスタイルをスコーピング」する手法を、より安全に扱えるようになったとも言えます。

## Appendix

- [React: CSS in JS - Speaker Deck](https://speakerdeck.com/vjeux/react-css-in-js?slide=7)
- [Why We're Breaking Up with CSS-in-JS - DEV Community](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b)
- [CSS Modulesの歴史、現在、これから - Hatena Developer Blog](https://developer.hatenastaff.com/entry/2022/09/01/093000)
- [Components Should Be Focused, Independent, Reusable, Small And Testable (FIRST)](https://addyosmani.com/first/)
- [The End of Global CSS. CSS selectors all exist within the same… | by Mark Dalgleish | SEEK blog | Medium](https://medium.com/seek-blog/the-end-of-global-css-90d2a4a06284)

---

<advent-calendar-2025 />
