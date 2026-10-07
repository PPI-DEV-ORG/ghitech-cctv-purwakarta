import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD || "ghitechadmin2026";
  const authHeader = req.headers.get("x-admin-password");
  return authHeader === adminPass;
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

    // Simpan ke direktori public/imgs/blog/
    const blogDir = path.join(process.cwd(), "public", "imgs", "blog");
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 40);
    const filename = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(blogDir, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      message: "Media berhasil diunggah",
      url: `/imgs/blog/${filename}`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}

