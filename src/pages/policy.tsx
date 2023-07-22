import dynamic from "next/dynamic";
import Head from "next/head";

import Policy from "@/docs/policy.mdx";

const Layout = dynamic(() => import("@/components/Layout"));

export default function PolicyPage() {
  return (
    <>
      <Head>
        <title>개인정보 처리방침 - nabi-simple-note</title>
      </Head>
      <Layout>
        <div className="prose max-w-none prose-p:m-0 prose-li:m-0">
          <Policy />
        </div>
      </Layout>
    </>
  );
}
