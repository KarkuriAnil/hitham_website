import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Blog, Testimonial } from "@/types";

export async function getStorefrontBlogs(): Promise<Blog[]> {
  const snap = await getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Blog, "id">) }));
}

export async function getStorefrontBlog(id: string): Promise<Blog | null> {
  const snap = await getDoc(doc(db, "blogs", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Blog, "id">) };
}

export async function getStorefrontTestimonials(): Promise<Testimonial[]> {
  const snap = await getDocs(query(collection(db, "testimonials"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}
