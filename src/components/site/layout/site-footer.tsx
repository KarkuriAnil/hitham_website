import Link from "next/link";
import { Download } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream-border bg-veda-green text-parchment">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl font-bold text-parchment">VEDAHITHAM</p>
          <div className="brand-rule mt-1 text-[9px] uppercase tracking-[0.2em] text-hitham-gold" />
          <p className="mt-4 text-sm leading-relaxed text-parchment/70">
            Rooted in Ayurveda. Inspired by nature. Crafted for everyday wellness.
          </p>
          <Link
            href="/brand-guide.pdf"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-hitham-gold px-4 py-2 text-xs text-hitham-gold transition-colors hover:bg-hitham-gold hover:text-veda-green-dark"
          >
            <Download className="h-3.5 w-3.5" />
            Download brand guide
          </Link>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { href: "/products", label: "All products" },
            { href: "/subscriptions", label: "28-day plans" },
            { href: "/recommendations", label: "Find your fit" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { href: "/about", label: "Our story" },
            { href: "/blog", label: "Journal" },
            { href: "/account", label: "My account" },
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            { href: "/account/orders", label: "Track an order" },
            { href: "/account/subscriptions", label: "Manage subscription" },
          ]}
        />
      </div>

      <div className="border-t border-parchment/10 px-5 py-5 text-center text-xs text-parchment/50 lg:px-8">
        {`© ${new Date().getFullYear()} Vedahitham. Founded by Ashwini Reddy. Rooted in Ayurveda — inspired by nature — crafted for everyday wellness.`}
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-hitham-gold">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-parchment/70 transition-colors hover:text-parchment">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
