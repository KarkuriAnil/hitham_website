"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Quote, Star } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { TestimonialFormDialog } from "@/components/admin/testimonials/testimonial-form-dialog";
import { getTestimonials, deleteTestimonial } from "@/lib/services/testimonials";
import type { Testimonial } from "@/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  async function load() {
    try {
      setTestimonials(await getTestimonials());
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load testimonials.");
      setTestimonials([]);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getTestimonials()
      .then((data) => {
        if (!cancelled) setTestimonials(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          toast.error("Couldn't load testimonials.");
          setTestimonials([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteTestimonial(deleteTarget.id);
    setTestimonials((prev) => prev?.filter((t) => t.id !== deleteTarget.id) ?? null);
    toast.success("Testimonial deleted");
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Customer stories featured across the storefront."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add testimonial
          </Button>
        }
      />

      {testimonials && testimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add a customer story to build trust on the storefront."
          actionLabel="Add testimonial"
          actionHref="#"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials?.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex flex-col gap-3 pt-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-ivory-dim">
                    {t.image && (
                      <Image src={t.image} alt={t.userName} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.userName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < t.rating ? "fill-gold text-gold" : "text-border-soft"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ink-soft">&ldquo;{t.message}&rdquo;</p>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(t);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(t)}>
                    <Trash2 className="h-4 w-4 text-clay" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TestimonialFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        testimonial={editing}
        onSaved={load}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this testimonial?"
        description={`The story from "${deleteTarget?.userName}" will be removed. This can't be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
