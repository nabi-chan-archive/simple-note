import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";

import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import { useTabList } from "@/components/TabList/hooks/useTabList";
import TabListSkeleton from "@/components/TabList/Skeleton";

const Layout = dynamic(() => import("@/components/Layout"));

const TabList = dynamic(() => import("@/components/TabList"), {
  loading: () => <TabListSkeleton />,
});
const Editor = dynamic(() => import("@/components/blocknote/Editor"), {
  loading: () => <EditorSkeleton />,
});

export default function Notes() {
  const { isLoading, tabList, newTab, removeTab, setTab, currentTab } =
    useTabList();

  return (
    <>
      <Head>
        <title>
          {(currentTab?.title ?? "Loading") + " - nabi-simple-note"}
        </title>
      </Head>
      <Layout>
        {isLoading ? (
          <TabListSkeleton />
        ) : (
          <TabList
            tabList={tabList}
            newTab={newTab}
            removeTab={removeTab}
            setTab={setTab}
          />
        )}
        {isLoading ? (
          <EditorSkeleton />
        ) : (
          <Suspense fallback={<EditorSkeleton />}>
            <Editor currentTab={currentTab} />
          </Suspense>
        )}
      </Layout>
    </>
  );
}
