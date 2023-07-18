import { useTabList } from "@/hooks/useTabList";
import TabListSkeleton from "@/components/TabList/Skeleton";
import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Layout from "@/components/Layout";

const TabList = dynamic(() => import("@/components/TabList"), {
  loading: () => <TabListSkeleton />,
});
const Editor = dynamic(() => import("@/components/blocknote/Editor"), {
  loading: () => <EditorSkeleton />,
});

export default function Home() {
  const {
    isLoading,
    tabList,
    newTab,
    isCurrentTab,
    removeTab,
    setTab,
    currentTab,
  } = useTabList();

  return (
    <Layout>
      {isLoading ? (
        <TabListSkeleton />
      ) : (
        <TabList
          tabList={tabList}
          newTab={newTab}
          isCurrentTab={isCurrentTab}
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
  );
}
