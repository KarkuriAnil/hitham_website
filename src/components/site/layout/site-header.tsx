"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">

          {/* Logo — text based, no image */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-black tracking-wide text-veda-green lg:text-2xl">
              VEDAHITHAM
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-hitham-gold">
              — Good Food For Life —
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    active
                      ? "border-b-2 border-hitham-gold pb-0.5 text-veda-green"
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
              {user
                ? profile?.fullName?.split(" ")[0] || "Account"
                : "Sign in"}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-veda-green text-parchment transition-colors hover:bg-veda-green-light"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-hitham-gold text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

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
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-parchment shadow-2xl flex flex-col overflow-y-auto">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-cream-border bg-veda-green px-5 py-4 shrink-0">
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-black text-parchment tracking-wide">
                  VEDAHITHAM
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-hitham-gold">
                  Good Food For Life
                </span>
              </div>
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
              <div className="border-b border-cream-border bg-hitham-gold-dim px-5 py-3 shrink-0">
                <p className="text-xs text-ink-soft">Welcome back</p>
                <p className="font-display text-base font-bold text-veda-green">
                  {profile?.fullName || "Customer"}
                </p>
              </div>
            ) : (
              <div className="border-b border-cream-border bg-hitham-gold-dim px-5 py-3 shrink-0">
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
            <nav className="px-4 py-4 shrink-0">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/");
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
                        <span className="text-xl">{link.emoji}</span>
                        {link.label}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4",
                          active ? "text-parchment/70" : "text-ink-soft"
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Contact details */}
            <div className="mx-4 border-t border-cream-border pt-4 pb-2 shrink-0">
              <p className="mb-2 px-1 text-[10px] uppercase tracking-wide text-hitham-gold font-semibold">
                Contact Us
              </p>
              <Link
                href="tel:9573404039"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-parchment-dim transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-veda-green/10">
                  <Phone className="h-4 w-4 text-veda-green" />
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Call us</p>
                  <p className="font-semibold text-veda-green">9573404039</p>
                </div>
              </Link>
              <Link
                href="mailto:Vedahitham@gmail.com"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-parchment-dim transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-veda-green/10">
                  <Mail className="h-4 w-4 text-veda-green" />
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Email us</p>
                  <p className="font-semibold text-veda-green">
                    Vedahitham@gmail.com
                  </p>
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/hitham_kitchen?igsh=MTNvdWpxMmdsMnRmNw=="
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-parchment-dim transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-50">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Instagram</p>
                  <p className="font-semibold text-veda-green">
                    @hitham_kitchen
                  </p>
                </div>
              </Link>
            </div>

            {/* Bottom actions */}
            <div className="border-t border-cream-border p-4 flex flex-col gap-2 shrink-0">
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
            <div className="bg-hitham-gold px-5 py-3 text-center shrink-0">
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
