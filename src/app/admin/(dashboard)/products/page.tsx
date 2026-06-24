"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { getProducts, deleteProduct } from "@/lib/services/products";
import type { Product } from "@/types";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  async function load() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load products.");
      setProducts([]);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          toast.error("Couldn't load products.");
          setProducts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setProducts((prev) => prev?.filter((p) => p.id !== deleteTarget.id) ?? null);
    toast.success("Product deleted");
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the catalog — detox drinks, millet products, breakfast kits, and more."
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>
      </div>

      {products && products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first product — a detox drink, millet snack, or breakfast kit — to get the catalog started."
          actionLabel="Add product"
          actionHref="/admin/products/new"
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border-soft/60 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ivory-dim">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <span className="font-medium text-ink">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-ink-soft">{product.category}</td>
                  <td className="p-4">₹{product.price.toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    {product.stockQuantity > 0 ? (
                      <Badge variant="success">{product.stockQuantity} in stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of stock</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="h-4 w-4 text-clay" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-soft">
                    No products match &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this product?"
        description={`"${deleteTarget?.title}" will be removed from the catalog permanently. This can't be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
