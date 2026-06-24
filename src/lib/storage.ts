import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type StorageFolder =
  | "products"
  | "users"
  | "blogs"
  | "testimonials"
  | "banners"
  | "subscriptions";

/**
 * Uploads a file to Firebase Storage under the given folder and returns its
 * public download URL. Filenames are timestamp-prefixed to avoid collisions.
 */
export async function uploadImage(folder: StorageFolder, file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadImages(folder: StorageFolder, files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(folder, file)));
}

/** Deletes an image given its Storage download URL. Best-effort — ignores errors. */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Non-fatal: URL may already be gone, or may not be a Storage URL.
  }
}
