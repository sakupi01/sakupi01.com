#!/usr/bin/env python3
"""DevFest Kwansai 2026 demo のサーバー (登壇本番とリハーサル用)。

使い方: python3 serve.py [port]   (既定は 3720)

- 標準ライブラリだけで動く。セッションとお気に入りは SQLite (data/devfest.sqlite) に持つ。
  DB がなければ起動時に作り、data/seed.json を入れる
- 利用者は cookie (devfest_user) の匿名の id で見分ける。初めてのリクエストで発行する
- GET /sessions.json: DB のセッションを返す (session-item.js が JSON modules で読む)
- GET / PUT /api/favorites: 利用者のお気に入り (セッションの id の配列、並びがお気に入りの順番)
- POST /api/feedback: セッションの感想 (feedback/ のフォーム) を保存し、そのセッションの件数、平均、エージェント経由の件数を返す
- GET /api/countdown: saku の登壇が終わるまでの残り時間を、1 秒ごとに <template for="countdown"> の HTML で送り続ける。
  ページの JS は fetch の body を streamAppendHTMLUnsafe() につなぐだけ (2 章の Declarative Partial Updates)
- GET /favs/: お気に入り。HTML のボード (<main>) の終わりまでをすぐ送り、DB を読んでからカードの HTML を作って
  <template for="board-cards"> で送る (2 章の Out-of-Order Streaming)。DB の読み取りは一瞬なので、
  STREAM_DELAY_SECONDS だけ待ってから読み、DB や API の待ち時間の代わりにする
- GET /timetable/、/favs/、/session/ に X-Partial: page が付いていたら、ページの中身だけを <template for="page"> で返す。
  同じ文書のままページを切り替える shared/router.js が、これを streamAppendHTMLUnsafe() で差し込む (2 章の Platform Driven SPA)。
  favs は中身 (スケルトン) をすぐ送り、そのあとカードを <template for="board-cards"> で送る
- 編集をすぐ反映させるため、全レスポンスに Cache-Control: no-store を付ける
"""

import html
import json
import re
import secrets
import sqlite3
import sys
import time
from contextlib import closing
from datetime import datetime
from functools import partial
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "devfest.sqlite"
SEED_PATH = ROOT / "data" / "seed.json"
# ボード (スケルトンと <?start name="board-cards">〜<?end> を持つ <main>) の終わり。ここまでを先に送る。
# コメントではなく要素の終わりで分けるので、HTML のコメントを書き換えても壊れない
STREAM_SPLIT = b"</main>"
STREAM_DELAY_SECONDS = 3
# SPA の差し替えで返すページ (パス → ページのディレクトリ)。差し替える範囲は <?start name="page"> から最後の <?end> まで
SPA_PAGES = {"/timetable/": "timetable", "/favs/": "favs", "/session/": "session"}
PAGE_START = b'<?start name="page">'
PAGE_END = b"<?end>"
COOKIE = "devfest_user"
USER_ID = re.compile(r"^[0-9a-f]{32}$")
MAX_BODY_BYTES = 10_000
# 感想フォーム (feedback/index.html) の選択肢と、自由記述の上限
FEEDBACK_CHOICES = {
    "liked": {"content", "delivery", "slides", "demo"},
    "missed": {"too_hard", "too_easy", "hard_to_hear", "too_short"},
}
LIKED_DEMOS = {"timetable", "favorites", "feedback"}
FEEDBACK_TEXTS = ("hard_part", "question", "comment")
MAX_TEXT_LENGTH = 1000
# saku の登壇 (session-11、Track C 13:50〜14:15) の終わり
TALK_END = datetime(2026, 10, 18, 14, 15, tzinfo=ZoneInfo("Asia/Tokyo"))

SCHEMA = """
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  track TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  kind TEXT,
  lang TEXT,
  title TEXT NOT NULL,
  title_lang TEXT,
  format TEXT,
  description TEXT,
  description_lang TEXT
);
CREATE TABLE speakers (
  session_id TEXT NOT NULL REFERENCES sessions (id),
  position INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_lang TEXT,
  affiliation TEXT,
  affiliation_lang TEXT,
  image TEXT,
  PRIMARY KEY (session_id, position)
);
CREATE TABLE favorites (
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions (id),
  position INTEGER NOT NULL,
  PRIMARY KEY (user_id, session_id)
);
"""
# 感想は後から足したテーブルなので、既存の DB にも作る。answers は条件付きの質問と自由記述の答え (JSON)
FEEDBACK_SCHEMA = """
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions (id),
  rating INTEGER NOT NULL,
  answers TEXT NOT NULL,
  via TEXT NOT NULL,
  created_at TEXT NOT NULL
);
"""


# ---- DB ----


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """DB にテーブルがなければ作り、seed を入れる。あれば seed は入れない (お気に入りを消さない)。
    ファイルの有無ではなくテーブルの有無で見る。serve.py の動作中に DB を消すと、
    次のリクエストで sqlite3.connect() が空のファイルを作るため"""
    with closing(connect()) as conn:
        exists = conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'sessions'"
        ).fetchone()
    if not exists:
        seed = json.loads(SEED_PATH.read_text(encoding="utf-8"))
        with closing(connect()) as conn, conn:
            conn.executescript(SCHEMA)
            for s in seed:
                conn.execute(
                    "INSERT INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (s["id"], s["track"], s["start"], s["end"], s["kind"], s["lang"], s["title"],
                     s["titleLang"], s["format"], s["description"], s["descriptionLang"]),
                )
                for position, p in enumerate(s["speakers"]):
                    conn.execute(
                        "INSERT INTO speakers VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (s["id"], position, p["name"], p["nameLang"], p["affiliation"],
                         p["affiliationLang"], p["image"]),
                    )
        print(f"Created {DB_PATH.relative_to(ROOT)} from {SEED_PATH.relative_to(ROOT)}")
    with closing(connect()) as conn, conn:
        conn.executescript(FEEDBACK_SCHEMA)


def load_sessions(conn, ids=None):
    """セッションを seed.json と同じ形の dict で返す。ids を渡すと、その順番でそのセッションだけ返す"""
    rows = {r["id"]: r for r in conn.execute("SELECT * FROM sessions ORDER BY id")}
    speakers = {}
    for p in conn.execute("SELECT * FROM speakers ORDER BY session_id, position"):
        speakers.setdefault(p["session_id"], []).append({
            "name": p["name"],
            "nameLang": p["name_lang"],
            "affiliation": p["affiliation"],
            "affiliationLang": p["affiliation_lang"],
            "image": p["image"],
        })
    return [
        {
            "id": r["id"],
            "track": r["track"],
            "start": r["start_time"],
            "end": r["end_time"],
            "kind": r["kind"],
            "lang": r["lang"],
            "title": r["title"],
            "titleLang": r["title_lang"],
            "format": r["format"],
            "speakers": speakers.get(r["id"], []),
            "description": r["description"],
            "descriptionLang": r["description_lang"],
        }
        for r in (rows[i] for i in (ids if ids is not None else rows))
    ]


def load_favorites(conn, user_id):
    return [
        r["session_id"]
        for r in conn.execute(
            "SELECT session_id FROM favorites WHERE user_id = ? ORDER BY position", (user_id,)
        )
    ]


def save_favorites(conn, user_id, ids):
    with conn:
        conn.execute("DELETE FROM favorites WHERE user_id = ?", (user_id,))
        conn.executemany(
            "INSERT INTO favorites VALUES (?, ?, ?)",
            [(user_id, session_id, position) for position, session_id in enumerate(ids)],
        )


def validate_feedback(data, known):
    """感想を検証し、(session_id, rating, answers, via) を返す。不正なら ValueError。
    条件付きの質問は feedback/feedback.js の CONDITIONS と同じ条件で、条件を満たさない答えを受け付けない。
    ただし question の条件 (has_question) は、フォームが has_question を送らないので確かめられない"""
    if not isinstance(data, dict):
        raise ValueError("body must be a JSON object")
    unknown = set(data) - {"session", "rating", "via", "liked", "liked_demo", "missed", *FEEDBACK_TEXTS}
    if unknown:
        # キーは利用者が送ったものなので、UTF-8 にできない文字 (単独の surrogate) を含んでも返せるよう、ASCII でエスケープする
        raise ValueError(f"unknown fields: {json.dumps(sorted(unknown))}")
    if not isinstance(data.get("session"), str) or data["session"] not in known:
        raise ValueError("session must be a known session id")
    rating = data.get("rating")
    # bool は int の一種なので、type で比べて true / false を弾く
    if type(rating) is not int or not 1 <= rating <= 5:
        raise ValueError("rating must be an integer from 1 to 5")
    if data.get("via") not in ("human", "agent"):
        raise ValueError("via must be human or agent")
    # 答えのない質問は、キーごと送らない決まり。null も不正として断る
    for name, choices in FEEDBACK_CHOICES.items():
        values = data.get(name)
        if name in data and (
            not isinstance(values, list)
            or not values
            or not all(isinstance(value, str) for value in values)
            or len(set(values)) != len(values)
            or not set(values) <= choices
        ):
            raise ValueError(f"{name} must be a non-empty list of unique values from {sorted(choices)}")
    if "liked" in data and rating < 4:
        raise ValueError("liked is only for rating 4 or 5")
    if "missed" in data and rating > 3:
        raise ValueError("missed is only for rating 1 to 3")
    if "liked_demo" in data:
        if "demo" not in data.get("liked", []):
            raise ValueError("liked_demo is only when liked includes demo")
        if not isinstance(data["liked_demo"], str) or data["liked_demo"] not in LIKED_DEMOS:
            raise ValueError(f"liked_demo must be one of {sorted(LIKED_DEMOS)}")
    for name in FEEDBACK_TEXTS:
        value = data.get(name)
        if name in data and (
            not isinstance(value, str) or not value.strip() or len(value) > MAX_TEXT_LENGTH
        ):
            raise ValueError(f"{name} must be a non-empty string of up to {MAX_TEXT_LENGTH} characters")
        # JSON の \ud800 のような単独の surrogate は、UTF-8 にできず DB に保存できない
        if name in data and not value.isascii():
            try:
                value.encode("utf-8")
            except UnicodeEncodeError:
                raise ValueError(f"{name} must be valid Unicode text") from None
    if "hard_part" in data and "too_hard" not in data.get("missed", []):
        raise ValueError("hard_part is only when missed includes too_hard")
    answers = {
        name: data[name]
        for name in ("liked", "liked_demo", "missed", *FEEDBACK_TEXTS)
        if name in data
    }
    return data["session"], rating, answers, data["via"]


def feedback_stats(conn, session_id):
    """セッションの感想の件数、平均、エージェント経由の件数。他の人の答えの中身は返さない"""
    row = conn.execute(
        "SELECT COUNT(*) AS count, AVG(rating) AS average, COALESCE(SUM(via = 'agent'), 0) AS agent"
        " FROM feedback WHERE session_id = ?",
        (session_id,),
    ).fetchone()
    average = round(row["average"], 1) if row["average"] is not None else None
    return {"count": row["count"], "average": average, "agent": row["agent"]}


# ---- お気に入りのカードの HTML (favs/session-card.js の build() と同じ形) ----


def attr(name, value):
    return f' {name}="{html.escape(value)}"' if value else ""


def render_card(s):
    e = html.escape
    sid = s["id"]
    number = sid.removeprefix("session-")
    items = []
    for index, p in enumerate(s["speakers"]):
        first = index == 0
        avatar = ""
        if p["image"]:
            avatar = (
                f'<img class="avatar"{attr("id", f"{sid}-avatar" if first else None)}'
                f' src="https://img.gdgs.jp/{e(p["image"])}?w=192&amp;h=192&amp;fit=cover&amp;q=60&amp;f=avif"'
                ' alt="" width="192" height="192">'
            )
        name_id = attr("id", f"{sid}-name" if first else None)
        if p["affiliation"]:
            # 所属があれば、名前を interest invoker のボタンにして、所属を popover="hint" で出す
            popover = f"aff-{number}-{index + 1}"
            name = (
                f'<button type="button" class="name"{name_id}{attr("lang", p["nameLang"])}'
                f' interestfor="{popover}">{e(p["name"])}</button>'
                f'<span class="affiliation" id="{popover}" popover="hint"{attr("lang", p["affiliationLang"])}>'
                f'{e(p["affiliation"])}</span>'
            )
        else:
            name = f'<span class="name"{name_id}{attr("lang", p["nameLang"])}>{e(p["name"])}</span>'
        items.append(f"<li>{avatar}{name}</li>")
    speakers = f'<ul slot="speakers" class="speakers">{"".join(items)}</ul>' if items else ""
    fmt = f'<span>{e(s["format"])}</span>' if s["format"] else ""
    return (
        f'<session-card id="{sid}" draggable="true" data-favorite=""'
        f' data-track="{e(s["track"])}">'
        f'<h2 slot="title" id="{sid}-title"{attr("lang", s["titleLang"])}>'
        f'<a class="session-link" href="../session/?id={sid}" draggable="false">{e(s["title"])}</a></h2>'
        f"{speakers}"
        f'<p slot="meta" class="meta"><span class="track">Track {e(s["track"].upper())}</span>'
        f'<span><time datetime="{e(s["start"])}">{e(s["start"])}</time>〜'
        f'<time datetime="{e(s["end"])}">{e(s["end"])}</time></span>{fmt}</p>'
        "</session-card>"
    )


# ---- HTTP ----


class DemoHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        if getattr(self, "new_user_id", None):
            self.send_header(
                "Set-Cookie",
                f"{COOKIE}={self.new_user_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000",
            )
            self.new_user_id = None
        super().end_headers()

    def user_id(self):
        """cookie の匿名の id。なければ (形が違っても) 新しく発行し、このレスポンスで Set-Cookie する"""
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        if COOKIE in cookie and USER_ID.match(cookie[COOKIE].value):
            return cookie[COOKIE].value
        self.new_user_id = secrets.token_hex(16)
        return self.new_user_id

    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlsplit(self.path).path
        user_id = self.user_id()
        if path == "/sessions.json":
            with closing(connect()) as conn:
                self.send_json(200, load_sessions(conn))
            return
        if path == "/api/favorites":
            with closing(connect()) as conn:
                self.send_json(200, load_favorites(conn, user_id))
            return
        page = SPA_PAGES.get(path.removesuffix("index.html"))
        if page and self.headers.get("X-Partial") == "page":
            self.stream_page(page, user_id)
            return
        if path in ("/favs/", "/favs/index.html"):
            self.stream_favs(user_id)
            return
        if path == "/api/countdown":
            self.stream_countdown()
            return
        super().do_GET()

    def do_PUT(self):
        path = urlsplit(self.path).path
        if path != "/api/favorites":
            self.send_json(404, {"error": "not found"})
            return
        user_id = self.user_id()
        length = int(self.headers.get("Content-Length") or 0)
        if not 0 < length <= MAX_BODY_BYTES:
            self.send_json(400, {"error": "body must be a JSON array of session ids"})
            return
        try:
            ids = json.loads(self.rfile.read(length))
        except json.JSONDecodeError:
            self.send_json(400, {"error": "body is not JSON"})
            return
        with closing(connect()) as conn:
            known = {r["id"] for r in conn.execute("SELECT id FROM sessions")}
            if (
                not isinstance(ids, list)
                or not all(isinstance(i, str) for i in ids)
                or len(set(ids)) != len(ids)
                or not set(ids) <= known
            ):
                self.send_json(400, {"error": "ids must be unique, known session ids"})
                return
            save_favorites(conn, user_id, ids)
            self.send_json(200, load_favorites(conn, user_id))

    def do_POST(self):
        path = urlsplit(self.path).path
        if path != "/api/feedback":
            self.send_json(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = -1
        if not 0 < length <= MAX_BODY_BYTES:
            self.send_json(400, {"error": "body must be a JSON object of feedback"})
            return
        try:
            data = json.loads(self.rfile.read(length))
        # JSONDecodeError に加え、UTF-8 でない body (UnicodeDecodeError) と桁の多すぎる整数も ValueError になる
        except ValueError:
            self.send_json(400, {"error": "body is not JSON"})
            return
        with closing(connect()) as conn:
            known = {r["id"] for r in conn.execute("SELECT id FROM sessions")}
            try:
                session_id, rating, answers, via = validate_feedback(data, known)
            except ValueError as error:
                self.send_json(400, {"error": str(error)})
                return
            with conn:
                conn.execute(
                    "INSERT INTO feedback (session_id, rating, answers, via, created_at) VALUES (?, ?, ?, ?, ?)",
                    (session_id, rating, json.dumps(answers, ensure_ascii=False), via,
                     datetime.now(TALK_END.tzinfo).isoformat()),
                )
            self.send_json(200, feedback_stats(conn, session_id))

    def stream_countdown(self):
        """1 秒ごとに残り時間の <template for="countdown"> を送る。登壇の終わりを過ぎるか、ページが閉じられたら終わる。
        差し替えると <?start>〜<?end> の目印ごと置き換わるので、次の回のために中身にも目印を入れる"""
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True
        try:
            while True:
                now = datetime.now(TALK_END.tzinfo)
                text = html.escape(countdown_text(now))
                self.wfile.write(
                    f'<template for="countdown"><?start name="countdown">{text}<?end></template>'.encode("utf-8")
                )
                self.wfile.flush()
                if not text:
                    return
                # 次の秒の変わり目に合わせて送る
                time.sleep(1 - now.microsecond / 1_000_000)
        except (BrokenPipeError, ConnectionResetError):
            # ページを閉じた、ほかのページへ移ったなど。送り続ける相手がいないので終わる
            return

    def stream_page(self, page, user_id):
        """ページの中身を <template for="page"> で返す。次の切り替えのために、中身にも目印 (<?start name="page">〜<?end>) を入れる"""
        body = (ROOT / page / "index.html").read_bytes()
        # 範囲の中にもカードや残り時間の <?end> があるので、最後の <?end> で切る
        start = body.find(PAGE_START)
        end = body.rfind(PAGE_END)
        if start == -1 or end < start:
            self.send_error(500, f'<?start name="page"> or <?end> not found in {page}/index.html')
            return
        content = body[start:end + len(PAGE_END)]
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        # 部分の応答であることを router.js に伝える (これがない応答は、完全な文書として読み込み直される)
        self.send_header("X-Partial", "page")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True
        try:
            self.wfile.write(b'<template for="page">' + content + b"</template>")
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return
        if page != "favs":
            return
        # 全部のページを読み込むときと同じく、待ってからカードを送る。この間、差し込んだスケルトンが見えている
        time.sleep(STREAM_DELAY_SECONDS)
        with closing(connect()) as conn:
            cards = "".join(render_card(s) for s in load_sessions(conn, load_favorites(conn, user_id)))
        try:
            self.wfile.write(f'\n<template for="board-cards">{cards}</template>'.encode("utf-8"))
        except (BrokenPipeError, ConnectionResetError):
            # カードが届く前に別のページへ移った (router.js が流し込みを止めた)
            return

    def stream_favs(self, user_id):
        body = (ROOT / "favs" / "index.html").read_bytes()
        head, sep, tail = body.partition(STREAM_SPLIT)
        if not sep:
            self.send_error(500, "</main> not found in favs/index.html")
            return
        head += sep
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True
        try:
            self.wfile.write(head)
            self.wfile.flush()
            # DB や API の待ち時間の代わり。この間、ブラウザは前半 (スケルトン) を描画している
            time.sleep(STREAM_DELAY_SECONDS)
            with closing(connect()) as conn:
                cards = "".join(render_card(s) for s in load_sessions(conn, load_favorites(conn, user_id)))
            self.wfile.write(f'\n<template for="board-cards">{cards}</template>'.encode("utf-8"))
            self.wfile.write(tail)
        except (BrokenPipeError, ConnectionResetError):
            # カードが届く前にページを閉じた、ほかのページへ移ったなど
            return


def countdown_text(now):
    """saku の登壇が終わるまでの残り時間の文言。Intl.DurationFormat (ja、long) と同じ「10 日 17 時間 50 分 30 秒」の形にする"""
    seconds = int((TALK_END - now).total_seconds())
    if seconds <= 0:
        return ""
    days, rest = divmod(seconds, 86400)
    hours, rest = divmod(rest, 3600)
    minutes, seconds = divmod(rest, 60)
    parts = [(days, "日"), (hours, "時間"), (minutes, "分"), (seconds, "秒")]
    return "登壇終了まで あと " + " ".join(f"{value} {unit}" for value, unit in parts if value)


def main():
    init_db()
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3720
    handler = partial(DemoHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/")
        server.serve_forever()


if __name__ == "__main__":
    main()
