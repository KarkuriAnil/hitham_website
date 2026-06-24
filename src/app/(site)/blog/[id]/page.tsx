"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getStorefrontBlog } from "@/lib/site/content";
import type { Blog } from "@/types";

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null | undefined>(undefined);

  useEffect(() => {
    getStorefrontBlog(params.id).then(setBlog);
  }, [params.id]);

  if (blog === undefined) {
    return <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-ink-soft">Loading…</div>;
  }
  if (blog === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center text-sm text-ink-soft">
        We couldn&apos;t find that article.
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <Badge variant="outline">{blog.category}</Badge>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink">{blog.title}</h1>
      {blog.imageUrl && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-ivory-dim">
          <Image src={blog.imageUrl} alt={blog.title} fill unoptimized className="object-cover" />
        </div>
      )}
      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink-soft">
        {blog.content}
      </div>
    </article>
  );
}
