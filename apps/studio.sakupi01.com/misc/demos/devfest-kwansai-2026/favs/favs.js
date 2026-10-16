// お気に入りのボード。router.js が、お気に入りを表示するたびに init() を呼ぶ (SPA で中身が差し替わるため)。
// ボードとイベントはそのたびに付け直し、ページを離れたら (signal の abort) 外す
import * as favorites from "../shared/favorites.js";
import { SESSIONS } from "../shared/session-item.js";

let board;
let status;
let draggedCard = null;
let laneCount;
let boardWidth;

const favoriteCards = () => [
  ...board.querySelectorAll("session-card[data-favorite]"),
];

function save() {
  return favorites.setOrder(favoriteCards().map((card) => card.id)).then(
    (ids) => {
      status.textContent = "";
      return ids;
    },
    (error) => {
      console.warn("お気に入りを保存できませんでした", error);
      status.textContent =
        "お気に入りを保存できませんでした。再読み込みすると、保存されている状態に戻ります";
      return null;
    }
  );
}

function commit(update) {
  let saved;
  const run = () => {
    update();
    saved = save();
  };
  // board だけで行う (element-scoped)。並べ替えのアニメーションの間も、絞り込みやナビは操作できる
  const host = board.startViewTransition ? board : document;
  if (!host.startViewTransition) {
    run();
    return saved;
  }
  const transition = host.startViewTransition(run);
  transition.ready.catch((error) =>
    console.warn("並べ替えのアニメーションを飛ばしました", error)
  );
  return transition.updateCallbackDone.then(() => saved);
}

function place(card, reference) {
  if ("moveBefore" in board && card.isConnected)
    board.moveBefore(card, reference);
  else board.insertBefore(card, reference);
}

function lanes() {
  const style = window.getComputedStyle(board);
  const widths = style.gridTemplateColumns.split(" ").map(parseFloat);
  const gap = parseFloat(style.columnGap) || 0;
  let left =
    board.getBoundingClientRect().left +
    parseFloat(style.borderInlineStartWidth) +
    parseFloat(style.paddingInlineStart);
  return widths.map((width) => {
    const lane = { left, right: left + width };
    left += width + gap;
    return lane;
  });
}

function laneAt(x) {
  const all = lanes();
  const index = all.findIndex(
    (lane, i) => i === all.length - 1 || x < (lane.right + all[i + 1].left) / 2
  );
  return index + 1;
}

function clearLanes() {
  for (const card of board.querySelectorAll("[data-lane]")) {
    delete card.dataset.lane;
  }
}

function watchLanes(signal) {
  laneCount = lanes().length;
  boardWidth = board.clientWidth;
  const observer = new ResizeObserver(() => {
    const widthChanged = board.clientWidth !== boardWidth;
    boardWidth = board.clientWidth;
    if (board.dataset.view === "track") {
      if (widthChanged) clearLanes();
      return;
    }
    const count = lanes().length;
    if (count === laneCount) return;
    laneCount = count;
    clearLanes();
  });
  observer.observe(board);
  signal.addEventListener("abort", () => observer.disconnect(), { once: true });
}

const visibleCards = () =>
  favoriteCards().filter((card) => card.checkVisibility());

// 前後で見えているカードと入れ替え、押したボタンにフォーカスを残す。
// 入れ替えた相手の列を引き継ぐので、固定した列があっても見た目の上下が入れ替わる
function move(card, direction) {
  const byTrack = board.dataset.view === "track";
  const visible = visibleCards().filter(
    (c) => !byTrack || c.dataset.track === card.dataset.track
  );
  const neighbor =
    visible[visible.indexOf(card) + (direction === "before" ? -1 : 1)];
  if (!neighbor) return;
  commit(() => {
    const [cardLane, neighborLane] = [card.dataset.lane, neighbor.dataset.lane];
    place(card, direction === "before" ? neighbor : neighbor.nextSibling);
    setLane(card, neighborLane);
    setLane(neighbor, cardLane);
    card.shadowRoot.querySelector(`[data-move="${direction}"]`).focus();
  });
}

function setLane(card, lane) {
  if (lane) card.dataset.lane = lane;
  else delete card.dataset.lane;
}

// id のカード。サーバーが送ってこなかったセッション (WebMCP や別のタブで後から足したもの) は、
// <session-card> を作り、中身を sessions.json から組み立てる (session-card.js の build())
function cardFor(id) {
  const card = document.getElementById(id);
  if (card?.localName === "session-card") return card;
  if (!SESSIONS.has(id)) return null;
  const created = document.createElement("session-card");
  created.id = id;
  created.draggable = true;
  created.build();
  return created;
}

// 消えるカードにフォーカスがあったとき (カードの ♥ で外したときなど) は、隣のカードのタイトルへ移す。
// 隣がなければ見出しへ移す。フォーカスがほかにあれば動かさない (WebMCP から外したときなど)
function unfavorite(card) {
  if (!card?.hasAttribute("data-favorite")) return favorites.read();
  const hadFocus = card.matches(":focus-within");
  const visible = visibleCards();
  const index = visible.indexOf(card);
  const next = index === -1 ? null : (visible[index + 1] ?? visible[index - 1]);
  return commit(() => {
    delete card.dataset.favorite;
    delete card.dataset.lane;
    if (!hadFocus) return;
    (
      next?.querySelector(".session-link") ??
      document.querySelector(".page-title")
    ).focus();
  });
}

function favorite(card) {
  if (card.hasAttribute("data-favorite")) return favorites.read();
  return commit(() => {
    card.dataset.favorite = "";
    place(card, null);
  });
}

// 別のタブやページでお気に入りが変わったら、印と順番を付け直す
function render(ids) {
  for (const card of favoriteCards()) {
    if (ids.includes(card.id)) continue;
    delete card.dataset.favorite;
    delete card.dataset.lane;
  }
  for (const id of ids) {
    const card = cardFor(id);
    if (!card) continue;
    card.dataset.favorite = "";
    place(card, null);
  }
}

// ---- ドラッグ & ドロップ ----

const DROP_CLASSES = ["drop-before", "drop-after"];

function clearDropTarget() {
  const selector = DROP_CLASSES.map((name) => `.${name}`).join(", ");
  for (const card of board.querySelectorAll(selector)) {
    card.classList.remove(...DROP_CLASSES);
  }
}

// ポインタの位置から落とす先を決める。カードは入れ替えず、カードの上か下の隙間に入れる。
// - すべて: ポインタのある列に落とし、その列でいちばん近いカードの上か下に入れる。列にカードがなければ末尾
// - トラック別: カードは自分のトラックの列に固定されるので、同じトラックのカードだけを基準にする
function dropPosition(e) {
  const byTrack = board.dataset.view === "track";
  const lane = byTrack ? null : laneAt(e.clientX);
  let nearest = null;
  let nearestDistance = Infinity;
  for (const card of visibleCards()) {
    if (card === draggedCard) continue;
    if (byTrack && card.dataset.track !== draggedCard.dataset.track) continue;
    const rect = card.getBoundingClientRect();
    if (lane && laneAt(rect.left + rect.width / 2) !== lane) continue;
    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
    const distance = Math.hypot(dx, dy);
    if (distance < nearestDistance) {
      nearest = card;
      nearestDistance = distance;
    }
  }
  if (!nearest) return { card: null, where: "end", lane };
  const rect = nearest.getBoundingClientRect();
  return {
    card: nearest,
    where: e.clientY < rect.top + rect.height / 2 ? "before" : "after",
    lane,
  };
}

export function init(signal) {
  board = document.querySelector(".board");
  status = document.querySelector(".save-status");
  draggedCard = null;
  watchLanes(signal);
  favorites.onChange(render, { signal });

  board.addEventListener(
    "dragstart",
    (e) => {
      const card = e.target.closest("session-card");
      if (!card) return;

      draggedCard = card;
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.id);
    },
    { signal }
  );

  board.addEventListener(
    "dragend",
    () => {
      draggedCard?.classList.remove("dragging");
      clearDropTarget();
      draggedCard = null;
    },
    { signal }
  );

  // ボード上ならどこにでも落とせる。入れる位置を、カードの上か下の隙間に線で示す
  board.addEventListener(
    "dragover",
    (e) => {
      if (!draggedCard) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      const { card, where } = dropPosition(e);
      const className = `drop-${where}`;
      if (card?.classList.contains(className)) return;
      clearDropTarget();
      card?.classList.add(className);
    },
    { signal }
  );

  board.addEventListener(
    "drop",
    (e) => {
      if (!draggedCard) return;
      e.preventDefault();
      clearDropTarget();

      const dragged = draggedCard;
      const { card, where, lane } = dropPosition(e);
      commit(() => {
        // 落とした列に固定する。ほかのカードは Grid Lanes の自動配置のまま
        setLane(dragged, lane);
        if (!card) place(dragged, null);
        else place(dragged, where === "before" ? card : card.nextSibling);
      });
    },
    { signal }
  );

  board.addEventListener(
    "move-request",
    (e) => move(e.target, e.detail.direction),
    { signal }
  );

  // お気に入りから外す / 加える。カードの ♥ は e.target のカード、WebMCP (webmcp.js) は detail.id で頼む。
  // 保存の結果 (Promise) を detail.result に入れ、頼んだ側が待てるようにする
  board.addEventListener(
    "unfavorite-request",
    (e) => {
      const card = e.detail?.id ? cardFor(e.detail.id) : e.target;
      const result = unfavorite(card);
      if (e.detail) e.detail.result = result;
    },
    { signal }
  );
  board.addEventListener(
    "favorite-request",
    (e) => {
      const card = cardFor(e.detail.id);
      e.detail.result = card ? favorite(card) : Promise.resolve(null);
    },
    { signal }
  );
}
