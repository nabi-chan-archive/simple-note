import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { type ReactNode } from "react";

import NotFound from "@/pages/404";

type AdminLayoutProps = {
  className?: string;
  children: ReactNode;
};

export default function AdminLayout({ children, className }: AdminLayoutProps) {
  const { data } = useSession();

  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="navbar sticky top-0 bg-white shadow-md">
        <div className="flex-1">
          <Link className="btn btn-ghost btn-sm text-xl" href="/">
            Simple Note Admin
          </Link>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-ghost btn-sm capitalize"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="w-56 shadow-lg">
          <ul className="menu menu-sm rounded-none">
            <li>
              <h2 className="menu-title">유저 관리</h2>
              <ul>
                <li>
                  <Link href="/admin/users">유저 리스트</Link>
                </li>
                <li>
                  <Link href="/admin/admins">어드민 리스트</Link>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="menu-title">서비스 관리</h2>
              <ul>
                <li>
                  <Link href="/admin/error-logs">에러 로그</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <main className="flex-1 overflow-x-hidden p-4">
          <div className={className}>{children}</div>
        </main>
      </div>
    </div>
  );
}
