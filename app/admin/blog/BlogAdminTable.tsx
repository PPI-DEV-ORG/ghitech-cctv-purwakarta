"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/app/components/BlogCard";
import BlogEditorModal from "./BlogEditorModal";

interface BlogAdminTableProps {
  initialBlogs: BlogPost[];
  adminPass: string;
  onLogout: () => void;
}

export default function BlogAdminTable({
  initialBlogs,
  adminPass,
  onLogout,
}: BlogAdminTableProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = [
    "Semua",
    ...Array.from(new Set(blogs.map((b) => b.category))),
  ];

  const filtered = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "Semua" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": adminPass },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus artikel");
        return;
      }
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus artikel.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Blog & Artikel</h1>
          <p className="text-sm text-slate-500">
            Kelola publikasi panduan, edukasi CCTV, dan update promo G-Tech.
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
            Tulis Artikel Baru
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
            placeholder="Cari judul atau ringkasan artikel..."
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4f9c]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0b4f9c] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-semibold text-slate-700">Tidak ada artikel yang cocok</p>
            <p className="text-sm mt-1">Coba ubah kata kunci pencarian atau kategori.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Artikel</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Penulis</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-md">
                          <Link
                            href={`/blog/${item.slug}`}
                            target="_blank"
                            className="font-semibold text-slate-900 hover:text-[#0b4f9c] line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0b4f9c] border border-blue-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                      {item.author}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${item.slug}`}
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
                          onClick={() => handleDelete(item.id, item.title)}
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
      <BlogEditorModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingBlog(null);
        }}
        post={editingBlog}
        adminPassword={adminPass}
        onSaved={async () => {
          try {
            const res = await fetch("/api/blogs");
            if (res.ok) {
              const updated = await res.json();
              setBlogs(updated);
            }
          } catch {}
        }}
      />
    </div>
  );
}

