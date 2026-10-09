import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured, BUCKET_NAME } from "@/app/lib/supabase";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const authHeader = req.headers.get("x-admin-password")?.trim();
  return !!adminPass && authHeader === adminPass;
}

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json(
      { message: "Akses ditolak. Password admin salah." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimal ukuran file adalah 2 MB.`,
        },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    const mimeType = file.type.toLowerCase();

    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_TYPES.includes(mimeType);

    if (!isValidExt || !isValidMime) {
      return NextResponse.json(
        {
          message:
            "Format file tidak didukung. Hanya file PNG, JPG, JPEG, dan WEBP yang diperbolehkan.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 40);
    const filename = `${baseName}-${Date.now()}${ext}`;

    // 1. Jika Supabase dikonfigurasi, simpan ke Supabase Storage Bucket
    if (isSupabaseConfigured && supabase) {
      const storagePath = `uploads/${filename}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        return NextResponse.json({
          message: "Media berhasil diunggah ke Supabase Storage",
          url: publicUrlData.publicUrl,
        });
      }

      console.warn("Upload ke Supabase gagal, fallback ke lokal:", uploadErr?.message);
    }

    // 2. Fallback: simpan ke lokal public/imgs/blog/
    const blogDir = path.join(process.cwd(), "public", "imgs", "blog");
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const filePath = path.join(blogDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      message: "Media berhasil diunggah secara lokal",
      url: `/imgs/blog/${filename}`,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Gagal mengunggah file";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
