import type { ArticleSchemaType } from "@/interfaces/type";
import { ImageResponse } from "next/og";
import { loadGoogleFont } from "./font";

export const generateOgImage = async (
  article: ArticleSchemaType | undefined,
  category: "dev" | "life",
) => {
  const size = {
    width: 1200,
    height: 630,
  };
  const interArrayBuffer = await loadGoogleFont({
    family: "Inter",
    weight: 600,
  });

  const notoSansArrayBuffer = await loadGoogleFont({
    family: "Noto Sans JP",
    weight: 600,
  });

  const tagWithId = article?.tags.map((tag) => {
    const id = Math.random().toString(32).substring(2);
    return {
      id: id,
      name: tag,
    };
  });

  const renderTags = tagWithId?.map((tag) => (
    <span
      tw="text-3xl p-1 font-medium rounded text-left text-[#B8A47C] hover:underline hover:bg-neutral-100 mr-3"
      key={tag.id}
    >
      {tag.name}
    </span>
  ));

  if (article) {
    return new ImageResponse(
      <div
        tw="w-full h-full p-7 flex"
        style={{
          backgroundImage: "linear-gradient(to right, #ffdede, #BAA0B5)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div tw="rounded-xl border-2 border-zinc-500 w-full h-full p-4 flex bg-zinc-50 shadow-lg">
          <div tw="w-full flex flex-col p-8 h-full justify-between">
            <div tw="flex flex-wrap gap-3 w-full">{renderTags}</div>
            <h1 tw="w-full text-7xl font-bold text-left text-zinc-700 my-6 text-pretty">
              {article.title}
            </h1>
            <div tw="flex justify-between items-end w-full text-zinc-400 text-xl">
              <div tw="flex items-center">
                <div tw="flex items-center">
                  <img
                    tw="rounded-full border-2 border-zinc-400"
                    width="90"
                    height="90"
                    src="https://blog.sakupi01.com/icon.svg"
                    alt="icon"
                  />
                  <div tw="flex items-center align-center text-4xl font-bold ml-2">
                    <span tw="text-zinc-400">🌸saku's&nbsp;</span>
                    <span tw="text-[#BAA0B5]">
                      {category === "dev" ? "Techblog" : "Lifeblog"}
                    </span>
                  </div>
                </div>
              </div>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </div>,
      {
        ...size,
        width: 1200,
        height: 630,
        debug: false,
        fonts: [
          {
            name: "interArrayBuffer",
            data: interArrayBuffer,
            style: "normal",
            weight: 600,
          },
          {
            name: "Noto Sans JP",
            data: notoSansArrayBuffer,
            style: "normal",
            weight: 600,
          },
        ],
      },
    );
  }
  return new Response("Not Found", { status: 404 });
};
