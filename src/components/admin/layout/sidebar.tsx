"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-64 flex-col bg-moss text-ivory lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15">
          <Leaf className="h-4.5 w-4.5 text-sage-light" />
        </div>
        <div>
          <p className="font-display text-base font-medium leading-none">HITHAM</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-sage-light/80">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-moss-light text-ivory"
                      : "text-sage-light/80 hover:bg-moss-light/50 hover:text-ivory"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sage" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sage-light/80 transition-colors hover:bg-moss-light/50 hover:text-ivory"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
