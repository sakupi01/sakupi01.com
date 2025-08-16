---
title: "🎨 CSS Advent Calendar: Day 12 / Web Apps are demanded! - The Emergence of SPA"
excerpt: "アプリケーションとしての Web の進化と SPA"
date: 2025-08-12
update: 2025-08-12
category: 'dev'
tags: ['web', 'ui', 'css', 'html', 'standards', 'advent calendar']
status: 'published'
---

## Table of Contents

## はじめに

:::note{.message}
🌏 この記事は CSS Advent Calendar の 12 日目の記事です。
:::

モバイルデバイスの登場により影響を受けたのは、Web のユーザへの適応能力だけではありません。

モバイルの普及はネイティブアプリの普及を産み、ネイティブアプリは Web にはない独自の強みを持つことになりました。

- デバイス固有の API（カメラ、GPS、プッシュ通知、etc）へのアクセス
- オフライン環境での動作
- デバイスレベルで最適化されたパフォーマンス

これらの機能により、「アプリ」という側面における Web の「弱み」が強調されるようになりました。
これは Web 自体にとって大きな打撃を与え、Web は対応を急ぐ必要がありました。

この時期にブラウザエンジンを最適化したり、Service Workers や Web App Manifest が提案されて PWA の発展が急がれたりしたのは、プラットフォーム側の対応の代表的な例です。（その後のベンダ側の事情により、PWA 界隈は停滞しましたが）

対して、Ajax の登場と SPA エコシステムの拡大は、「Web アプリの体験・開発容易性向上」という点において結果的に「対ネイティブアプリ」に繋がった、 Web エコシステムの動きになったと言えるでしょう。

## HTML per Request

SPA 以前の Web アプリケーションは、SPA との対比で、いわゆる「Multi-Page Application (MPA)」と表現します。

MPA は、ページ遷移を基本としたアプリケーション設計です。
ユーザーがリンクをクリックしたり、フォームを送信したりするたびに、ブラウザは完全に新しい HTML ページをサーバーから取得し、画面全体を再レンダリングします。

改めて MPA の描画フローを確認すると、以下のような流れになります。（e.g. EC サイト）

- 商品一覧ページ（/products）を表示 → full page load
- 商品詳細ページ（/products/123）へ遷移 →  full page load
- カートに追加（/cart/add）→ カートページへリダイレクト → full page load

full page load が走るということは、そのたびにバックグラウンドで以下のようなプロセスが発生することになります。

- ブラウザがサーバーへ HTTP リクエストを送信
- サーバー側でロジックを実行し、DB からデータを取得・加工
- サーバーでデータを埋め込んだ HTML を生成（Server-Side Rendering）
- サーバが HTML + CSS + JavaScript をブラウザに返す
- ブラウザは HTML を解析し、CSS を適用し、JS を実行して画面を描画

この「ステートレス」なモデルは、「独立したページ同士をリンクする」という Web の基本設計思想に忠実なものです。
各ページは独立しており、サーバーはクライアントの状態を保持する必要がありませんでした（セッションの管理などを除いて）。

## Expectation Change on Web

「独立したページ同士のリンク」であるが故の課題が、 MPA には存在します。

- ページ遷移時に一瞬現れる「白い画面」（ホワイトフラッシュ）
- フォーム入力中のページ更新による入力内容の消失
- 画面の一部だけを更新したい場合でも、全体を再描画
- ネットワークが遅い環境で描画のたびに発生するレイテンシ
- etc

デスクトップアプリのみならず、モバイルの登場と普及により、ネイティブアプリの体験が一気に広まり、ユーザはもちろん Web アプリにも同様の体験を求めるようになりました。
「リンクされたドキュメント」として始まった Web に対して、次第に「アプリケーション」としての期待が高まり、その結果、MPA のデメリットが露呈してきました。

そんな中 2004年に登場した Gmail は、Web の「アプリケーション」としての可能性を大きく前進させるものとなります。

Gmail は「Ajax（Asynchronous JavaScript and XML）」という技術を本格的に活用した大規模アプリケーションの一つでした。
メールの読み込み、フォルダ間の移動、検索などが、ページ遷移なしにスムーズに実行できる体験は、ユーザにとって革新的なものだったでしょう。

こうした動きの中から、「[Web 2.0](https://en.wikipedia.org/wiki/Web_2.0)」という「動的で、情報の流れが双方向な、アプリとしての Web」という概念が流行していくことにもなります。

## Ajax Brought A Revolution

2005年、Jesse James Garrett が「[Ajax: A New Approach to Web Applications](https://designftw.mit.edu/lectures/apis/ajax_adaptive_path.pdf)」で Ajax を概説し、「Ajax」が用語として広まりました。

Ajax は全く新しい”技術”ではなく、既存の Web 標準技術の組み合わせからなる”手法”です。
Ajax は「DOMの部分更新」「非同期通信」「リアルタイム性」という、これまでになかったパターンを実現可能にするものでした。

```js
// Pre-Ajax：フォーム送信によるページ遷移
<form action="/update-profile" method="POST">
  <input name="username" value="john_doe">
  <button type="submit">更新</button>
</form>


// With Ajax：ページ遷移なしでデータを送信
function updateProfile() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/update-profile');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 200) {
      // DOM を部分的に更新
      document.getElementById('status').textContent = '更新完了';
    }
  };
  xhr.send(JSON.stringify({
    username: document.getElementById('username').value
  }));
}
```

## The Emergence of Single-Page Application (SPA)

iPhone が登場した 2007年あたりから、「Single-Page Application」という概念が認識され始めます。

SPA は、MPA の「ページ」という概念を根本的に再定義するようなアプローチです。

MPA：

- URL = 個別の `.html` ファイル
- 状態 = サーバー側で管理
- 画面遷移 = full page load

SPA：

- URL = Web アプリ内の「状態」を示す
- 状態 = クライアント側 JS で管理
- 画面遷移 = JS による DOM の書き換え

これまで HTML + CSS が主流だった「ドキュメントとしての Web」に対し、Ajax/SPA の登場から 「アプリとしての Web」に変化します。
JavaScript が Web アプリケーションの中心的な役割を果たすようになったのは、このタイミングからです。

ただし、初期の SPA 開発は、大量の JavaScript コードを必要とし、複雑なものでした。
こうした初期 SPA 開発のつらみを簡素化すべく、SPA フレームワークが次々と登場して民主化を進めていくことになります。

## Appendix

- [Ajax: A New Approach to Web Applications](https://designftw.mit.edu/lectures/apis/ajax_adaptive_path.pdf)
- [Single-page application](https://en.wikipedia.org/wiki/Single-page_application)
- [Comparing the "Why" of Single Page App Frameworks - The History of the Web](https://thehistoryoftheweb.com/comparing-the-why-of-single-page-app-frameworks/)

---

<advent-calendar-2025 />
