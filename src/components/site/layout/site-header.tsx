"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Leaf, ShoppingBag, Menu, X, User as UserIcon } from "lucide-react";
import { useCart } from "@/components/site/cart/cart-context";
import { useAuth } from "@/components/site/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/subscriptions", label: "Plans" },
  { href: "/recommendations", label: "Find your fit" },
  { href: "/blog", label: "Journal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/70 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss">
            <Leaf className="h-4 w-4 text-sage-light" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-medium text-ink">HITHAM</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "growth-line text-sm transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
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
            className="hidden items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink lg:flex"
          >
            <UserIcon className="h-4 w-4" />
            {user ? profile?.fullName?.split(" ")[0] || "Account" : "Sign in"}
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ivory-dim"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-clay text-[10px] font-medium text-ivory">
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-ivory lg:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <p className="font-display text-lg">HITHAM</p>
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
                className="border-b border-border-soft py-4 text-base text-ink"
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
