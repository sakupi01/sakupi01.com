/* global location -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// WebMCP (3 章): お気に入りの操作を AI エージェント向けのツールとして公開する。
// 人が使う画面と同じ処理 (favorite-request / unfavorite-request イベント) を呼ぶので、エージェント専用の UI は作らない。
// 未対応のブラウザと ?off=webmcp のときは何もしない。
// router.js が、お気に入りを表示するたびに init() を呼ぶ。ツールは signal 付きで登録し、ほかのページへ移ったら (abort) 外す。
// 「いまのページで使えるツールだけを出す」(WebMCP のベストプラクティス) を、SPA でもそのまま守る
import { SESSIONS } from "../shared/session-item.js";

export async function init(signal) {
  const off = (new URLSearchParams(location.search).get("off") ?? "").split(
    ","
  );
  if (!("modelContext" in document) || off.includes("webmcp")) return;

  // セッションの中身は sessions.json から、お気に入りかどうかは画面のカードから読む
  const describe = (session) => ({
    id: session.id,
    title: session.title,
    speakers: session.speakers.map((speaker) => speaker.name),
    track: session.track.toUpperCase(),
    start: session.start,
    favorite:
      document.getElementById(session.id)?.hasAttribute("data-favorite") ??
      false,
  });

  const ID_SCHEMA = {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "search_sessions が返す id (例: session-11)",
      },
    },
    required: ["id"],
  };

  // 人がボタンを押したときと同じ処理を、お気に入りのボード (favs.js) に頼む。
  // 保存はサーバーへの非同期の通信なので、favs.js が detail.result に入れる Promise を待ち、
  // 保存できた配列で結果を確かめる (null は保存の失敗)
  const request = async (id, type) => {
    if (typeof id !== "string" || !SESSIONS.has(id)) {
      return { error: `session ${id} was not found` };
    }
    const detail = { id };
    document
      .querySelector(".board")
      .dispatchEvent(new CustomEvent(type, { detail }));
    let ids;
    try {
      ids = await detail.result;
    } catch (error) {
      return { error: `failed to save favorites: ${error.message}` };
    }
    if (!ids || ids.includes(id) !== (type === "favorite-request")) {
      return { error: `failed to save favorites for ${id}` };
    }
    return { session: { id, title: SESSIONS.get(id).title } };
  };

  await document.modelContext.registerTool(
    {
      name: "search_sessions",
      description:
        "DevFest Kwansai 2026 の全 30 セッションを探す。query はタイトルと登壇者名の部分一致、track は A から D のトラック、favorite を true にするとお気に入りだけを返す。結果の id は add_favorite と remove_favorite に渡せる",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "タイトルか登壇者名の一部" },
          track: { type: "string", enum: ["A", "B", "C", "D"] },
          favorite: {
            type: "boolean",
            description: "true ならお気に入りのセッションだけ",
          },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async ({ query = "", track, favorite } = {}) => {
        // エージェントは schema と違う型を渡すことがあるので、ここでも確かめる
        if (typeof query !== "string")
          return { error: "query must be a string" };
        if (track !== undefined && !["A", "B", "C", "D"].includes(track)) {
          return { error: "track must be one of A, B, C, D" };
        }
        if (favorite !== undefined && typeof favorite !== "boolean") {
          return { error: "favorite must be a boolean" };
        }
        const needle = query.toLowerCase();
        const sessions = [...SESSIONS.values()]
          .map(describe)
          .filter((session) => !track || session.track === track)
          .filter((session) => !favorite || session.favorite)
          .filter(
            (session) =>
              !needle ||
              session.title.toLowerCase().includes(needle) ||
              session.speakers.some((name) =>
                name.toLowerCase().includes(needle)
              )
          );
        return { sessions };
      },
    },
    { signal }
  );

  await document.modelContext.registerTool(
    {
      name: "add_favorite",
      description:
        "指定した id のセッションをお気に入りに加える。お気に入りの末尾に並ぶ。人がタイムテーブルで ♥ を押したときと同じく保存される",
      inputSchema: ID_SCHEMA,
      execute: async ({ id } = {}) => request(id, "favorite-request"),
    },
    { signal }
  );

  await document.modelContext.registerTool(
    {
      name: "remove_favorite",
      description:
        "指定した id のセッションをお気に入りから外す。人がカードの ♥ を押したときと同じ処理を呼ぶ",
      inputSchema: ID_SCHEMA,
      execute: async ({ id } = {}) => request(id, "unfavorite-request"),
    },
    { signal }
  );
}
