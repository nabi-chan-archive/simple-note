import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { type JWT } from "next-auth/jwt";

type HeaderProps = {
  token: JWT | null;
};

export default function Header({ token }: HeaderProps) {
  const userName = token?.name ?? "Unknown";
  const handleSignOut = () => void signOut({ callbackUrl: "/" });

  return (
    <header className="navbar bg-base-100 px-[54px] shadow-md">
      <div className="flex-1">
        <Link href="/#" className="btn btn-ghost btn-sm text-xl normal-case">
          Simple Note
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              {token?.picture ? (
                <Image
                  src={token.picture}
                  width={80}
                  height={80}
                  alt="프로필사진"
                  className="bg-primary"
                />
              ) : (
                <span className="h-full w-full bg-primary text-2xl text-white">
                  {userName?.slice(0, 1)}
                </span>
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-4 shadow"
          >
            <li className="p-2">안녕하세요, {userName}님!</li>
            <li>
              <button onClick={handleSignOut}>👋 | 로그아웃하기</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
