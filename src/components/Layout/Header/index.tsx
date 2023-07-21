import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();
  const userName = session.data?.user.name ?? "Unknown";
  const handleSignOut = () => void signOut({ callbackUrl: "/" });

  return (
    <header className="navbar bg-base-100 px-4 shadow-md sm:px-[54px]">
      <div className="flex-1">
        <Link href="/#" className="btn btn-ghost btn-sm text-xl normal-case">
          Simple Note
        </Link>
      </div>
      <div className="flex-none gap-2">
        {session.data ? (
          <div className="dropdown-end dropdown">
            {session.data?.user.image ? (
              <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <Image
                    src={session.data?.user.image}
                    width={80}
                    height={80}
                    alt="프로필사진"
                    className="bg-primary"
                  />
                </div>
              </label>
            ) : session.status === "authenticated" ? (
              <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-2xl text-white">
                    {userName?.slice(0, 1)}
                  </div>
                </div>
              </label>
            ) : null}
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-4 shadow"
            >
              <li className="p-2">안녕하세요, {userName}님!</li>
              <li>
                <Link href="/setting/printer">🖨️ | 프린터 설정하기</Link>
              </li>
              <li>
                <button onClick={handleSignOut}>👋 | 로그아웃하기</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-ghost btn-sm">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
