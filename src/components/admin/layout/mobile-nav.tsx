"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarRange,
  ClipboardList,
  Users,
  NotebookPen,
  Quote,
  Leaf,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CalendarRange },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/blogs", label: "Blogs", icon: NotebookPen },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between border-b border-border-soft bg-ivory px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss">
            <Leaf className="h-4 w-4 text-sage-light" />
          </div>
          <p className="font-display text-sm font-medium">HITHAM Admin</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-ink hover:bg-ivory-dim"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-moss text-ivory">
          <div className="flex items-center justify-between px-5 py-5">
            <p className="font-display text-base">HITHAM</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-2 hover:bg-moss-light"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="px-3">
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm",
                        active ? "bg-moss-light text-ivory" : "text-sage-light/80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 px-6 py-3 text-sm text-sage-light/80"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
