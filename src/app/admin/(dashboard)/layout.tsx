import { Sidebar } from "@/components/admin/layout/sidebar";
import { MobileNav } from "@/components/admin/layout/mobile-nav";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-ivory">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 px-5 py-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
