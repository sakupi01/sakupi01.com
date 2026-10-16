/* global BroadcastChannel -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// お気に入り。サーバー (serve.py) の DB に、セッションの id をお気に入りにした順の配列で保存する。
// 利用者は serve.py が発行する cookie で見分けるので、ここでは id の配列を読み書きするだけ。
// 読み書きに失敗したら reject する。呼び出し側は画面の状態を変えずに、role="status" の場所で知らせる
const ENDPOINT = new URL("../api/favorites", import.meta.url);

// 別のタブやページへの通知 (BroadcastChannel は送ったタブ自身には届かない)
const channel = new BroadcastChannel("devfest-kwansai-2026:favorites");

async function request(init) {
  const response = await fetch(ENDPOINT, { cache: "no-store", ...init });
  if (!response.ok) {
    throw new Error(
      `${init?.method ?? "GET"} ${ENDPOINT.pathname}: ${response.status}`
    );
  }
  return response.json();
}

export function read() {
  return request();
}

// 並び順ごと保存し、保存できた配列を返す
export async function setOrder(ids) {
  const saved = await request({
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
  channel.postMessage(saved);
  return saved;
}

export async function add(id) {
  const ids = await read();
  return ids.includes(id) ? ids : setOrder([...ids, id]);
}

export async function remove(id) {
  const ids = await read();
  return ids.includes(id) ? setOrder(ids.filter((other) => other !== id)) : ids;
}

// 別のタブやページでの変更と、戻る / 進むで bfcache から戻ったときに呼ぶ。
// signal を渡すと、abort で呼ばなくなる (SPA でページを離れたとき。router.js を参照)
export function onChange(callback, { signal } = {}) {
  channel.addEventListener("message", (e) => callback(e.data), { signal });
  window.addEventListener(
    "pageshow",
    (e) => {
      if (!e.persisted) return;
      read().then(callback, (error) =>
        console.warn("お気に入りを読み直せませんでした", error)
      );
    },
    { signal }
  );
}
