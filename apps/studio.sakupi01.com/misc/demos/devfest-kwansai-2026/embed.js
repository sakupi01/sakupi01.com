/* global location */

// iframe に埋め込まれたときだけ、文書の高さの変化を埋め込み先へ伝える。
// - Responsive iframe 対応 (Chrome 154+): window.requestResize() で再計測を頼むだけ。高さは iframe の frame-sizing が決める
// - 未対応: 従来どおり postMessage で高さを送り、埋め込み先が iframe の height を書き換える
if (window.parent !== window) {
  const notify = () => {
    // View Transition 中に iframe の大きさを変えると viewport が変わって transition が中断されるので、終わるまで待つ
    const transition = document.activeViewTransition;
    if (transition) {
      transition.finished.finally(notify);
      return;
    }
    if ("requestResize" in window) {
      window.requestResize();
      return;
    }
    window.parent.postMessage(
      // scrollHeight は viewport より小さくならず iframe が縮まないので、html 要素の box の高さを送る
      {
        type: "embed-resize",
        height: document.documentElement.getBoundingClientRect().height,
      },
      location.origin
    );
  };

  // フォントの読み込み、iframe の幅の変化、カードの並び替えなど、高さが変わる原因をまとめて拾う
  new ResizeObserver(notify).observe(document.documentElement);
  // 自前配信のフォントは大きいので、読み込み後に改めて測り直してもらう (blog の embed と同じ形)
  document.fonts.ready.then(notify);
}
