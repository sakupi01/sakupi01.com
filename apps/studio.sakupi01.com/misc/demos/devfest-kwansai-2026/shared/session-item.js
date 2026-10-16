import sessions from "../sessions.json" with { type: "json" };
import "./like-button.js";

export const SESSIONS = new Map(
  sessions.map((session) => [session.id, session])
);

export function startMinutes(session) {
  const [hour, minute] = session.start.split(":").map(Number);
  return hour * 60 + minute;
}

export function sessionURL(session) {
  return new URL(`../session/?id=${session.id}`, import.meta.url).href;
}

export function h(tag, { attrs = {}, ...props } = {}, children = []) {
  const element = Object.assign(document.createElement(tag), props);
  for (const [name, value] of Object.entries(attrs)) {
    if (value != null) element.setAttribute(name, value);
  }
  element.append(...children.filter((child) => child != null));
  return element;
}

// 登壇者の写真。名前がすぐ隣にあるので装飾 (alt="")。最初の登壇者だけ View Transitions 用の id を持つ
export function avatar(session, speaker, index) {
  if (!speaker.image) return null;
  return h("img", {
    className: "avatar",
    src: `https://img.gdgs.jp/${speaker.image}?w=192&h=192&fit=cover&q=60&f=avif`,
    alt: "",
    width: 192,
    height: 192,
    attrs: { id: index === 0 ? `${session.id}-avatar` : null },
  });
}

// 登壇者の名前。最初の登壇者だけ View Transitions 用の id を持つ
export function speakerName(session, speaker, index, tag = "span") {
  return h(tag, {
    className: "name",
    textContent: speaker.name,
    attrs: {
      id: index === 0 ? `${session.id}-name` : null,
      lang: speaker.nameLang,
    },
  });
}

export function affiliation(speaker, attrs = {}) {
  if (!speaker.affiliation) return null;
  return h("span", {
    className: "affiliation",
    textContent: speaker.affiliation,
    attrs: { lang: speaker.affiliationLang, ...attrs },
  });
}

// "Track C" と "13:50〜14:15" と、あれば形式 (オンライン など)
export function metaParts(session) {
  return [
    h("span", {
      className: "track",
      textContent: `Track ${session.track.toUpperCase()}`,
    }),
    h("span", {}, [
      h("time", { dateTime: session.start, textContent: session.start }),
      "〜",
      h("time", { dateTime: session.end, textContent: session.end }),
    ]),
    session.format ? h("span", { textContent: session.format }) : null,
  ];
}

// 普通の登壇者のリスト (タイムテーブルのセルとセッションページ)
function speakerList(session) {
  if (session.speakers.length === 0) return null;
  return h(
    "ul",
    { className: "speakers" },
    session.speakers.map((speaker, index) =>
      h("li", {}, [
        avatar(session, speaker, index),
        speakerName(session, speaker, index),
        affiliation(speaker),
      ])
    )
  );
}

function title(session, tag) {
  return h(tag, {
    className: "title",
    id: `${session.id}-title`,
    textContent: session.title,
    attrs: { lang: session.titleLang },
  });
}

function cell(session) {
  return [
    h("like-button", {
      attrs: { session: session.id, label: `お気に入り: ${session.title}` },
    }),
    h(
      "a",
      {
        className: "session-link",
        href: sessionURL(session),
        attrs: { "aria-labelledby": `${session.id}-title` },
      },
      [
        title(session, "p"),
        session.format
          ? h("p", { className: "format", textContent: session.format })
          : null,
        speakerList(session),
      ]
    ),
  ];
}

function detail(session) {
  return [
    h(
      "article",
      {
        className: "session-detail",
        id: session.id,
        attrs: { "data-track": session.track, lang: session.lang },
      },
      [
        h("p", { className: "session-meta" }, metaParts(session)),
        title(session, "h1"),
        speakerList(session),
        session.description
          ? h(
              "div",
              {
                className: "description",
                attrs: { lang: session.descriptionLang },
              },
              session.description
                .split("\n\n")
                .map((text) => h("p", { textContent: text }))
            )
          : null,
        h("p", { className: "session-actions" }, [
          h("like-button", {
            textContent: "お気に入り",
            attrs: { session: session.id },
          }),
        ]),
      ]
    ),
  ];
}

function missing() {
  return [
    h("div", { className: "session-missing" }, [
      h("h1", {
        className: "page-title",
        textContent: "セッションが見つかりません",
      }),
      h("p", {}, [
        h("a", {
          href: new URL("../timetable/", import.meta.url).href,
          textContent: "タイムテーブル",
        }),
        "から選んでください。",
      ]),
    ]),
  ];
}

class SessionItem extends HTMLElement {
  connectedCallback() {
    if (this.childElementCount > 0) return;
    // セッションページでは session 属性を書かず、URL の ?id で選ぶ
    const id =
      this.getAttribute("session") ??
      new URLSearchParams(location.search).get("id");
    const session = SESSIONS.get(id);
    const variant = this.getAttribute("variant");

    if (!session) {
      if (variant === "detail") this.replaceChildren(...missing());
      else
        console.warn(`<session-item>: session ${id} is not in sessions.json`);
      return;
    }
    if (variant === "detail") {
      this.replaceChildren(...detail(session));
      document.title = `${session.title} | DevFest Kwansai 2026`;
      return;
    }
    this.replaceChildren(...cell(session));
  }
}

customElements.define("session-item", SessionItem);
