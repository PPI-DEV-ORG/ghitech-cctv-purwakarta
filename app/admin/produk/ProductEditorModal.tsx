"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductItem } from "@/app/components/ProductCard";

interface ProductEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  adminPassword: string;
  onSaved: () => void;
}

const CATEGORIES = [
  { value: "all", label: "Semua" },
  { value: "office", label: "Kamera Office / Toko" },
  { value: "baby", label: "Kamera Baby / Home" },
  { value: "smartbox", label: "Smart IoT & Box" },
];

export default function ProductEditorModal({
  open,
  onOpenChange,
  product,
  adminPassword,
  onSaved,
}: ProductEditorModalProps) {
  const [prevProduct, setPrevProduct] = useState<ProductItem | null | undefined>(product);
  const [formData, setFormData] = useState<Partial<ProductItem>>(() =>
    product
      ? product
      : {
          name: "",
          category: "office",
          subCategory: "home_office",
          badge: "",
          channels: "4 Channel",
          price: "Rp 3.850.000",
          priceNumber: 3850000,
          image: "/imgs/products/home office - 4 channel.webp",
          description: "",
          includes: [
            "4 Unit Kamera Resolusi HD",
            "1 Unit NVR/DVR Recorder",
            "1 Unit Harddisk Surveillance",
            "Kabel Instalasi Lengkap",
            "Jasa Pemasangan & Konfigurasi",
          ],
          footerNote: "Garansi Resmi Unit & Sparepart 1 Tahun",
        }
  );

  const [includesText, setIncludesText] = useState<string>(() =>
    (product?.includes || [
      "4 Unit Kamera Resolusi HD",
      "1 Unit NVR/DVR Recorder",
      "1 Unit Harddisk Surveillance",
      "Kabel Instalasi Lengkap",
      "Jasa Pemasangan & Konfigurasi",
    ]).join("\n")
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(() => product?.image || "");

  // Sinkronisasi saat product prop berganti
  if (product !== prevProduct) {
    setPrevProduct(product);
    if (product) {
      setFormData(product);
      setIncludesText(product.includes.join("\n"));
      setPreviewUrl(product.image || "");
    } else {
      setFormData({
        name: "",
        category: "office",
        subCategory: "home_office",
        badge: "",
        channels: "4 Channel",
        price: "Rp 3.850.000",
        priceNumber: 3850000,
        image: "/imgs/products/home office - 4 channel.webp",
        description: "",
        includes: [
          "4 Unit Kamera Resolusi HD",
          "1 Unit NVR/DVR Recorder",
          "1 Unit Harddisk Surveillance",
          "Kabel Instalasi Lengkap",
          "Jasa Pemasangan & Konfigurasi",
        ],
        footerNote: "Garansi Resmi Unit & Sparepart 1 Tahun",
      });
      setIncludesText(
        [
          "4 Unit Kamera Resolusi HD",
          "1 Unit NVR/DVR Recorder",
          "1 Unit Harddisk Surveillance",
          "Kabel Instalasi Lengkap",
          "Jasa Pemasangan & Konfigurasi",
        ].join("\n")
      );
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setError("");
  }

  const handleFileSelect = (file: File) => {
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(`Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimal 2 MB.`);
      return;
    }
    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Nama paket produk wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let finalImageUrl = formData.image || "/imgs/products/home office - 4 channel.webp";

      // Upload file gambar jika ada yang baru
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-admin-password": adminPassword },
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.message || "Gagal mengunggah foto produk.");
        }
        finalImageUrl = uploadJson.url;
      }

      const parsedIncludes = includesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const priceNum = Number(formData.priceNumber) || 0;
      const formattedPrice =
        priceNum > 0 ? `Rp ${priceNum.toLocaleString("id-ID")}` : "Hubungi Admin";

      const payload = {
        ...formData,
        priceNumber: priceNum,
        price: formattedPrice,
        image: finalImageUrl,
        includes: parsedIncludes,
      };

      const isEditing = !!product?.id;
      const res = await fetch("/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || "Gagal menyimpan produk.");
      }

      onSaved();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan produk.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-5xl rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-ink">
              {product ? "Edit Paket / Produk CCTV" : "Tambah Paket CCTV Baru"}
            </h3>
            <span className="text-xs text-muted">
              Kelola katalog paket retail & spesifikasi yang tampil di website.
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-slate-200 hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              {error}
            </div>
          )}

          {/* Nama Produk & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Nama Paket Produk *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Paket CCTV Home Office 4 Channel Full HD"
                required
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Badge / Tag Promo</label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Contoh: Terpopuler Ruko"
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
          </div>

          {/* Kategori, Channels, Harga Angka */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Kategori</label>
              <select
                value={formData.category || "office"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              >
                {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Kapasitas Channel</label>
              <input
                type="text"
                value={formData.channels || ""}
                onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                placeholder="Contoh: 4 Channel atau 8 Channel"
                required
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Harga (Angka IDR)</label>
              <input
                type="number"
                value={formData.priceNumber || 0}
                onChange={(e) => setFormData({ ...formData, priceNumber: Number(e.target.value) })}
                placeholder="3850000 (0 = Hubungi Admin)"
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
              <span className="text-[10px] text-muted">
                Tip: Untuk paket 8 channel ke atas otomatis tampil &quot;Hubungi Admin&quot;.
              </span>
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Deskripsi Singkat Paket</label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan peruntukan tempat, tipe ruangan, dan keunggulan paket ini..."
              className="w-full rounded-lg border border-border bg-white p-3 text-xs sm:text-sm text-ink outline-none focus:border-amber"
            />
          </div>

          {/* Item Termasuk Paket (Includes) */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Daftar Paket Termasuk (1 baris per item) *
            </label>
            <textarea
              rows={4}
              value={includesText}
              onChange={(e) => setIncludesText(e.target.value)}
              placeholder="4 Unit Kamera HD Weatherproof&#10;1 Unit DVR/NVR Dedicated&#10;1 Unit Harddisk Surveillance 1TB&#10;Jasa Pasang & Setting Smartphone"
              className="w-full rounded-lg border border-border bg-white p-3 font-mono text-xs sm:text-sm text-ink outline-none focus:border-amber"
            />
          </div>

          {/* Footer Note Garansi */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Catatan Garansi / Layanan</label>
            <input
              type="text"
              value={formData.footerNote || ""}
              onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
              placeholder="Contoh: Sudah Termasuk Jasa Training Penggunaan dan Akomodasi Teknisi"
              className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
            />
          </div>

          {/* Foto Produk */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Foto Paket Produk</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-dashed border-border p-4 bg-slate-50">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-white border border-border flex items-center justify-center">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-contain p-1" sizes="128px" />
                ) : (
                  <span className="text-[11px] text-muted">No Image</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5 w-full">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                  }}
                  className="text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-amber hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[11px] text-muted">
                  Format gambar: WEBP, PNG, JPG (Maks. 2 MB). Otomatis tersimpan ke /imgs/blog/ atau pilih gambar katalog default.
                </p>
                <input
                  type="text"
                  value={formData.image || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="Atau masukkan path gambar, misal /imgs/products/..."
                  className="w-full rounded-md border border-border bg-white px-2.5 py-1 text-xs text-ink outline-none focus:border-amber"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border px-4 py-2 text-xs sm:text-sm font-semibold text-muted hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#083870] disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Menyimpan..." : product ? "Simpan Perubahan" : "Tambah ke Katalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

