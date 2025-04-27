---
title: "📝note: What is web accessibility?"
excerpt: "Practical Accessibility のメモ"
date: 2024-10-24
update: 2024-10-24
beginColor: 'from-purple-300'
middleColor: 'via-pink-200'
endColor: 'to-orange-300'
category: 'dev'
tags: ['web accessibility', 'a11y', 'inclusive web design', 'usability on the web', 'types of disabilities', 'barriers to access', 'assistive technology']
status: 'published'
---
## Table of Contents

## はじめに

Practical Accessibility Section2: What is web accessibility?

## note

- “accessibility” : “the quality of being able to be reached or entered”
- Web の世界ではもっと正確に定義される
  - Web accessibility : 不自由のある人にとってウェブサイトやアプリケーションをアクセシブルにすること。バリアを取り除くことで、不自由な人からもウェブサイトにアクセスしてもらえる。
- 「不自由さ」の例
  - ランプのない廊下や曲がり角
  - 狭い廊下や脇道や入口
  - 明度の低い照明： 視覚的にコミュニケーションをとるのが難しい人にとって不自由
  - 弱いカラーコントラスト
  - 自動ドアのない入口

- Web の世界では次のようなデジタル特有の「不自由さ」がある
  - キーボードフォーカスインジケーターの不在
  - フォームコントロールにラベルがない
  - キーボードで操作できないボタン、リンク、UI ウィジェット
  - 代替テキストのない画像
  - キャプション、トランスクリプト、音声説明のないビデオ
  - 低い色のコントラストと小さなフォント
  - 一時停止、スキップできない動きやアニメーション
- “a11y” と “ally”って似てるよね
  - typeface によっては正常者でも判別が難しい
  - 失読症のユーザーとか、視覚障害や認知障害のあるユーザーが判読しやすいように、文字を簡単に区別できる別の書体を選択することが重要
  - Sara のサイトでは[Atkinson Hyperlegible Font](https://www.brailleinstitute.org/freefont/)を使用していて、文字の認識を高めるために文字の区別に重点を置いた、 Braille Institute の無料フォントらしい
- Web という文脈における、「アクセシビリティ」「インクルーシビティ」「ユーザビリティ」の違い
  - Web アクセシビリティ設計：障害を持つ人々が平等にアクセスできるようにすること
    - **障害を持つ人々が**Web サイトやアプリケーションを認識し、理解し、操作し、操作できるように、**アクセスの障壁を取り除くこと**
    - 障害という特有の事象に対処するためのものであり、広範な事象を指すものではない
  - インクルーシブ Web デザイン（インクルーシビティ）：さまざまな背景や文化、年齢、能力や障害、性別、地理的な場所、言語、コンピューター リテラシーなどを持つ**幅広い人々を包含(include)する**
  - インクルーシビティの達成にはアクセシビリティが含まれる
  - **アクセシブルでなければインクルーシブでない**
  - 国際化やパフォーマンス改善などもインクルーシブな Web プロダクトにするための取り組み
  - インクルーシブデザイナー：能力や障害の有無にかかわらず、可能な限りすべての人のインクルージョンを積極的に追求する人たち
  - アクセシビリティデザイナー：障害を持つ人々のニーズに焦点を当てる人たち
- アクセシビリティ要件はインクルーシブデザインの対象とする人々にも利益をもたらす
  - [キャプションは元来、聴覚障害者・難聴者のために必要](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1#captions-prerecorded)な機能とされていた（いる）
    - 非ネイティブスピーカーが理解を助けるために使用する
    - 音声よりも書き言葉の方が理解しやすい人々に好まれる
    - 静かな場所や騒がしい場所（図書館、喫茶店、赤ちゃんが眠っている保育室、会議など）で働く人が使用できる
    - 空港や空港ラウンジなどの公共の場所で使用される。テレビやビデオはデフォルトでミュートされており、字幕に完全に依存している時にも使用される
    - 多くの会議がオンラインになり、低品質のマイクや不安定な Wi-Fi 下で講演を聞くときに使用される
  - ハイコントラストモードは視覚障害者や弱視の人々にとって重要な機能
    - 晴れた日に屋外で作業する際に読みやすさを向上させるためにも使用できる
  - など、インクルーシブデザインの対象となる人にも役立っている
- アクセシビリティとユーザビリティ
  - 国際標準化機構 (ISO) は、[ユーザビリティ](https://www.iso.org/standard/63500.html)を **「特定のユーザーが特定の使用状況において、特定の目的を効果的、効率的、かつ満足感を持って達成するために製品を使用できる程度」**と定義している
  - ユーザビリティデザイン：**さまざまなユーザーがさまざまな状況**で、**効果的、効率的、満足感を持ってタスクを達成できるよう**にサポートする
- アクセシビリティ デザイン：障害を持つ人々のニーズを対象
- インクルーシブ デザイン：障害を持つ人々を含む多様なグループの人々のニーズを対象
- ユーザビリティ デザイン：ユーザーが目的を効果的かつ効率的に、満足のいく形で達成できるようにするもの
  - ユーザビリティ デザインの定義を障害のあるユーザーに焦点を絞る→**ユーザビリティ デザインは障害のある人が製品を使用できることを保証する必要があると言える**
  - アクセシブルであっても、ユーザブルであるとは限らない
  - 標準のアクセシビリティ要件に準拠していても、そのサービスが使いやすいとは限らない
    - コンテンツにどれだけ効果的かつ効率的にアクセスできるかによって、そのウェブサイトの使いやすさが決まる
- ユーザビリティを確かめる方法
  - ユーザビリティ テストを実施して、ユーザーが直面している問題や、ユーザーのエクスペリエンスを非効率にしている可能性のある障壁を明らかにし、設計と実装でそれらの問題に対処することが必要
    - e.g.
    - 特定のタスクを実行するのはどれくらい簡単または難しいですか?
    - キーボードはすべて期待通りに動作しますか?
    - 予期しないキーの組み合わせや操作を使用しているため、ユーザーが特定のタスクを実行するのに困難を感じていますか?
    - コンポーネントは操作しやすいですか? それとも複雑すぎますか?

> “Think of accessibility as the lowest bar; it works with assistive technology, but to go beyond ‘it works’ to ‘it’s enjoyable and easy to use’ you’ll need to test with real users.”
> — Kate Kalcevich, Head of Services at Fable

- 障害がなければアクセシビリティはないので、障害について学ぶ
  - 視覚障害：失明、低視力、白内障、緑内障など、あらゆる種類の視力喪失
  - 聴覚障害：加齢、大きな騒音、感染症などによる難聴や聴力喪失など
  - 運動障害：麻痺、切断、筋ジストロフィー、関節炎、脊髄損傷など
  - 認知障害および学習障害：注意欠陥、失読症、記憶喪失、脳損傷など
  - 世界中で 10 億人以上の人々が何らかの障害を抱えて生活している。5 人に 1 人が永久的な障害を抱えていると推定されているが、人口の 100% が人生のある時点で視覚、聴覚、運動、または認知障害に直面することになる
  - アクセシビリティを考慮することによって将来の自分自身も恩恵を受ける

> we’re all just temporarily abled. (— Cindy Li)

> The word “disability” is not bad but instead describes a state of being that we may experience situationally, temporarily, or permanently, perhaps due to social or medical circumstances. […] many of us benefit from accessible design, even when we don’t identify as having a disability. […] Accessibility benefits every single human being on this planet, disabled and abled.
> — Anna cook, Senior Accessibility Designer

- 支援技術（Assistive Technology）
  - ハイテク支援技術の例：キーボード、スクリーン リーダー、点字ディスプレイ、音声認識ソフトウェア、スイッチ コントロール、画面拡大鏡、OS やブラウザのアクセシビリティ表示モード (ダーク モードや Windows ハイ コントラスト モードなど)も
  - ローテク支援技術の例：点字、車椅子、メガネ、補聴器、義肢、杖、手すりなど
  - AT は人々の持つ能力を拡張する
  - 一度に複数の AT を使用する人もいる
  - web コンテンツを使用・閲覧するすべての方法を網羅することは事実上不可能
  - Tetralogical の「[Browsing with assistive technology videos](https://tetralogical.com/blog/2021/12/24/browsing-with-assistive-technology-videos/)」を見る
- 障害のある人がどのような方法でアクセスするかに関係なく、Web にアクセスできるように障壁を取り除くのは私たちの責任
  - AT を使用しているからといって必ずしもアクセスできるとは限らない
- アクセシビリティの高い製品の作成を開始する場合は、Web コンテンツ アクセシビリティ ガイドラインから始める必要がある
