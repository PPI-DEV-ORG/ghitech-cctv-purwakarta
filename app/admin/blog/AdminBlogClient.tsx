"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/app/components/BlogCard";
import BlogAdminTable from "./BlogAdminTable";

interface AdminBlogClientProps {
  initialBlogs: BlogPost[];
}

const STORAGE_KEY = "ghitech_blog_admin_pass";
const emptySubscribe = () => () => {};

export default function AdminBlogClient({ initialBlogs }: AdminBlogClientProps) {
  const [password, setPassword] = useState("");
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
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Password salah.");
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

  // Not authenticated: Show Login Card (also rendered consistently on SSR)
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
                G-TECH <span className="text-[#d32f2f]">ADMIN</span>
              </span>
            </Link>
            <h2 className="text-lg font-semibold text-slate-800">
              Portal Admin Blog & Artikel
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan password admin untuk mengelola artikel publik.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4f9c]"
              />
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
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-[#0b4f9c] transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Show Dashboard Table
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
                G-TECH <span className="text-[#d32f2f]">PANEL</span>
              </span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/produk"
                className="text-xs font-medium text-slate-600 hover:text-[#0b4f9c] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                Katalog Produk
              </Link>
              <span className="text-xs font-semibold text-white bg-[#0b4f9c] px-2.5 py-1 rounded-md">
                Blog & Artikel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="text-xs font-semibold text-slate-600 hover:text-[#0b4f9c] transition-colors"
            >
              Lihat Halaman Blog ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogAdminTable
          initialBlogs={initialBlogs}
          adminPass={adminPass}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
}

