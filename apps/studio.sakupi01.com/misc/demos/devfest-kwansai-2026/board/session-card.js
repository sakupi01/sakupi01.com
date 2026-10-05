/* global CSSStyleSheet -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// <session-card>: ボードのカード。見た目は card.css の :host 規則が持ち、ここは骨組みだけ。
// 中身 (タイトル、登壇者、時刻) は light DOM に置いたまま <slot> で見せるので、JS がなくても読める。

// card.css を shadow DOM でも使う。読み込み終わってから定義するので、
// それまでは card.css の session-card:not(:defined) の見た目で表示される
const sheet = new CSSStyleSheet();
const cssText = await fetch(new URL("../card.css", import.meta.url)).then(
  (response) => response.text()
);
await sheet.replace(cssText);

class SessionCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sheet];
    shadow.innerHTML = `
      <slot name="title"></slot>
      <slot name="speakers"></slot>
      <slot name="meta"></slot>
      <div class="actions" lang="ja">
        <button type="button" class="feature">注目枠へ</button>
        <button type="button" class="move" data-move="before">前へ</button>
        <button type="button" class="move" data-move="after">後ろへ</button>
      </div>
      <a class="share" lang="ja">共有画像を作る</a>
    `;
    // ドラッグできない環境やキーボード操作向けの経路。処理は board.js が受け取る
    shadow.querySelector(".feature").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("feature-request", { bubbles: true }));
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
    const text = (selector) =>
      this.querySelector(selector)?.textContent.replace(/\s+/g, " ").trim() ??
      "";
    const title = text('[slot="title"]');

    // 30 枚のカードのボタンを読み上げで区別できるよう、名前にタイトルを入れる
    const shadow = this.shadowRoot;
    shadow.querySelector(".feature").ariaLabel = `${title} を注目枠へ`;
    shadow.querySelector('[data-move="before"]').ariaLabel =
      `${title} を前へ移動`;
    shadow.querySelector('[data-move="after"]').ariaLabel =
      `${title} を後ろへ移動`;

    // 注目枠のときだけ見える共有画像へのリンク (4 章)。セッション情報をクエリで渡す
    const url = new URL("../share/", import.meta.url);
    url.searchParams.set("title", title);
    url.searchParams.set("speaker", text(".name"));
    url.searchParams.set(
      "time",
      [...this.querySelectorAll(".meta time")]
        .map((t) => t.textContent)
        .join("〜")
    );
    url.searchParams.set("track", this.dataset.track ?? "");
    shadow.querySelector("a.share").href = url.href;
  }
}

customElements.define("session-card", SessionCard);
