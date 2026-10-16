/* global CSS, location -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// セッションページの感想フォームの iframe。router.js が、セッションページを表示するたびに init() を呼ぶ。
// - ?id のセッションの感想フォーム (feedback/?id=…) を読み込む。セッションが見つからないときは section ごと消す
// - Responsive iframe 対応: CSS の frame-sizing が高さを決めるので、ここは src を決めるだけ
// - 未対応: 埋め込んだ文書 (feedback/embed.js) から postMessage で届く高さを iframe に設定する
import { SESSIONS } from "../shared/session-item.js";

export function init(signal) {
  const section = document.querySelector(".feedback");
  const frame = section.querySelector(".feedback-frame");
  const id = new URLSearchParams(location.search).get("id");

  if (!SESSIONS.has(id)) {
    section.remove();
    return;
  }
  frame.src = `../feedback/?id=${encodeURIComponent(id)}`;

  if (CSS.supports("frame-sizing", "content-height")) return;
  window.addEventListener(
    "message",
    (e) => {
      if (e.origin !== location.origin || e.source !== frame.contentWindow)
        return;
      if (e.data?.type !== "embed-resize" || typeof e.data.height !== "number")
        return;
      // box-sizing: border-box なので枠線の分を足す
      frame.style.blockSize = `calc(${Math.ceil(e.data.height)}px + 2 * var(--s-border-width-base))`;
    },
    { signal }
  );
}
