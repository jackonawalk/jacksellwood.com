import { BlogPosts } from "app/components/posts";
import { BlogPostsChart } from "app/components/posts-chart";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Hi there 👋
      </h1>
      <p className="mb-4">
        {`I’m a curious technologist stumbling into design and minimalism. I find joy in tidying up technology. Cooking with friends, long walks, and yoga help me find purpose. Streamlining life helps me stay focused on these priorities. A minimal wardrobe, few possessions, and unstructured time help me feel grounded.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
      <div className="my-8">
        <BlogPostsChart />
      </div>
    </section>
  );
}
