import dayjs from "dayjs";
import { type InferGetServerSidePropsType } from "next";

import AdminLayout from "@/components/admin/Layout";
import { prisma } from "@/server/db";

type AdminUsersProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function AdminErrorLogs({ errors }: AdminUsersProps) {
  return (
    <AdminLayout className="w-full overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>발생시간</th>
            <th>오류 메시지</th>
            <th>메타데이터</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error) => (
            <tr key={error.id}>
              <td>{error.id}</td>
              <td>{dayjs(error.createdAt).format("YYYY-MM-DD hh:mm:ss")}</td>
              <td className="whitespace-nowrap">{error.message}</td>
              <td className="whitespace-pre-line">{error.meta}</td>
              <td>{error.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const errors = (
    await prisma.log.findMany({
      where: {
        level: "error",
        ip: {
          notIn: ["127.0.0.1"],
        },
      },
      orderBy: {
        id: "asc",
      },
    })
  ).map((error) => ({
    ...error,
    createdAt: error.createdAt.toString(),
  }));

  return {
    props: {
      errors,
    },
  };
}
