---
title: "TPAC 2025 @Kobe Diary"
excerpt: "TPAC 2025 参加記（Unpolished ver.）"
date: 2025-11-15
update: 2025-11-20
category: 'dev'
tags: ['w3c', 'tpac', 'web', 'diary']
status: 'published'
---

## Table of Contents

## My first TPAC Diary

2025/11/10 〜 11/14 にかけて、W3C の年次総会 TPAC 2025 が神戸で開催されるので、参加してきます。 今年は[会社がメンバーシップを取得](https://blog.cybozu.io/entry/joining-w3c)したので、このような機会に恵まれました。ありがたい。。。

ということで、人生初の TPAC！新鮮な感覚もいろいろあると思うので、一旦つらつらとここに残していこうと思います。まとまりのある記事は後日改めて別媒体で書き起こします。

例によって、である調をお許しください。聞いてたやつだけ

## Day 0, 09/11/2025

### Kobe Developer Meetup (held by HTML5 Japan)

Lola Odelola の [The Web and the Digital Divide](https://www.youtube.com/watch?v=SYU4fb9sTTs)（リンクは過去公演）が、 よかった。

`<video>` `autoplay` の能動的挙動や、 カスタムフォント（`@font-face`）利用時の回線状況未考慮、WebGPU の利用可能ユーザ数などなどの観点から、Web 標準はときにユーザを排除してしまう可能性を孕んでいることを示唆する内容だった。そして、そうした状況は社会の変化とともに生じるため、Web もそれに準じて変化していく、その変化を具体例を持って示してくれた。

「The Web」 自身が「The Digital Divide」を産まないための、W3C の持続的活動への展開が、非常に TAG らしさが沁みるトークだった。

そしてその後の懇親会が、個人的にはめちゃくちゃよかった。
前段として、以前行ったカンファレンス以来、 nt1m さんと割と仲良くしてもらっていた。彼が WebKit の実装に必要な仕様を直したりテストを書いたりを自分がちょこちょこしていたら、その過程で CSS のスゴい人（fantasai）とも OL で知り合いになっていた。で、その二人が WG のチェア（alan）に自分を TPAC に誘うように言っていてくれた経緯があったのだが、その3人がこの懇親会で一挙に回収できた。（もっと時間がかかると思っていた）

虚無の顔でアイドルの踊りを見ていた Tim を JSConf に誘い（のちに rniwa さんも連れてきてくれた）、fantasai に紹介してもらい、 ちゃっかり長く拘束して色々聞けてしまった。 fantasai が WG の Chair を断り続けている理由、 TPAC での tips、 Standards-way の本質的な部分、 人を巻き込むマインドセットなど、30年近く spec writer やってて包括的に CSS のことを理解している人ならではの話が聞けて、満足感高かった。「喋ったこと、書いてまとめてるやつがあるから。あとで送るね。」とも言ってくれて、超いい人だった。

![ディベロッパーミートアップ会場](../../../../assets/images/dev-mtup.png)

そして、帰りのエレベーターで alan と lola と3人になった。lola は個人的に気になっていた ARIA-AT の提案者でもあるので、感触はどんなもんかをサクッと聞けた。 drawbacks としては、環境多様性があって、挙動の基準づくりがむずい。という回答だった気がする。詳細は breakouts に持ち越し。

総括して、大いなるコネクションは大いなるリターンをもたらす。を感じられた会だった。

その後は、一緒に来ていたメンバーと三ノ宮でご飯を食べて、ポートアイランドのホテルへ。

これを書いて寝たかったけど、移動でかなり疲弊していたので寝てしまった。

## Day 1, 10/11/2025

いよいよ TPAC 本番初日。朝から会場へ。

### Web Components CG

* Details: <https://www.w3.org/events/meetings/3d545adf-8de1-4f6d-abb5-be2030e66cf6/>
* Agenda: <https://docs.google.com/document/d/1KeqMzuPHzHXTGR2zXmOHQydMUgVm2Y8onZHVmygAQFc/>
* Minutes
  * 1: <https://www.w3.org/2025/11/10-webcomponents-minutes.html>
  * 2: <https://www.w3.org/2025/11/10-webcomponents-irc>
* Time Slots: 9AM-12:30PM
* Attendees: 14人
* Main Participating Org: Igalia, Mozialla, WebKit, Shopify
* References:
  * Reference Target​ <https://onedrive.live.com/edit?id=3C830C8020C680D9!497341&resid=3C830C8020C680D9!497341&ithint=file%2Cpptx&authkey=!AIbmxScKhLFKgQ4&wdo=2&cid=3c830c8020c680d9>
  * Declarative CSS Modules <https://docs.google.com/presentation/d/10SagxoHUY9JBlMK2dXej1atndwQdpVEz0YmmJ52dLBg/edit?slide=id.g3a1d0091211_1_93#slide=id.g3a1d0091211_1_93>
  * JS Templating DOM Parts DOM Scheduling: <https://docs.google.com/presentation/d/1r0AXWbP8RadIBuIFl-hC3O8G6YhTlguxKyluDIWil7g/edit?slide=id.p#slide=id.p>
  * heximal: <https://heximal.dev/>
  * Exploring HTML Module​ <https://docs.google.com/presentation/d/1eKio8ZvoeBqMe0Ao161hE-RaGGRagYTZ28KKL6xOkAg/edit?slide=id.p#slide=id.p>
  * HTML module use case examples: <https://gist.github.com/justinfagnani/33c83d8b886e3ed2c362911263e40080>

本当は TAG にいく予定だったけど、 TAG 以外の人はダメってキックオフされたので WCCG へ。
人がだんだん集まってきて、部屋はパンパン。 Attendee は 14 人くらいの錚々たるメンバーだった。

```
alan(CSSWG Chair) - Anne(webkit) - Anthony(shopify) - adam(shopify) - lea - ?
                                                                    ?(?)
                                                                    Keith(Mozilla)
                                                                    Johnson(Chair)
rniwa(webkit) - tim(webkit) - emillio(Mozilla) - brian(Igalia) - alice(Igalia)
```

WCCG はテーブルに座ってる人もいない人も含めて、全員挨拶。

---

* **Reference Target​ (for Cross-Root) 関連**
  * shadow dom 内の要素を IDREF から参照する場合、 そのターゲット（reference target）が無効な場合にどう振る舞うべきかが焦点
  * Reference Target​ は Phase が 1/2 に分かれる。 1 は「IDREF-適用要素が 1:1 になる場合」 2 は「複数IDREF-適用要素が N:N になる場合」
  * Phase 1: reference targetの解決を行わず、単純に要素を返すことに決定
  * Phase 2: で、無効な reference target の場合にどう振る舞うかを議論するまで延期
Igalia Alice Boxhell のファシリテート。Alice さんの会話の温度とりがすごく良かった。

* **@sheet & Declarative CSS Modules**
  * というか、ほとんど DCSSM の話だった
  * 議論は主に二つ：@import との統合方法、モジュールのスコープ
  * まずは emilio からの @import で Declarative CSS module を参照できるか？追加の構文が必要？という問い
  * JS の import と CSS の import にはモジュールマップを見るかみないかの違いがある。 JS は見るけど CSS は見ない、的な lea からの指摘（CSS は単なる URL）
  * Declarative CSS Module が Attribute @import のセマンティクスが JS modules と合わない
  * Import Assertions から派生した提案なのに、 CSS Modules は JS Modules と同じ振る舞いをしない・できない
  * だからモジュールマップ見れるように `@import module(foo)` みたいな構文作っとこ
  * そのモジュールはどこに展開されるの？という rniwa さんの議論を転換する鋭い発言
  * モジュールマップはグローバルなので、名前衝突の問題がある
  * で、衝突した際に優先されるのはグローバル
  * なので、ローカルスコープで定義されたやつはオーバーライドされる。コンポーネントのスタイルを上書きできることになり、よくない。

* **JS Templating / DOM Parts / DOM Scheduling**
  * なんか全体的に「やりたいことはわかるんだけど、デカい」問題から提起が始まった（Explainer 割とそのまま）
  * ただ, DOM Scheduling （そのまま、 DOM の並行バッチ更新）の話は新しかったが、必須ではない
  * DOM Parts とスケジューリングなしでもテンプレーティングは始められる
  * DOM Parts とか、template instantiation とか、スケジューリングの話とか、SSR 考慮した dom manipulation の仕方どうするとかいろいろあるから一個に絞ろって、にわさんがまとめてくれた
  * 特に Web Components に至っては、本当にごもっともな指摘だった
  * 切り上げられた（実質何も進まなかった）

* **Exploring HTML Modules**
  * HTML Modulesは時期尚早。実際の需要はHTML Includesの方
    * Includes はサーバサイドテンプレーティング的な。顧客が欲しいものが「再利用のための HTML 部品」であれば、これでいい
  * Justin は Modules の方を欲しがる
    * Modulesの方が、フレームワークをカバーするようなより動的な話が盛り込まれている
  * Declarative Custom Elements なしでHTML Modulesを作っても、結局JSが必要になるという rniwa&anne の指摘
  * 何回も書いてサイズが大きくなるのが嫌なら、 Compression API を使えば？という Keith の指摘
  * lea: そうではなく、State of HTML をみても HTML Modules の需要はまだある
  * ふんわり、Justin vs others な感じを感じた
  * 問題の依存関係が不明確だし、やろうとしてることがやはりデカいので、切り分けた方がいい by rniwa。HTML Modules は延期。
  * Template API と DCE の進展を待つ
  * 小 WG で DCE と HTML Modules に特化した検討をしては？という Next Action

---

という感じで、ほとんど Web Components に集中していた。

AGWG が WCAG3 やってるのもみたけど、「この環境では〜この場合は〜どう対応するの？」みたいな話がほとんどで、途中離脱。最後は AI の考慮なども入ってきて、殊更についていけなくなった。特に何か決まったというのもなさそう。 一応 memo:

* Schedule: <https://www.w3.org/events/meetings/5ba02c76-d748-4db0-9e2a-c73e4238ec48/>
  * Slides: <https://docs.google.com/presentation/d/1lrSm4JSt7vgmXdAJwO0cASqp11EGYoCCR6Ni2OkWBzk/edit?slide=id.p#slide=id.p>
  * Minutes:
  * ATWG, WCAG, UAAG に手を出そうとしている
  * AT は今の課題に一番早くアプローチできるそうだから手を出して行きたい
  * アクセシブルなコンテンツを作りやすくする
  * でもその上で「何が正しいのか」ってのを wcag3 で話しているよね？それって何？みたいな話
  * まず、特定の 「AT」に限定特定の「地域」に限定とかで進めていくのは？って案が出たけど、なんかまとまってこれってのはなくてわからんかった

---

そのほかは Tim と喋り、rniwaさんと喋り、 JSConf に誘ってきた。どちらとも日曜に東京で都合をつけてくれ、運が良かった。
Rniwa さんと話しながら部屋に戻っていたところ、 廊下で Anne と Rniwa さんと Emillio の議論になり（聞いてるだけだけど）、「私もこんなに議論できたらなあ〜、勉強なるなあ〜」などと勝手に感動していた。

### 日本会員ディナー@ジェームス亭

訳あって、 前日に W3C CEO の Seth Dobbs 氏の隣席を賜ることになった。つまり、めちゃくちゃウキウキだけだったのにめちゃくちゃ緊張して胃が痛かった。

「Reserved」 の札が立てられた席に着席。 Seth 氏は非常にフレンドリーで、和やかな雰囲気で会話が始まった。 自己紹介から始まり、W3C の最近の動向や、日本のウェブマーケットに対する見込みなどを伺えた。 Seth さんは CEO になる前は普通にディベロッパーだったそうで、Epub 周りを触っていたらしい。ウェブのマインドセットに非常に共感しており、2,3 年前の CEO 募集に応募し、就任されたとのこと。

何か備えていっておけば良かったが、昨日の今日かつ準備する体力もなかったので、割と雑談的な質問をしてしまった。 食事が進まないくらいたくさん喋っていただいて、Seth さんには少し申し訳なかったけど。

<div style="display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
 gap: 3px; place-items: center;">
<img src="/images/food1.png" alt="ローストビーフ"/>
<img src="/images/food2.png" alt="カボチャの前菜的な"/>
<img src="/images/with-seth-ceo.png" alt="Seth Dobbs 氏とのディナー"/>
<img src="/images/james-tei.png" alt="ジェームス亭"/>
<img src="/images/james-tei-outside.png" alt="ジェームス亭外観"/>
<img src="/images/seth-and-igarash-san.png" alt="Seth さんと Igarashi さん"/>
</div>

帰り際、日本のウェブの父、村井純先生ともお会する機会をいただけた。非常に光栄なことに写真を撮らせていただける機会にも恵まれた。

![村井先生との写真](../../../../assets/images/with-murai-prof.png)

TPAC に行く前は「ただの日本会員ディナー会」を想定していたが、思いもよらないオファーと機会の巡り合わせで、非常に稀有な機会を得られた。ありがたかった〜。

## Day 2, 11/11/2025

### WHATWG

* Schedule: <https://www.w3.org/events/meetings/3d545adf-8de1-4f6d-abb5-be2030e66cf6/>
* Agenda
  * 1: <https://docs.google.com/document/d/1XQLLjETtdBPv-xGiGPRALR4X7hgSb_Lk13bdBucEJ_g/edit?tab=t.0#heading=h.51akrqmzup50>
  * 2: <https://github.com/whatwg/html/issues/11711#issuecomment-3499143498>
* Minutes: <https://www.w3.org/2025/11/11-whatwg-minutes.html>
* Time Slots: 09:45AM-12:30PM
* Attendees: Anne, smaug, rniwa, emillio, andreubotella, nicolo-ribaudo, fantasai, kizu, domfarolino, foolip, masonf, noamr, rakina, jake, & many more
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Igalia
* References:
  * minutes doc: <https://docs.google.com/document/d/1XQLLjETtdBPv-xGiGPRALR4X7hgSb_Lk13bdBucEJ_g/edit?tab=t.0>

---

* **FormControlRange**
  * issue: <https://github.com/whatwg/html/issues/11478>
  * 現在の Range API では `<textarea>` や `<input>` 要素の**選択値**に対して Range 操作ができない。要素自体は選択できても、その中のテキストの特定部分をライブで選択して Range として扱えない。
  * CSS CustomHighlight API を提案しているのに必要がゆえの提案。
  * AbstractRange のサブクラスとして実装したいか or textarea/input の値空間で動作する、全く別の FormControlRange interface を作る方向か。 FormControlRange は it's different enough from Range to justify creating a new type. という立ち位置だし、 Range を拡張したら全てのメソッドの書き換えを要したり話が大きい。
  * FormControlRange Interface の提案概要
  * Custom Element/Shadow Root への対応は、 Element Internals 経由でやる？
  * 命名どうする？

* **Anchor Positioning - Anchor Positioning Inter Related Issues**
  * Anchor Attribute: <https://github.com/whatwg/html/pull/9144>
  * issue: <https://github.com/w3c/csswg-drafts/issues/9356>
  * issue: <https://github.com/w3c/csswg-drafts/issues/10311>
  * issue: <https://github.com/w3c/csswg-drafts/issues/7628>
  * popover は Implicit Anchor Positioning をつくる。 popover はこれで対応できる。
  * ので、popover 以外に Anchor Positioning のユースケースがあるか？マークアップ的対応は必要か？
  * anchor positioning、 presentation reason 以外で使うユースケース、ある？
  * Anchor positioningにはプレゼンテーション目的（セマンティックな関係を表現すべきでない）とセマンティックな関係を表現すべき（popoverのような）ケースが存在する
  * presentation binding は CSS 側で作れる。ここに異論はない。が、 semantic binding は作れない。
  * Anchor Positioning はセマンティクスを解決するものでは全くない。それは欲しいものではない。
  * ARIAは "mental load" が大きい。そのコンテキストに応じたアプローチが必要
  * HTML に入れるには semantic meaning が必要になってくる。その semantic meaning は本当に anchor positioningに必要？
  * \> 必要ではなさそう
  * ただ、popover を利用した semantic な anchor binding を行うときに、開いた常に表示しておく場合は検討できる
  * needs more thoughts

* **HTML in Canvas**
  * `<canvas>` を利用すると、プラットフォームがやってくれる機能を失ってしまう。アクセシビリティの問題や高度なテキストフォーマットなど。
  * なので、 `<canvas>` 内に HTML で描画できるようにしたい
  * Canvas の子要素として配置した HTML/SVG 要素を Canvas 内に直接レンダリングし、インタラクティブに操作できるように
  * foolip がすでに動作するデモを作っていてすごかった
  * ランチによりここで離脱

* **Navigation API**
  * ボタンを何回もクリックした時に何回もリクエスト飛ばしたくないので、3秒以内の新しいリクエストは無効にしたいという提案について
  * 主に実装の詳細の議論
  * つまり、ポジ or ネガでいうとポジな前提の議論

---

Google JP からきていた数名の方と神戸牛鉄板焼きに行った。とても美味しかったです。

![神戸牛鉄板焼き](../../../../assets/images/teppan.png)

この日の夕飯は一緒に来ていたメンバーと三宮まで。２日目、出張は３日目。慢性的な疲労が結構溜まってきた。

## Day 3, 12/11/2025 (Breakouts)

今日は一日 Breakout Sessions の日！
人が割とたくさんきていると思うので、話せる内容を持っていきたい。

### For Everyone: Towards a Sustainable Future for Independent Standards Work

* Schedule: <https://www.w3.org/events/meetings/2107ef50-86f2-47b9-9b4e-a36cf0e3015a/>
* Agenda: <https://www.w3.org/events/meetings/2107ef50-86f2-47b9-9b4e-a36cf0e3015a/>
* Minutes: <https://www.w3.org/2025/11/11-webplatform-design-minutes.html>
* Time Slots: 8:30AM-9:30AM
* Attendees: around 20? Lea, Florian, Milliam
* Main Participating Org: Unknown
* References:
  * For Everyone: Towards a Sustainable Future for Independent Standards Work: <https://webplatform.design/talks/tpac2025/>
  * Web Platform Collective: <https://github.com/webplatformco>

Web標準という公共財的インフラを、大企業の社員以外の独立した専門家が支えているが、その作業に対する安定的な資金調達の仕組みがないという問題について。

* fscholz: 大企業のメンバーシップモデルはあるが、企業の参加は流動的で、いつ消えるかわからない
* Open Collectiveを使った寄付モデルやクラウドファンディングだけでは不十分
* 政府からの資金調達も企業への提案と同様に説得が困難
* WPT を chrome で初めて行くために igalia を雇用しないといけなかった
* ボランティアではやっていけない量の standards works が、やまほどある
* bkardell: W3Cのような組織が資金をプールして、共同で優先順位を決める仕組みは？Igalia はクラファンでそうやってる
* ドキュメント作成など、実装以外の作業も価値として売り込める
* 作業の影響や必要時間、金額などを明確に示す透明性が欲しい
* Open Web Docs とかは年次でそういうレポート出してる。
* lea のポートフォリオで、どの standards work にどのくらい時間がかかったのかを示すのの公開は考えている？
* 持続可能性
* miriam：大口スポンサーが離れた場合の持続性をどう確保する?
* florian: 引き続き話せる場つくろう

### Future of the Open Web

* Schedule: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Agenda: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Minutes: <https://www.w3.org/2025/11/12-future-of-the-open-web-minutes.html>
* Time Slots: 11:15AM-12:15PM
* Attendees: Mark Nottingham, Tantek Celik, David Baron, Chris Wilson, Rick Byers, Chris Harrelson, Martin Thomson, Jeffrey Yasskin, Theresa O'Connor, Mason Freed, Alice Boxhall, Alison Maher, Roman Komarov, Adam Rice, Philippe Le Hegaret, Rachel Andrew, Emilio Cobos Alvarez, Noam Rosenthal, and so many
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Igalia, Invited Experts
* References: <https://docs.google.com/document/d/1WaXDfwPP6olY-UVQxDZKNkUyqvmHt-u4kREJW4ys6ms/edit?tab=t.0#heading=h.o7pe1jtypsho>

![会場パンパンになり、熱く意見が交わされる Open Web の breakouts](../../../../assets/images/open-web.png)
*会場パンパンになり、熱く意見が交わされる Open Web の breakouts*

率直に、「この場に身を置けただけでも TPAC に来た価値があった」と思えた。
私がこれまでみてきた中で、これほど「**これからの Web について真剣に議論する**」場はないと感じられる、熱く、どこか緊張感の走るセッションだった。

セッションの趣旨としては、「昨今 AI の登場などで曖昧になりつつある「Open Web」の定義を再議論しよう」というもの。
あとでブログ一本にまとめる価値があるくらいのすごい議論だったが、一旦ここではメモを。

* 全体として、Terms & Conditions: How contents are get used by who? が主要な問題そう
* 出版社の人：生成 AI は著作権の仕組みを悪用し、大量のデータを同意なしに収集している。これは deeply exploitative
  * → bvandersloot: AI が大量生成する "slop" で Web が溢れかえる問題も
* What is Open Web
* jyasskin: 好きなコンテンツを自由に選択した UA が解釈し、コンテンツの value を好きなユニ提供できる でも、AI が介在すると、コンテンツを作る価値が薄まってしまう
* commons vs open?
* dbaron: Open Web のための新しいツールを作ることが重要
  * そもそも多様な定義の仕方があるんで、定義は困難
  * → 新しいブラウザ、パブリッシング、コンテンツ消費ツールを作れる能力こそが Open
* tantek
  * Wikipedia と Internet Archive は最も重要なオープン Web サイトで、広告もペイウォールもない
  * 15 年前のブログポスト今も有効：書く・共有する・発見される能力
  * → OpenStreetMap 「人類には不可能だと言われたのに実現した」
* Michael Kleber (Chrome?): クロール後の利用条件について
  * Policy 側: 法的条件の付与（著作権など）
  * Technical 側: エージェント認証ベースのアクセス制御
* → DavidS: まさに IETF で議論してる AI-Prefs と WebBotAuth の話
* Ads, tracking, Agentic AI: It's not presenting
* it's difficult to define without usecases.
* → hadleybeeman: TAG でも agentic AI と user agent の関係を議論中
* **Everything we're doing is for people.**
* → reillyg: 初期の Web は「できるから」公開してた。商業化は後から
* → Tess (hober): 定義より「エコシステム」として捉えるべき。力学とレバーを理解すべき
* jeffrey: what rules/borders?
* → robots.txt の社会的契約を無視すると、クラス全体に backfire (MT)
* web contents はそれが
* business models for
* → kleber: 広告は tax として機能。だからみんなアクセス可能に
* → Isaac (MS Ads): 全部がトラッキングベースである必要はない
* Chris Wilson: Open web isn't just one thing.
  * each of these(SNS, chat…) change
  * How do we take the best parts and how do we beat the worst past.
  * It's not the binary decision.
* → AI の成長が massive effect を持つことは確実。shifting dynamics
* tantek response to ads:
  * これらのサイトは「貧しい人も裕福な人も」アクセス可能
  * 一方、広告過多のサイトは古いデバイスや遅いネットワークでは動作しない
  * → MT: 「Wikipedia の数学記事読んだことある？"accessible" って言えるか？」
* There're different models for open web.
  * → rbyers: トレードオフを管理できないから社会全体で決めるべき
* Ad
  * → Simon: クライアント側を規制できないのが Open Web の essence。robots.txt 無視もステイ
* Mark Nottingham
  * **"open" という言葉は使われすぎている。オープン性には様々な度合いがある**
  * **それぞれ異なる部分を保護したいと考えており、異なる視点からどう保護するかを考える必要あり**

---

Open Web のセッションの後、最近 web.dev で執筆した記事についてお世話になっていた、 Google の Rick Viscomi さんとお話しする機会があったので、諸々の感謝を伝えた。彼は午前自分が見れなかった [Baseline の Breakout](https://www.w3.org/events/meetings/95b89f3d-1494-4f0e-9968-53fdf15945dc/) の Chair だったので、そのことについて聞けた。内容は、以下のリポにまとまっているそう。

* rviscomi/accelerating-adoption: <https://github.com/rviscomi/accelerating-adoption>
* Web Features Polyfill Explorer: <https://rviscomi.github.io/accelerating-adoption/>

その後、別の Baseline 記事レビュアー、Kadir Topal さんともお話しできた。「Baseline について、何かフィードバックある？」と聞かれた。「利用できない機能の detect」ではなく「利用できるが使ってない機能の detect」、つまりポリフィルの削減に Baseline はまだ使いにくいかもしれない、という話をしたところ、かなり興味を持ってもらえた。

余談だが、Kadir さんは JSConf の Pre-event で、記事の内容と TPAC で話したことを共有してくれたらしい。自分は不在だったが、こういう影響力のあるところで影響力のある会話をすると、大きな場で昇華してくれるのはありがたい。

![alt text](../../../../assets/images/kadir-talk.png)

Anyways, どちらからも「記事、すごく良かったよ！」と言ってもらえて、嬉しかった。

---

正直、2日目は疲労で完全にダメで、省エネで過ごしてしまった実感があった。そして「このままではいけない」という感覚があった。なので、３日目は作戦を練って臨んだ。 Breakouts の日は人もたくさんくる。この機に乗じて、話す予定だった人をできるだけ捕まえて、話せるようにする状態を作っておく必要があると思った。

よって、お昼前に Tim に連絡をとっておき、「午後、もしよければ WebKit の CSS 実装について教えてほしい」とお願いしておいた。そしてできれば fantasai とも話したいとお願いも。

そしてお昼過ぎ。 3F のオープン作業スペースで Tim を待っていると、そこに fantasai が先に来て、自然な流れで話が始まった。

彼女は US の大学時代に仕様の proofread を始め、そこから仕様の editorial な部分だけでなく文の「ロジック」部分も見るようになり、それが spec writer として活動し始めた経緯だった。もちろんその活動は一人でもやっていけるが、 Tips として、「複数人で仕様を読みながら、『全員が 100% 同じ解釈をした』となるまでその文章の論理を詰めていく」ことをやっていたそうで、それをやってみるといいよ。とアドバイスをもらった。これは機会があったらぜひやりたい。

* Flexbox Spec Workshop: <https://fantasai.inkedblade.net/style/events/flexbox-workshop>

また、彼女は Layout に非常に強い spec writer であるということも知っていた。なので、仕様の話をしている中でどうやって Layout に精通していったのかについて聞くと、彼女は Gecko の Layout での実装経験を語ってくれた。

* fantasai: /weblog/2023/align-content/: <https://fantasai.inkedblade.net/weblog/2023/align-content/>

CSS には大量の仕様がある。その仕様のエディタをしているのは、 fantasai 含め、容易に数えられるほどの人数しかいない。そんな中、もちろん仕様を書いてくれる人も欲しいが、もっと**リアルワールドのユースケースや実装経験を議論の場に持ってきてくれる人**が必要だ。

TPAC では、もちろんエンジン実装側や Web のプリンシパル文脈での議論も交わされたが、それと同量程度の「この場合はどうなる？」というユースケースの話がなされた。 Web が合意形成した結果とも言える「仕様」は、そういった実に細かなユースケースの集合体であることを、強く実感した。

そして、そういったフィードバックを専門とするのは、エンジンの実装者や仕様のエディタではない。デザインシステムを作り、フレームワークを作り、ライブラリを利用している、私たちだ。そんな”貴重な”立場からのフィードバックをとてもありがたいと思っているし、もっとそいういう人が増えてほしい、と fantasai は伝えてくれた。

* 「この Ana Tudor のコメントのようなものは、とてもありがたい」と伝えてくれた： <https://github.com/w3c/csswg-drafts/issues/4410#issuecomment-1086891786>

fantasai とたくさん話している間に、Tim が私でもできそうな WebKit の CSS 実装のタスクをいくつかピックアップしてくれていた。 それを見せてもらいながら、どういう風に実装されているのか、どういう風に動いているのかをざっくり教えてもらった。

話しているうちに、Tim が Editor の Form Control Styling を一緒にさせてもらうことになり、text-justify の WebKit 実装の面倒を見てもらえることになった。（この後 JSConf でペアプロをしてもらう中で、 「`ident()` の実装の方がいいかもしれない」という話になり、結局そっちになりそうだが）

そんなこんなでそのお昼過ぎは、 fantasai と Tim に囲まれて、3人で丸１時間半くらいつきっきりで CSS の仕様の話、実装の話をしてもらっていた。

何か継続的に繋がれるものを得られたのと、つながりが一段深まった感覚があって、この午後の充実感はすごかった。オフラインで来て、本当によかった。

### Custom Attributes for All

* Schedule: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Agenda: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Minutes: <https://www.w3.org/2025/11/12-custom-attrs-minutes.html>
* Time Slots: 11:15AM-12:15PM
* Attendees: So many!
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Igalia, Invited Experts
* References: <https://docs.google.com/document/d/1WaXDfwPP6olY-UVQxDZKNkUyqvmHt-u4kREJW4ys6ms/edit?tab=t.0#heading=h.o7pe1jtypsho>

Custom の Attribute を HTML 要素に追加できるようにする提案。

* memo
  * Mutation Observer を使って属性の変更を監視して、要素に追加の機能（"superpowers"）を与える仕組みとして使用していた。
  * 普通にエルゴノミクス的に良くないし、Shadow DOM境界の問題もあったShadow Root を越えてセレクトしたり監視したりできない。
  * なので、MO を使わない方法で属性を superpower したい。
  * 多くの場合、複数の属性が協調して動作する必要がある。
  * つまり、要素の本質（要素自体）を変えるのではなく、振る舞いを追加（Mixin）するのがCustom Attributes。で、その mixin の方向はかなり感触だった。
  * data-*、aria-*との衝突をどう避けるか
  * ダッシュ付き属性名を開発者用に予約できるか
  * 諸々の懸念はありつつも、大きな反対意見は出なかった。
  * 提案に対して大きな反対はなく、興味深いという反応っていう反応だったので、 keith が impl を作ってみて詰めてみようという感じだった。
  * 注意したいのが、これはCustom Element に対する attr ではなく、要素に対するカスタム attr. CE との差分は詰めていく。
* Ship it! （って言われたけど実際は「良さそう！実験やってき！」の意だと思う）される breakouts だった。なかなかないのでは？

### [TBD] Fixing IDREFs

* Schedule: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Agenda: <https://www.w3.org/events/meetings/679c6e5a-f288-4a9b-8887-9d9af4d8b8ad/>
* Minutes: <https://www.w3.org/2025/11/12-apa-minutes.html>
* Time Slots: 11:15AM-12:15PM
* Attendees: So many!
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Igalia, Invited Experts
* References:
  * document: <https://docs.google.com/document/d/1WaXDfwPP6olY-UVQxDZKNkUyqvmHt-u4kREJW4ys6ms/edit?tab=t.0#heading=h.o7pe1jtypsho>
  * related comment: <https://github.com/whatwg/html/issues/10143#issuecomment-3195739405>

---

### Podcast 収録

この日の夜は、神戸から大阪までドライブをしてもらい、ポッドキャストの収録をした。
ここ 3日間の TPAC の収穫を放出すべくﾎｸﾎｸしていたのもあり、いつもの Monthly とは違った感じで、かなりテンション高めな回になった（なってしまった（？））。

* ep189 Drive Talk: TPAC 2025 | mozaic.fm: <https://mozaic.fm/episodes/189/tpac2025.html>

大阪ではお好み焼きを食べた。モダン焼きは麺が入っているやつらしい。どちらも美味しかった。「砂ずり」があまり知られてないことも、びっくりしたのでここに残しておく。

<div style="display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
 gap: 3px; place-items: center;">
<img src="/images/canalun-and-jxck.png" alt="ナビ操作に必死な canalun さんと jxck さん"/>
<img src="/images/okonomiyaki.png" alt="お好み焼き"/>
</div>

## [TBD] Day 4, 13/11/2025

### CSS WG

* Schedule:<https://www.w3.org/events/meetings/c73e9796-940b-4df4-9c86-eb04a8da1abc/>
* Agenda: <https://github.com/orgs/w3c/projects/213/views/1>
* Minutes
  * Minutes は各 issue にコメントされる。後日メーリスにまとまる
* Time Slots: 09:45AM-12:30PM
* Attendees: 20?
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Igalia
* References:
  * whatever

* [css-scoping] Scoping of functions, other name-defining at-rules and custom idents · Issue #11798 · w3c/csswg-drafts <https://github.com/w3c/csswg-drafts/issues/11798>
  * 色々 ident で定義するものが増えてきた。 Light/Shadow DOM 以外で名前空間の衝突を防ぐ方法がない。つまり、Light DOM はグローバル

* [css-fonts-5] Text Fitting: Shrinking and Growing · Issue #12887 · w3c/csswg-drafts <https://github.com/w3c/csswg-drafts/issues/12887>

* [css-fonts-5] Text Fitting: Scaling of things based on font-size · Issue #12888 · w3c/csswg-drafts <https://github.com/w3c/csswg-drafts/issues/12888>

* [css-anchor-position-1] Allow anchor references to match names in outer tree scopes · Issue #9408 · w3c/csswg-drafts <https://github.com/w3c/csswg-drafts/issues/9408>

* [css-grid-3] Masonry Switch Syntax
<https://github.com/w3c/csswg-drafts/issues/12022>

> RESOLVED: masonry switch will be display: grid-lanes

---

## Link

* whatwg
  * WHATWG – 13 November 2025 <https://www.w3.org/2025/11/13-whatwg-minutes.html>

## Day 5, 14/11/2025

### CSS WG

* Schedule: <https://www.w3.org/events/meetings/9be8b030-8bb9-4dab-a647-24dc763075bf/>
* Agenda: <https://github.com/orgs/w3c/projects/213/views/1>
* Minutes
  * Minutes は各 issue にコメントされる。後日メーリスにまとまる
* Time Slots: 9:00AM-6:00PM
* Attendees: 20?
* Main Participating Org: Google, Microsoft, Apple, Mozilla, Invited Experts ...
* References:
  * whatever

#### 全体的な所感

#### 議論内容

* **Which replaced elements stretch?**
  * iframe, video などの置換要素は、何も指定しなければ親要素の幅いっぱいに自動的に広がるようになっている。が、これがブラウザごとに挙動違うし、仕様にもない
  * Servo の Looriol からの提案
  * Spec に明記することになった

...

ここまでの三つ、鋭意実装中の Servo だからこそ出せる issue だなと思って聞いた。
比較的最近でもない機能の実装の差分を埋める議論で脳が追いついてない。。。

* **Proposal: Add overscroll gestures with ability to reveal elements**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12750>
  * resource: <https://docs.google.com/presentation/d/1J7RrjKQQCuqLjxTOTvGWoGmxq2FzVvL00YpEczaRUUo/edit?slide=id.p#slide=id.p>
  * 要するに、スワイプジェスチャーを Web で宣言的に実装できるようにしたいというやつ
  *`overscroll-area` を指定して、その領域までスクロール可能にする
  * breakout session からこっちに昇格したらしい。ので、ユースケースについては結構ポジティブ
  * Adam の demo：<https://codepen.io/argyleink/pen/gOzPYOj>
  * これを CSS でやるか HTML でやるか
  * overscroll 領域は画面外にある
  * ので、ユーザによってはそのコンテンツの存在を知ることができない可能性がある？
  * focus できるのでは？？と思ったけど、どうなんだろ
  * そいういう領域を見つけられるようにするためのボタンの併用を強制できるべき
  * focus できるのはそうだけど、その挙動の話かな？
  * noamr: これはスタイリングであり、プログレッシブエンハンスメント。 ページのセマンティックな性質を変えるべきではない
  * dbaron が似たような別の提案を持っているらしい。あとでちゃんと見る
    * Snap-to-activate (Explainer): <https://github.com/WICG/declarative-partial-updates/blob/main/snap-to-activate-explainer.md>
  * OpenUI や ARIA といっしょに話してみないとわからないとなった
  * このあと joint あるんかな？

* **Negative containing blocks and auto margins**
  * issue: <https://github.com/w3c/csswg-drafts/issues/11478>
  * inset の値が大きすぎると containing block が負の値になってしまう（？）
  * containing block の値が負の値になってしまうことに関するブラウザ間の挙動差異が発生している
  * 「存在しない配置領域」に対して margin: auto で中央寄せを行おうとすると、ブラウザごとに異なる解釈がされてしまう
  * 今の観点はすごい面白かった。 25 年前のレイアウトエンジンはそんなにパフォーマンス的にも優れてなかった。だから、仕様でも理想挙動を明記できなかった
  * \> the original collapse was supposed to not impact layout for perf reasons. tables 25 years ago were very expensive. it's not a good behavior. what people would actually want is to do an extra table layout but that's complicated
  * まあでも今やるとしたら、 blink みたいに０にクランプするのが良さそう
  * ただし、blink は alignment のバグがあるのでそこは直す

* **Exposing navigation/route matching**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12594>
  * CSS で URL Pattern に応じてスタイリングを振り分けるセレクタをかけるようにしたい、という提案
  * Navigation API 、 VT と併用すると良さそう
  * SPA のようなルーティングベースの UI 制御を CSS レベルで実現しようという動き
  * View Transition とコンバインすることが前提であるのであれば、今回のように without JS でやるアイディアはあってもいいのではないか
  * URLPatterns - すでにある機能を CSS で利用可能にし、 セレクタマッチングに利用可能にする
  * すでにあるプリミティブを生かしていく流れ、良い
  * lea: ルートに名前をつけて HTML/css/js で、プラットフォーム全体で参照できるようにするのは？
  * `@route` はルーティングっていう UI 開発者にとって馴染みの薄い概念を意識させるのと、 Navigation API との一貫性を保つため `@navigation` はどうか
  * `css-route-matching` から `css-navigation` に変更
  * BfCache どうなる？TBD
  * Editors Draft になる！
  * これはかなり面白い提案と進展だった
  * プラットフォーム SPA 元年か？

* **What is the layout of the `::v-t` pseudo in relation to the scope?**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12324>
  * `::view-transition` がスコープ（遷移の適用範囲）に対してどのようにレイアウトされるべきかという話
  * 現在は view-transition 擬似要素が子要素としてスコープの中に配置されるので、その適用範囲自体が遷移に参加する場合
  * `::view-transition` が遷移の適用範囲に対してどのようにレイアウトされるべきかという話
  * で、これが現状 position absolute で色々良くない場合がある
  * エッジケースみが強い
  * 繊維の適用範囲がスクローラブルコンテナの場合の話とか
  * 全然あり得はするか
  * フラットに展開されていた view transition が、これからは stacking context を持つようにすることで解決？

* **Order of inheritance vs. mapping in logical properties**
  * issue: <https://github.com/w3c/csswg-drafts/issues/3029>
  * 確かに writing mode が変わる場合の logical <-> physical properties の継承ってどっちでやってるんだろう
  * あ、どっちも physical を継承するのか
  * それをそれぞれマッピングした方がいいのかという
  * あ、すでに過去にそういう resolution 出ている？
  * でも長い事誰も実装してないし、今実装したらどのくらい壊れるかわからんから一回ちゃんと話しておくって感じか
  * emilio: キーワードが一部プロパティだけ特別扱いして変換するのはおかしいし、あんま useful じゃない
  * \> RESOLVED: specify inheritance works on physical properties
  * つまり 2020 年の resolution を覆す形でいく（全て物理にして継承）
  * これまでもそうだったので互換性が壊れることもない

* **`column-height:0`**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12787>
  * column-height をし指定可能になったことにより、 column-wrap をトリガーできるようになった。 column-height: 0; の場合にどのような挙動になるかについて、 column-wrap との関係性を騒動ルアに関して議論されている。
  * 列が表示されなくなるのか、最小高さが適用されるのか等
  * fantasai: Fragmentation 仕様ですでに fragmentainer は最小1pxのブロックサイズを持つ
  * fantasai さすがだ
  * 0を許可し、fragmentation 仕様で進捗を保証するという合意
  * 実際のレイアウト時にfragmentationが最低限の進捗（1px）を保証

* **column-wrap, column-height and column balancing**
  * issue: <https://github.com/w3c/csswg-drafts/issues/11976>

最終日のお昼ご飯はうどんを食べに行った。久しぶりの定食っぽい感じ、美味しかった。やっぱりこういうのが一番美味しい。

* Source maps for CSS
  * issue: <https://github.com/w3c/csswg-drafts/issues/13098>
  * the current source maps proposals, check <https://github.com/tc39/ecma426/tree/main/proposals>
  * resource: <https://docs.google.com/presentation/d/1lyor5xgv821I4kUWJIwrrmXBjzC_qiqIqcZxve1ybw0/edit>
  * resource: <https://docs.google.com/presentation/d/1KrVRIiz2J9hbQGMuWZZQeo1sAtyR4nWD3EwINSGoYcE/edit>
  * CSS のニーズに合わせてソースマップ改善したい。どんな改善ができそうかの議論
  * ソースマップは主に JS 向けだが、HTML 向けにも拡張中。CSS にはどんなふうに対応できそうか考えたい、という一連の説明が Nicolo からあった。
  * 協力していきたいんで、nicolo たちに連絡ちょうだいねっていうプレゼンだった
  * kizu: CSS のソースは CSS 以外からも来る可能性がある（JSON、JavaScript. etc）

* **item-flow row vs. column in masonry layouts**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12803>
  * resource: <https://lists.w3.org/Archives/Public/www-archive/2025Oct/att-0013/CSSWG_2025_October_Masonry_Item_Flow.pdf>
  * Tab: 「もしwaterfallレイアウトでrowを使うなら formal objection する」
  * Tab: 「formal objection する」 ２回目、かなり強い
  * ntim: もしそうならこっちだって formal objection する
  * 白熱してきた
  * mia: 対話したいと言ったのに formal objection なの？自分たちには権限ないの？という皮肉でかなり緊張感高い
  * alan:「formal objectionを投げ合うのは不適切で生産的じゃない、という注意が入った。さすが
  * fantasai がデモしながら新しい grid-lanes での row / column の指定方法を説明
  * tab と fantasai の間で意見が対立した
  * florian: ここでまとまるわけないから、一旦オフラインで話せてよかったとして、次に進もう。 TPAC で話せてよかった。

![白熱する masonry の row/col 概念議論](../../../../assets/images/masonry-syntax.png)

* **Expose environmental variables inside apply's contents block**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12631>
  * 現在の mixin の仕様では、パラメータは `env()`、パブリックのカスタムプロパティは `var()` と2つの異なるシステムを使い分ける必要があるらしい
  * 開発者が常に「これはパラメータか、通常の変数か」を意識しなければならないのは苦痛なので、どっちも var でやりたい
  * Chrome Canary での実装がある
  * YouTubeをテストケースとして使用し、良好な結果が出ているし、 Google 内でもいい感じのレスポンスを得ている
  * mia: 実装の詳細はわかったけど、 author への影響をもっと示してほしい

* **Add a property to the CSSPseudoElement IDL interface to retrieve pseudo argument(s)**
  * issue: <https://github.com/w3c/csswg-drafts/issues/12161>
  * DOM API 側で擬似要素を取得できるようにするという提案があった
    * 多分これ：<https://github.com/w3c/csswg-drafts/issues/12163#issuecomment-3108997256>
  * それの地続きの issue
  * 擬似要素に渡された引数を取得できるようにする
  * Apple (fantasai & Tim) は、取得結果を文字列で返した方がいいという主張
  * Tab はそれに対して strongly disagree で、配列で返した方がいいという主張
  * `::part(header)` の `header` は関数の引数というより、単なる識別子でしょ、だから文字列でしょ、ってのもわかる
  * CSS はこういった「あくまでも宣言」という考え方がメンタルモデルとしてあるな、と思う（`@function` の result とかも）
  * \> RESOLVED: Add selectorText to the pseudo object

## Overall

## Links Dump

* TPAC 2025 Schedule: <https://www.w3.org/2025/11/TPAC/schedule.html>
* WG Meetings: <https://github.com/w3c/tpac2025-meetings/issues>
* Breakouts: <https://github.com/w3c/tpac2025-breakouts/issues>
* CSSWG
  * 1: <https://www.w3.org/events/meetings/c73e9796-940b-4df4-9c86-eb04a8da1abc/>
  * 2: <https://www.w3.org/events/meetings/9be8b030-8bb9-4dab-a647-24dc763075bf/>
  * Agenda: <https://github.com/orgs/w3c/projects/213/views/1>
  * wiki: <https://wiki.csswg.org/planning/tpac-2025#agenda>
* WHATWG
  * 1: <https://www.w3.org/events/meetings/c33b890d-56a9-429b-ac81-aca8c5447772/>
  * 2: <https://www.w3.org/events/meetings/c3357551-d84b-4e96-b02d-4eab08a16d9e/>
  * Agenda: <https://github.com/whatwg/html/issues/11711>
* Web Components CG: <https://www.w3.org/events/meetings/3d545adf-8de1-4f6d-abb5-be2030e66cf6/>
  * Agenda: <https://docs.google.com/document/d/1KeqMzuPHzHXTGR2zXmOHQydMUgVm2Y8onZHVmygAQFc/edit?tab=t.0#heading=h.gaqncq7xkj>
* WebDXCG: <https://www.w3.org/events/meetings/74ea288a-df57-4a3f-a32a-dd57e9413430/>
  * Agenda: <https://docs.google.com/document/d/1ree75ImLZjf60lTZ3BhCaLHygxgywr7SBXp-q0xPs8A/edit?tab=t.kwy3jemh57eo>

### Schedule

* Monday, 9:00 - 10:30 (Web Components) (TAG) (Web Fonts) (AGW) (ARIA)
* Monday, 11:00 - 12:30  (Web Components) (Web Fonts) (AGW) (ARIA)
* Monday, 13:45 - 15:00 (Web Fonts) (AGW) (ARIA)
* Monday, 15:30 - 16:45 (Web Fonts) (AGW) (ARIA)
* Tuesday, 9:45 - 11:00 (whatwg)
* Tuesday, 11:30 - 13:00 (whatwg)
* Tuesday, 14:15 - 16:00 (whatwg)
* Tuesday, 16:30 - 18:00 (whatwg)
* Thursday, 9:00 - 10:30 (whatwg) (CSS)
* Thursday, 11:00 - 12:30 (whatwg) (CSS)
* Thursday, 13:45 - 15:00 (whatwg) (CSS)
* Thursday, 15:30 - 16:45 (whatwg) (CSS)
* Friday, 9:00 - 10:30 (CSS)
* Friday, 11:00 - 12:30 (CSS)
* Friday, 14:00 - 16:00 (CSS)
* Friday, 16:30 - 18:00 (CSS) (WebDX)
