import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

export function TestimonialsStrip({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <p className="text-xs uppercase tracking-wide text-ink-soft">From the community</p>
      <h2 className="growth-line mt-1 inline font-display text-2xl font-medium text-ink lg:text-3xl">
        People who switched
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.id} className="rounded-xl border border-border-soft bg-white/60 p-6">
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < t.rating ? "fill-gold text-gold" : "text-border-soft"}`}
                />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">&ldquo;{t.message}&rdquo;</p>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-ivory-dim">
                {t.image && (
                  <Image src={t.image} alt={t.userName} fill unoptimized className="object-cover" />
                )}
              </div>
              <p className="text-sm font-medium text-ink">{t.userName}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
