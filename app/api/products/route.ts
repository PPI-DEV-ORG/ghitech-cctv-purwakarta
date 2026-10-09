import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, deleteStoredImage } from "@/app/lib/storage";
import { ProductItem } from "@/app/components/ProductCard";
import { supabase, isSupabaseConfigured } from "@/app/lib/supabase";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const authHeader = req.headers.get("x-admin-password")?.trim();
  return !!adminPass && authHeader === adminPass;
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
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
    const products: ProductItem[] = await getProducts();

    const priceNum =
      typeof body.priceNumber === "number"
        ? body.priceNumber
        : parseInt(String(body.priceNumber || "0").replace(/[^0-9]/g, "")) || 0;

    const formattedPrice =
      body.price ||
      (priceNum > 0
        ? `Rp ${priceNum.toLocaleString("id-ID")}`
        : "Hubungi Admin");

    const newProduct: ProductItem = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name || "Paket CCTV Baru",
      category: body.category || "office",
      subCategory: body.subCategory || "home_office",
      badge: body.badge || "",
      channels: body.channels || "4 Channel",
      price: formattedPrice,
      priceNumber: priceNum,
      image: body.image || "/imgs/products/home office - 4 channel.webp",
      description: body.description || "",
      includes: Array.isArray(body.includes)
        ? body.includes
        : typeof body.includes === "string"
        ? body.includes.split("\n").filter(Boolean)
        : [],
      footerNote: body.footerNote || "Garansi Unit Resmi 1 Tahun",
    };

    // 1. Simpan ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase.from("products").insert({
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        sub_category: newProduct.subCategory,
        badge: newProduct.badge,
        channels: newProduct.channels,
        price: newProduct.price,
        price_number: newProduct.priceNumber,
        image: newProduct.image,
        description: newProduct.description,
        includes: newProduct.includes,
        footer_note: newProduct.footerNote,
      });

      if (dbErr) {
        console.warn("Supabase insert product error:", dbErr.message);
      }
    }

    // 2. Simpan ke local cache
    products.unshift(newProduct);
    await saveProducts(products);

    return NextResponse.json(
      { message: "Produk berhasil ditambahkan", product: newProduct },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambah produk";
    return NextResponse.json({ message }, { status: 500 });
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
    const products: ProductItem[] = await getProducts();

    const index = products.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const priceNum =
      typeof body.priceNumber === "number"
        ? body.priceNumber
        : parseInt(String(body.priceNumber || "0").replace(/[^0-9]/g, "")) || 0;

    const formattedPrice =
      body.price ||
      (priceNum > 0
        ? `Rp ${priceNum.toLocaleString("id-ID")}`
        : "Hubungi Admin");

    const oldProduct = products[index];
    const newImage = body.image;

    // Hapus file gambar lama jika foto diganti
    if (oldProduct.image && newImage && oldProduct.image !== newImage) {
      await deleteStoredImage(oldProduct.image);
    }

    products[index] = {
      ...products[index],
      ...body,
      priceNumber: priceNum,
      price: formattedPrice,
      includes: Array.isArray(body.includes)
        ? body.includes
        : typeof body.includes === "string"
        ? body.includes.split("\n").filter(Boolean)
        : products[index].includes,
    };

    // 1. Update ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase
        .from("products")
        .update({
          name: products[index].name,
          category: products[index].category,
          sub_category: products[index].subCategory,
          badge: products[index].badge,
          channels: products[index].channels,
          price: products[index].price,
          price_number: products[index].priceNumber,
          image: products[index].image,
          description: products[index].description,
          includes: products[index].includes,
          footer_note: products[index].footerNote,
        })
        .eq("id", products[index].id);

      if (dbErr) {
        console.warn("Supabase update product error:", dbErr.message);
      }
    }

    // 2. Simpan ke local cache
    await saveProducts(products);

    return NextResponse.json({
      message: "Produk berhasil diperbarui",
      product: products[index],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui produk";
    return NextResponse.json({ message }, { status: 500 });
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
        { message: "ID produk wajib disertakan" },
        { status: 400 }
      );
    }

    let products: ProductItem[] = await getProducts();
    const prodToDelete = products.find((p) => p.id === id);

    if (!prodToDelete) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file gambar produk jika tersimpan
    if (prodToDelete.image) {
      await deleteStoredImage(prodToDelete.image);
    }

    // 1. Hapus dari Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      const { error: dbErr } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (dbErr) {
        console.warn("Supabase delete product error:", dbErr.message);
      }
    }

    // 2. Hapus dari local cache
    products = products.filter((p) => p.id !== id);
    await saveProducts(products);

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus produk";
    return NextResponse.json({ message }, { status: 500 });
  }
}
