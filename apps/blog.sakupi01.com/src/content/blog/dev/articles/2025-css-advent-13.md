---
title: "🎨 CSS Advent Calendar: Day 13 / CSS meets npm Ecosystem - the first shot ... AltCSS"
excerpt: "AltCSS とも言える SassとPostCSS の登場、エコシステムへの影響"
date: 2025-08-13
update: 2025-08-13
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 13 日目の記事です。
:::

2010年代に入ると、様々な SPA フレームワークが登場しました。

2010年の Backbone.js、 AngularJS、 2013年の React、2014年の Vue.js ...

SPA はその「即時応答性」によってユーザ体験を大きく変え、コミュニティによって醸成されたさまざまなフレームワークによって時代を築いていくことになります。

SPA フレームワークでは、初期の MPA と比較して、基本的に大量の JS が必要です。
それらの処理に、 Grunt/Gulp/Webpack など npm エコシステムのビルドツールが必要になりました。

いわゆる「Web フロントエンド」と呼ばれる開発領域が確立されていくのは、Node.js や npm エコシステムが普及したこの頃からです。
SPA が主流になることで、Web アプリケーション開発も本格的に変化していきました。
そして、CSS の開発スタイルにも変化が見られるようになります。

## CSS Pre-Processors - Change/Extend CSS for Dream Spec

実は、JS のビルドプロセスが確立される以前にも、CSS のプリプロセッサは存在しました。

Ruby コミュニティでは「書きたくない言語は Ruby ぽく書いてコンパイルしちゃえ」という文化があり、CoffeeScript なども同様の思想で作られていました。
その流れの中で、「メタ CSS」とも言える Sass が 2006年に登場し、Sass Variables や Nesting、Mixin など、最近の CSS 標準でもまだ完璧な実現には至っていないような独自機能を提供していました。

しかし、最初の Sass にはいくつかのハードルがありました。
まず、Ruby 環境が必要で、`gem` で Sass をローカルにインストールし、手動でコンパイルする必要がありました。
HTML/CSS/JS をやってきた人々にとっては、違和感のあるものだったと想像します。

```bash
gem install sass
sass --watch input.sass:output.css
```

さらに、`.sass` の記法はインデントベースの Ruby ライクなもので、CSS とは大きく異なるものでした。

```sass
div
  margin: 0
  p
    font-size: 16px
```

こうした背景から、2009年に登場した Less は、標準の CSS により近い記法を採用しました。

```less
div {
  margin: 0;
  p {
    font-size: 16px;
  }
}
```

さらに、Less は Node.js 環境で動作し、Web 開発者にとってより馴染みのある環境で使えました。
Bootstrap が Less を採用したことも相まって、Less は一定の普及をみせます。

一方で、Sass コミュニティも Less の影響を受け、2010年に SCSS 記法を導入しました。
`.scss` は標準の CSS により近い記法で、Sass の機能を使いながらも、Web をやっていた人たちにとってより身近な構文で書けるようになりました。

結果的に、SCSS の導入によって Sass はより幅広い採用を得ることになりました。
標準 CSS 記法との後方互換性もある `.scss` は、一つの選択肢として一定の知名度を得ることができたのではないかと思います。

しかし、プロダクションでの利用を考えると、「サーバサイドで事前にコンパイル」するための手法が求められるようになっていきます。

### Node.js & Build Tool Ecosystems contribute CSS Evolution

2009年に Node.js が登場し、ブラウザ以外の JS のランタイムが生まれます。
Node.js そのものが CSS プリプロセッサのコンパイルを可能にしたわけではありませんが、
Node.js によって npm エコシステムが広まったことで、ビルド系のツールも充実していきました。

Grunt や Gulp といった「タスクランナー」が登場し、「メタ CSS」 のコンパイルや auto-prefix、minify を含む一連の作業を「ビルドプロセス」として自動化することが可能になりました。

```js
gulp.task('css', function() {
  return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});
```

CSS のビルドプロセスが、ローカルでの手動実行→サーバサイドでの事前自動ビルドというふうに移り変わり、CSS が JS からの「ビルド成果物」として扱われるように変化していることが見て取れます。

## PostCSS - Pioneer CSS Ecosystem!

ビルドツールチェイン黎明の 2013年ごろに、新しいメンタルモデルで CSS を扱うためのツールとして PostCSS が登場しました。

プリプロセッサを必要とする Sass や Less は、独自の構文を持つ別言語、いわゆる「メタ CSS」として機能します。
JS 界隈だと、TS のようなものに近く、CSS プリプロセッサは TSC のようなものと捉えると、イメージしやすいかもしれません。

対して、PostCSS は、あくまで仕様に沿った CSS を、AST に変換し、プラグインを通して、変換/整形するというものです。
見かたによっては、PostCSS 自体は、 JS を Babel や Eslint が JS を解析/変換するようなものと捉えることができるでしょう。

よって、CSS プリプロセッサと PostCSS は排他的なため、両方を組み合わせて使うこともできます。
例えば Sass で開発して、PostCSS で最適化するといった具合です。

PostCSS の創始者 [Andrey Sitnik](https://github.com/ai) は、「エコシステムの広がりによって、ツールは発展する」というビジョンを持って PostCSS の開発を始めていました。

> PostCSS is not a preprocessor or a way to add syntactic sugar. It is a framework for creating CSS tools.
>
> **I designed that framework for a single purpose: bring more exciting ideas into the world of CSS tooling.** If the tools were easier to build, I thought, more people would build them, and everyone would benefit from the variety of approaches.
>
> With that in mind, I started working on PostCSS and had my first release just two months later: on November 4, 2013.
>
> ー [Five years of PostCSS: State of the Union—Martian Chronicles, Evil Martians’ team blog](https://evilmartians.com/chronicles/five-years-of-postcss-state-of-the-union)

「実験場としてのエコシステム」につながるメンタルモデルを持った PostCSS は、そのプラグインアーキテクチャにより、これまでに存在しなかった CSS エコシステムを形成しました。
CSS ツールチェインにおける **「プラグインエコシステム」** の拡充は、PostCSS が CSS エコシステムにもたらした大きな変化の一つだったと言えます。

その中には、CSS を書く上でデファクトで使うようなプラグインから、 CSS 標準に貢献したものまでさまざまにあります。

たとえば、Autoprefixer は、「どのブラウザでどのプレフィックスが必要か」という複雑性から我々を解放し、標準的な CSS を書くことに集中できるようにしてくれています。

```css
/* before */
.example {
  display: flex;
  user-select: none;
}

/* after */
.example {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

CSS 仕様の策定にも影響を与えたものとして例を挙げると、 [postcss-easing-gradients](https://github.com/larsenwork/postcss-easing-gradients) が挙げられます。
より自然なグラデーションを実現するプラグインとして開発されましたが、その成果は [CSS Images Module Level 4 の提案](https://github.com/w3c/csswg-drafts/issues/1332) にまで発展します。

> Even if you are not a member of CSS Working Group, you can still make CSS better.
>
> ー Andrey Sitnik

---

時代の潮流に沿ったプラグインの受け皿となる PostCSS の存在は、CSS エコシステムの発展に欠かせないものとなっていきます。

2013年に React が登場し、「宣言的 UI」というパラダイムがもたらされると、「コンポーネント」という単位で UI を構築することが主流になっていきます。
この「コンポーネント志向 UI 開発」という潮流に対しても、Post CSS は貢献の域を広げていくことになります。

## Appendix

- [Five years of PostCSS: State of the Union—Martian Chronicles, Evil Martians’ team blog](https://evilmartians.com/chronicles/five-years-of-postcss-state-of-the-union)
- [The evolution of scalable CSS, Part 1: CSS scalability issues](https://andreipfeiffer.dev/blog/2022/scalable-css-evolution/part1-scalability-issues)

---

<advent-calendar-2025 />
