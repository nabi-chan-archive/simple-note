import Layout from "@/components/Layout";
import Policy from "@/docs/policy.mdx";

export default function PolicyPage() {
  return (
    <Layout>
      <div className="prose max-w-none prose-p:m-0 prose-li:m-0">
        <Policy />
      </div>
    </Layout>
  );
}
