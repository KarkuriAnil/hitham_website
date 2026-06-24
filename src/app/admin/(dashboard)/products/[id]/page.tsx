"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/layout/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { getProduct } from "@/lib/services/products";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    getProduct(params.id).then(setProduct);
  }, [params.id]);

  if (product === undefined) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  if (product === null) {
    return <p className="text-sm text-clay">Product not found.</p>;
  }

  return (
    <div>
      <PageHeader title="Edit product" description={product.title} />
      <ProductForm product={product} />
    </div>
  );
}
