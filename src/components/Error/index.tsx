import dynamic from "next/dynamic";
import Link from "next/link";

const Layout = dynamic(() => import("@/components/Layout"));

type ErrorProps = {
  title?: string;
  resetErrorBoundary?: () => void;
};

export default function Error({ title, resetErrorBoundary }: ErrorProps) {
  return (
    <Layout>
      <main className="flex flex-col items-center gap-3 py-48">
        <h1 className="text-2xl font-bold">이런!</h1>
        <p>{title || "오류가 발생했어요"}</p>
        <div className="mt-4 flex gap-2">
          {resetErrorBoundary && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetErrorBoundary}
            >
              다시 시도해볼래요
            </button>
          )}
          <Link href="/" className="btn btn-primary btn-sm">
            돌아갈래요
          </Link>
        </div>
      </main>
    </Layout>
  );
}
