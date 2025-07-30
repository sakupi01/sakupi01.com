---
title: "🎨 CSS Advent Calendar: Day 13 / CSS meets Node.js Ecosystem - the first shot"
excerpt: "CSS Advent Calendar Day 13"
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
それらを処理するために必要だったのが、 Node.js に代表されるサーバサイド JS と Grunt/Gulp/Webpack などのビルドツールでした。
SPA 開発に必要な大量の JS を処理するために、サーバサイド JS やビルドツールの利用はデファクトになっていきます。

いわゆる「Web フロントエンド」と呼ばれる開発領域が確立されていくのは、Node.js やビルドツールによって Web アプリケーション 開発が本格的に SPA 化するこの頃からです。
そして、CSS の開発スタイルにも変化が見られるようになります。

## CSS Pre-Processors - Change/Extend CSS for Dream Spec

実は、JS のビルドプロセスが確立される以前にも、CSS のプリプロセッサは存在しました。

「メタ CSS」とも言える Sass は 2006年に登場し、Sass Variables や Nesting、Mixin など、最近の CSS 標準でもまだ完璧な実現には至っていないような独自機能を提供していました。

しかし、2006年当時に提供されていた Sass は Ruby ベースでした。
`gem` で Sass をローカルにインストールし、手動で `.scss` をコンパイルする必要があり、HTML/CSS/JS をやってきた人々にとっては、違和感のあるものだったと想像します。

```bash
gem install sass
sass --watch input.scss:output.css
```

Sass が浸透しづらい中、2010年に登場した Less 最大の功績は、「ブラウザ上でコンパイルできる」ことでした。

```html
<link rel="stylesheet/less" href="styles.less">
<script src="less.js"></script>
```

Ruby-based Sass に比べた手軽さと、Bootstrap が Less を採用したこともあり、Less は一気に広まりました。
プリプロセッサは「特殊なツール」から「標準的な選択肢」として一定の知名度を得ることができたのではないかと思います。

しかし、「ブラウザ上でコンパイルする」ということ自体プロダクションには不向きなことは明白で、
「サーバサイドで事前にコンパイル」するための手法が求められるようになっていきます。

### Node.js & Build Tools contribute CSS Evolution

2009年に Node.js が登場し、ブラウザ以外の JS のランタイムが生まれます。
Node.js の登場は、CSS プリプロセッサでいう「サーバサイドで事前にコンパイル」するフェーズを可能にするものとして、大きな転機となるものでした。

後続して、Grunt や Gulp とった「タスクランナー」が登場し、「メタ CSS」 のコンパイルや auto-prefix、 minify を含む一連の作業を「ビルドプロセス」として自動化することが可能になりました。

```js
gulp.task('css', function() {
  return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});
```

CSS のビルドプロセスが、ローカルでの手動実行→ブラウザ JS→サーバサイドでの事前自動ビルドというふうに移り変わり、CSS が JS からの「ビルド成果物」として扱われるように変化していることが見て取れます。

## PostCSS - Pioneer CSS Ecosystem!

ビルドツールチェイン黎明の 2013年ごろに、新しいメンタルモデルで CSS を扱うためのツールとして PostCSS が登場しました。

プリプロセッサを必要とする Sass や Less は、独自の構文を持つ別言語、いわゆる「メタ CSS」として機能します。
JS 界隈だと、TS のようなものに近く、CSS プリプロセッサは TSC のようなものと捉えると、イメージしやすいかもしれません。

対して、PostCSS は、あくまで仕様に沿った CSS を、AST に変換し、プラグインを通して、変換/整形するというものです。
見かたによっては、PostCSS 自体は、 JS を Babel や Eslint が JS を解析/変換するようなものと捉えることができるでしょう。

よって、CSS プリプロセッサと PostCSS は排他的なため、両方を組み合わせて使うこともできます。
例えば Sass で開発して、PostCSS で最適化するといった具合です。

PostCSS がもたらしたものとして大きかったのが **「プラグインアーキテクチャ」** というモデルだったように思います。

PostCSS の創始者 [Andrey Sitnik](https://github.com/ai) は、「エコシステムの広がりによって、ツールは発展する」というビジョンを持って PostCSS の開発を始めています。

> PostCSS is not a preprocessor or a way to add syntactic sugar. It is a framework for creating CSS tools.
>
> **I designed that framework for a single purpose: bring more exciting ideas into the world of CSS tooling.** If the tools were easier to build, I thought, more people would build them, and everyone would benefit from the variety of approaches.
>
> With that in mind, I started working on PostCSS and had my first release just two months later: on November 4, 2013.
>
> ー [Five years of PostCSS: State of the Union—Martian Chronicles, Evil Martians’ team blog](https://evilmartians.com/chronicles/five-years-of-postcss-state-of-the-union)

「実験場としてのエコシステム」につながるメンタルモデルを持った PostCSS は、そのプラグインアーキテクチャにより、これまでに存在しなかった CSS エコシステムを形成しました。
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
