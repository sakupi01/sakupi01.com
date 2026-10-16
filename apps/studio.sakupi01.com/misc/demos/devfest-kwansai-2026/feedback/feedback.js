/* global FormData, location -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// 感想フォーム (session ページの iframe の中)。
// - 答えに応じて質問を出し入れする。高さが変わると embed.js が埋め込み先に測り直しを頼む (Responsive iframe)
// - 送信は fetch で行い、iframe の中では遷移しない (遷移した先の文書からは iframe が縮まなかったため)
// - エージェントが入力したフォームを人が送信したときは、結果を respondWith() でエージェントに返す (WebMCP の declarative API)
import { SESSIONS } from "../shared/session-item.js";

const form = document.querySelector(".feedback-form");
const status = form.querySelector(".form-status");
const submit = form.querySelector("[type=submit]");
const thanks = document.querySelector(".feedback-thanks");
const summary = thanks.querySelector(".feedback-summary");
const id = new URLSearchParams(location.search).get("id");

// 条件付きの質問 ([data-when]) を出す条件。条件は、いま見えている質問の答え (answers()) で判断するので、
// 親の質問が隠れると、その答えで出ていた子の質問も隠れる。
// 隠すのは disabled ではなく hidden にする。disabled の項目はツールの入力 (JSON Schema) から外れ、質問が出るたびに
// ツールの定義が変わって、エージェントの実行が取り消されるため (Chrome 157 Canary、2026-10-13)
const CONDITIONS = {
  liked: (data) => Number(data.get("rating")) >= 4,
  "liked-demo": (data) => data.getAll("liked").includes("demo"),
  missed: (data) => [1, 2, 3].includes(Number(data.get("rating"))),
  "hard-part": (data) => data.getAll("missed").includes("too_hard"),
  question: (data) => data.has("has_question"),
};

// いま見えている質問の答え。隠れた質問の項目は、値が入っていても除く
function answers() {
  const data = new FormData(form);
  for (const question of form.querySelectorAll("[data-when][hidden]")) {
    for (const element of question.querySelectorAll("[name]")) {
      data.delete(element.name);
    }
  }
  return data;
}

// 隠れた質問に入っている答え (エージェントが条件を満たさない項目に入れたときなど)。送らないことをエージェントに伝える
function ignoredAnswers() {
  const all = new FormData(form);
  const sent = answers();
  return [...new Set(all.keys())].filter(
    (name) => !sent.has(name) && all.getAll(name).some((value) => value.trim())
  );
}

function updateQuestions() {
  // 前の質問を出し入れした結果を次の条件に使うので、質問ごとに読み直す
  for (const question of form.querySelectorAll("[data-when]")) {
    question.hidden = !CONDITIONS[question.dataset.when](answers());
  }
}

function payload(data, via) {
  const body = { session: id, rating: Number(data.get("rating")), via };
  for (const name of ["liked", "missed"]) {
    if (data.has(name)) body[name] = data.getAll(name);
  }
  for (const name of ["liked_demo", "hard_part", "question", "comment"]) {
    const value = data.get(name)?.trim();
    if (value) body[name] = value;
  }
  return body;
}

function showThanks(stats) {
  const average = stats.average.toFixed(1);
  summary.textContent = `みんなの評価: ★${average} (${stats.count} 件。うちエージェント経由 ${stats.agent} 件)`;
  form.hidden = true;
  thanks.hidden = false;
  // 押した送信ボタンが消えるので、フォーカスを結果へ移す
  thanks.focus();
}

// エージェントへの結果にも使うので、失敗は例外ではなく { error } で返す (favs/webmcp.js と同じ形)
async function send(via) {
  updateQuestions();
  const data = answers();
  const rating = Number(data.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "rating must be one of 1, 2, 3, 4, 5" };
  }
  let response;
  try {
    response = await fetch("../api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(data, via)),
    });
  } catch (error) {
    return { error: `failed to send feedback: ${error.message}` };
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      error:
        result.error ?? `failed to send feedback (HTTP ${response.status})`,
    };
  }
  if (
    !["count", "average", "agent"].every(
      (key) => typeof result[key] === "number"
    )
  ) {
    return { error: "the server returned an unexpected response" };
  }
  // 画面を更新してから結果を返す (エージェントは画面に反映されたあとで完了を伝える)
  showThanks(result);
  const ignored = ignoredAnswers();
  return {
    sent: true,
    session: { id, title: SESSIONS.get(id).title },
    ...(ignored.length > 0 && {
      not_sent: ignored,
      note: "answers in not_sent were not sent because their questions are shown only under other answers",
    }),
  };
}

if (!SESSIONS.has(id)) {
  status.textContent = "セッションが見つかりません";
  submit.disabled = true;
  // 送れないフォームはツールとして出さない
  form.removeAttribute("toolname");
} else {
  // エージェントが値を入れたときも input / change が起きるので、同じ処理で質問を出し直す (Chrome 157 Canary で確認)
  form.addEventListener("input", updateQuestions);
  updateQuestions();

  let sending = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // 送信中にもう一度押されても (Enter キーなど)、二重に保存しない。エージェントからの送信には理由を返す
    if (sending) {
      if (event.agentInvoked)
        event.respondWith(Promise.resolve({ error: "already sending" }));
      return;
    }
    sending = true;
    submit.disabled = true;
    // 思わぬ例外も { error } にそろえ、送信できない状態のまま残さない
    const result = send(event.agentInvoked ? "agent" : "human").catch(
      (error) => ({ error: `unexpected error: ${error.message}` })
    );
    if (event.agentInvoked) event.respondWith(result);
    result.then((outcome) => {
      sending = false;
      submit.disabled = false;
      if (outcome.error) {
        console.warn("感想を送信できませんでした", outcome.error);
        status.textContent = "送信できませんでした。もう一度試してください";
        return;
      }
      status.textContent = "";
      // 送信が済んだフォームはツールとして使えないので、登録を外す (ベストプラクティス: 今の状態で使えるツールだけを出す)。
      // 同じタスクで外すと、respondWith() の結果が届く前に「ツールの定義が変わった」として実行が取り消されるので、
      // 次のタスクで外す (Chrome 157 Canary、2026-10-13)
      setTimeout(() => form.removeAttribute("toolname"));
    });
  });
}
