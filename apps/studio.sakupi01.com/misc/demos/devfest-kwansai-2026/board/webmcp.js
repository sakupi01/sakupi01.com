/* global location -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// WebMCP (5 章): ボードの操作を AI エージェント向けのツールとして公開する。
// 人が使う画面と同じ処理 (feature-request イベント) を呼ぶので、エージェント専用の UI は作らない。
// 未対応のブラウザと ?off=webmcp のときは何もしない
const off = (new URLSearchParams(location.search).get("off") ?? "").split(",");

if ("modelContext" in document && !off.includes("webmcp")) {
  const cards = () => [...document.querySelectorAll("session-card")];
  const text = (element) =>
    element?.textContent.replace(/\s+/g, " ").trim() ?? "";

  const describe = (card) => ({
    id: card.id,
    title: text(card.querySelector('[slot="title"]')),
    speakers: [...card.querySelectorAll(".name")].map(text),
    track: (card.dataset.track ?? "").toUpperCase(),
    start: text(card.querySelector(".meta time")),
    featured: card.dataset.slot === "featured",
  });

  await document.modelContext.registerTool({
    name: "search_sessions",
    description:
      "DevFest Kwansai 2026 のセッションを探す。query はタイトルと登壇者名の部分一致、track は A から D のトラック。結果の id は feature_session に渡せる",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "タイトルか登壇者名の一部" },
        track: { type: "string", enum: ["A", "B", "C", "D"] },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async ({ query = "", track } = {}) => {
      // エージェントは schema と違う型を渡すことがあるので、ここでも確かめる
      if (typeof query !== "string") return { error: "query must be a string" };
      if (track !== undefined && !["A", "B", "C", "D"].includes(track)) {
        return { error: "track must be one of A, B, C, D" };
      }
      const needle = query.toLowerCase();
      const sessions = cards()
        .map(describe)
        .filter((session) => !track || session.track === track)
        .filter(
          (session) =>
            !needle ||
            session.title.toLowerCase().includes(needle) ||
            session.speakers.some((name) => name.toLowerCase().includes(needle))
        );
      return { sessions };
    },
  });

  await document.modelContext.registerTool({
    name: "feature_session",
    description:
      "指定した id のセッションをボードの注目枠に入れる。人がカードを注目枠へドラッグしたときと同じ処理を呼ぶ",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "search_sessions が返す id (例: session-11)",
        },
      },
      required: ["id"],
    },
    execute: async ({ id }) => {
      const card = document.getElementById(id);
      if (card?.localName !== "session-card") {
        return { error: `session ${id} was not found` };
      }
      card.dispatchEvent(new CustomEvent("feature-request", { bubbles: true }));
      // 注目枠の付け替えは View Transition の中で非同期に起きるので、ここでは対象だけを返す
      return {
        featured: {
          id: card.id,
          title: text(card.querySelector('[slot="title"]')),
        },
      };
    },
  });
}
