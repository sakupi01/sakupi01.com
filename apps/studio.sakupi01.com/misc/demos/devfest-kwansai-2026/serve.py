#!/usr/bin/env python3
"""DevFest Kwansai 2026 demo のローカル配信 (登壇本番とリハーサル用)。

使い方: python3 serve.py [port]   (既定は 3720)

- 標準ライブラリだけで動く。会場のネットワークに頼らない
- 編集をすぐ反映させるため、全レスポンスに Cache-Control: no-store を付ける
- /board/?slow で開くと、文書の "stream-split" の目印から後ろを遅れて送る。
  Out-of-Order Streaming (後から届く <template for> が前の <?start> を差し替える) を目で見せるため。
  公開版の studio (静的配信) では遅延なしで同じ結果になる
"""

import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parent
STREAM_SPLIT = b"<!-- stream-split"
STREAM_DELAY_SECONDS = 1.5


class DemoHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        url = urlsplit(self.path)
        if url.path in ("/board/", "/board/index.html") and "slow" in parse_qs(url.query, keep_blank_values=True):
            self.stream_board()
            return
        super().do_GET()

    def stream_board(self):
        body = (ROOT / "board" / "index.html").read_bytes()
        head, sep, tail = body.partition(STREAM_SPLIT)
        if not sep:
            self.send_error(500, "stream-split marker not found in board/index.html")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(head)
        self.wfile.flush()
        time.sleep(STREAM_DELAY_SECONDS)
        self.wfile.write(sep + tail)
        self.close_connection = True


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3720
    handler = partial(DemoHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/")
        server.serve_forever()


if __name__ == "__main__":
    main()
