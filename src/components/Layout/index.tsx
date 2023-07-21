import Link from "next/link";
import { type ReactNode } from "react";

import ButtonMenu from "./ButtonMenu";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="main mt-4 flex min-h-screen flex-col gap-4 px-4 sm:px-[54px]">
        {children}
      </main>
      <footer className="px-4 py-8 sm:px-[54px]">
        <Link
          href="https://nabi.kim"
          className="link-primary link mt-4 block text-center text-xs"
        >
          Made With 💚 By Nabi
        </Link>
      </footer>
      <ButtonMenu />
    </>
  );
}
