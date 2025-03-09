---
title: "Next.jsでSSGとmarkdownを使用したブログアプリを作成する"
excerpt: "Next.jsのApp RouterでSSGを用いてブログを作成した過程を狭く浅くまとめます。使用技術や技術選定の話が中心です。"
date: 2024-02-28
beginColor: 'from-purple-300'
middleColor: 'via-yellow-200'
endColor: 'to-green-300'
category: 'dev'
tags: ['react', 'nextjs', 'turborepo', 'vercel']
status: 'draft'
---
## Table of Contents

## はじめに

このブログを開発するにあたって選定した技術やアプリの構成について簡単にまとめておこうと思います。
技術的な詳細やチャレンジは後日また書こうと考えています。

## 使用技術

今回このブログに使用されているおおまかな技術は以下のようになります。

<https://github.com/sakupi01/sakupi01.com>

#### 全体

- Vercel
- Turborepo

#### ブログアプリ：`/apps/blog.sakupi01.com`

- Next.js (v14)

#### 記事管理：`/articles`

- マークダウンを管理

#### アプリで必要なパッケージ：`/packages`

- サイドバー目次作成のためのHeadings切り出しパッケージ：`headings-extractor`
  - JavaScript
- TailwindCSSのグローバルconfigパッケージ：`tailwind-confing`

- TypeScriptのグローバルconfigパッケージ：`typescript-config`

- 共通uiコンポーネントパッケージ：`ui`
  - React
  - Storybook

#### 解析ツール・CI/CD
<!-- textlint-disable -->
TypeScript, biome, markuplint(`/apps/blog.sakupi01.com`), markdownlint(`/articles`), cspell(`/articles`), textlint(`/articles`), Pa11y, Lighthouse
<!-- textlint-enable -->

## 選定基準

### Turborepo

モノリポを個人開発でも導入してみたかったという興味がきっかけです。
<br/>
<br/>
Turborepoは仕事やOSSでよく見るものの、実際にゼロから自分でプロジェクトを立ち上げるときに使用した経験がなく、モノリポに対するふわっとした理解が深まればいいなという願いを込めて選定しました。
<br/>
<br/>
Turborepoでは、各workspaceに定義されたpackage.jsonのscriptsを、workspace間の依存関係を考慮した順番でビルドしてくれます。
また、CPUの上限内で異なる種類のscriptsの並列実行もしてくれます。

<https://turbo.build/repo/docs/core-concepts/monorepos/task-graph>

<https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks>

また、Turborepoを選定して、ローカル・リモートキャッシュの恩恵を受けて効率的に開発できることが大きなメリットだなと感じています。
<br/>
<br/>
ローカルキャッシュに関しては`turbo.json`にキャッシュファイル群を指定する設定を行なうことで、キャッシュがあるときのビルドが効率化されます。キャッシュを利用して、差分がある箇所のみのビルドを行なうことができます。

```json showLineNumbers {7} title="turbo.json"
{
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": [".next/**", "!.next/cache/**"]
        },
        "test": {
            "dependsOn": ["^build"]
        },
        ...
    }
    ...
}
```

さらに、リモートキャッシュを使用することでCIの高速化を図ることができます。
今回はVercelをPaaSとして使用したので、Vercelのキャッシュサーバーをそのまま利用でき、CIでリモートキャッシュを比較的簡単に使用できました。

<https://vercel.com/docs/monorepos/turborepo>

### Next.js

まず、ブログアプリということで、初回レンダリングのパフォーマンス改善とSEOに対する強みが欲しかったので、ページのPre-RenderingができるReactフレームワークを使用したいと考えました。
加えて、ブログアプリのため、リクエスト時ではなく、ビルド時に生成されたファイルを提供する、SSGができるということも条件に入れたかったです。
<br/>
<br/>
各記事は`/dev/articles/[slug]/*.tsx`|`/life/articles/[slug]/*.tsx`で管理しているのですが、Next.jsであれば、こうしたDynamic Routesであっても`generateStaticParams`を使用することでSSGをできます。

<https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params>

さらに、Turborepoを使用するという背景も加わり、Vercelにデプロイすることでキャッシュやその他の面で恩恵を受けやすい一面のあったNext.jsで事を進めました。
Next.jsのSSGアプリをVercelでホスティングすると、構築済みのHTMLファイルを都度アプリケーションサーバーから取得するのではなく、CDNにHTMLファイルのキャッシュを配置しておくことでパフォーマンスの最大化に近づけるということが比較的簡単に行なえます。
<br/>
<br/>
これでNext.jsを使用するということは決まったのですが、正直前述の条件であればPages Routerで十分な気がしてきました。
<br/>
<br/>
しかし、App Routerを使用することでReact Server ComponentsやSuspenseがデフォルトで使用できたり、それによるさらなるパフォーマンス改善が期待できたりしました。そこで、一旦App Routerでやってみて、不具合などで見切りがつきそうならPagesにしようという気持ちでApp Routerに舵を切りました。

### 記事管理と提供

記事の管理は`[root]/articles/**/*.md`でマークダウンとして管理しています。
`*.md`ファイルの頭にfront matterというYAML形式でメタデータを記述できる手法を用いて、[gray-matter](https://www.npmjs.com/package/gray-matter)でYAMLを解析し、jsonデータとして取り出しています。
<br/>
<br/>
markdown自体の解析・DOM構築、目次の生成には[remark](https://github.com/remarkjs/remark)、remarkの諸プラグイン、[remark-rehype](https://github.com/remarkjs/remark-rehype)、rehypeの諸プラグイン、rehype-stringifyを使用して、markdownをHTML stringで返却する関数を使用しています。
<br/>
<br/>
<!-- textlint-disable -->
少しまとめると、[remark](https://github.com/remarkjs/remark)でmarkdown→AST(mdast)に変換し、mdastのカスタマイズが可能な諸プラグインの処理を通し、[remark-rehype](https://github.com/remarkjs/remark-rehype)でAST(mdast)→AST(hast)に変換し、hastのカスタマイズが可能な諸プラグインの処理を通し、[rehype-stringify](https://www.npmjs.com/package/rehype-stringify)でHTML形式のテキストを出力しています。
stringに変換されたHTMLは、最終的にはサニタイズしたのちに`dangerouslySetInnerHTML`を使用してブラウザDOMとしてレンダリングしています。
<!-- textlint-enable -->

## 感想

今回は、ブログを開発するにあたって選定した技術について狭く浅く触れました。
<br/>
<br/>
CMS使おうと思ってやっぱやめたってなった話とか、TailwindCSSと仲違いしそうになった話とか、技術的なチャレンジとか、色々書ききれてないことはまたまとめていきたいです🌸
<br/>
<br/>
Vercelってすごい。

## 余談
<!-- textlint-disable -->
テストがないとかリファクタできるとかまだまだ改善しなければいけない部分があるので、追々やっていきたいです🤸🏻
<!-- textlint-enable -->
