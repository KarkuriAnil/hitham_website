import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

const CORE_VALUES = [
  {
    title: "Authenticity",
    description: "We stay true to our roots, blending traditional knowledge with modern quality standards.",
    icon: "🌿",
  },
  {
    title: "Purity",
    description: "No compromise, no harmful shortcuts. Just clean, conscious, and effective goodness.",
    icon: "✨",
  },
  {
    title: "Mindful Living",
    description: "Empowering you to make choices that feel good today and sustain you tomorrow.",
    icon: "🧘",
  },
  {
    title: "Nativity First",
    description: "Every product traces back to a source, a region, and a tradition rooted in Indian heritage.",
    icon: "🪴",
  },
  {
    title: "Integrity & Honesty",
    description: "We use clean ingredients, honest labeling, and no shortcuts in everything we make.",
    icon: "🤝",
  },
  {
    title: "Accessibility",
    description: "Good ancestral food should be within reach of every modern household, not a luxury.",
    icon: "🏠",
  },
];

const BENEFITS = [
  {
    title: "Sustained Energy & Vitality",
    description:
      "Whole, nutrient-dense foods provide clean fuel for the body, eliminating the energy crashes caused by processed sugars and junk food.",
  },
  {
    title: "Strengthened Immunity",
    description:
      "A diet rich in vitamins, minerals, and antioxidants builds a resilient immune system, helping the body naturally ward off illnesses.",
  },
  {
    title: "Sharper Mental Clarity",
    description:
      "What you eat directly impacts brain health. Clean eating reduces brain fog, improves focus, and helps balance mood and anxiety levels.",
  },
  {
    title: "Radiant Skin & Healthy Aging",
    description:
      "True beauty starts from the inside. Eating fresh, nutrient-rich foods nourishes your cells, giving you a natural, healthy glow.",
  },
];

const PROMISES = [
  "No junk",
  "No chemicals",
  "No sugar",
  "No refined oils",
  "No compromises",
];

export default function AboutPage() {
  return (
    <div className="bg-parchment">

      {/* Hero */}
      <section className="relative overflow-hidden bg-veda-green py-20 text-parchment lg:py-28">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #C59C44 0%, transparent 60%), radial-gradient(circle at 80% 20%, #C59C44 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-hitham-gold">
            Rooted in Ayurveda · Inspired by Nature
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-parchment lg:text-6xl">
            The Roots of
            <br />
            Vedahitham
          </h1>
          <div className="brand-rule mt-5 text-xs uppercase tracking-[0.2em] text-hitham-gold" />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-parchment/80">
            Every great journey begins with a return to what truly matters. The
            name <strong className="text-parchment">VEDAHITHAM</strong> comes
            from two powerful ideas:{" "}
            <em className="text-hitham-gold">Veda</em> (ancient wisdom) &amp;{" "}
            <em className="text-hitham-gold">Hitham</em> (beneficial, good).
            Together they form our core mission: bringing the timeless benefits
            of ancient Ayurvedic wisdom into modern daily life.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full bg-hitham-gold px-6 py-3 text-sm font-semibold text-veda-green-dark transition-colors hover:bg-hitham-gold-light"
            >
              Shop our products <ArrowRight className="h-4 w-4" />
            </Link>
            
              href="/brand-guide.pdf"
              download="brand-guide.pdf"
              className="flex items-center gap-2 rounded-full border border-parchment/30 px-6 py-3 text-sm text-parchment transition-colors hover:bg-parchment/10"
            >
              <Download className="h-4 w-4" />
              Download brand guide
            </a>
          </div>
        </div>
      </section>

      {/* Founder story */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-hitham-gold">
              The heart behind Vedahitham
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-veda-green lg:text-4xl">
              Ashwini Reddy&apos;s Story
            </h2>
            <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
            <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-ink-soft">
              <p>
                Ashwini Reddy — a certified Ayurvedic Nutritionist — was always
                health-conscious and a passionate food lover who found it
                difficult to eat clean, hygienic food outside. She began
                researching clean, guilt-free, and preservative-free foods.
              </p>
              <p>
                She tried many recipes in her own kitchen. What began as her
                personal journey became a community proving that{" "}
                <strong className="text-veda-green">
                  healthy never has to be boring.
                </strong>
              </p>
              <p>Every recipe and every product carries her promise:</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {PROMISES.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-hitham-gold/40 bg-hitham-gold-dim px-3 py-1 text-xs font-medium text-veda-green"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm italic text-ink-soft">
              &ldquo;We aren&apos;t just selling a product; we are sharing a
              heritage of well-being that has stood the test of time.&rdquo;
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-hitham-gold/30 bg-hitham-gold-dim p-6">
              <p className="font-display text-2xl font-bold text-veda-green">
                Vision
              </p>
              <div className="mt-1 h-0.5 w-10 bg-hitham-gold" />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                To become India&apos;s most trusted name in native, sustainable
                food — one that future generations associate with the taste of
                home and the wisdom of tradition.
              </p>
            </div>
            <div className="rounded-2xl border border-veda-green/20 bg-veda-green p-6 text-parchment">
              <p className="font-display text-2xl font-bold text-parchment">
                Mission
              </p>
              <div className="mt-1 h-0.5 w-10 bg-hitham-gold" />
              <div className="mt-4 flex flex-col gap-3">
                {[
                  {
                    title: "Preserve Ancestral Wisdom",
                    desc: "Bringing time-tested Ayurvedic food knowledge into every modern home without compromise.",
                  },
                  {
                    title: "Nourish with Integrity",
                    desc: "Using only clean, traceable ingredients prepared with honesty and care at every step.",
                  },
                  {
                    title: "Make Good Food Accessible",
                    desc: "Ensuring that ancestral, wholesome food is within reach of every household, not a privilege.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-hitham-gold" />
                    <div>
                      <p className="text-sm font-semibold text-hitham-gold">
                        {item.title}
                      </p>
                      <p className="text-xs text-parchment/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="bg-parchment-dim py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-hitham-gold">
              What we stand for
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-veda-green lg:text-4xl">
              Our Core Values
            </h2>
            <div className="mt-2 flex justify-center">
              <div className="h-0.5 w-16 bg-hitham-gold" />
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((val) => (
              <div
                key={val.title}
                className="rounded-xl border border-cream-border bg-parchment p-5"
              >
                <span className="text-2xl">{val.icon}</span>
                <p className="mt-2 font-display text-lg font-bold text-veda-green">
                  {val.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-hitham-gold">
            Why eat clean
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-veda-green lg:text-4xl">
            The Power of Healthy Food
          </h2>
          <div className="mt-2 flex justify-center">
            <div className="h-0.5 w-16 bg-hitham-gold" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            A healthy diet is the foundation upon which wellness is built.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className="flex gap-4 rounded-xl border border-cream-border bg-parchment p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hitham-gold font-display text-lg font-bold text-veda-green">
                {i + 1}
              </div>
              <div>
                <p className="font-display text-lg font-bold text-veda-green">
                  {b.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download CTA */}
      <section className="border-t border-cream-border bg-veda-green py-14 text-center text-parchment">
        <p className="font-display text-xl font-bold text-hitham-gold">
          Learn more about us
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-parchment">
          Download our brand guide
        </h2>
        <p className="mt-3 text-sm text-parchment/70">
          The full Vedahitham story, our palette, typography, and values — all
          in one document.
        </p>
        
          href="/brand-guide.pdf"
          download="brand-guide.pdf"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-hitham-gold px-8 py-3 text-sm font-semibold text-veda-green-dark transition-colors hover:bg-hitham-gold-light"
        >
          <Download className="h-4 w-4" />
          Download brand guide (PDF)
        </a>
      </section>
    </div>
  );
}
