"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductItem } from "@/app/components/ProductCard";
import ProductAdminTable from "./ProductAdminTable";

interface AdminProductClientProps {
  initialProducts: ProductItem[];
}

const STORAGE_KEY = "ghitech_blog_admin_pass";
const emptySubscribe = () => () => {};

export default function AdminProductClient({ initialProducts }: AdminProductClientProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminPass, setAdminPass] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    fetch("/api/blogs/verify", {
      headers: { "x-admin-password": saved },
    })
      .then((res) => {
        if (res.ok) {
          setAdminPass(saved);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Masukkan password admin.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/blogs/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password.trim(),
        },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Password salah.");
        return;
      }

      sessionStorage.setItem(STORAGE_KEY, password);
      setAdminPass(password);
      setPassword("");
    } catch {
      setError("Terjadi kesalahan jaringan saat verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminPass(null);
  };

  // SSR dan Unauthenticated view
  if (!isClient || !adminPass) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="relative w-9 h-9">
                <Image
                  src="/imgs/logo.png"
                  alt="G-Tech Purwakarta"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0b4f9c]">
                G-TECH <span className="text-[#d32f2f]">CATALOG</span>
              </span>
            </Link>
            <h2 className="text-lg font-semibold text-slate-800">
              Portal Admin Katalog CCTV
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan password admin untuk mengelola paket dan harga retail.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4f9c]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0b4f9c] hover:bg-[#093e7a] text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard Katalog"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-slate-500 hover:text-[#0b4f9c] transition-colors"
            >
              ← Beranda
            </Link>
            <Link
              href="/admin/blog"
              className="text-slate-500 hover:text-[#0b4f9c] transition-colors"
            >
              Admin Blog →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/imgs/logo.png"
                  alt="G-Tech"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-base text-[#0b4f9c]">
                G-TECH <span className="text-[#d32f2f]">CATALOG</span>
              </span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white bg-[#0b4f9c] px-2.5 py-1 rounded-md">
                Katalog Produk
              </span>
              <Link
                href="/admin/blog"
                className="text-xs font-medium text-slate-600 hover:text-[#0b4f9c] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                Blog & Artikel
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/produk"
              target="_blank"
              className="text-xs font-semibold text-slate-600 hover:text-[#0b4f9c] transition-colors"
            >
              Lihat Halaman Katalog ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductAdminTable
          initialProducts={initialProducts}
          adminPass={adminPass}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
}

