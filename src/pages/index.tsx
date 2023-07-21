import Layout from "@/components/Layout";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <section id="hero" className="hero h-1/2 min-h-[500px] flex justify-center items-center">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="mb-4 text-center text-4xl font-bold">Simple Note</h1>
            <p className="mb-8 text-center">
              (아마도) 세상에서 제일 간단한 노트 앱
            </p>
            <Link href="/login" className="btn btn-primary btn-sm">
              시작하기
            </Link>
          </div>
        </div>
      </section>
      <section id="introduce" className="mb-8">
        <div className="container mx-auto">
          <h1 className="mb-2 text-2xl font-bold">
            📝 간단한 메모앱을 만나보세요
          </h1>
          <p className="mb-4 leading-8">
            심플노트는 아주 간단하게 사용할 수 있는 웹 기반의 메모 앱입니다.
            <br />
            당신이 어디에 있든 어떤 기기를 사용하든 인터넷만 연결되어 있다면
            사용할 수 있습니다.
            <br />
            광고도, 가격 정책도, 복잡한 회원가입도 없습니다.
            <br />
            시작하기 버튼을 누르고 (아마도) 세상에서 간단한 노트 앱을
            만나보세요.
          </p>
        </div>
      </section>
      <section id="introduce" className="mb-8">
        <div className="container mx-auto mb-2">
          <h1 className="mb-2 text-2xl font-bold">
            🔨 원한다면, 직접 돌릴수도 있습니다.
          </h1>
          <p className="mb-4 leading-8">
            이 프로젝트는 누구나 볼 수 있는 오픈소스로 관리됩니다.
            <br />
            그렇기 때문에, 당신이 원한다면 직접 서버를 구축하여 사용할 수도
            있습니다.
            <br />
            메모를 보다 더 안전하게 보관하고 싶다면 사용 설명서를 적어두었으니
            한번 읽어보세요!
            <br />
            <span className="text-xs">
              만약 좋은 아이디어를 가지고 있다면 이 프로젝트에 기여해주세요!
            </span>
          </p>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/nabi-chan/simple-note"
            className="btn btn-secondary btn-sm"
          >
            레포지토리 보기
          </Link>
        </div>
      </section>
      <section id="support-feature" className="mb-8">
        <div className="container mx-auto mb-2">
          <h1 className="mb-2 text-2xl font-bold">
            🎒 이런 기술들을 사용했습니다
          </h1>
          <ul className="mb-4 list-inside list-disc leading-8">
            <li>NextJS 13</li>
            <li>tRPC</li>
            <li>Prisma</li>
            <li>next-auth</li>
            <li>blocknote</li>
          </ul>
        </div>
      </section>
      <section id="support-feature" className="mb-8">
        <div className="container mx-auto mb-2">
          <h1 className="mb-2 text-2xl font-bold">🌱 이런 기능들이 있습니다</h1>
          <ul className="mb-4 list-inside list-disc leading-8">
            <li>클라우드 기반의 노트 CRUD</li>
            <li>GitHub 기반의 oAuth 인증</li>
            <li>(영수증) 프린터 인쇄 기능</li>
            <li>웹사이트 공유 기능</li>
          </ul>
        </div>
      </section>
      <section id="support-feature" className="mb-8">
        <div className="container mx-auto mb-2">
          <h1 className="mb-2 text-2xl font-bold">
            🚀 이런 기능들이 곧 추가됩니다
          </h1>
          <ul className="mb-4 list-inside list-disc leading-8">
            <li>이미지 / QR코드 / 바코드 블럭</li>
            <li>이메일 / 구글 로그인</li>
            <li>프린터 인쇄 기능</li>
            <li>오프라인 모드 지원</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, {});

  if (session?.user) {
    return {
      redirect: {
        destination: "/notes",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
