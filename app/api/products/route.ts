import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/app/lib/storage";
import { ProductItem } from "@/app/components/ProductCard";

function verifyPassword(req: NextRequest): boolean {
  const adminPass = process.env.BLOG_ADMIN_PASSWORD || "ghitechadmin2026";
  const authHeader = req.headers.get("x-admin-password");
  return authHeader === adminPass;
}

export async function GET() {
  const products = getProducts();
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
    const products: ProductItem[] = getProducts();

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

    products.unshift(newProduct);
    saveProducts(products);

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
    const products: ProductItem[] = getProducts();

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

    saveProducts(products);

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

    let products: ProductItem[] = getProducts();
    const exists = products.some((p) => p.id === id);

    if (!exists) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    products = products.filter((p) => p.id !== id);
    saveProducts(products);

    return NextResponse.json({
      message: "Produk berhasil dihapus",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus produk";
    return NextResponse.json({ message }, { status: 500 });
  }
}

