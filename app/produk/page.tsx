import Header from "../components/Header";
import Footer from "../components/Footer";
import CatalogFilter from "../components/CatalogFilter";
import WarrantySection from "../components/WarrantySection";
import FaqSection from "../components/FaqSection";
import productsData from "../../data/products.json";
import { ProductItem } from "../components/ProductCard";

export const metadata = {
  title: "Katalog & Paket Pasang CCTV Purwakarta | G-Tech CCTV",
  description:
    "Katalog harga dan paket instalasi CCTV siap pasang untuk rumah, toko, kantor dan gudang di Purwakarta dan sekitarnya. Termasuk hard disk, kabel, dan garansi resmi 1 tahun.",
};

export default function ProdukPage() {
  const products = productsData as ProductItem[];

  return (
    <>
      <Header />

      {/* Header Banner */}
      <section className="border-b border-border bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
            KATALOG &amp; PAKET SIAP PASANG
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Paket CCTV Bergaransi Resmi Purwakarta
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-muted leading-relaxed">
            Dapatkan paket CCTV lengkap (kamera, DVR/NVR, hard disk surveillance, kabel, dan jasa pasang teknisi).
            Tersedia pilihan untuk rumah, ruko, kantor, hingga pengawasan industri.
          </p>
        </div>
      </section>

      {/* Main Catalog with Filters */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <CatalogFilter products={products} />
        </div>
      </section>

      {/* 1 Year Warranty */}
      <WarrantySection />

      {/* FAQ */}
      <FaqSection />

      <Footer />
    </>
  );
}

