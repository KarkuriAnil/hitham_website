import Link from "next/link";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-soft bg-ivory-dim">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-moss">
              <Leaf className="h-3.5 w-3.5 text-sage-light" />
            </div>
            <p className="font-display text-base font-medium">HITHAM</p>
          </div>
          <p className="max-w-xs text-sm text-ink-soft">
            House Of Organic Foods. Whole-food nutrition, grown and made with intention.
          </p>
        </div>

        <FooterColumn
          title="Shop"
          links={[
            { href: "/products", label: "All products" },
            { href: "/subscriptions", label: "Subscription plans" },
            { href: "/recommendations", label: "Find your fit" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/blog", label: "Journal" },
            { href: "/account", label: "My account" },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { href: "/account/orders", label: "Track an order" },
            { href: "/account/subscriptions", label: "Manage subscription" },
          ]}
        />
      </div>
      <div className="border-t border-border-soft px-5 py-5 text-center text-xs text-ink-soft lg:px-8">
        © {new Date().getFullYear()} HITHAM. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-ink-soft">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-soft hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
