import { type ReactNode } from "react";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="main mt-4 flex min-h-screen flex-col gap-4 px-[54px]">
        {children}
      </main>
    </>
  );
}
