import dynamic from "next/dynamic";

import Policy from "@/docs/policy.mdx";

const Layout = dynamic(() => import("@/components/Layout"));

export default function PolicyPage() {
  return (
    <Layout>
      <div className="prose max-w-none prose-p:m-0 prose-li:m-0">
        <Policy />
      </div>
    </Layout>
  );
}
