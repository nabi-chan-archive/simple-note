import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getToken } from "next-auth/jwt";
import { useTabList } from "@/hooks/useTabList";
import Header from "@/components/Header";
import TabListSkeleton from "@/components/TabList/Skeleton";
import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const TabList = dynamic(() => import("@/components/TabList"), {
  loading: () => <TabListSkeleton />,
});
const Editor = dynamic(() => import("@/components/blocknote/Editor"), {
  loading: () => <EditorSkeleton />,
});

export default function Home({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
    <>
      <Header token={token} />
      <main className="main mt-4 flex min-h-screen flex-col gap-2 px-[54px]">
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
            <Editor currentTabId={currentTab.id} />
          </Suspense>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken({ req: ctx.req });

  return {
    props: {
      token,
    },
  };
};
