"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User as UserIcon, ChevronRight } from "lucide-react";
import { useCart } from "@/components/site/cart/cart-context";
import { useAuth } from "@/components/site/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Shop", emoji: "🛍️" },
  { href: "/subscriptions", label: "Plans", emoji: "📋" },
  { href: "/recommendations", label: "Find Your Fit", emoji: "🎯" },
  { href: "/about", label: "Our Story", emoji: "🌿" },
  { href: "/blog", label: "Journal", emoji: "📖" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream-border bg-parchment/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Vedahitham"
              width={140}
              height={52}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
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

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Link
              href={user ? "/account" : "/login"}
              className="hidden items-center gap-1.5 rounded-full border border-cream-border px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-hitham-gold hover:text-veda-green lg:flex"
            >
              <UserIcon className="h-3.5 w-3.5" />
              {user ? profile?.fullName?.split(" ")[0] || "Account" : "Sign in"}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-veda-green text-parchment transition-colors hover:bg-veda-green-light"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-hitham-gold text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-veda-green text-parchment lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-night-earth/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-parchment shadow-2xl flex flex-col">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-cream-border bg-veda-green px-5 py-4">
              <Image
                src="/logo.png"
                alt="Vedahitham"
                width={120}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-parchment/20 text-parchment"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* User greeting */}
            {user ? (
              <div className="border-b border-cream-border bg-hitham-gold-dim px-5 py-3">
                <p className="text-xs text-ink-soft">Welcome back</p>
                <p className="font-display text-base font-bold text-veda-green">
                  {profile?.fullName || "Customer"}
                </p>
              </div>
            ) : (
              <div className="border-b border-cream-border bg-hitham-gold-dim px-5 py-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-sm font-semibold text-veda-green"
                >
                  <span>Sign in / Create account</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-veda-green text-parchment"
                          : "text-ink hover:bg-parchment-dim"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{link.emoji}</span>
                        {link.label}
                      </span>
                      <ChevronRight className={cn("h-4 w-4", active ? "text-parchment/70" : "text-ink-soft")} />
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-cream-border p-4 flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl bg-veda-green px-4 py-3 text-sm font-semibold text-parchment"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  View Cart
                </span>
                {itemCount > 0 && (
                  <span className="rounded-full bg-hitham-gold px-2 py-0.5 text-xs font-bold text-veda-green">
                    {itemCount} items
                  </span>
                )}
              </Link>
              {user && (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-cream-border px-4 py-3 text-sm font-medium text-ink hover:bg-parchment-dim"
                >
                  <UserIcon className="h-4 w-4" />
                  My Account
                </Link>
              )}
            </div>

            {/* Brand tagline */}
            <div className="bg-hitham-gold px-5 py-3 text-center">
              <p className="text-xs font-bold text-veda-green">
                🌿 Good Food For Life
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
