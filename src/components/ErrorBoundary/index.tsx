import { api } from "@/utils/api";
import Link from "next/link";
import { type ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

type ErrorBoundaryProps = {
  children: ReactNode;
};

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { mutate, isSuccess, isLoading } = api.log.new.useMutation();

  return (
    <ReactErrorBoundary
      fallbackRender={({ resetErrorBoundary, error }) => {
        if (!isLoading && !isSuccess) {
          if (error instanceof Error) {
            mutate({
              message: error.message,
              level: "error",
              meta: error.stack ?? "unknown stack",
            });
          } else {
            mutate({
              message: String(error),
              level: "error",
              meta: "unknown stack",
            });
          }
        }

        return (
          <main className="flex flex-col items-center gap-3 py-48">
            <h1 className="text-2xl font-bold">이런!</h1>
            <p>오류가 발생했어요</p>
            <div className="mt-4 flex gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={resetErrorBoundary}
              >
                다시 시도해볼래요
              </button>
              <Link href="/" className="btn btn-primary btn-sm">
                돌아갈래요
              </Link>
            </div>
          </main>
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
