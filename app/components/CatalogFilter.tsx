"use client";

import { useState } from "react";
import ProductCard, { ProductItem } from "./ProductCard";

interface CatalogFilterProps {
  products: ProductItem[];
}

export default function CatalogFilter({ products }: CatalogFilterProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "office") return p.category === "office";
    if (activeTab === "babycam") return p.category === "babycam";
    if (activeTab === "enterprise") return p.category === "smartbox" || p.channels.includes("8");
    return true;
  });

  return (
    <div className="w-full">
      {/* Tab Filter Pills */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "all"
              ? "bg-amber text-white shadow-sm"
              : "border border-border bg-white text-muted hover:border-amber hover:text-ink"
          }`}
        >
          Semua Paket ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("office")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "office"
              ? "bg-amber text-white shadow-sm"
              : "border border-border bg-white text-muted hover:border-amber hover:text-ink"
          }`}
        >
          Kamera Office &amp; Toko
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("babycam")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "babycam"
              ? "bg-amber text-white shadow-sm"
              : "border border-border bg-white text-muted hover:border-amber hover:text-ink"
          }`}
        >
          Smart Baby Cam Wireless
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("enterprise")}
          className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "enterprise"
              ? "bg-amber text-white shadow-sm"
              : "border border-border bg-white text-muted hover:border-amber hover:text-ink"
          }`}
        >
          Enterprise &amp; AI (8+ Titik)
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted">
          Tidak ada paket pada kategori ini.
        </div>
      )}
    </div>
  );
}

