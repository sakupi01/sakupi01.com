import { Card } from "@/components/card/card";
import { Form } from "@/components/form/form";
import { Input } from "@/components/form/input";
import { Heatmap } from "@/components/heatmap/heatmap";
import { SizeSelector } from "@/components/size-selector/size-selector";
import { ThemeSelector } from "@/components/theme-selector/theme-selector";
import type { ContributionCalendar } from "@/components/types";
import {
  QueryUserInfoAndContributionYearsDocument,
  QueryYearlyUserContributionsDocument,
} from "@/gql/generated/graphql";
import { error, success } from "@/types/results";
import { fetcher } from "@/utils/fetcher";
import { getStreakStats } from "@/utils/parser";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import domtoimage from "dom-to-image";
import { Check, Copy, Download, Hand } from "lucide-react";
import { useRef, useState } from "react";
import { Layout } from "./_layout";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const twitter = [
    {
      name: "twitter:image",
      content: "https://git-kusa.sakupi01.com/favicon.ico",
    },
    { name: "twitter:card", content: "summary" },
  ];
  const og = [
    {
      property: "og:image",
      content: "https://git-kusa.sakupi01.com/favicon.ico",
    },

    {
      property: "og:title",
      content: `${data?.data?.username}'s Git Kusa`,
    },
    {
      property: "og:description",
      content: `View ${data?.data?.username}'s Git Kusa`,
    },
    {
      property: "og:card",
      content: "summary",
    },
    {
      property: "og:url",
      content: `https://git-kusa.sakupi01.com/${data?.data?.username}`,
    },
  ];
  return [
    { title: `${data?.data?.username}'s GitHub Contributions` },
    {
      name: "title",
      content: `${data?.data?.username}'s GitHub Contributions`,
    },
    {
      name: "description",
      content: `View ${data?.data?.username}'s GitHub contributions`,
    },
    ...twitter,
    ...og,
  ];
};

const renderTruthyData = ({
  prefix,
  data,
  suffix,
}: {
  prefix?: string;
  data?: string | null;
  suffix?: string;
}) => {
  if (Boolean(data) === false) {
    return <></>;
  }
  return (
    <span className="bg-primary-disabled text-primary-background-text text-[0.65rem] font-medium me-2 px-2.5 py-0.5 rounded-full">
      {prefix} {data} {suffix}
    </span>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const username = body.get("username") || "";
  return redirect(`/${username}`);
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const username = params.username || "";
  const githubApiUrl = process.env.GITHUB_API_URL || "";

  try {
    const { user } = await fetcher(
      githubApiUrl,
      QueryUserInfoAndContributionYearsDocument,
      {
        username,
      },
    );

    const { contributionsCollection, ...rest } = user ?? {};

    let totalInLifetime = 0;

    const promises = contributionsCollection?.contributionYears.map(
      async (year: number): Promise<ContributionCalendar> => {
        const yearlyUserContributions = await fetcher(
          githubApiUrl,
          QueryYearlyUserContributionsDocument,
          {
            username,
            from: `${year}-01-01T00:00:00Z`,
            to: `${year}-12-31T23:59:59Z`,
          },
        );
        const weeks =
          (yearlyUserContributions?.user?.contributionsCollection.contributionCalendar?.weeks.map(
            (week) => {
              return {
                days: week.contributionDays.map((day) => {
                  return {
                    level: day.contributionLevel,
                    date: day.date,
                    contributionCount: day.contributionCount,
                  };
                }),
              };
            },
          ) ?? []) satisfies ContributionCalendar["weeks"];
        const total =
          yearlyUserContributions?.user?.contributionsCollection
            .contributionCalendar.totalContributions || 0;
        totalInLifetime += total;
        return {
          year,
          total,
          weeks,
        };
      },
    );
    if (!promises)
      return error(`Sorry, we couldn't find ${username} on GitHub.`);

    const contributions = await Promise.all(promises);
    const stats = await getStreakStats(
      contributionsCollection?.contributionYears ?? [],
      contributions.reverse(),
    );
    contributions.reverse();
    return success({
      ...rest,
      username,
      totalInLifetime,
      contributions,
      stats,
    });
  } catch {
    return error("There was an error fetching the data");
  }
};

export default function GitApp() {
  const { ok, data, message } = useLoaderData<typeof loader>();
  const [copySuccess, setCopySuccess] = useState(false);
  const [doingCopy, setDoingCopy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const username = ok ? data?.username : "";
  const contributionImageAreaRef = useRef<HTMLDivElement>(null);

  // MEMO: use `useTransition` to control suspense after upgrading to React 19
  const handleDownload = async () => {
    setDownloading(true);
    if (contributionImageAreaRef.current) {
      try {
        const dataURL = await domtoimage.toSvg(
          contributionImageAreaRef.current,
        );
        const trigger = document.createElement("a");
        trigger.href = dataURL;
        trigger.download = `${username}_contributions`;
        trigger.click();
        trigger.remove();
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
      setDownloading(false);
    }
  };

  // MEMO: use `useTransition` to control suspense after upgrading to React 19
  const handleCopyImage = async () => {
    setDoingCopy(true);
    if (contributionImageAreaRef.current) {
      try {
        const item = new ClipboardItem({
          "image/png": (async () => {
            if (!contributionImageAreaRef.current) {
              throw new Error();
            }

            const blobData = await domtoimage.toBlob(
              contributionImageAreaRef.current,
            );

            if (!blobData) {
              throw new Error();
            }

            return blobData;
          })(),
        });

        await navigator.clipboard.write([item]);

        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
      } finally {
        setDoingCopy(false);
      }
    }
  };
  if (!ok) {
    return (
      <Layout>
        <div className="w-full">
          <ThemeSelector />
          <SizeSelector />
          <Form method="post" id="search-form-result">
            <>
              <Input
                id="username"
                name="username"
                placeholder="Search by username..."
              />
              <button
                type="submit"
                className="text-primary-text absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary-hover focus:ring-2 focus:outline-none focus:ring-primary-active font-medium rounded-lg text-sm px-4 py-2 animate-bounce hover:animate-none"
              >
                Search
              </button>
            </>
          </Form>
        </div>
        <p>{message}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full px-3">
        <ThemeSelector />
        <hr className="my-4 border-gray-300 border-dashed sm:mx-auto" />
        <SizeSelector />
        <Form method="post">
          <>
            <Input
              id="username"
              name="username"
              placeholder="Search by username..."
            />
            <button
              type="submit"
              className="text-primary-text absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary-hover focus:ring-2 focus:outline-none focus:ring-primary-active font-medium rounded-lg text-sm px-4 py-2 animate-bounce hover:animate-none transition-colors"
            >
              Search
            </button>
          </>
        </Form>
      </div>

      <p>
        Reach out to{" "}
        <a
          href={data?.url}
          className="text-primary-active underline hover:text-primary-hover transition-colors"
        >
          {username} on GitHub!
        </a>
      </p>

      <div className="grid md:grid-cols-2 md:grid-rows-2 gap-2 pt-10">
        <Card
          title={`${data?.name ? data.name : username} has made a total of \n`}
          statNumber={`${data?.totalInLifetime} contributions in life!`}
          details="You've grow a lot! Keep it up!"
        />
        <Card
          // biome-ignore lint/style/noUnusedTemplateLiteral: As I need to use template literals
          title={`First contribution was made on \n`}
          statNumber={data?.stats?.firstContribution ?? "N/A"}
          details="Your GitHub journey has started here!"
        />
        <Card
          title="Longest Streak is "
          statNumber={`${data?.stats?.longestStreak.days} ${
            data?.stats?.longestStreak.days === 1 ? "day" : "days"
          }`}
          details={`started on ${data?.stats?.longestStreak.start}\nended on ${data?.stats?.longestStreak.end}`}
        />
        <Card
          title="Current Streak is "
          statNumber={`${data?.stats?.currentStreak.days} ${
            data?.stats?.currentStreak.days === 1 ? "day" : "days"
          }`}
          details={`started on ${data?.stats?.currentStreak.start}\nended on ${data?.stats?.currentStreak.end}`}
        />
      </div>

      <div className="w-full py-10">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl text-base-text">
              {data?.name ? data.name : username}'s Contributions{" "}
            </h2>
            <img className="w-10 h-10" src={"/favicon.ico"} alt="Kusabocado" />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className={
                "text-primary-text end-2.5 bottom-2.5 bg-primary hover:bg-primary-hover focus:ring-2 focus:outline-none focus:ring-primary-active font-medium rounded-lg text-sm px-4 py-2"
              }
            >
              <a
                href={`https://x.com/intent/post?text=${username}has%20${data?.totalInLifetime}%20Kusas%20in%20life%20time!%20%7C%20&url=https%3A%2F%2Fgit-kusa.vercel.app/${username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share!
              </a>
            </button>

            <button
              type="button"
              className={clsx(
                "text-primary-text end-2.5 bottom-2.5 bg-primary hover:bg-primary-hover focus:ring-2 focus:outline-none focus:ring-primary-active font-medium rounded-lg text-sm px-2 py-2 transition-colors",
                {
                  "animate-pulse ": downloading,
                },
              )}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? <Hand size={15} /> : <Download size={15} />}
            </button>

            <button
              type="button"
              className={clsx(
                "text-primary-text end-2.5 bottom-2.5 bg-primary hover:bg-primary-hover focus:ring-2 focus:outline-none focus:ring-primary-active font-medium rounded-lg text-sm px-2 py-2 transition-colors",
                {
                  "animate-pulse ": doingCopy,
                  "bg-green-300": copySuccess,
                },
              )}
              onClick={handleCopyImage}
              disabled={doingCopy}
            >
              {copySuccess ? (
                <Check size={15} />
              ) : doingCopy ? (
                <Hand size={15} />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-300 sm:mx-auto lg:my-8" />

        <div id="calendar-graph">
          <div className="overflow-auto md:overflow-visible transition-all duration-200">
            <div
              ref={contributionImageAreaRef}
              className="w-main-width bg-primary-background"
            >
              <div className="flex items-center gap-3 py-3 px-1">
                <img
                  className="w-10 h-10 p-1 rounded-full ring-1 ring-gray-300 "
                  src={data?.avatarUrl}
                  alt="Rounded avatar"
                />
                <h2 className="text-lg text-primary-background-text">
                  Hello, It's {data?.name ? data.name : username}!
                </h2>
              </div>
              <div className="text-primary-background-text">
                {data?.bio ? <p className="pb-3">{data.bio} </p> : ""}
                {data?.username ? (
                  <p className="text-sm pb-2">id: {data.username} </p>
                ) : (
                  ""
                )}
                {renderTruthyData({
                  data: data?.email,
                  prefix: "📧",
                })}
                {renderTruthyData({
                  data: data?.company,
                  prefix: "💼",
                })}
                {renderTruthyData({
                  data: data?.twitterUsername,
                  prefix: "@",
                })}
                {renderTruthyData({
                  data: data?.followers?.totalCount.toString(),
                  suffix: "followers",
                })}
              </div>
              <div className="flex flex-col gap-8 mt-7">
                {data?.contributions.map((annualData) => (
                  <Heatmap key={annualData.year} data={annualData} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
