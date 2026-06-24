"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getStorefrontBlogs } from "@/lib/site/content";
import type { Blog } from "@/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStorefrontBlogs()
      .then((data) => {
        if (!cancelled) setBlogs(data);
      })
      .catch(() => {
        if (!cancelled) setBlogs([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <p className="text-xs uppercase tracking-wide text-ink-soft">Journal</p>
      <h1 className="growth-line mt-1 inline font-display text-3xl font-medium text-ink">
        Notes on eating well
      </h1>

      {blogs === null ? (
        <p className="mt-8 text-sm text-ink-soft">Loading…</p>
      ) : blogs.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">Nothing published yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ivory-dim">
                {blog.imageUrl && (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <Badge variant="outline" className="mt-3 w-fit">
                {blog.category}
              </Badge>
              <p className="mt-2 font-display text-lg font-medium text-ink">{blog.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{blog.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
