#!/usr/bin/env python3
"""DevFest Kwansai 2026 demo のローカル配信 (登壇本番とリハーサル用)。

使い方: python3 serve.py [port]   (既定は 3720)

- 標準ライブラリだけで動く。会場のネットワークに頼らない
- 編集をすぐ反映させるため、全レスポンスに Cache-Control: no-store を付ける
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class DemoHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3720
    handler = partial(DemoHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/")
        server.serve_forever()


if __name__ == "__main__":
    main()
