"use client";

import { useEffect, useState } from "react";
import { HomeHero } from "@/components/site/home/home-hero";
import { FeaturedProducts } from "@/components/site/home/featured-products";
import { GoalGrid } from "@/components/site/home/goal-grid";
import { TestimonialsStrip } from "@/components/site/home/testimonials-strip";
import { getStorefrontProducts } from "@/lib/site/products";
import { getStorefrontTestimonials } from "@/lib/site/content";
import type { Product, Testimonial } from "@/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getStorefrontProducts(), getStorefrontTestimonials()])
      .then(([p, t]) => {
        if (cancelled) return;
        setProducts(p);
        setTestimonials(t);
      })
      .catch((err) => console.error("Failed to load homepage data", err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <HomeHero />
      <FeaturedProducts products={products} />
      <GoalGrid />
      <TestimonialsStrip testimonials={testimonials} />
    </div>
  );
}
