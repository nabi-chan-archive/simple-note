import { type ReactNode } from "react";
import Header from "./Header";
import ButtonMenu from "./ButtonMenu";
import Link from "next/link";

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
      <footer className="py-8 sm:px-[54px] px-4">
        <Link href="https://nabi.kim" className="link-primary link text-xs mt-4 text-center block">
          Made With 💚 By Nabi
        </Link>
      </footer>
      <ButtonMenu />
    </>
  );
}
