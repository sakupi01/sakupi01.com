import { getAllArticles } from "@/libs/getApi";
import markdownToHtml from "@/libs/markdownToHtml";
import RSS from "rss";

const HOST = "https://blog.sakupi01.com";
export async function GET() {
  const feed = new RSS({
    title: "saku's blog",
    description: "sakuの備忘録",
    site_url: "https://blog.sakupi01.com",
    feed_url: "https://blog.sakupi01.com/feed.xml",
    copyright: "sakupi01",
    language: "ja",
    pubDate: new Date().toISOString(),
    image_url: `${HOST}/icon.svg`,
  });
  const articles = getAllArticles();
  const promises = articles.map(async (article) => {
    feed.item({
      title: article.title,
      guid: `${HOST}/${article.category}/articles/${article.slug}`,
      url: `${HOST}/${article.category}/articles/${article.slug}`,
      date: article.date,
      description: await markdownToHtml(article.excerpt),
      author: "sakupi01",
      categories: article.tags.map((tag) => tag) || [],
    });
  });
  await Promise.all(promises);
  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
