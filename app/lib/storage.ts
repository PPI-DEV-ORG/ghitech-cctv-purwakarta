import fs from "fs";
import path from "path";
import { BlogPost } from "../components/BlogCard";
import { ProductItem } from "../components/ProductCard";
import { supabase, isSupabaseConfigured, BUCKET_NAME } from "./supabase";

const blogsFilePath = path.join(process.cwd(), "data", "blogs.json");
const productsFilePath = path.join(process.cwd(), "data", "products.json");

/* -------------------------------------------------------------
 * BLOGS
 * ------------------------------------------------------------- */
export async function getBlogs(): Promise<BlogPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((item) => ({
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt || "",
          content: item.content || "",
          category: item.category || "Keamanan & Tips",
          author: item.author || "Tim G-Tech CCTV Purwakarta",
          date: item.date || item.created_at?.split("T")[0] || "",
          image: item.image || "",
          readTime: item.read_time || "5 min baca",
        }));
      }
      if (error) {
        console.warn("Supabase getBlogs warning, falling back to local:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getBlogs failed, falling back to local:", err);
    }
  }

  // Fallback ke local JSON file
  try {
    if (!fs.existsSync(blogsFilePath)) return [];
    const data = fs.readFileSync(blogsFilePath, "utf8");
    return JSON.parse(data) as BlogPost[];
  } catch (error) {
    console.error("Error reading blogs.json:", error);
    return [];
  }
}

export async function saveBlogs(blogs: BlogPost[]): Promise<boolean> {
  // Selalu simpan ke local file sebagai backup / cache
  try {
    const dir = path.dirname(blogsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing blogs.json:", error);
  }
  return true;
}

/* -------------------------------------------------------------
 * PRODUCTS
 * ------------------------------------------------------------- */
export async function getProducts(): Promise<ProductItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((item) => ({
          id: String(item.id),
          name: item.name,
          category: item.category || "office",
          subCategory: item.sub_category || undefined,
          badge: item.badge || undefined,
          channels: item.channels || "4 Channel",
          price: item.price || "Hubungi Admin",
          priceNumber: Number(item.price_number) || 0,
          image: item.image || "",
          description: item.description || "",
          includes: Array.isArray(item.includes) ? item.includes : [],
          footerNote: item.footer_note || "Garansi Unit Resmi 1 Tahun",
        }));
      }
      if (error) {
        console.warn("Supabase getProducts warning, falling back to local:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getProducts failed, falling back to local:", err);
    }
  }

  // Fallback ke local JSON file
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    const data = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(data) as ProductItem[];
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
}

export async function saveProducts(products: ProductItem[]): Promise<boolean> {
  // Selalu simpan ke local file sebagai backup / cache
  try {
    const dir = path.dirname(productsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing products.json:", error);
  }
  return true;
}

/* -------------------------------------------------------------
 * IMAGE STORAGE HELPER (SUPABASE BUCKET & LOCAL)
 * ------------------------------------------------------------- */
export async function deleteStoredImage(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) return;

  // 1. Cek jika file tersimpan di Supabase Storage
  if (isSupabaseConfigured && supabase) {
    try {
      // Pola URL Supabase: .../storage/v1/object/public/{bucket}/{filePath}
      if (imageUrl.includes(`/storage/v1/object/public/${BUCKET_NAME}/`)) {
        const pathPart = imageUrl.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
        if (pathPart) {
          const cleanPath = pathPart.split("?")[0].split("#")[0];
          await supabase.storage.from(BUCKET_NAME).remove([cleanPath]);
          return;
        }
      }
    } catch (err) {
      console.error("Gagal menghapus gambar dari Supabase Storage:", err);
    }
  }

  // 2. Cek jika file tersimpan di lokal public/imgs/blog/
  try {
    const rawPath = imageUrl.trim().split("?")[0].split("#")[0];
    const isBlogImage =
      rawPath.startsWith("/imgs/blog/") ||
      rawPath.startsWith("imgs/blog/");

    if (isBlogImage) {
      const cleanRelativePath = rawPath.replace(/^\/+/, "");
      const fullLocalPath = path.join(process.cwd(), "public", cleanRelativePath);
      if (fs.existsSync(fullLocalPath)) {
        fs.unlinkSync(fullLocalPath);
      }
    }
  } catch (fileErr) {
    console.error("Gagal menghapus gambar lokal:", fileErr);
  }
}
