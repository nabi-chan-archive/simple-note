import Layout from "@/components/Layout";
import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import { api } from "@/utils/api";
import { type BlockSchema, type PartialBlock } from "@blocknote/core";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";

const Viewer = dynamic(() => import("@/components/blocknote/Viewer"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export default function ShareArticlePage() {
  const {
    query: { shareId },
  } = useRouter();
  const { isLoading, data } = api.share.read.useQuery(
    {
      shareId: shareId as string,
    },
    {
      enabled: !!shareId,
    }
  );

  const initialContent = data?.article.content as PartialBlock<BlockSchema>[];

  return (
    <Layout>
      <main className="px-4 pb-4 sm:-mx-[54px] sm:mx-0">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="avatar rounded-full">
            <div className="w-12 rounded-full">
              {data?.author.image ? (
                <Image
                  src={data?.author.image}
                  width={80}
                  height={80}
                  alt="프로필사진"
                  className="bg-primary"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-2xl text-white">
                  {data?.author.name?.slice(0, 1)}
                </div>
              )}
            </div>
          </div>
          <div className="grid">
            <span>작성자 : {data?.author.name ?? "Unknown"}</span>
            <span>
              작성일 :{" "}
              {dayjs(data?.article.createdAt).format("YYYY-MM-DD hh:mm")}
            </span>
          </div>
        </header>
        <article>
          <h1 className="mb-4 text-2xl font-bold">{data?.article.tab.title}</h1>

          {isLoading ? (
            <EditorSkeleton />
          ) : (
            <Viewer initialContent={initialContent} />
          )}
        </article>
      </main>
    </Layout>
  );
}
