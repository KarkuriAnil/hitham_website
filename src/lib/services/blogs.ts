import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Blog, BlogInput } from "@/types";

const COLLECTION = "blogs";

export async function getBlogs(): Promise<Blog[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Blog, "id">) }));
}

export async function getBlog(id: string): Promise<Blog | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Blog, "id">) };
}

export async function createBlog(input: BlogInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(id: string, input: Partial<BlogInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...input });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
