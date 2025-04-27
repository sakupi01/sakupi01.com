---
title: "Next.jsでSSGとmarkdownを使用したブログアプリを作成する"
excerpt: "Next.jsのApp RouterでSSGを用いてブログを作成した過程を狭く浅くまとめます。使用技術や技術選定の話が中心です。"
date: 2024-02-28
update: 2024-02-28
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

今回このブログに使用されているおおまかな技術は次のようになります。

<https://github.com/sakupi01/sakupi01.com>

#### 全体

- Vercel
- Turborepo

#### ブログアプリ：`/apps/blog.sakupi01.com`

- Next.js (v14)

#### 記事管理：`/articles`

- マークダウンを管理

#### アプリで必要なパッケージ：`/packages`

- サイドバー目次作成のための Headings 切り出しパッケージ：`headings-extractor`
  - JavaScript
- TailwindCSS のグローバル config パッケージ：`tailwind-confing`

- TypeScript のグローバル config パッケージ：`typescript-config`

- 共通 ui コンポーネントパッケージ：`ui`
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
Turborepo は仕事や OSS でよく見るものの、実際にゼロから自分でプロジェクトを立ち上げるときに使用した経験がなく、モノリポに対するふわっとした理解が深まればいいなという願いを込めて選定しました。
<br/>
<br/>
Turborepo では、各 workspace に定義された package.json の scripts を、workspace 間の依存関係を考慮した順番でビルドしてくれます。
また、CPU の上限内で異なる種類の scripts の並列実行もしてくれます。

<https://turbo.build/repo/docs/core-concepts/monorepos/task-graph>

<https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks>

また、Turborepo を選定して、ローカル・リモートキャッシュの恩恵を受けて効率的に開発できることが大きなメリットだなと感じています。
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

さらに、リモートキャッシュを使用することで CI の高速化を図ることができます。
今回は Vercel を PaaS として使用したので、Vercel のキャッシュサーバーをそのまま利用でき、CI でリモートキャッシュを比較的簡単に使用できました。

<https://vercel.com/docs/monorepos/turborepo>

### Next.js

まず、ブログアプリということで、初回レンダリングのパフォーマンス改善と SEO に対する強みが欲しかったので、ページの Pre-Rendering ができる React フレームワークを使用したいと考えました。
加えて、ブログアプリのため、リクエスト時ではなく、ビルド時に生成されたファイルを提供する、SSG ができるということも条件に入れたかったです。
<br/>
<br/>
各記事は`/dev/articles/[slug]/*.tsx`|`/life/articles/[slug]/*.tsx`で管理しているのですが、Next.js であれば、こうした Dynamic Routes であっても`generateStaticParams`を使用することで SSG をできます。

<https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params>

さらに、Turborepo を使用するという背景も加わり、Vercel にデプロイすることでキャッシュやその他の面で恩恵を受けやすい一面のあった Next.js で事を進めました。
Next.js の SSG アプリを Vercel でホスティングすると、構築済みの HTML ファイルを都度アプリケーションサーバーから取得するのではなく、CDN に HTML ファイルのキャッシュを配置しておくことでパフォーマンスの最大化に近づけるということが比較的簡単に行なえます。
<br/>
<br/>
これで Next.js を使用するということは決まったのですが、正直前述の条件であれば Pages Router で十分な気がしてきました。
<br/>
<br/>
しかし、App Router を使用することで React Server Components や Suspense がデフォルトで使用できたり、それによるさらなるパフォーマンス改善が期待できたりしました。そこで、一旦 App Router でやってみて、不具合などで見切りがつきそうなら Pages にしようという気持ちで App Router に舵を切りました。

### 記事管理と提供

記事の管理は`[root]/articles/**/*.md`でマークダウンとして管理しています。
`*.md`ファイルの頭に front matter という YAML 形式でメタデータを記述できる手法を用いて、[gray-matter](https://www.npmjs.com/package/gray-matter)で YAML を解析し、json データとして取り出しています。
<br/>
<br/>
markdown 自体の解析・DOM 構築、目次の生成には[remark](https://github.com/remarkjs/remark)、remark の諸プラグイン、[remark-rehype](https://github.com/remarkjs/remark-rehype)、rehype の諸プラグイン、rehype-stringify を使用して、markdown を HTML string で返却する関数を使用しています。
<br/>
<br/>
<!-- textlint-disable -->
少しまとめると、[remark](https://github.com/remarkjs/remark)で markdown→AST(mdast)に変換し、mdast のカスタマイズが可能な諸プラグインの処理を通し、[remark-rehype](https://github.com/remarkjs/remark-rehype)で AST(mdast)→AST(hast)に変換し、hast のカスタマイズが可能な諸プラグインの処理を通し、[rehype-stringify](https://www.npmjs.com/package/rehype-stringify)で HTML 形式のテキストを出力しています。
string に変換された HTML は、最終的にはサニタイズしたのちに`dangerouslySetInnerHTML`を使用してブラウザ DOM としてレンダリングしています。
<!-- textlint-enable -->

## 感想

今回は、ブログを開発するにあたって選定した技術について狭く浅く触れました。
<br/>
<br/>
CMS 使おうと思ってやっぱやめたってなった話とか、TailwindCSS と仲違いしそうになった話とか、技術的なチャレンジとか、色々書ききれてないことはまたまとめていきたいです🌸
<br/>
<br/>
Vercel ってすごい。

## 余談
<!-- textlint-disable -->
テストがないとかリファクタできるとかまだまだ改善しなければいけない部分があるので、追々やっていきたいです🤸🏻
<!-- textlint-enable -->
