import { type BlockSchema, type PartialBlock } from "@blocknote/core";
import dayjs from "dayjs";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import EditorSkeleton from "@/components/blocknote/Editor/Skeleton";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";

const Layout = dynamic(() => import("@/components/Layout"));
const NotFound = dynamic(() => import("@/components/Error"));

const Viewer = dynamic(() => import("@/components/blocknote/Viewer"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export default function ShareArticlePage({
  title,
  shareId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoading, data } = api.share.read.useQuery({
    shareId,
  });

  const initialContent = data?.article.content as PartialBlock<BlockSchema>[];

  if ((!isLoading && !data) || data?.isShareActive === false)
    return <NotFound title="페이지를 찾을 수 없어요" />;

  if (!isLoading && dayjs(data?.expiredAt).isBefore(dayjs()))
    return (
      <Layout>
        <main className="flex flex-col items-center gap-3 py-48">
          <h1 className="text-2xl font-bold">이런!</h1>
          <p>공유가 만료된 노트에요.</p>
          <Link href="/" className="btn btn-primary btn-sm mt-4">
            돌아갈래요
          </Link>
        </main>
      </Layout>
    );

  return (
    <Layout>
      <Head>
        <title>{`${title} - nabi-simple-note`}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`${title} - nabi-simple-note`}
        />
      </Head>
      <main className="px-4 pb-4 sm:mx-0">
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

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const data = await prisma.share.findFirst({
    where: {
      id: params?.shareId as string,
    },
    select: {
      id: true,
      article: {
        select: {
          tab: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      shareId: data.id,
      title: data.article.tab.title,
    },
  };
}
