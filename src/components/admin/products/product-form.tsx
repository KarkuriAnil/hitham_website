"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { TagInput } from "@/components/admin/tag-input";
import { createProduct, updateProduct } from "@/lib/services/products";
import type { Product } from "@/types";

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Add a short description"),
  category: z.string().min(2, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stockQuantity: z.coerce.number().int().min(0, "Stock can't be negative"),
  images: z.array(z.string()).min(1, "Add at least one image"),
  ingredients: z.array(z.string()),
  benefits: z.array(z.string()),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  fiber: z.coerce.number().min(0).optional(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

const CATEGORIES = [
  "Detox Drinks",
  "Millet Products",
  "Breakfast Kits",
  "Snacks",
  "Superfoods",
  "Beverages",
];

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          stockQuantity: product.stockQuantity,
          images: product.images,
          ingredients: product.ingredients,
          benefits: product.benefits,
          calories: product.nutritionInfo?.calories,
          protein: product.nutritionInfo?.protein,
          carbs: product.nutritionInfo?.carbs,
          fat: product.nutritionInfo?.fat,
          fiber: product.nutritionInfo?.fiber,
        }
      : {
          title: "",
          description: "",
          category: "",
          price: 0,
          stockQuantity: 0,
          images: [],
          ingredients: [],
          benefits: [],
        },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        price: values.price,
        stockQuantity: values.stockQuantity,
        images: values.images,
        ingredients: values.ingredients,
        benefits: values.benefits,
        nutritionInfo: {
          calories: values.calories,
          protein: values.protein,
          carbs: values.carbs,
          fat: values.fat,
          fiber: values.fiber,
        },
      };

      if (product) {
        await updateProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save the product. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Product name</Label>
        <Input id="title" placeholder="e.g. Ragi Detox Mix" {...register("title")} />
        {errors.title && <p className="text-xs text-clay">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What makes this product worth trying?"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-clay">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="h-10 rounded-md border border-border-soft bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-clay">{errors.category.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-clay">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
          {errors.stockQuantity && (
            <p className="text-xs text-clay">{errors.stockQuantity.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Product images</Label>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUploadField folder="products" value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.images && <p className="text-xs text-clay">{errors.images.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Ingredients</Label>
        <Controller
          control={control}
          name="ingredients"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type an ingredient, press Enter"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Benefits</Label>
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type a benefit, press Enter"
            />
          )}
        />
      </div>

      <div>
        <Label className="mb-2 block">Nutrition info (per serving)</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(["calories", "protein", "carbs", "fat", "fiber"] as const).map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={key} className="text-xs capitalize text-ink-soft">
                {key}
              </Label>
              <Input id={key} type="number" step="0.1" {...register(key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
