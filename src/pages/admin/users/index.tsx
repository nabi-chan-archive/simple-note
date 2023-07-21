import AdminLayout from "@/components/admin/Layout";
import { prisma } from "@/server/db";
import { type InferGetServerSidePropsType } from "next";

type AdminUsersProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function AdminUsers({ users }: AdminUsersProps) {
  return (
    <AdminLayout className="overflow-x-auto w-full">
        <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>레벨</th>
            <th>생성한 글의 개수</th>
            <th>생성한 공유의 개수</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.level}</td>
              <td>{user.article.length}</td>
              <td>{user.share.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "asc"
    },
    include: {
      article: {
        select: {
          id: true,
        },
      },
      share: {
        select: {
          id: true,
        },
      },
    },
  });

  return {
    props: {
      users,
    },
  };
}
