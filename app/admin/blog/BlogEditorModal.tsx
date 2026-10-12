"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BlogPost } from "../../components/BlogCard";
import { RichTextEditor } from "./RichTextEditor";

interface BlogEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  adminPassword: string;
  onSaved: () => void;
}

const CATEGORY_OPTIONS = [
  "Keamanan & Tips",
  "Teknologi CCTV",
  "Layanan & Maintenance",
  "Tutorial & Panduan",
  "Proyek & Portofolio",
];

export function BlogEditorModal({
  open,
  onOpenChange,
  post,
  adminPassword,
  onSaved,
}: BlogEditorModalProps) {
  const [prevPost, setPrevPost] = useState<BlogPost | null | undefined>(post);
  const [formData, setFormData] = useState<Partial<BlogPost>>(() =>
    post
      ? post
      : {
          title: "",
          slug: "",
          category: "Keamanan & Tips",
          excerpt: "",
          content: "",
          author: "Tim G-Tech CCTV Purwakarta",
          image: "",
          readTime: "5 min baca",
        }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(() => post?.image || "");

  // Update state when post changes during render
  if (post !== prevPost) {
    setPrevPost(post);
    if (post) {
      setFormData(post);
      setPreviewUrl(post.image || "");
    } else {
      setFormData({
        title: "",
        slug: "",
        category: "Keamanan & Tips",
        excerpt: "",
        content: "",
        author: "Tim G-Tech CCTV Purwakarta",
        image: "",
        readTime: "5 min baca",
      });
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setError("");
  }

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!post) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, title, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

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
    if (!formData.title?.trim()) {
      setError("Judul artikel wajib diisi.");
      return;
    }
    if (!formData.content?.trim()) {
      setError("Isi artikel wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let finalImageUrl = formData.image || "";

      // Upload file jika ada yang dipilih
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "x-admin-password": adminPassword,
          },
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.message || "Gagal mengunggah gambar.");
        }
        finalImageUrl = uploadJson.url;
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
      };

      const isEditing = !!post?.id;
      const res = await fetch("/api/blogs", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.message || "Gagal menyimpan artikel.");
      }

      onSaved();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan artikel.";
      setError(message);
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
              {post ? "Edit Artikel Blog" : "Tulis Artikel Baru"}
            </h3>
            <span className="text-xs text-muted">
              {post ? `Mengubah artikel ID: ${post.id}` : "Publikasikan artikel baru ke G-Tech Blog"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm text-muted hover:bg-slate-200 cursor-pointer"
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

          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Judul Artikel *</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="Contoh: Tips Memilih CCTV Outdoor Rumah..."
                required
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Slug URL</label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="tips-memilih-cctv-outdoor"
                required
                className="w-full rounded-lg border border-border bg-slate-50 font-mono px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
          </div>

          {/* Category, Author, Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Kategori</label>
              <select
                value={formData.category || "Keamanan & Tips"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Penulis</label>
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Tim G-Tech Purwakarta"
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Waktu Baca</label>
              <input
                type="text"
                value={formData.readTime || ""}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min baca"
                className="w-full rounded-lg border border-border bg-white px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-amber"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Ringkasan Singkat (Excerpt)</label>
            <textarea
              rows={2}
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Deskripsi 1-2 kalimat untuk preview card..."
              className="w-full rounded-lg border border-border bg-white p-3 text-xs sm:text-sm text-ink outline-none focus:border-amber"
            />
          </div>

          {/* Thumbnail Image Upload */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Thumbnail Gambar (Maks 2 MB)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-dashed border-border bg-slate-50 p-4">
              {previewUrl ? (
                <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-border bg-white shrink-0">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-24 w-36 items-center justify-center rounded-lg border border-border bg-white text-xs text-muted shrink-0 font-mono">
                  No Image
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                  className="block w-full text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-amber file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-[#083870]"
                />
                <span className="block text-[11px] text-muted">
                  Format didukung: JPG, PNG, WEBP. Otomatis disimpan ke <strong className="font-mono">/imgs/blog/</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Content (RichTextEditor) */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">Isi Lengkap Artikel *</label>
            <RichTextEditor
              value={formData.content || ""}
              onChange={(val) => setFormData({ ...formData, content: val })}
              placeholder="Tulis artikel lengkap di sini..."
              minHeight="240px"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
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
              {saving ? "Menyimpan..." : post ? "Simpan Perubahan" : "Publikasikan Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogEditorModal;

