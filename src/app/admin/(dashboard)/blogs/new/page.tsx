import { PageHeader } from "@/components/admin/layout/page-header";
import { BlogForm } from "@/components/admin/blogs/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <PageHeader title="Write blog" description="Publish a new article to the HITHAM journal." />
      <BlogForm />
    </div>
  );
}
