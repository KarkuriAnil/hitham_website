import { PageHeader } from "@/components/admin/layout/page-header";
import { ProductForm } from "@/components/admin/products/product-form";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="Add product" description="Add a new item to the HITHAM catalog." />
      <ProductForm />
    </div>
  );
}
