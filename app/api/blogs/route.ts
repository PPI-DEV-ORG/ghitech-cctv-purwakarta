import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getBlogs, saveBlogs } from "../../lib/storage";
import { BlogPost } from "../../components/BlogCard";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const authHeader = req.headers.get("x-admin-password")?.trim();
  return !!adminPass && authHeader === adminPass;
}

export async function GET() {
  const blogs = getBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json(
      { message: "Akses ditolak. Password admin salah." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const blogs = getBlogs();

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug:
        body.slug ||
        body.title
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-") ||
        `post-${Date.now()}`,
      title: body.title || "Judul Artikel",
      excerpt: body.excerpt || "",
      content: body.content || "",
      category: body.category || "Keamanan & Tips",
      author: body.author || "Tim G-Tech CCTV Purwakarta",
      date: new Date().toISOString().split("T")[0],
      image: body.image || "",
      readTime: body.readTime || "5 min baca",
    };

    blogs.unshift(newPost);
    saveBlogs(blogs);

    return NextResponse.json(
      { message: "Artikel berhasil ditambahkan", post: newPost },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat artikel";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json(
      { message: "Akses ditolak. Password admin salah." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const blogs = getBlogs();

    const index = blogs.findIndex((b) => b.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const oldPost = blogs[index];
    const newImage = body.image;

    // Hapus file gambar lama jika foto diganti dan foto lama tersimpan di public
    if (oldPost.image && newImage && oldPost.image !== newImage) {
      try {
        const rawPath = oldPost.image.trim().split("?")[0].split("#")[0];
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
        console.error("Gagal menghapus file gambar lama artikel:", fileErr);
      }
    }

    blogs[index] = {
      ...blogs[index],
      ...body,
    };

    saveBlogs(blogs);

    return NextResponse.json({
      message: "Artikel berhasil diperbarui",
      post: blogs[index],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui artikel";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyPassword(req)) {
    return NextResponse.json(
      { message: "Akses ditolak. Password admin salah." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID artikel wajib disertakan" },
        { status: 400 }
      );
    }

    let blogs = getBlogs();
    const postToDelete = blogs.find((b) => b.id === id);

    if (!postToDelete) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file media/gambar jika tersimpan di public folder
    if (postToDelete.image) {
      try {
        const rawPath = postToDelete.image.trim().split("?")[0].split("#")[0];

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
        console.error("Gagal menghapus file gambar artikel:", fileErr);
      }
    }

    blogs = blogs.filter((b) => b.id !== id);
    saveBlogs(blogs);

    return NextResponse.json({
      message: "Artikel dan gambarnya berhasil dihapus",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus artikel";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

