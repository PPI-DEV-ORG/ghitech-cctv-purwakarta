import { Metadata } from "next";
import { getProducts } from "@/app/lib/storage";
import AdminProductClient from "./AdminProductClient";

export const metadata: Metadata = {
  title: "Admin Katalog | G-Tech CCTV Purwakarta",
  description: "Panel pengelolaan katalog paket dan produk G-Tech CCTV Purwakarta",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProdukPage() {
  const products = await getProducts();

  return <AdminProductClient initialProducts={products} />;
}

