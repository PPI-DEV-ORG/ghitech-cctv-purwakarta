"use client";

import { useState, useMemo } from "react";
import BlogCard, { BlogPost } from "../components/BlogCard";

interface BlogListClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("Semua");
    initialBlogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [initialBlogs]);

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((post) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === "Semua" || post.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [initialBlogs, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Searchbar & Category Filter */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel, tips CCTV, panduan..."
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-xs sm:text-sm text-ink outline-none focus:border-amber"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-muted hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-amber text-white shadow-xs"
                  : "border border-border bg-white text-muted hover:border-amber hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Blogs */}
      {filteredBlogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted">
          Tidak ada artikel yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

