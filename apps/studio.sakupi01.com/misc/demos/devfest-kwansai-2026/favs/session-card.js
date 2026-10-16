/* global CSSStyleSheet -- リポジトリの eslint.config.js の globals に無いブラウザの API */

import { HEART } from "../shared/like-button.js";
import {
  SESSIONS,
  sessionURL,
  h,
  avatar,
  speakerName,
  affiliation,
  metaParts,
} from "../shared/session-item.js";

// <session-card id="session-05">: お気に入りのカード。見た目は card.css の :host 規則が持つ。
// 中身 (タイトルのリンク、登壇者、時刻) は light DOM に置き、<slot> で見せる。
// ふだんは serve.py が DB から light DOM を作って流し込む。中身のないカード (WebMCP や別のタブで後から足したもの) だけ、
// favs.js の cardFor() が build() を呼び、<session-item> (session-item.js) と同じ部品とデータ (sessions.json) でここで組み立てる。
// connectedCallback で「中身が空なら組み立てる」とすると、SPA でサーバーのカードを流し込んだとき、子要素が届く前に
// 文書につながって組み立ててしまい、中身が 2 重になった (Chrome 157 Canary、2026-10-13)

// card.css を shadow DOM でも使う。読み込み終わってから定義する。
// 定義前のカードは shadow DOM (カードの枠と操作ボタン) がまだないので、favs/layout.css で隠しておく
const sheet = new CSSStyleSheet();
const cssText = await fetch(new URL("card.css", import.meta.url)).then(
  (response) => response.text()
);
await sheet.replace(cssText);

class SessionCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sheet];
    shadow.innerHTML = `
      <div class="layout">
        <slot name="title"></slot>
        <slot name="speakers"></slot>
        <slot name="meta"></slot>
        <div class="actions" lang="ja">
          <button type="button" class="unfavorite" aria-pressed="true">${HEART}</button>
          <button type="button" class="move" data-move="before">前へ</button>
          <button type="button" class="move" data-move="after">後ろへ</button>
        </div>
      </div>
    `;
    // ドラッグできない環境やキーボード操作向けの経路。処理は favs.js が受け取る
    shadow.querySelector(".unfavorite").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("unfavorite-request", { bubbles: true })
      );
    });
    for (const button of shadow.querySelectorAll(".move")) {
      button.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("move-request", {
            bubbles: true,
            detail: { direction: button.dataset.move },
          })
        );
      });
    }
  }

  connectedCallback() {
    const session = SESSIONS.get(this.id);
    if (!session) {
      console.warn(
        `<session-card>: session ${this.id} is not in sessions.json`
      );
      return;
    }
    const title = session.title;

    // 30 枚のカードのボタンを読み上げで区別できるよう、名前にタイトルを入れる
    const shadow = this.shadowRoot;
    shadow.querySelector(".unfavorite").ariaLabel = `お気に入り: ${title}`;
    shadow.querySelector('[data-move="before"]').ariaLabel =
      `${title} を前へ移動`;
    shadow.querySelector('[data-move="after"]').ariaLabel =
      `${title} を後ろへ移動`;
  }

  // トラックの色と列 (card.css) と、トラックの絞り込み (favs/layout.css) は data-track を見る
  build() {
    const session = SESSIONS.get(this.id);
    this.dataset.track = session.track;
    const number = session.id.replace("session-", "");
    const children = [
      h(
        "h2",
        {
          slot: "title",
          id: `${session.id}-title`,
          attrs: { lang: session.titleLang },
        },
        [
          h("a", {
            className: "session-link",
            href: sessionURL(session),
            draggable: false,
            textContent: session.title,
          }),
        ]
      ),
      session.speakers.length === 0
        ? null
        : h(
            "ul",
            { slot: "speakers", className: "speakers" },
            session.speakers.map((speaker, index) => {
              // 所属があれば、名前を interest invoker のボタンにして、所属を popover="hint" で出す
              if (!speaker.affiliation) {
                return h("li", {}, [
                  avatar(session, speaker, index),
                  speakerName(session, speaker, index),
                ]);
              }
              const popoverId = `aff-${number}-${index + 1}`;
              const name = speakerName(session, speaker, index, "button");
              name.type = "button";
              name.setAttribute("interestfor", popoverId);
              return h("li", {}, [
                avatar(session, speaker, index),
                name,
                affiliation(speaker, { id: popoverId, popover: "hint" }),
              ]);
            })
          ),
      h("p", { slot: "meta", className: "meta" }, metaParts(session)),
    ];
    this.append(...children.filter((child) => child != null));
  }
}

customElements.define("session-card", SessionCard);
