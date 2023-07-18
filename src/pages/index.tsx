import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getToken } from "next-auth/jwt";
import TabListSkeleton from "@/components/TabList/Skeleton";
import { useTabList } from "@/hooks/useTabList";
import dynamic from "next/dynamic";
import Editor from "@/components/blocknote/Editor";
import Header from "@/components/Header";
const TabList = dynamic(() => import("@/components/TabList"), {
  loading: TabListSkeleton,
  ssr: false,
});

export default function Home({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabList, newTab, isCurrentTab, removeTab, setTab, currentTab } =
    useTabList();

  return (
    <div className="font-mono">
      <Header token={token} />
      <main className="main mt-4 flex min-h-screen flex-col gap-2 px-[54px]">
        <TabList
          tabList={tabList}
          newTab={newTab}
          isCurrentTab={isCurrentTab}
          removeTab={removeTab}
          setTab={setTab}
        />
        <Editor currentTabId={currentTab.id} />
      </main>
    </div>
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
