import Header from "../components/Header";
import Footer from "../components/Footer";
import BlogListClient from "./BlogListClient";
import blogsData from "../../data/blogs.json";
import { BlogPost } from "../components/BlogCard";

export const metadata = {
  title: "Blog & Tips CCTV Purwakarta | G-Tech CCTV",
  description:
    "Panduan memilih CCTV, tips instalasi kamera, cara merawat NVR/DVR, dan info keamanan properti di Purwakarta.",
};

export default function BlogPage() {
  const blogs = blogsData as BlogPost[];

  return (
    <>
      <Header />

      <section className="border-b border-border bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
            BLOG &amp; TIPS KEAMANAN
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Panduan &amp; Informasi Seputar CCTV
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-muted leading-relaxed">
            Tips memilih spesifikasi kamera, panduan setting aplikasi HP, dan solusi pemeliharaan CCTV untuk rumah serta bisnis Anda.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <BlogListClient initialBlogs={blogs} />
        </div>
      </section>

      <Footer />
    </>
  );
}

