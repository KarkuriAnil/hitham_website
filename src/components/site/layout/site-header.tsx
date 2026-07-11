"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User as UserIcon } from "lucide-react";
import { useCart } from "@/components/site/cart/cart-context";
import { useAuth } from "@/components/site/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/subscriptions", label: "Plans" },
  { href: "/recommendations", label: "Find Your Fit" },
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-border bg-parchment/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 lg:px-8">

        {/* Real Vedahitham logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Vedahitham — Good Food For Life"
            width={160}
            height={60}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-veda-green border-b-2 border-hitham-gold pb-0.5"
                    : "text-night-earth-soft hover:text-veda-green"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={user ? "/account" : "/login"}
            className="hidden items-center gap-1.5 text-sm text-night-earth-soft transition-colors hover:text-veda-green lg:flex"
          >
            <UserIcon className="h-4 w-4" />
            {user ? profile?.fullName?.split(" ")[0] || "Account" : "Sign in"}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-parchment-dim"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-hitham-gold text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-parchment lg:hidden">
          <div className="flex items-center justify-between border-b border-cream-border px-5 py-3">
            <Image src="/logo.png" alt="Vedahitham" width={120} height={45} className="h-10 w-auto" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-cream-border py-4 text-base font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="py-4 text-base text-ink"
            >
              {user ? "My account" : "Sign in"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
