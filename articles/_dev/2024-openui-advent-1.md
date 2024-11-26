---
title: "🎄Open UI Advent Calendar: Day 1 / Open UIについて"
excerpt: "Open UIの概要、そして調査方法です"
date: "2024-12-1"
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
🎄 この記事は[Open UI Advent Calendar](https://adventar.org/calendars/10293)の1日目の記事です。
:::

今日から早速、Open UIについての話を進めていきます。

1日目は、Open UIの概要、そして調査方法です🧤

## OpenUIとは

Open UIは、[W3C Community Group](https://www.w3.org/groups/cg/)の一つで、正式には[Open UI Community Group](https://www.w3.org/groups/cg/)です。端的にまとめると、Open UIは、Web プラットフォームのInteroperabilityを実現するための技術の標準化を検討することに取り組んでいます。

具体的には、独自UIを作るにはどうHTML, CSS, JS, Web APIを組み合わせるのが適切なのかを決めたり、標準を決める具体的なグループ（WHATWG, CSSWG, TC39など）向けの推奨事項を作成したりします。

ここで注意したいのは、**Open UI自体は「標準そのものの決定はしない」こと**です。

Open UIは、Web 全体のUIコンポーネントやコントロールをリサーチし、Interoperabilityを実現するための技術の標準化を検討し、その過程で標準化団体と議論を重ね、策定された仕様を各ブラウザに実装してもらいます。
筆者の解釈では、 Open UI の担当範囲は以下のグリーンの部分にあたります。

![Open UIの影響イメージ](/effect-open-ui.png)
*Open UIの影響イメージ*

## Open UIがやること

- 標準Webコンポーネント・コントロールのリサーチ
- デザインシステム、フレームワーク、Web プラットフォームのInteroperabilityを実現するための技術の標準化を検討
- WHATWGやW3Cなどの標準化団体と協力し、HTML、ARIA、CSSなどに実際に仕様を追加
- Chromium、WebKit、Geckoなどのブラウザエンジンチームと協力し、仕様に基づく機能をブラウザエンジンに実装してもらう

## Open UIの動向調査方法

Open UIの情報は以下のリンクから得ることができます。

- Open UI Telecon Agendas: https://github.com/openui/open-ui/tree/main/meetings/telecon
- Discord server: https://discord.gg/DEWjhSw
- Mailing List: https://lists.w3.org/Archives/Public/public-open-ui/
- Open UI Github: https://github.com/openui/open-ui

### Telecon

Telecon（電話会議）が毎週午前11時（PST）にDiscordの#teleconferenceチャンネルでおこなわれており、事実上は誰でも参加できます。

その週のTeleconのAgendaには、GitHubの[OpenなIssueで`agenda+`とラベル付けしてあるもの](https://github.com/openui/open-ui/issues?q=is%3Aopen+is%3Aissue+label%3Aagenda%2B)が上がってきます。どんな内容が今週議論されそうか事前に知っておきたい場合は、こちらを参照すると良いでしょう。
また、[openui/meetings/telecon](https://github.com/openui/open-ui/tree/main/meetings/telecon)からも、過去のAgendaを見ることができます。

隔週のTeleconの議事録は、GitHubリポジトリの[openui/meetings/telecon](https://github.com/openui/open-ui/tree/main/meetings/telecon)でMinutesとして公開されています。しかし、Minutesのリンクが[openui/meetings/telecon](https://github.com/openui/open-ui/tree/main/meetings/telecon)に反映されるには時差があるため、最新のMinutesの内容が知りたい場合は、`https://www.w3.org/YYYY/MM/DD-openui-minutes.html`のURLをTeleconがおこなわれた日付に編集し、該当するMinutesを参照すると良いでしょう。

:::note{.memo}
e.g.）
[openui/meetings/telecon/2024-11-14.md](https://github.com/openui/open-ui/blob/main/meetings/telecon/2024-11-14.md)のMinutesを参照したい場合は、https://www.w3.org/2024/11/14-openui-minutes.html を開く。
:::

### Discord

雑多な議論は、Discordの各チャンネルで行われているようです。Issueに上がる背景を把握できたり、時にはCG外からの意見や質問が飛び込んできたりしています。

### Mailing List

Open UIの場合、メーリングリストはCSSWGなど、外部Working GroupとのMeeting InvitationやMinutesの共有に使われているようです。

***

W3Cのメーリングリストでは、W3Cの標準化活動に関する情報を受け取ることができます。
メーリングリストの活用方法は、W3Cが以下のリンクで紹介しています。

https://www.w3.org/ja/email/

メーリングリスト内を検索したい場合は、[W3C mailing list search service](https://www.w3.org/Search/Mail/Public/search)を利用することができます。

:::note{.memo}
e.g.）
Open UIのパブリックメーリングリストから「select」のキーワードを含むメールを検索したい場合は、以下のように検索オプションを設定することができます。
https://www.w3.org/Search/Mail/Public/search?lists=public-open-ui&keywords=select
:::

さらに、[Message-Id redirection Service](https://www.w3.org/mid/)を使用することで、特定のメールが複数のメーリングリストに送信された場合も網羅できます。

:::note{.memo}
e.g.）
たとえば、`message-id`が`<CADhPm3v0ZqQdc_+nTxFsrAraPuxrXnkWRpfyJw+43BCPc85w-g@mail.gmail.com>`のメールを検索したい場合は、https://www.w3.org/mid/CADhPm3v0ZqQdc_+nTxFsrAraPuxrXnkWRpfyJw+43BCPc85w-g@mail.gmail.com となります。
![message-idはメールヘッダーから確認できる](/image.png)
*message-idはメールヘッダーから確認できる*
すると、そのメールが`public-open-ui@w3.org`と`www-style@w3.org`に送信されていることがわかります。同じIDのメールでも、送信先が複数ある場合はそれぞれの場所で異なる前後関係となるため、議論を網羅的に追うためには、[Message-Id Redirection Service](https://www.w3.org/mid/)を活用すると良いでしょう。
:::

***

重複する部分があると思いますが、以前の登壇でOpenUI Community Groupについて話したものがあるので、そちらも参照してみてください。

https://sakupi01.github.io/slides/ja/2024_frontendo2024_aftertalk/

それでは、また明日⛄

See you tomorrow!

***

## Appendix

- [irc cheat sheet](https://gist.github.com/xero/2d6e4b061b4ecbeb9f99)
- [HTML Standard](https://html.spec.whatwg.org/multipage/)
- [All CSS specifications](https://www.w3.org/Style/CSS/specs.en.html)
- [ARIA - Accessibility | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA#standardization_efforts)
- [メーリングリスト - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0%E3%83%AA%E3%82%B9%E3%83%88)
