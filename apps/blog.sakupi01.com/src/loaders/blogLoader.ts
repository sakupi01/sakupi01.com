import { execFileSync } from "node:child_process";
import { glob, type Loader } from "astro/loaders";

// git log の --grep は複数指定すると OR になる
const UPDATE_COMMIT_PATTERNS = ["^up:", "^\\[up\\]"];

function git(args: string[]) {
  return execFileSync("git", args, {
    encoding: "utf-8",
    env: { ...process.env, TZ: "Asia/Tokyo" },
  }).trim();
}

// frontmatter の YAML 日付と同じく、JST の日付を UTC 0 時の Date にそろえる
const toDate = (ymd: string) => new Date(ymd);

// 新しい順
function updateCommitDates(filePath: string) {
  const out = git([
    "log",
    "--follow",
    ...UPDATE_COMMIT_PATTERNS.map((pattern) => `--grep=${pattern}`),
    "--date=format-local:%Y-%m-%d",
    "--format=%ad",
    "--",
    filePath,
  ]);
  return out ? out.split("\n").map(toDate) : [];
}

function today() {
  return toDate(
    new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(
      new Date()
    )
  );
}

/**
 * frontmatter で省略された値を補完する glob ローダー
 * - category: パスの先頭ディレクトリ
 * - date: `up:` か `[up]` で始まるコミットのうち最初のもの
 * - update: `up:` か `[up]` で始まるコミットのうち最後のもの
 */
export function blogLoader(options: Parameters<typeof glob>[0]): Loader {
  const base = glob(options);
  return {
    name: "blog-loader",
    load: async (context) => {
      if (git(["rev-parse", "--is-shallow-repository"]) === "true") {
        context.logger.warn(
          "shallow clone のため、`up:` コミットから算出する date / update が不正確になる可能性があります"
        );
      }
      return base.load({
        ...context,
        parseData: ({ id, data, filePath }) => {
          const needsGit = data.date == null || data.update == null;
          const dates = needsGit && filePath ? updateCommitDates(filePath) : [];
          const date = data.date ?? dates.at(-1) ?? today();
          return context.parseData({
            id,
            filePath,
            data: {
              ...data,
              category: data.category ?? id.split("/")[0],
              date,
              update: data.update ?? dates[0] ?? date,
            },
          });
        },
      });
    },
  };
}
