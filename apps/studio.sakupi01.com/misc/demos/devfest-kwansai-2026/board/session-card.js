/* global CSSStyleSheet */

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
      <button type="button" lang="ja">注目枠へ</button>
      <a class="share" lang="ja">共有画像を作る</a>
    `;
    // ドラッグできない環境やキーボード操作向けの経路
    shadow.querySelector("button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("feature-request", { bubbles: true }));
    });
  }

  connectedCallback() {
    // 注目枠のときだけ見える共有画像へのリンク (4 章)。セッション情報をクエリで渡す
    const text = (selector) =>
      this.querySelector(selector)?.textContent.replace(/\s+/g, " ").trim() ??
      "";
    const url = new URL("../share/", import.meta.url);
    url.searchParams.set("title", text('[slot="title"]'));
    url.searchParams.set("speaker", text(".name"));
    url.searchParams.set(
      "time",
      [...this.querySelectorAll(".meta time")]
        .map((t) => t.textContent)
        .join("〜")
    );
    url.searchParams.set("track", this.dataset.track ?? "");
    this.shadowRoot.querySelector("a.share").href = url.href;
  }
}

customElements.define("session-card", SessionCard);
