/* global CSS, location */

// まとめページ:埋め込んだ iframe の高さを中身に合わせる。
// - Responsive iframe 対応: CSS の frame-sizing が高さを決めるので、ここは表示だけ
// - 未対応: 埋め込んだ文書 (embed.js) から postMessage で届く高さを iframe に設定する

const frames = [...document.querySelectorAll("iframe.embed")];
const nativeSizing = CSS.supports("frame-sizing", "content-height");

document.querySelector("#sizing-mode").textContent = nativeSizing
  ? "iframe の高さ: frame-sizing (Responsive iframe)"
  : "iframe の高さ: postMessage (fallback)";

// デモ用に、いまの iframe の高さを見出しの横に出す
const heightObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const label = document.querySelector(
      `[data-height-for="${entry.target.id}"]`
    );
    label.textContent = `${Math.round(entry.borderBoxSize[0].blockSize)}px`;
  }
});
for (const frame of frames) heightObserver.observe(frame);

if (!nativeSizing) {
  window.addEventListener("message", (e) => {
    if (e.origin !== location.origin || e.data?.type !== "embed-resize") return;
    const frame = frames.find((frame) => frame.contentWindow === e.source);
    if (!frame || typeof e.data.height !== "number") return;
    // box-sizing: border-box なので枠線の分を足す
    frame.style.blockSize = `calc(${Math.ceil(e.data.height)}px + 2 * var(--s-border-width))`;
  });
}
