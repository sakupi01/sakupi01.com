/* global AbortController, AbortSignal, TextDecoderStream, location, navigation -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// 2 章の Platform Driven SPA: ページ内のリンクを、同じ文書のまま中身だけ差し替えて切り替える。
// - 遷移は Navigation API の navigate イベントで受け取る (intercept())。URL と履歴はブラウザが管理する
// - 中身はサーバー (serve.py) が <template for="page"> で流す。JS は fetch の body を streamAppendHTMLUnsafe() につなぐだけで、
//   <?start name="page">〜<?end> を差し替えるのはブラウザ (Declarative Partial Updates)
// - 差し替えは同じ文書の View Transitions で包む。遷移中のスタイルは navigation.css の @navigation が決める
// - Navigation API か streamAppendHTMLUnsafe() がないブラウザでは遷移を受け取らず、今までどおりページごとに読み込む (MPA)
//
// ページごとの JS (init(signal)) も、ここから呼ぶ。ページを離れたら signal を abort して、イベントやツールの登録を外す

const PAGES = {
  timetable: {
    className: "timetable-page",
    title: "タイムテーブル | DevFest Kwansai 2026",
    modules: ["../timetable/timezone.js", "../timetable/countdown.js"],
  },
  favs: {
    className: "favs-page",
    title: "お気に入り | DevFest Kwansai 2026",
    modules: [
      "../favs/session-card.js",
      "../favs/favs.js",
      "../favs/board-filter.js",
      "../favs/webmcp.js",
    ],
  },
  // セッションページのタイトルは、session-item.js がセッションの名前で付け直す
  session: {
    className: "session-page",
    title: "セッション | DevFest Kwansai 2026",
    modules: ["../session/feedback-frame.js"],
  },
};

// URL がどのページか。デモは studio の下の階層でも配信されるので、パスはこのファイルの場所から求める
function pageFor(url) {
  if (url.origin !== location.origin) return null;
  for (const name of Object.keys(PAGES)) {
    const base = new URL(`../${name}/`, import.meta.url).pathname;
    if (url.pathname === base || url.pathname === `${base}index.html`)
      return name;
  }
  return null;
}

let pageController = new AbortController();

// ページの JS を読み込んで init(signal) を呼ぶ。読み込みに失敗した module は (静的配信で sessions.json がないときなど)、
// 警告を出して飛ばし、残りの module は動かす
async function start(name) {
  // 中断された遷移の start() が先に作った controller も、ここで abort してから作り直す
  pageController.abort();
  pageController = new AbortController();
  const { signal } = pageController;
  for (const path of PAGES[name].modules) {
    try {
      const module = await import(path);
      // 読み込みを待つ間に次のページへ移ったら、残りの初期化はしない
      if (signal.aborted) return;
      await module.init?.(signal);
    } catch (error) {
      console.warn(`${path} を動かせませんでした`, error);
    }
  }
}

// サーバーから届く HTML を body に流し込む。最初の </template> (ページの差し替え) を書き終えたら pageWritten を resolve する。
// favs はそのあとカード (<template for="board-cards">) が届くので、流し込みはそのまま続ける。
// 最初の </template> が届く前に終わったとき (中断、通信の失敗) は、ページを差し替えられていないので pageWritten を reject する
function stream(response, signal) {
  const END = "</template>";
  let resolvePage;
  let rejectPage;
  let pageFound = false;
  const pageWritten = new Promise((resolve, reject) => {
    resolvePage = resolve;
    rejectPage = reject;
  });
  // update が pageWritten を待ち始める前に reject されても、未処理の reject として報告させない (失敗は update が受け取る)
  pageWritten.catch(() => {});
  const done = (async () => {
    let writer;
    // チャンクの境目で </template> が分かれても見つけられるように、前のチャンクの末尾を足して探す
    let tail = "";
    try {
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      writer = document.body.streamAppendHTMLUnsafe().getWriter();
      // 中断したら読むのをやめる。read() は done で終わる
      signal.addEventListener(
        "abort",
        () =>
          reader
            .cancel(signal.reason)
            .catch((error) =>
              console.warn("読み込みを止められませんでした", error)
            ),
        { once: true }
      );
      for (;;) {
        const { value, done: ended } = await reader.read();
        if (ended) break;
        await writer.write(value);
        const text = tail + value;
        if (!pageFound && text.includes(END)) {
          pageFound = true;
          resolvePage();
        }
        tail = text.slice(-(END.length - 1));
      }
      // 中断したときは、書きかけの HTML を閉じて差し込まずに捨てる
      if (signal.aborted) await writer.abort(signal.reason);
      else await writer.close();
    } catch (error) {
      await writer?.abort(error);
      throw error;
    } finally {
      if (!pageFound) {
        rejectPage(
          signal.aborted
            ? signal.reason
            : new Error('the response ended before <template for="page">')
        );
      }
    }
  })();
  return { pageWritten, done };
}

// 前の遷移の流し込み (お気に入りのカード)。次の遷移が始まったら止める
let streamController = new AbortController();

async function show(name, url, navigationSignal) {
  // 前のページの JS (イベント、WebMCP のツール、残り時間の流し込み) は、新しいページを差し込んだあとで start() が止める。
  // 遷移が取り消されたときに、今のページを動かしたままにするため
  streamController.abort();
  streamController = new AbortController();
  const signal = AbortSignal.any([navigationSignal, streamController.signal]);

  const response = await fetch(url, {
    headers: { "X-Partial": "page" },
    signal,
  });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  // X-Partial を知らないサーバー (公開版の静的配信など) は完全な文書を返すので、流し込まずに読み込み直す
  if (response.headers.get("X-Partial") !== "page")
    throw new Error(`${url}: not a partial response`);
  // 流し込みは update の中で始める。View Transition は update を呼ぶ前に今の画面を撮るので、
  // それより先に新しい中身が入ると、移る前の画面にも新しいページが写ってしまう
  const update = async () => {
    // タイトルは流し込む前に変える。セッションページは、流し込んだ <session-item> がセッションの名前で付け直す。
    // ここまで来ると、遷移が取り消されてもタイトルは戻さない (URL も遷移先のまま)
    document.title = PAGES[name].title;
    const { pageWritten, done } = stream(response, signal);
    // カードの流し込みは遷移の外で続ける (遷移を 3 秒待たせない)。止めたときは失敗ではない。
    // ページを差し込む前の失敗は pageWritten から伝わる
    done.catch((error) => {
      if (!signal.aborted)
        console.warn("ページの続きを流し込めませんでした", error);
    });
    await pageWritten;
    // 流し込みの途中で次の遷移が来たら、このページの初期化はしない
    signal.throwIfAborted();
    document.body.className = PAGES[name].className;
    await start(name);
  };
  // ページの切り替えは document 全体の View Transition にする。ページの範囲だけの element-scoped にすると、
  // 名前付きの要素 (前のページのセルなど) が消える更新で transition が飛ばされる
  // (InvalidStateError: Prepaint layout check failed。Chrome 155 / 157 Canary、2026-10-13 実測)。
  // 消える要素がない並べ替えは、favs.js と board-filter.js で board だけの scoped にしている
  if (document.startViewTransition) {
    const transition = document.startViewTransition({ update, types: [name] });
    transition.ready.catch((error) =>
      console.warn("ページ切り替えのアニメーションを飛ばしました", error)
    );
    // update が失敗したときは finished も reject される。失敗は下の updateCallbackDone から show() の呼び出し元へ伝える
    transition.finished.catch(() => {});
    await transition.updateCallbackDone;
  } else {
    await update();
  }
}

const current = pageFor(new URL(location.href));
if (current) start(current);

if (
  "navigation" in window &&
  typeof document.body.streamAppendHTMLUnsafe === "function"
) {
  navigation.addEventListener("navigate", (e) => {
    const destination = new URL(e.destination.url);
    const name = pageFor(destination);
    if (
      !name ||
      !e.canIntercept ||
      e.hashChange ||
      e.downloadRequest !== null ||
      e.formData ||
      e.navigationType === "reload" ||
      e.info?.fullLoad
    )
      return;
    e.intercept({
      handler: () =>
        show(name, destination, e.signal).catch((error) => {
          if (e.signal.aborted) return;
          // 差し替えに失敗したら、そのページを普通に読み込み直す (理由はコンソールに残す)
          console.warn(
            "ページを差し替えられなかったので、読み込み直します",
            error
          );
          navigation
            .navigate(destination.href, {
              history: "replace",
              info: { fullLoad: true },
            })
            .committed.catch((reloadError) =>
              console.warn("ページを読み込み直せませんでした", reloadError)
            );
        }),
    });
  });
}
