import Layout from "@/components/Layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <main className="flex flex-col items-center gap-3 py-48">
        <h1 className="text-2xl font-bold">이런!</h1>
        <p>페이지를 찾을 수 없어요</p>
        <Link href="/" className="btn btn-primary btn-sm mt-4">
          돌아갈래요
        </Link>
      </main>
    </Layout>
  );
}
