// セッションボードの操作: ドラッグ & ドロップでの並べ替えと、注目枠の入れ替え。
// JS は DOM の順番と data-slot を変えるだけ。色・大きさ・位置は card.css の if() が決める

const board = document.querySelector(".board");
let draggedCard = null;

// DOM を変えたら、埋め込み先の iframe にこの文書の高さを測り直してもらう。
// Grid Lanes は並び順で各列の高さが変わるので、並べ替えるたびにボード全体の高さも変わる
function commit(update) {
  const resize = () => {
    if (window.parent !== window && "requestResize" in window)
      window.requestResize();
  };
  if (!document.startViewTransition) {
    update();
    resize();
    return;
  }
  // transition 中に iframe の高さが変わると viewport が変わり、transition が中断される。終わってから測り直す
  document.startViewTransition(update).finished.finally(resize);
}

function feature(card) {
  const current = board.querySelector('[data-slot="featured"]');
  if (current === card) return;
  // 「注目枠へ」ボタンから来た場合、そのボタンは注目枠では消えるので、同じカードの共有リンクへフォーカスを移す
  const fromButton =
    card.shadowRoot.activeElement?.classList.contains("feature");
  commit(() => {
    current?.removeAttribute("data-slot");
    card.dataset.slot = "featured";
    // 注目枠は見た目で先頭に出る。DOM でも先頭に置き、読み上げ順と Tab 順を見た目に合わせる
    // (Grid Lanes では reading-flow が効かなかったため、2026-10-06 実測)
    place(card, board.firstElementChild);
    if (fromButton) card.shadowRoot.querySelector("a.share").focus();
  });
}

// カードを DOM の中で動かす。moveBefore() は要素を外さずに動かすので、フォーカスなどの状態が保たれる
function place(card, reference) {
  if ("moveBefore" in board) board.moveBefore(card, reference);
  else board.insertBefore(card, reference);
}

// キーボードでの並べ替え: 前後で見えているカードと入れ替え、押したボタンにフォーカスを残す
function move(card, direction) {
  // 注目枠は常に先頭に表示されるので、入れ替えの相手にしない (入れ替えても見た目が変わらないため)。
  // トラック別の表示ではカードが自分のトラックの列に固定されるので、同じトラックのカードとだけ入れ替える
  const byTrack = board.dataset.view === "track";
  const visible = [...board.querySelectorAll("session-card")].filter(
    (c) =>
      c.checkVisibility() &&
      c.dataset.slot !== "featured" &&
      (!byTrack || c.dataset.track === card.dataset.track)
  );
  const neighbor =
    visible[visible.indexOf(card) + (direction === "before" ? -1 : 1)];
  if (!neighbor) return;
  commit(() => {
    place(card, direction === "before" ? neighbor : neighbor.nextSibling);
    card.shadowRoot.querySelector(`[data-move="${direction}"]`).focus();
  });
}

function clearDropTarget() {
  board.querySelector(".drop-target")?.classList.remove("drop-target");
}

function cardAt(event) {
  const card = event.target.closest?.("session-card");
  return card === draggedCard ? null : card;
}

board.addEventListener("dragstart", (e) => {
  const card = e.target.closest("session-card");
  if (!card) return;

  draggedCard = card;
  card.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", card.id);
});

board.addEventListener("dragend", () => {
  draggedCard?.classList.remove("dragging");
  clearDropTarget();
  draggedCard = null;
});

// ボード上ならどこにでも落とせる。重なっているカードだけ枠で示す
board.addEventListener("dragover", (e) => {
  if (!draggedCard) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";

  const target = cardAt(e);
  if (target?.classList.contains("drop-target")) return;
  clearDropTarget();
  target?.classList.add("drop-target");
});

board.addEventListener("drop", (e) => {
  if (!draggedCard) return;
  e.preventDefault();
  clearDropTarget();

  const dragged = draggedCard;
  const target = cardAt(e);

  // カード以外 (ボードの余白) に落としたら末尾へ。注目枠は先頭に置いたままにする (見た目も常に先頭のため)
  if (!target) {
    if (dragged.dataset.slot !== "featured") {
      commit(() => place(dragged, null));
    }
    return;
  }

  // どちらかが注目枠なら、注目枠を入れ替える
  if (target.dataset.slot === "featured") {
    feature(dragged);
    return;
  }
  if (dragged.dataset.slot === "featured") {
    feature(target);
    return;
  }

  // それ以外は並べ替え。カードの上半分なら前、下半分なら後ろに入れる
  const rect = target.getBoundingClientRect();
  const before = e.clientY < rect.top + rect.height / 2;
  commit(() => target[before ? "before" : "after"](dragged));
});

board.addEventListener("feature-request", (e) => feature(e.target));
board.addEventListener("move-request", (e) =>
  move(e.target, e.detail.direction)
);
