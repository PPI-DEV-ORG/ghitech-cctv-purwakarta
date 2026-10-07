"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductItem } from "@/app/components/ProductCard";
import ProductEditorModal from "./ProductEditorModal";

interface ProductAdminTableProps {
  initialProducts: ProductItem[];
  adminPass: string;
  onLogout: () => void;
}

export default function ProductAdminTable({
  initialProducts,
  adminPass,
  onLogout,
}: ProductAdminTableProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.channels.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod: ProductItem) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus paket produk "${name}" dari katalog? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": adminPass },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Gagal menghapus produk");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus produk.");
    } finally {
      setDeletingId(null);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const updated = await res.json();
        setProducts(updated);
      }
    } catch {}
  };

  return (
    <div className="w-full">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Katalog Produk & Paket</h1>
          <p className="text-sm text-slate-500">
            Kelola paket instalasi, harga retail, item include, dan badge promo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-[#0b4f9c] hover:bg-[#093e7a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Paket Baru
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama paket atau channel..."
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4f9c]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Kategori:</span>
          {[
            { id: "all", label: "Semua" },
            { id: "office", label: "Office & Toko" },
            { id: "baby", label: "Baby & Home" },
            { id: "smartbox", label: "Smart Box" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#0b4f9c] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-semibold text-slate-700">Tidak ada paket produk yang cocok</p>
            <p className="text-sm mt-1">Coba sesuaikan kata kunci pencarian atau kategori.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Paket Produk</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Item Termasuk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-md overflow-hidden bg-slate-50 shrink-0 border border-slate-200 flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400">No Img</span>
                          )}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 line-clamp-1">{item.name}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0b4f9c] border border-blue-200">
                        {item.channels}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.priceNumber > 0 ? `Rp ${item.priceNumber.toLocaleString("id-ID")}` : "Hubungi Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">
                      <span className="line-clamp-2">
                        {item.includes?.join(", ") || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/produk"
                          target="_blank"
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-[#0b4f9c] border border-slate-200 rounded hover:bg-slate-50"
                        >
                          Lihat
                        </Link>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 border border-blue-200 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id, item.name)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded cursor-pointer disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Hapus..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <ProductEditorModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
        adminPassword={adminPass}
        onSaved={refreshProducts}
      />
    </div>
  );
}

