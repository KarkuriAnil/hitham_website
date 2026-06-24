"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createBlog, updateBlog } from "@/lib/services/blogs";
import type { Blog } from "@/types";

const blogSchema = z.object({
  title: z.string().min(2, "Title is required"),
  content: z.string().min(20, "Write a bit more content"),
  category: z.string().min(2, "Category is required"),
  imageUrl: z.string().min(1, "Add a cover image"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog
      ? {
          title: blog.title,
          content: blog.content,
          category: blog.category,
          imageUrl: blog.imageUrl,
        }
      : { title: "", content: "", category: "", imageUrl: "" },
  });

  async function onSubmit(values: BlogFormValues) {
    try {
      if (blog) {
        await updateBlog(blog.id, values);
        toast.success("Blog updated");
      } else {
        await createBlog(values);
        toast.success("Blog published");
      }
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save the blog. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. 5 Millets You Should Be Eating" {...register("title")} />
        {errors.title && <p className="text-xs text-clay">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" placeholder="e.g. Nutrition" {...register("category")} />
        {errors.category && <p className="text-xs text-clay">{errors.category.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Cover image</Label>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUploadField
              folder="blogs"
              multiple={false}
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] || "")}
            />
          )}
        />
        {errors.imageUrl && <p className="text-xs text-clay">{errors.imageUrl.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" rows={10} placeholder="Write the article…" {...register("content")} />
        {errors.content && <p className="text-xs text-clay">{errors.content.message}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : blog ? "Save changes" : "Publish blog"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
