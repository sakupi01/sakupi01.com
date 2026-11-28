# blog.sakupi01.com

Astro で静的生成し、Cloudflare Workers Static Assets（Free プラン）から配信する個人ブログです。

## 配信の仕組み

- build 時に、全ページの HTML の隣へ Markdown を出力します（`index.html` に対して `index.md`、`404.html` に対して `404.md`）。実装は `src/integrations/markdown-alternates.ts` です。
- HTML、Markdown、feed、sitemap は静的ファイルとして配信され、Worker script は動きません。
- `Accept: text/markdown` を送る request は、Cloudflare の zone に置いた URL Rewrite Rule が同じ directory の `index.md` へ振り替えます。URL は変わりません。
- 一致する静的ファイルがない request だけを `src/worker.ts` が受けます。`.md` で終わる path と、Markdown を求める client には Markdown の 404 を、それ以外には HTML の 404 を返します。
- response header は `public/_headers` で設定します。

Cloudflare の Markdown for Agents は Pro プラン以上が対象のため使っていません。

## Local development

```sh
pnpm --filter blog.sakupi01.com dev
pnpm --filter blog.sakupi01.com check
pnpm --filter blog.sakupi01.com test:agent-ready:build
```

Cloudflare と同じ配信経路（静的ファイル、Worker、`_headers`）で確認する場合:

```sh
pnpm --filter blog.sakupi01.com preview:cloudflare
pnpm --filter blog.sakupi01.com test:agent-ready:live:local
```

## Cloudflare Workers Builds

- Production branch: `main`
- Build command: `pnpm --filter blog.sakupi01.com build`
- Deploy command: `pnpm --filter blog.sakupi01.com deploy:cloudflare`
- Preview command: `pnpm --filter blog.sakupi01.com exec wrangler preview`
- Wrangler config: `apps/blog.sakupi01.com/wrangler.json`

`wrangler preview` は、設定ファイルに `previews` がないと error で終了します。空でよいので、`wrangler.json` の `"previews": {}` は消さないでください。

Build に必要な変数名:

- `PUBLIC_BLOG`（ブログの URL。末尾の `/` はあってもなくてもよい）
- `PUBLIC_HOME`
- `PUBLIC_ZENN_BASE_URL`
- `PUBLIC_SLIDES`
- `PUBLIC_STUDIO`
- `ZENN_URL`

値は Cloudflare dashboard で管理し、repository や log に記録しません。

tag には、大文字小文字だけが違う表記（`css` と `CSS` など）を作りません。macOS は file 名の大文字小文字を区別しないため、手元で build すると 2 つの tag ページが 1 つの directory にまとまり、片方が欠けたまま deploy されます。build テストがこの重複を検出します。以前あった `/tags/CSS/` は、`public/_redirects` で `/tags/css/` へ redirect しています。

## URL Rewrite Rule

同じ URL で HTML と Markdown を出し分ける処理は、repository の外にあるこの rule が担います。Cloudflare dashboard で zone `sakupi01.com` を開き、Rules > Overview > Create rule > URL Rewrite Rule から作成します。Free プランで作れる rule は 10 個までで、この構成が使うのは 1 個です。

- 条件（Custom filter expression）:

  ```text
  http.host eq "blog.sakupi01.com" and any(lower(http.request.headers["accept"][*])[*] contains "text/markdown") and ends_with(http.request.uri.path, "/")
  ```

- 書き換え: Path を Rewrite to > Dynamic にして次の式を指定し、Query は Preserve のままにします。

  ```text
  concat(http.request.uri.path, "index.md")
  ```

この rule の性質:

- path が `/` で終わらない URL（`/feed.xml`、`/llms.txt` など）は書き換えません。
- `/about` のように末尾の `/` がない URL は、先に `/about/` への 307 redirect が返り、redirect 先で書き換えられます。
- rule の比較は大文字小文字を区別するので、`lower()` で header の値を小文字にそろえています。
- 条件は文字列の部分一致なので、`Accept: text/markdown;q=0` のように Markdown を拒否する指定でも Markdown を返します。存在しない URL でも同じで、書き換え後の path が `.md` で終わるため Markdown の 404 になります。`q` の値まで解釈されるのは、rule が書き換えない path（末尾が `/` でない path）が存在しない場合だけです。

## response header

`public/_headers` が静的ファイルの header を決めます。Worker が作る Markdown の 404 には適用されないので、同じ値を `src/worker.ts` にも書いています。

- すべての response: `Content-Signal`、`Vary: Accept, Accept-Encoding`、`Strict-Transport-Security`（Vercel が返していた値と同じ）
- HTML と llms.txt: `charset=utf-8` を明示（Cloudflare は charset なしで返すため）
- `.md`: `Content-Type: text/markdown; charset=utf-8` と、HTML の URL を指す `Link: …; rel="canonical"`。同じファイルがページ自身の URL にも返るので、`noindex` は付けません
- `/404.md`: `X-Robots-Tag: noindex`
- `/blog.json`、`/feed.xml`: `Access-Control-Allow-Origin: *`（Vercel が返していた値と同じ）

既知の制限: `_headers` は request の path だけで適用されます。browser の画面遷移は Worker を通らないため、browser で存在しない `.md` の URL を開くと、HTML の 404 ページが `text/markdown` として返り、HTML の source が文字として表示されます。status は 404 のままです。

## テスト

| script                             | 対象                             | 同じ URL での出し分け |
| ---------------------------------- | -------------------------------- | --------------------- |
| `test:agent-ready:unit`            | Markdown への変換と Worker       | 対象外                |
| `test:agent-ready:build`           | 上記に加えて build 成果物        | 対象外                |
| `test:agent-ready:live:local`      | ローカルの `wrangler dev`        | 検証しない            |
| `test:agent-ready:live:preview`    | workers.dev の deploy            | 検証しない            |
| `test:agent-ready:live:rehearsal`  | zone 内の一時的な hostname       | 検証する              |
| `test:agent-ready:live:production` | `https://blog.sakupi01.com` 固定 | 検証する              |

URL Rewrite Rule は zone の hostname にだけ効くため、出し分けを検証できるのは `rehearsal` と `production` だけです。`preview` と `rehearsal` は対象の URL を環境変数で渡します。

```sh
AGENT_READY_BASE_URL=https://<host> \
  pnpm --filter blog.sakupi01.com test:agent-ready:live:preview
```

## 切り替えと rollback

1. Workers Builds の preview で `test:agent-ready:live:preview` を実行する。
2. 一時的な hostname（例: `blog-next.sakupi01.com`）を Worker の custom domain に追加し、URL Rewrite Rule の条件にその hostname を含めて、`test:agent-ready:live:rehearsal` を実行する。URL Rewrite Rule が静的ファイルの配信より先に適用されることは、ここで初めて確かめられます。通ったら一時的な hostname を外す。
3. `blog.sakupi01.com` の CNAME record（Vercel 向け）を削除し、続けて Worker に `blog.sakupi01.com` を custom domain として追加する。Cloudflare は、CNAME record が残っている hostname に custom domain を作れません。削除から追加までの間は名前解決できないので、間を空けずに操作します。
4. `test:agent-ready:live:production` を実行する。
5. pass 後に Vercel から blog の custom domain と Git 連携を外す。

手順 2 で出し分けが働かない場合は、切り替えずに設計を見直します。代替は `wrangler.json` の `assets.run_worker_first` でページの request を Worker に先に渡す方式ですが、その場合は全ページの request が Workers Free の上限（1 日 10 万 request）に数えられます。

切り替えを実行した担当者が rollback の判断と復旧確認も担当します。失敗時は Worker の custom domain を外し、`blog.sakupi01.com` の CNAME を切り替え前の Vercel の値（2026-11-28 時点で `dc17b695a7f1c613.vercel-dns-017.com.`）に戻します。Vercel の project は rollback できる期間中は削除しません。

## Free プランの上限

- 静的ファイルへの request は無料で、数の上限がありません。
- Worker の実行は 1 日 10 万 request まで（アカウント単位、00:00 UTC にリセット）です。この構成で数えられるのは、存在しない URL への request のうち、browser の画面遷移（`Sec-Fetch-Mode: navigate`）以外です。上限を超えても、既存ページの配信は続きます。
- 特定の IP からの大量 request を抑えたい場合は、WAF の rate limiting rule（Free は 1 個、IP 単位、10 秒）を追加できます。workers.dev の URL には zone の rule が効きません。
