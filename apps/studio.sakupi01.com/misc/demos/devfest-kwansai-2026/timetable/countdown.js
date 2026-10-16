/* global TextDecoderStream -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// saku の登壇が終わるまでの残り時間 (2 章の Declarative Partial Updates)。
// サーバー (serve.py の /api/countdown) が 1 秒ごとに <template for="countdown"> の HTML を送り続ける。
// JS は fetch の body を streamAppendHTMLUnsafe() (新しい HTML の挿入メソッドのストリーム版) につなぐだけで、
// HTML を解釈して <?start name="countdown">〜<?end> を差し替えるのはブラウザ。
// JS は残り時間の計算も、差し替える場所を探す処理もしない。
//
// Unsafe 版を使う理由: Sanitizer を通す安全版 (streamAppendHTML() / appendHTML()) は <template for> を取り除き、
// 差し替えが起きなかった (Chrome 157 Canary、2026-10-08 実測)。流すのは自分のサーバーが作った HTML で、
// 文字は serve.py がエスケープしているので、Sanitizer を通さなくてよい
//
// router.js が、タイムテーブルを表示するたびに init() を呼ぶ。ほかのページへ移ったら (signal の abort)、流し込みを止める。
// 止めないと、差し込み先のない <template for="countdown"> が届き続ける (patching の explainer では、一致しない template は文書に残して誤りを知らせる)
export function init(signal) {
  const countdown = document.querySelector(".countdown");
  if (typeof document.body.streamAppendHTMLUnsafe !== "function") {
    // 新しいメソッドがないブラウザでは出さない (同じことを JS で書き直すと、見せたい違いがなくなるため)
    countdown.hidden = true;
    return;
  }
  fetch(new URL("../api/countdown", import.meta.url), { signal })
    .then((response) => {
      if (!response.ok) throw new Error(`/api/countdown: ${response.status}`);
      // Response.textStream() (これも新しい) があれば使い、なければ TextDecoderStream で文字にする
      const text =
        typeof response.textStream === "function"
          ? response.textStream()
          : response.body.pipeThrough(new TextDecoderStream());
      return text.pipeTo(document.body.streamAppendHTMLUnsafe(), { signal });
    })
    .catch((error) => {
      // ページを離れて止めたときは、失敗ではない
      if (signal.aborted) return;
      console.warn("残り時間を流し込めませんでした", error);
      countdown.hidden = true;
    });
}
