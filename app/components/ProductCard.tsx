import React from "react";
import Image from "next/image";
import { CheckIcon, WhatsAppIcon, ShieldCheckIcon } from "./Icons";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  badge?: string;
  channels: string;
  price: string;
  priceNumber: number;
  image: string;
  description: string;
  includes: string[];
  footerNote: string;
}

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Logic: Paket kamera 8 atau lebih tidak menampilkan harga angka
  const isEightOrMore =
    product.channels.includes("8") ||
    product.channels.includes("16") ||
    product.channels.includes("32") ||
    product.id.includes("8ch") ||
    product.id.includes("babycam-8") ||
    product.category === "smartbox";

  const waMessage = `Halo G-Tech CCTV Purwakarta, saya tertarik dan ingin konsultasi mengenai ${product.name}. Mohon info ketersediaan dan penawaran terbaiknya.`;
  const waUrl = `https://wa.me/6287722686440?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-white p-5 sm:p-6 transition-all duration-200 hover:border-amber hover:shadow-lg">
      <div>
        {/* Top Channel Badge & Tag */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-amber">
            {product.channels}
          </span>
          {product.badge && (
            <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-bold text-rec">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative mb-5 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Title & Desc */}
        <h3 className="mb-2 text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-amber transition-colors">
          {product.name}
        </h3>
        <p className="mb-4 text-xs sm:text-[13px] text-muted leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Includes Checklist */}
        <div className="mb-5 space-y-2 border-t border-slate-100 pt-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            Paket Termasuk:
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {product.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-amber">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mt-2">
        {/* Price Section */}
        <div className="mb-4">
          <span className="block text-[11px] font-mono text-muted uppercase">
            Estimasi Biaya Paket
          </span>
          {isEightOrMore ? (
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-amber">
                Hubungi Admin
              </span>
              <span className="text-[11px] font-medium text-muted">
                (Harga Khusus Proyek)
              </span>
            </div>
          ) : (
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-ink">
                {product.price}
              </span>
              <span className="text-[11px] text-muted">/ paket siap pasang</span>
            </div>
          )}
        </div>

        {/* Delivery / Warranty Note */}
        <div className="mb-3.5 flex items-center gap-1.5 text-[11px] text-muted">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Garansi 1 Tahun &amp; Termasuk Training HP</span>
        </div>

        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber px-4 py-2.5 text-xs sm:text-sm font-bold text-white no-underline shadow-xs hover:bg-[#083870] transition-colors"
        >
          <WhatsAppIcon size={16} />
          {isEightOrMore ? "Konsultasi & Cek Harga via Admin" : "Pesan & Konsultasi Paket"}
        </a>
      </div>
    </div>
  );
}

