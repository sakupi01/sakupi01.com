// 時間帯の絞り込み。range の値は CSS から読めないので、比較だけ JS で行う。
// トラックの絞り込みは CSS の :has() だけで動くので、ここでは扱わない。
// 開始時刻はカードの属性ではなく sessions.json から読む (カードの定義より先にこの module が動くことがあるため)
// router.js が、お気に入りを表示するたびに init() を呼ぶ
import { SESSIONS, startMinutes } from "../shared/session-item.js";

let form;

function toLabel(minutes) {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function apply() {
  const { from, to, fromLabel, toLabel: toOutput } = form.elements;
  // 開始が終了を追い越したら、動かした方に合わせる
  if (Number(from.value) > Number(to.value)) {
    if (document.activeElement === from) to.value = from.value;
    else from.value = to.value;
  }
  fromLabel.value = toLabel(Number(from.value));
  toOutput.value = toLabel(Number(to.value));
  // 読み上げで「630」ではなく「10:30」と伝える
  from.setAttribute("aria-valuetext", fromLabel.value);
  to.setAttribute("aria-valuetext", toOutput.value);

  // カードはサーバーから届いたあとにも増える (WebMCP や別のタブで足したとき) ので、そのつど探す
  for (const card of document.querySelectorAll("session-card")) {
    const session = SESSIONS.get(card.id);
    if (!session) continue;
    const start = startMinutes(session);
    const outside = start < Number(from.value) || start > Number(to.value);
    card.toggleAttribute("data-out-of-range", outside);
  }
}

export function init(signal) {
  form = document.querySelector(".board-filter");
  form.addEventListener("input", apply, { signal });
  // フォームは送信しない (Enter で再読み込みしない)
  form.addEventListener("submit", (e) => e.preventDefault(), { signal });
  apply();

  // 表示の切り替え: board の data-view を変えるだけ。列の数とカードの置き場所は CSS が決める
  const board = document.querySelector(".board");
  const viewButtons = [...document.querySelectorAll(".board-view button")];

  for (const button of viewButtons) {
    button.addEventListener(
      "click",
      () => {
        const change = () => {
          board.dataset.view = button.dataset.view;
          for (const other of viewButtons) {
            other.setAttribute("aria-pressed", String(other === button));
          }
        };
        // board だけで行う (element-scoped)。ボタンの押された状態は、アニメーションを待たずに変わる
        const host = board.startViewTransition ? board : document;
        if (host.startViewTransition) host.startViewTransition(change);
        else change();
      },
      { signal }
    );
  }
}
