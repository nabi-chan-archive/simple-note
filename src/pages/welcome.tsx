import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Welcome() {
  return (
    <main className="p-4">
      <h1 className="mb-2 text-2xl font-bold">만나서 반갑습니다! 👋</h1>
      <p className="mb-4">
        긴 여정을 시작하기 전에, 다음 사항을 꼭 읽어주세요!
      </p>

      <ul className="mb-4 list-inside list-disc">
        <li>이 서비스는 토이프로젝트를 하기 위해 만들어졌습니다.</li>
        <li>
          그렇기 때문에 서비스의 완성도 또는 예상하지 못한 버그가 발생할 수
          있어요!
        </li>
        <li>만약 오류가 발생했다면, 주저없이 깃허브에 이슈를 남겨주세요!</li>
        <li>
          물론 그런 일은 없겠지만, 데이터가 유실될 수 있으니 중요한 정보는 꼭
          이중으로 백업해주세요!
        </li>
        <li>
          모든 소스코드는{" "}
          <a
            href="https://github.com/nabi-chan/simple-note"
            className="font-bold text-primary"
          >
            이 레포지토리
          </a>{" "}
          에 위치하여 있습니다!
        </li>
        <li>
          만약 영수증 프린터가 있다면, 프로필 메뉴의{" "}
          <b className="text-primary">프린터 연결하기</b> 버튼을 눌러보세요!
        </li>
      </ul>

      <div className="flex gap-2">
        <Link href="/" className="btn btn-primary btn-sm">
          네! 알겠습니다!
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn-btn-error btn btn-sm"
        >
          안녕히계세요...
        </button>
      </div>
    </main>
  );
}
