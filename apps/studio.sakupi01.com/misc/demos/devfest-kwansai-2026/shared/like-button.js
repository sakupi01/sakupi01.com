// <like-button session="session-05">: ♥ (お気に入り) のボタン (タイムテーブルとセッションページ)。
// HTML には id と名前だけを書き、ボタン、ハートの SVG、押した状態 (aria-pressed) の保存はここで組み立てる。
// 保存先はサーバーの DB (favorites.js)。JS がないと保存できないので、定義前 (JS 無効時を含む) は common.css で隠しておく。
//
// - session: セッションの id
// - label: ボタンの名前 (省略すると、中に書いた文字がそのまま見える名前になる)
import * as favorites from "./favorites.js";

export const HEART =
  '<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.6-4.7-9.4-9.4C1.2 7.4 3.6 4 7.1 4c2.1 0 3.8 1.1 4.9 2.8C13.1 5.1 14.8 4 16.9 4c3.5 0 5.9 3.4 4.5 7.1-1.8 4.7-9.4 9.4-9.4 9.4z"/></svg>';

// 同時に表示された ♥ (タイムテーブルの 30 個など) は、1 回の読み込みを共有する。読み終わったら捨て、
// あとから表示された ♥ (SPA で切り替えた先のページ) は読み直す。文書を読み込み直さないので、
// 最初の結果を使い続けると、このタブで直前に変えたお気に入りが反映されない
let pending = null;

function readOnce() {
  if (!pending) {
    pending = favorites.read();
    const clear = () => (pending = null);
    pending.then(clear, clear);
  }
  return pending;
}

function showStatus(message) {
  const status = document.querySelector(".save-status");
  if (status) status.textContent = message;
}

function all() {
  return document.querySelectorAll("like-button");
}

class LikeButton extends HTMLElement {
  #button = null;

  connectedCallback() {
    if (this.#button) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "like";
    if (this.hasAttribute("label"))
      button.ariaLabel = this.getAttribute("label");
    // 中に書いた文字 (例: お気に入り) は、ハートの後ろに見える文字として残す
    const text = this.textContent.trim();
    button.innerHTML = HEART;
    if (text) {
      const span = document.createElement("span");
      span.textContent = text;
      button.append(span);
    }
    // 状態を読み終わるまでは押せないようにする
    button.disabled = true;
    button.addEventListener("click", () => this.#toggle());
    this.replaceChildren(button);
    this.#button = button;

    readOnce().then(
      (ids) => this.render(ids),
      (error) => {
        console.warn("お気に入りを読み込めませんでした", error);
        showStatus(
          "お気に入りを読み込めませんでした。serve.py が動いているか確かめてください"
        );
      }
    );
  }

  render(ids) {
    if (!this.#button) return;
    this.#button.disabled = false;
    this.#button.setAttribute(
      "aria-pressed",
      String(ids.includes(this.getAttribute("session")))
    );
  }

  async #toggle() {
    const id = this.getAttribute("session");
    const pressed = this.#button.getAttribute("aria-pressed") !== "true";
    this.#button.disabled = true;
    try {
      const ids = await (pressed ? favorites.add(id) : favorites.remove(id));
      showStatus("");
      // 同じページにある、ほかの ♥ (同じセッションのもの) にも反映する
      for (const element of all()) element.render(ids);
    } catch (error) {
      console.warn("お気に入りを保存できませんでした", error);
      showStatus("お気に入りを保存できませんでした");
      this.#button.disabled = false;
    }
  }
}

customElements.define("like-button", LikeButton);

// 別のタブやページでの変更と、bfcache から戻ったときに、全部の ♥ を付け直す
favorites.onChange((ids) => {
  for (const element of all()) element.render(ids);
});
