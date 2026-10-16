// Builds a CodePen prefill from this page's raw source (not the live DOM, which the patches have already mutated).
// Lines containing `data-codepen-exclude` are dropped from the pen.
const ORIGIN = "https://studio.sakupi01.com";

function absolutize(markup) {
  const base = new URL(location.pathname, ORIGIN);
  return markup.replace(
    /\b(src|href)="(\.{1,2}\/[^"]*)"/g,
    (_, attr, path) => `${attr}="${new URL(path, base)}"`
  );
}

function between(source, open, close) {
  const start = source.search(open);
  const end = source.search(close);
  if (start === -1 || end === -1) return "";
  return source.slice(source.indexOf(">", start) + 1, end);
}

function dedent(text) {
  const lines = text.replace(/^(\s*\n)+|\s+$/g, "").split("\n");
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^ */)[0].length)
  );
  return lines.map((line) => line.slice(indent)).join("\n");
}

function buildPen(source) {
  const kept = source
    .split("\n")
    .filter((line) => !line.includes("data-codepen-exclude"))
    .join("\n");

  const styleRe = /<style>([\s\S]*?)<\/style>/g;
  const css = [...kept.matchAll(styleRe)]
    .map((match) => dedent(match[1]))
    .join("\n\n");

  const head = dedent(
    between(kept, /<head>/, /<\/head>/)
      .replace(styleRe, "")
      .replace(/<meta (charset|name="viewport")[^>]*>/g, "")
  );

  let body = between(kept, /<body>/, /<\/body>/);
  let js = "";
  const trailing = body.match(
    /^[ \t]*<script>\n(?![\s\S]*^[ \t]*<script>$)([\s\S]*)^[ \t]*<\/script>\s*$/m
  );
  if (trailing) {
    js = trailing[1];
    body = body.slice(0, trailing.index);
  }

  return {
    title: document.title.replace(/ \| studio\.sakupi01\.com$/, ""),
    description: `From ${ORIGIN}${location.pathname}`,
    head: absolutize(head),
    html: absolutize(dedent(body)),
    css,
    js: dedent(js),
    editors: "101",
  };
}

const form = document.createElement("form");
form.action = "https://codepen.io/pen/define";
form.method = "POST";
form.target = "_blank";
const data = document.createElement("input");
data.type = "hidden";
data.name = "data";
const button = document.createElement("button");
button.type = "submit";
button.textContent = "Open in CodePen";
form.append(data, button);

form.addEventListener("submit", async (event) => {
  if (data.value) return;
  event.preventDefault();
  const source = await (
    await fetch(location.href, { cache: "no-store" })
  ).text();
  data.value = JSON.stringify(buildPen(source));
  form.submit();
});

document.body.prepend(form);
