import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense, useMemo } from "react";
import { FaTimes } from "react-icons/fa";

import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import Error from "@/components/Error";
import { useSavedTabList } from "@/components/TabList/hooks/useSavedTabList";
import { type Tab } from "@/types/Tab";
import { api } from "@/utils/api";

const Layout = dynamic(() => import("@/components/Layout"));

const Viewer = dynamic(() => import("@/components/blocknote/Viewer"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export default function Notes() {
  const { isLoading, tabList, setTab, removeTab, currentTab } =
    useSavedTabList();
  const { data: article } = api.article.getArticle.useQuery(
    {
      tabId: currentTab?.id,
    },
    {
      enabled: !!currentTab?.id,
    }
  );
  const { data: meta } = api.article.meta.useQuery(
    {
      tabId: currentTab?.id,
    },
    {
      enabled: !!currentTab?.id,
    }
  );

  const groupedTabList = useMemo(() => {
    const grouped = tabList.reduce<Record<string, Tab[]>>((acc, tab) => {
      const newAcc = { ...acc };

      const key = dayjs(tab.createdAt).format("YYYY-MM");
      if (!newAcc[key]) {
        newAcc[key] = [];
      }
      newAcc[key]?.push(tab);

      return newAcc;
    }, {});
    return Object.entries(grouped);
  }, [tabList]);

  if (!tabList.length && !isLoading) {
    return <Error title="저장된 탭이 없어요." />;
  }

  return (
    <>
      <Head>
        <title>
          {(currentTab?.title ?? "Loading") + " - nabi-simple-note"}
        </title>
      </Head>
      <Layout>
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="w-full md:w-auto md:py-[3px]">
            <ul className="menu menu-sm p-0">
              <li className="menu-title">저장된 글들</li>
              {groupedTabList.map(([date, tabs]) => (
                <li key={date}>
                  <details>
                    <summary>{date}</summary>
                    <ul>
                      {tabs.map((tab) => (
                        <li role="button" onClick={setTab(tab.id)} key={tab.id}>
                          <span className="flex justify-between">
                            {tab.title}

                            <button onClick={removeTab(tab.id)}>
                              <FaTimes />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            {isLoading || !article ? (
              <EditorSkeleton />
            ) : (
              <Suspense fallback={<EditorSkeleton />}>
                <div className="grid gap-2 px-3 md:px-0 md:py-4">
                  <header>
                    <h2 className="text-lg font-bold">{currentTab.title}</h2>
                    <time className="text-xs">
                      생성일 : {dayjs(meta?.createdAt).format("YYYY-MM-DD")}
                    </time>
                  </header>
                  <Viewer initialContent={article} />
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
