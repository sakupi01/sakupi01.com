/* global location, CanvasRenderingContext2D, HTMLCanvasElement -- リポジトリの eslint.config.js の globals に無いブラウザの API */
// 共有画像: カードとフォームを canvas の中に置いたまま描画し、PNG で保存する。
// JS は値を textContent で入れ、入力のたびに再描画を頼むだけ。見た目は layout.css が決める

const DEFAULTS = {
  title: "Web UI 2026 Updates & What's Coming!",
  speaker: "saku",
  time: "13:50〜14:15",
  track: "c",
};
const TRACKS = ["a", "b", "c", "d"];
const FILE_NAME = "devfest-kwansai-2026.png";

const params = new URLSearchParams(location.search);
const canvas = document.querySelector("#share-canvas");
const card = document.querySelector("#share-card");
const saveButton = document.querySelector("#share-save");
const status = document.querySelector("#share-status");

// kill switch: ?off=canvas,webmcp のようにカンマ区切りで機能を切る
const off = (params.get("off") ?? "").split(",");
const supported =
  !off.includes("canvas") &&
  "drawElementImage" in CanvasRenderingContext2D.prototype &&
  "requestPaint" in HTMLCanvasElement.prototype;

// ---- セッション情報 (値は必ず textContent で入れる) ----
const track = TRACKS.includes(params.get("track"))
  ? params.get("track")
  : DEFAULTS.track;
card.dataset.track = track;
document.querySelector("#share-title").textContent =
  params.get("title") || DEFAULTS.title;
document.querySelector("#share-speaker").textContent =
  params.get("speaker") || DEFAULTS.speaker;
document.querySelector("#share-time").textContent =
  params.get("time") || DEFAULTS.time;
document.querySelector("#share-track").textContent =
  `Track ${track.toUpperCase()}`;

if (supported) {
  const draw = () => {
    const ctx = canvas.getContext("2d");
    ctx.reset();
    // 余白を取って左上に置く。canvas の背景は CSS ではなく PNG にも入れたいので白で塗る
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawElementImage(card, 20, 20);
  };

  // onpaint はブラウザが描画の更新を知らせるたびに呼ばれる
  canvas.onpaint = draw;
  // 入力値・選択・フォントの読み込みで見た目が変わったら再描画を頼む
  card.addEventListener("input", () => canvas.requestPaint());
  card.addEventListener("change", () => canvas.requestPaint());
  document.fonts.ready.then(() => canvas.requestPaint());
  canvas.requestPaint();

  saveButton.addEventListener("click", () => {
    canvas.requestPaint();
    canvas.toBlob((blob) => {
      if (!blob) {
        status.textContent = "PNG を作れませんでした";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = FILE_NAME;
      link.click();
      // ダウンロードが始まる前に無効にしないよう、次のタスクで解放する
      setTimeout(() => URL.revokeObjectURL(url), 0);
      status.textContent = `保存しました (${blob.size} bytes)`;
    }, "image/png");
  });
} else {
  // 縮退: canvas の子は描画されないので、カードとフォームを canvas の外へ出して普通の HTML として見せる
  canvas.after(card);
  card.removeAttribute("drawable");
  canvas.hidden = true;
  saveButton.disabled = true;
  status.textContent = "このブラウザは HTML-in-Canvas に未対応です";
}
