"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createTestimonial,
  updateTestimonial,
} from "@/lib/services/testimonials";
import type { Testimonial } from "@/types";

const testimonialSchema = z.object({
  userName: z.string().min(2, "Name is required"),
  message: z.string().min(10, "Message is too short"),
  rating: z.coerce.number().min(1).max(5),
  image: z.string().optional(),
});

type TestimonialFormInput = z.input<typeof testimonialSchema>;
type TestimonialFormValues = z.output<typeof testimonialSchema>;

export function TestimonialFormDialog({
  open,
  onOpenChange,
  testimonial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
  onSaved: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormInput, unknown, TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    values: testimonial
      ? {
          userName: testimonial.userName,
          message: testimonial.message,
          rating: testimonial.rating,
          image: testimonial.image || "",
        }
      : { userName: "", message: "", rating: 5, image: "" },
  });

  async function onSubmit(values: TestimonialFormValues) {
    try {
      if (testimonial) {
        await updateTestimonial(testimonial.id, values);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(values);
        toast.success("Testimonial added");
      }
      reset();
      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save the testimonial.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="userName">Customer name</Label>
            <Input id="userName" {...register("userName")} />
            {errors.userName && <p className="text-xs text-clay">{errors.userName.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={4} {...register("message")} />
            {errors.message && <p className="text-xs text-clay">{errors.message.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input id="rating" type="number" min={1} max={5} {...register("rating")} />
            {errors.rating && <p className="text-xs text-clay">{errors.rating.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Photo (optional)</Label>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageUploadField
                  folder="testimonials"
                  multiple={false}
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] || "")}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : testimonial ? "Save changes" : "Add testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
