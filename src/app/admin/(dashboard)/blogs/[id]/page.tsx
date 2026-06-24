"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/layout/page-header";
import { BlogForm } from "@/components/admin/blogs/blog-form";
import { getBlog } from "@/lib/services/blogs";
import type { Blog } from "@/types";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null | undefined>(undefined);

  useEffect(() => {
    getBlog(params.id).then(setBlog);
  }, [params.id]);

  if (blog === undefined) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (blog === null) return <p className="text-sm text-clay">Blog not found.</p>;

  return (
    <div>
      <PageHeader title="Edit blog" description={blog.title} />
      <BlogForm blog={blog} />
    </div>
  );
}
