import { CartProvider } from "@/components/site/cart/cart-context";
import { AuthProvider } from "@/components/site/auth/auth-context";
import { SiteHeader } from "@/components/site/layout/site-header";
import { SiteFooter } from "@/components/site/layout/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
