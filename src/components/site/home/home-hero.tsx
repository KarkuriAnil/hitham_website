import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SproutLine } from "@/components/site/home/sprout-line";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div className="fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sage-light">
            House Of Organic Foods
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl">
            Food that grows
            <br />
            you back.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">
            Millets, detox blends, and breakfast kits built around how your
            body actually works — not a trend. Tell us your goal, and we&apos;ll
            tell you what to eat.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full bg-sage px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-sage-light"
            >
              Shop the range <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/recommendations"
              className="flex items-center gap-2 rounded-full border border-ivory/20 px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ivory/10"
            >
              Find your fit
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <SproutLine className="h-64 w-full max-w-sm lg:h-80" />
        </div>
      </div>
    </section>
  );
}
