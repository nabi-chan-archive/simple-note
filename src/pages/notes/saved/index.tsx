import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";

import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import Error from "@/components/Error";
import { useSavedTabList } from "@/components/TabList/hooks/useSavedTabList";
import TabListSkeleton from "@/components/TabList/Skeleton";
import { api } from "@/utils/api";

const Layout = dynamic(() => import("@/components/Layout"));

const TabList = dynamic(() => import("@/components/TabList"), {
  loading: () => <TabListSkeleton />,
});
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
        <div className="flex items-start gap-8">
          <div className="py-[3px]">
            <ul className="menu menu-sm w-48">
              <li className="menu-title">저장된 글들</li>
              {tabList.map((tab) => (
                <li key={tab.id}>
                  <button>{tab.title}</button>
                </li>
              ))}
            </ul>
          </div>
          {isLoading || !article ? (
            <EditorSkeleton />
          ) : (
            <Suspense fallback={<EditorSkeleton />}>
              <div className="grid gap-2 py-4">
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
      </Layout>
    </>
  );
}
