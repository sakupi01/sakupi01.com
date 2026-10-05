// セッションボードの操作: ドラッグ & ドロップでの並べ替えと、注目枠の入れ替え。
// JS は DOM の順番と data-slot を変えるだけ。色・大きさ・位置は card.css の if() が決める

const board = document.querySelector(".board");
let draggedCard = null;

// DOM を変えたら、埋め込み先の iframe にこの文書の高さを測り直してもらう。
// Grid Lanes は並び順で各列の高さが変わるので、並べ替えるたびにボード全体の高さも変わる
function commit(update) {
  const resize = () => {
    if ("requestResize" in window) window.requestResize();
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
  commit(() => {
    current?.removeAttribute("data-slot");
    card.dataset.slot = "featured";
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

  // カード以外 (ボードの余白) に落としたら末尾へ
  if (!target) {
    commit(() => board.append(dragged));
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
