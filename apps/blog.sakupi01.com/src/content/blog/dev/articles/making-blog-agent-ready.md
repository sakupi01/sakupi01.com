---
title: "ブログを Agent Ready にする: Cloudflare の無料枠で Markdown を出し分ける"
excerpt: "同じ URL から HTML と Markdown を返し、サイトの説明と AI による利用の希望を機械が読める形で公開しました。Cloudflare の Free プランのまま、bot が大量にアクセスしても配信が止まらない構成にした判断をまとめます。"
date: 2026-11-19
update: 2026-11-28
category: "dev"
tags: ["agent", "ai", "http", "cloudflare", "structured-data"]
status: "draft"
---

<!--
公開前に確認すること:
- 切り替え後に test:agent-ready:live:production が pass したか
- 「検証」の節の「一時的な hostname を作って確かめてから、本番を切り替えました」は、リハーサルを実施した前提の文。実施しなかった場合は書き直す
- 「検証」の節に、切り替え後の is-agentic.com と isitagentready.com の結果を追記する
-->

## Table of Contents

## はじめに

このブログを、AI agent が内容と運営者を確認しやすい形に直しました。

ここでいう Agent Ready は、[unvalley さんの記事](https://unvalley.me/ja/blog/1793627906)の定義を借りて、「agent が Web サイトを発見し理解するための準備が、サイト側で済んでいること」とします。

準備の度合いは、次の 2 つの scanner で調べられます。URL を入力すると、項目ごとの合否と点数が返ります。

- [isitagentready.com](https://isitagentready.com/): Cloudflare が公開している scanner
- [is-agentic.com](https://is-agentic.com/): Vercel が運営している scanner

変更前のこのブログは、is-agentic.com で 72 点でした。記事本文は JavaScript なしで読め、sitemap、RSS、正しい status の 404 もありました。足りなかったのは次の項目です。

| 指摘された項目                               | 対応       |
| -------------------------------------------- | ---------- |
| `Accept: text/markdown` に Markdown を返す   | 対応した   |
| 404 を Markdown で返す                       | 対応した   |
| `Link` header でリソースを案内する           | 対応した   |
| Content Signals で AI による利用の希望を示す | 対応した   |
| トップページに JSON-LD を置く                | 対応した   |
| llms.txt に「いつ使うか」を書く              | 対応した   |
| About と Contact のページを置く              | 対応した   |
| Organization の住所と連絡先を JSON-LD に書く | 対応しない |
| API docs を検索で見つけられるようにする      | 対応しない |
| DNS-AID のレコードを公開する                 | 対応しない |

対応にあたって、条件を 2 つ置きました。

1. Cloudflare の Free プランのまま運用する
2. bot が大量にアクセスしても、既存ページの配信が止まらず、課金も発生しない

この記事では、各項目で何をしたか、なぜその方法にしたか、何をしなかったかを順に書きます。

## 同じ URL から Markdown を返す

HTTP の request には `Accept` header があり、client は受け取りたい形式をここで伝えます。browser は HTML を求め、agent は次のように Markdown を求められます。

```sh
curl -H 'Accept: text/markdown' https://blog.sakupi01.com/about/
```

URL を変えずに、request header に応じて返す形式を選ぶ仕組みを content negotiation と呼びます。agent にとって Markdown は、navigation や script を含む HTML より短く、本文の構造をそのまま読める形式です。

この仕組みには注意点が 1 つあります。同じ URL が 2 つの形式を返すので、途中の cache が HTML と Markdown を取り違える可能性があります。これを防ぐために、response に `Vary: Accept` を付けます。`Vary` は「この response は、ここに挙げた request header の値によって変わる」と cache に伝える header です。

### Cloudflare の機能は Free プランで使えない

Cloudflare には [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) があります。zone の設定を有効にすると、Cloudflare が HTML を Markdown に変換して返す機能です。ただし、対象は Pro プラン以上です。

そこで、同じ結果を Free プランの機能だけで組み立てました。

1. build 時に、全ページの Markdown を静的ファイルとして出力する
2. Markdown を求める request だけを、そのファイルへ振り替える

Next.js の `rewrites` で同じことをしている unvalley さんの方法を、Cloudflare の機能に置き換えた形です。

### build 時に Markdown を作る

このブログは Astro で全ページを静的生成しています。そこへ、build の最後に動く処理を足しました。出力された HTML を 1 つずつ読み、`<main>` の中身を Markdown に変換して、HTML の隣に書き出します。

```text
dist/about/index.html  →  dist/about/index.md
dist/404.html          →  dist/404.md
```

`/about/` の Markdown は次のようになります。先頭の `---` で囲んだ部分は frontmatter で、ページの題名や URL を機械が取り出せる形で書いています。

```md
---
title: "About"
description: "About saku and the editorial policy of blog.sakupi01.com."
url: "https://blog.sakupi01.com/about/"
lang: "ja"
---

# About

## このブログについて

blog.sakupi01.com は、saku が個人で運営する技術ブログです。
```

記事の原稿は Markdown で書いているので、原稿をそのまま配信する方法もあります。たとえば [blog.jxck.io](https://blog.jxck.io/) は、原稿の `.md` を HTML と同じ場所に置いて配信しています。このブログでその方法を取らなかった理由は 3 つあります。

- 原稿は画像を `../../../../assets/images/x.png` のような相対 path で参照していて、公開 URL は build 時に決まる
- 原稿には、リンクカードや埋め込みに変換される独自の書き方が含まれる
- トップページ、一覧、About、404 には Markdown の原稿がない

HTML から変換すれば、全ページを 1 つの処理で扱えます。変換では、agent に不要なものを落とし、HTML に固有の表現を Markdown の書き方へ戻しています。

- 目次、共有ボタン、コメント欄を除く
- code block の言語名を引き継ぐ
- リンクカードを 1 本のリンクと説明文にする
- 脚注を Markdown の脚注（`[^1]`）にする
- 画像とリンクの URL を絶対 URL にする

### Markdown を求める request だけを振り替える

振り替えには、Cloudflare の URL Rewrite Rule を使いました。rewrite は、client に見える URL を変えずに、サーバー側で参照する path だけを書き換える処理です。URL が変わる redirect とは別のものです。

rule の条件は次のとおりです。`Accept` に `text/markdown` が含まれ、path が `/` で終わる request を対象にします。

```text
http.host eq "blog.sakupi01.com"
and any(lower(http.request.headers["accept"][*])[*] contains "text/markdown")
and ends_with(http.request.uri.path, "/")
```

rule の比較は大文字小文字を区別します。media type は大文字でも同じ意味なので、`lower()` で小文字にそろえてから比べています。

対象の request は、path の末尾に `index.md` を足します。

```text
concat(http.request.uri.path, "index.md")
```

`/about/` への request は `/about/index.md` として処理され、build 時に作った Markdown が返ります。[Free プランで作れる rule は 10 個まで](https://developers.cloudflare.com/rules/transform/)で、この構成が使うのは 1 個です。

:::note{.memo}
この条件は文字列の部分一致です。`Accept: text/markdown;q=0` のように Markdown を拒否する指定でも、Markdown を返します。正規表現は Free プランで使えないため、この差は受け入れました。
:::

Markdown のファイルは `/about/index.md` という URL でも直接取得できます。header は、静的ファイルと一緒に置く `_headers` で設定します。

```text
/*
  Content-Signal: ai-train=no, search=yes, ai-input=yes
  Vary: Accept, Accept-Encoding

/*.md
  Content-Type: text/markdown; charset=utf-8

/*index.md
  Link: <https://blog.sakupi01.com/:splat>; rel="canonical"
```

Cloudflare は `.md` を charset なしの `text/markdown` で返します。日本語が文字化けしないよう、`charset=utf-8` を明示しました。

`.md` の URL が検索結果に HTML と重複して載るのを避けたいので、最初は `.md` に `X-Robots-Tag: noindex` を付けていました。これは誤りでした。rewrite のあとは `/about/` への request も `/about/index.md` として扱われるため、ページ本来の URL が `noindex` を返してしまいます。代わりに、HTML の URL を正規の URL として伝える `rel="canonical"` の `Link` header を付けました。`:splat` は、`*` に一致した部分に置き換わります。

### 404 も Markdown で返す

存在しない URL に Markdown を求められたら、status は 404 のまま、本文を Markdown で返します。本文には、トップページ、sitemap、llms.txt へのリンクを入れました。agent は、ページがないことと、次に見るべき場所を 1 回の response で知ることができます。

静的ファイルだけでは、この出し分けができません。そこで、一致するファイルがない request だけを受ける Worker script を置きました。Worker は Cloudflare 上で動く小さなプログラムです。やることは 2 つだけです。

- path が `.md` で終わるか、`Accept` が Markdown を優先していれば、`404.md` の内容を status 404 で返す
- それ以外は、従来の HTML の 404 を返す

`Accept` は `q`（優先度）まで解釈します。`text/markdown;q=0` や、HTML より低い優先度の指定には HTML を返します。path が `.md` で終わる場合に `Accept` を見ないのは、`_headers` が `.md` の path すべてに `Content-Type: text/markdown` を付けるからです。ここで HTML を返すと、本文と `Content-Type` が食い違います。

## bot が大量にアクセスしても止まらないようにする

Free プランには、Worker の実行回数に上限があります。[1 日 10 万 request まで](https://developers.cloudflare.com/workers/platform/limits/#daily-requests)で、アカウント全体で数えます。一方、[静的ファイルへの request は無料で、数の上限がありません](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)。

このため、Worker が動く request をできるだけ少なくしました。

| request                              | 処理する場所              | 上限に数えるか |
| ------------------------------------ | ------------------------- | -------------- |
| 既存ページの HTML                    | 静的ファイル              | 数えない       |
| 既存ページの Markdown                | 静的ファイル              | 数えない       |
| feed、sitemap、llms.txt、画像        | 静的ファイル              | 数えない       |
| 存在しない URL（browser の画面遷移） | 静的ファイルの 404 ページ | 数えない       |
| 存在しない URL（それ以外）           | Worker                    | 数える         |

browser の画面遷移は、`Sec-Fetch-Mode: navigate` という header で判別されます。この header がある request は、一致するファイルがなくても、Worker を通さずに 404 ページが返ります。

Worker が動くのは、crawler や agent が存在しない URL を取得したときだけです。上限を使い切った場合に失敗するのもこの request だけで、既存ページの配信は続きます。

逆に、すべてのページで Worker を先に動かす設定にすれば、出し分けを Worker だけで書けます。設定が repository に収まり、手元でも試せる利点があります。ただし、ページの request がすべて上限に数えられ、[超えた request は 429 になります](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)。crawler が 1 日に 10 万回アクセスしただけで、人が読むページまで止まります。今回は採りませんでした。

Worker が動く範囲は、実際の Cloudflare 上で実行 log を見て確かめました。既存の HTML、Markdown、feed を取得しても log には何も出ず、存在しない URL に Markdown を求めたときだけ 1 件記録されました。

## hosting を移すと変わる header をそろえる

このブログは、今回の対応にあわせて hosting を Vercel から Cloudflare へ移しました。移行前後の response を並べて比べると、Vercel が既定で付けていた header のうち 3 つが、Cloudflare では付かないと分かりました。どれも `_headers` で補っています。

- **charset**: Cloudflare は HTML を `text/html`、llms.txt を `text/plain` と、charset なしで返します。HTML は `<meta charset>` で文字コードを宣言できますが、llms.txt は本文に宣言を持てません。charset のない text を ISO-8859-1 として読む HTTP library があるので、`charset=utf-8` を明示しました
- **`Strict-Transport-Security`**: browser に、次回から HTTPS だけで接続するよう伝える header です。Vercel が返していた値をそのまま書きました
- **`Access-Control-Allow-Origin: *`**: 別の origin のページが、browser 上の script から response を読むことを許可する header です。外から読まれる想定の `blog.json` と `feed.xml` に付けました

## agent がサイトの使い方を判断できるようにする

### llms.txt に「使わない場面」も書く

[llms.txt](https://llmstxt.org/) は、サイトの概要と主要なページへのリンクを、LLM が読みやすい Markdown でまとめて置くファイルです。標準ではなく提案の段階です。

このブログの llms.txt には、サイトの概要に加えて「いつ使うか」と「いつ使わないか」を書きました。

- 使う場面: CSS、HTML、OpenUI、browser UI、Web 標準の経緯を調べるとき
- 使わない場面: 仕様の規範的な要件を確認するとき。製品 API、MCP server、SDK、CLI を探すとき

このブログの記事は、個人が調べた内容であって、公式の仕様ではありません。この境界を書いておくと、agent が記事を仕様の代わりに扱う誤りを減らせます。

### `Link` header で案内する

`Link` は、関連するリソースの場所を伝える HTTP の response header です。形式は [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) で決まっています。HTML を解析しなくても、header だけで関連するファイルを見つけられます。

トップページの response に、次の 3 つを付けました。

```text
Link: </llms.txt>; rel="describedby"; type="text/plain",
      </index.md>; rel="alternate"; type="text/markdown",
      </feed.xml>; rel="alternate"; type="application/rss+xml"; title="RSS"
```

`rel` は、リンク先との関係を表す値です。使える値は [IANA の一覧](https://www.iana.org/assignments/link-relations/link-relations.xhtml)に登録されています。`describedby` は「このページを説明するリソース」、`alternate` は「同じ内容の別の形式」を表します。

sitemap も案内したくなりますが、`sitemap` はこの一覧に登録されていません。sitemap の場所は、従来どおり robots.txt の `Sitemap:` 行で伝えています。

各ページの HTML にも、Markdown のファイルを指す `<link rel="alternate" type="text/markdown">` を入れました。

## JSON-LD で運営者と記事を表す

JSON-LD は、ページの内容を表すデータを JSON で HTML に埋め込む書き方です。語彙には [schema.org](https://schema.org/) を使います。名前、URL、著者、公開日を、HTML の文章から推測せずに取得できます。

トップページには `Person`、`WebSite`、`Blog` を、記事には `BlogPosting` を追加しました。`Person` の `sameAs` には、GitHub、Bluesky、X、CodePen の URL を並べています。`sameAs` は「この URL も同じ人を指す」と伝える項目です。次は `Person` の抜粋です。

```json
{
  "@type": "Person",
  "@id": "https://sakupi01.com/#person",
  "name": "saku",
  "url": "https://sakupi01.com/",
  "sameAs": [
    "https://github.com/sakupi01",
    "https://bsky.app/profile/sakupi01.com"
  ]
}
```

scanner は `Organization` に住所と連絡先を書くことも求めました。これは追加していません。このブログは個人が運営していて、組織ではないからです。存在しない組織を宣言したり、個人の住所や電話番号を公開したりすれば、点数は上がっても、書いてある情報は不正確になります。

同じ理由で、次の 2 つにも対応していません。

- API catalog（[RFC 9727](https://www.rfc-editor.org/rfc/rfc9727)）と「API docs の発見」: このブログに公開 API はない
- [DNS-AID](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/): agent 向けの endpoint を DNS で案内する仕組みで、案内する endpoint がない

## About と Contact を置く

agent が記事を引用したり人に薦めたりするとき、誰が書いているか、訂正をどこで受け付けるかも判断材料になります。そこで、ブログに 2 つのページを追加しました。

- About: 書き手、扱う主題、一次資料の扱い、訂正の方針
- Contact: email、GitHub、SNS の使い分け

連絡先は増やしていません。以前からフッターに載せていた窓口の用途を説明しただけです。Privacy は sakupi01.com に以前からあるページを使い、AI による利用についての段落を足しました。どのページにも、フッターから移動できます。

## AI による利用の希望を分けて示す

### Content Signals

[Content Signals](https://contentsignals.org/) は、内容の使われ方についての希望を、用途ごとに robots.txt へ書く提案です。このブログは次のように書いています。

```text
User-agent: *
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes
```

- `search=yes`: 検索結果への掲載を許可する
- `ai-input=yes`: AI が回答を作るときに記事を参照することを許可する
- `ai-train=no`: model の学習や追加学習への利用を許可しない

同じ値を、すべての response の `Content-Signal` header にも付けました。

Content Signals は提案の段階で、すべての crawler が読むことも、従うことも保証されていません。強制する仕組みではなく、希望を機械が読める形で伝えるものとして扱っています。

### 学習用の共通 token

robots.txt には、もう 1 つ group を足しました。

```text
User-agent: __usage_ai-training
Disallow: /
```

`__usage_ai-training` は crawler の名前ではありません。「AI の学習」という用途を表す token で、[IETF に提出された Internet-Draft](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/) が定義しています。この group の `Disallow` は、該当する path を学習に使わないでほしいという希望を表します。`User-agent: *` の group はこの token に適用されないと決められているので、専用の group が必要です。

[Google は、2027 年にこの token へ対応する予定](https://developers.google.com/search/blog/2026/10/ai-training-control)だと発表しています。

### Google は学習と参照を分けられない

Google には、`Google-Extended` という専用の設定があります。[Google の説明](https://developers.google.com/crawling/docs/google-extended)によると、この設定は「生成 AI の学習」と「Gemini などが回答時に記事を参照すること」を、まとめて許可または拒否します。片方だけは選べません。Google 検索への掲載は、この設定の対象外です。

Google は先の発表で、共通の token で学習を拒否し、`Google-Extended` を robots.txt に書いていないサイトは、`Google-Extended` を拒否したものとして扱う予定だと説明しています。何も書かなければ、Google が対応した時点で、Gemini の回答にこのブログの記事が載らなくなります。

Gemini の回答に出典として載り、そこから読者が来ることを優先して、`Google-Extended` は明示的に許可しました。

```text
User-agent: Google-Extended
Allow: /
```

この選択には代償があります。Google に対しては、記事を学習に使うことも許可したことになります。`ai-train=no` の希望は、Google については例外です。この例外は Privacy のページにも書きました。

## 検証

build 後の HTML、Markdown、設定ファイルは、Node.js に組み込まれた test runner で検査しています。主な内容は次のとおりです。

- すべての HTML に Markdown のファイルがあり、script や style が混ざっていない
- JSON-LD の型と値、llms.txt、robots.txt、`_headers` の内容
- draft の記事が、HTML、Markdown、feed、sitemap のどこにも出ていない

配信後の挙動は、別のテストで request を送って確かめます。

- HTML を求めると HTML が、Markdown を求めると同じ URL から Markdown が返る
- どちらの response にも `Vary: Accept` が付く
- 存在しない URL は、Markdown を求めた場合も status 404 を保つ
- browser の画面遷移には HTML の 404 が返る

URL Rewrite Rule は Cloudflare の zone にある hostname にだけ効きます。出し分けは、本番と同じ zone に一時的な hostname を作って確かめてから、本番を切り替えました。

scanner の点数は参考にとどめ、完了の判断には使っていません。status、header、本文を個別に確かめ、意図した情報だけを公開できているかを見ています。

## おわりに

指摘された項目のうち、このブログの実態に合うものだけに対応しました。

Markdown の出し分け、`Link` header、JSON-LD は、どれも以前からある HTTP と HTML の仕組みで説明できます。agent 専用の URL や API を別に作るのではなく、browser と agent が同じ URL と同じ本文を共有する形にしました。一方で、存在しない組織や API を宣言すれば点数は上がりますが、agent に誤った情報を渡すことになります。何を足さないかを決めることも、対応の一部だと考えています。

## 参考資料

- [AI Agent 時代の Web サイトを考える](https://unvalley.me/ja/blog/1793627906)
- [Markdown for Agents · Cloudflare](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
- [Static Assets の課金と制限 · Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Transform Rules · Cloudflare](https://developers.cloudflare.com/rules/transform/)
- [Web Linking — RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)
- [Link Relations · IANA](https://www.iana.org/assignments/link-relations/link-relations.xhtml)
- [Content Signals](https://contentsignals.org/)
- [Machine-Readable Training Preference Signal（Internet-Draft）](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/)
- [Supporting a shared AI training control for websites · Google Search Central](https://developers.google.com/search/blog/2026/10/ai-training-control)
- [A developer toolkit to make your website agent-ready · Chrome for Developers](https://developer.chrome.com/blog/agent-ready-toolkit)
