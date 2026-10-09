import { NextRequest, NextResponse } from "next/server";
import { getBlogs, saveBlogs, deleteStoredImage } from "../../lib/storage";
import { BlogPost } from "../../components/BlogCard";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const authHeader = req.headers.get("x-admin-password")?.trim();
  return !!adminPass && authHeader === adminPass;
}

export async function GET() {
  const blogs = await getBlogs();
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
    const blogs = await getBlogs();

    const id = `blog-${Date.now()}`;
    const slug =
      body.slug ||
      body.title
        ?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-") ||
      `post-${Date.now()}`;

    const newPost: BlogPost = {
      id,
      slug,
      title: body.title || "Judul Artikel",
      excerpt: body.excerpt || "",
      content: body.content || "",
      category: body.category || "Keamanan & Tips",
      author: body.author || "Tim G-Tech CCTV Purwakarta",
      date: new Date().toISOString().split("T")[0],
      image: body.image || "",
      readTime: body.readTime || "5 min baca",
    };

    // 1. Simpan ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase.from("blogs").insert({
        id: newPost.id,
        slug: newPost.slug,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        category: newPost.category,
        author: newPost.author,
        date: newPost.date,
        image: newPost.image,
        read_time: newPost.readTime,
      });

      if (dbErr) {
        console.warn("Supabase insert blog error:", dbErr.message);
      }
    }

    // 2. Simpan ke local cache
    blogs.unshift(newPost);
    await saveBlogs(blogs);

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
    const blogs = await getBlogs();

    const index = blogs.findIndex((b) => b.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const oldPost = blogs[index];
    const newImage = body.image;

    // Hapus file gambar lama jika foto diganti
    if (oldPost.image && newImage && oldPost.image !== newImage) {
      await deleteStoredImage(oldPost.image);
    }

    blogs[index] = {
      ...blogs[index],
      ...body,
    };

    // 1. Update ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase
        .from("blogs")
        .update({
          slug: blogs[index].slug,
          title: blogs[index].title,
          excerpt: blogs[index].excerpt,
          content: blogs[index].content,
          category: blogs[index].category,
          author: blogs[index].author,
          image: blogs[index].image,
          read_time: blogs[index].readTime,
        })
        .eq("id", blogs[index].id);

      if (dbErr) {
        console.warn("Supabase update blog error:", dbErr.message);
      }
    }

    // 2. Simpan ke local cache
    await saveBlogs(blogs);

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

    let blogs = await getBlogs();
    const postToDelete = blogs.find((b) => b.id === id);

    if (!postToDelete) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file media/gambar jika tersimpan
    if (postToDelete.image) {
      await deleteStoredImage(postToDelete.image);
    }

    // 1. Hapus dari Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (dbErr) {
        console.warn("Supabase delete blog error:", dbErr.message);
      }
    }

    // 2. Hapus dari local cache
    blogs = blogs.filter((b) => b.id !== id);
    await saveBlogs(blogs);

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
