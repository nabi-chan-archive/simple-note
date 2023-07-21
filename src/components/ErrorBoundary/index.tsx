import { api } from "@/utils/api";
import { type ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../Error";

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
          <ErrorComponent
            title="오류가 발생했어요"
            resetErrorBoundary={resetErrorBoundary}
          />
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
