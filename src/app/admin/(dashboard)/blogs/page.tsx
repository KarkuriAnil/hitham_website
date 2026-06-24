"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { getBlogs, deleteBlog } from "@/lib/services/blogs";
import type { Blog } from "@/types";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't load blogs.");
        setBlogs([]);
      });
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteBlog(deleteTarget.id);
    setBlogs((prev) => prev?.filter((b) => b.id !== deleteTarget.id) ?? null);
    toast.success("Blog deleted");
  }

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="Articles and guides published to the HITHAM journal."
        action={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              Write blog
            </Link>
          </Button>
        }
      />

      {blogs && blogs.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No blogs yet"
          description="Share wellness tips, recipes, or product stories with your first post."
          actionLabel="Write blog"
          actionHref="/admin/blogs/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs?.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <div className="relative h-40 w-full bg-ivory-dim">
                {blog.imageUrl && (
                  <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" unoptimized />
                )}
              </div>
              <CardContent className="flex flex-col gap-2 pt-4">
                <Badge variant="outline" className="self-start">
                  {blog.category}
                </Badge>
                <p className="font-display text-base font-medium text-ink">{blog.title}</p>
                <p className="line-clamp-2 text-sm text-ink-soft">{blog.content}</p>
                <div className="mt-2 flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/blogs/${blog.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(blog)}>
                    <Trash2 className="h-4 w-4 text-clay" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this blog?"
        description={`"${deleteTarget?.title}" will be removed from the journal. This can't be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
