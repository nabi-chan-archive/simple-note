import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BiSupport } from "react-icons/bi";
import { toast } from "react-toastify";

const Layout = dynamic(() => import("@/components/Layout"));

export default function Welcome() {
  return (
    <>
      <Head>
        <title>환영합니다! - nabi-simple-note</title>
      </Head>
      <Layout>
        <h1 className="mb-2 text-2xl font-bold">처음 뵙겠습니다 👋</h1>
        <p className="mb-4">
          긴 여정을 시작하기 전에, 다음 사항을 꼭 읽어주세요!
        </p>

        <ul className="mb-4 list-inside list-disc leading-8">
          <li>이 서비스는 토이프로젝트를 하기 위해 만들어졌습니다.</li>
          <li>
            그렇기 때문에 서비스의 완성도 또는 예상하지 못한 버그가 발생할 수
            있어요!
          </li>
          <li>만약 오류가 발생했다면, 주저없이 깃허브에 이슈를 남겨주세요!</li>
          <li>
            (그럴 일은 희박하겠지만) 데이터가 유실될 수 있으니 중요한 정보는 꼭
            이중으로 백업해주세요!
          </li>
          <li>
            모든 소스코드는{" "}
            <a
              href="https://github.com/nabi-chan/simple-note"
              className="link font-bold text-primary"
            >
              이 레포지토리
            </a>{" "}
            에 위치하여 있습니다!
          </li>
          <li>
            만약 영수증 프린터가 있다면, 프로필 메뉴의{" "}
            <b className="text-primary">프린터 연결하기</b> 버튼을 눌러보세요!
          </li>
          <li>보통 재미있는 기능은 우측 하단의 햄버거 버튼에 숨겨져 있어요!</li>
          <li className="flex items-center gap-1">
            궁금하신 내용이 있다면, 햄버거 버튼을 누른 다음에
            <button
              onClick={() => toast.error("이거 말고요!")}
              className="btn btn-square btn-secondary btn-xs"
            >
              <BiSupport />
            </button>{" "}
            버튼을 눌러주세요!
          </li>
        </ul>

        <div className="flex gap-2">
          <Link href="/notes" className="btn btn-primary btn-sm">
            네! 알겠습니다!
          </Link>
          <button
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="btn-btn-error btn btn-sm"
          >
            안녕히계세요...
          </button>
        </div>
      </Layout>
    </>
  );
}
