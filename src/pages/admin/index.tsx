import AdminLayout from "@/components/admin/Layout";
import Card from "@/components/admin/Layout/dashboard/Card";
import { prisma } from "@/server/db";
import { getDiff } from "@/utils/admin";
import dayjs from "dayjs";
import { type InferGetServerSidePropsType } from "next";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({
  userTotalCount,
  todayArticleCount,
  yesterdayArticleCount,
  todayErrorCount,
  todayMostError,
}: DashboardProps) {
  const { diff: articleDiff, text: articleDiffText } = getDiff(
    todayArticleCount._count,
    yesterdayArticleCount._count
  );
  
  return (
    <AdminLayout className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card title="가입한 유저">
        <p className="text-2xl font-bold">{userTotalCount._count} 명</p>
      </Card>
      <Card title="오늘 생성된 게시물의 개수">
        <p className="text-2xl font-bold">{todayArticleCount._count} 건</p>
        <p className="text-sm font-bold text-base-content/50">
          어제보다 {Math.abs(articleDiff)}건 {articleDiffText}
        </p>
      </Card>
      <Card title="오늘 발생한 에러 건수">
        <p className="text-2xl font-bold">{todayErrorCount._count} 건</p>
      </Card>
      <Card title="오늘 가장 많이 발생한 에러">
        <p className="text-2xl font-bold">
          {todayMostError?.message ?? "없음"}
        </p>
      </Card>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const [
    userTotalCount,
    todayArticleCount,
    yesterdayArticleCount,
    todayErrorCount,
    todayError,
  ] = await prisma.$transaction([
    prisma.user.aggregate({
      where: {
        level: "User",
      },
      _count: true,
    }),
    prisma.article.aggregate({
      where: {
        owner: {
          level: "User",
        },
        createdAt: {
          gte: dayjs().startOf("day").toDate(),
        },
      },
      _count: true,
    }),
    prisma.article.aggregate({
      where: {
        owner: {
          level: "User",
        },
        createdAt: {
          lte: dayjs().subtract(1, "day").startOf("day").toDate(),
        },
      },
      _count: true,
    }),
    prisma.log.aggregate({
      where: {
        level: "error",
        createdAt: {
          gte: dayjs().startOf("day").toDate(),
        },
        ip: {
          notIn: ["127.0.0.1"],
        },
      },
      _count: true,
    }),
    prisma.log.groupBy({
      by: ["message"],
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      where: {
        level: "error",
        createdAt: {
          gte: dayjs().startOf("day").toDate(),
        },
        ip: {
          notIn: ["127.0.0.1"],
        },
      },
    }),
  ]);

  return {
    props: {
      userTotalCount,
      todayArticleCount,
      yesterdayArticleCount,
      todayErrorCount,
      todayMostError: todayError[0] ?? null,
    },
  };
}
