import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowRightIcon, WhatsAppIcon } from "../../components/Icons";
import blogsData from "../../../data/blogs.json";
import { BlogPost } from "../../components/BlogCard";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = blogsData as BlogPost[];
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blogs = blogsData as BlogPost[];
  const post = blogs.find((b) => b.slug === slug);
  if (!post) {
    return { title: "Artikel Tidak Ditemukan — G-Tech CCTV Purwakarta" };
  }
  return {
    title: `${post.title} — G-Tech CCTV Purwakarta`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blogs = blogsData as BlogPost[];
  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogs.filter((b) => b.id !== post.id).slice(0, 2);

  return (
    <>
      <Header />

      <article className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[800px] px-5 sm:px-8">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-amber no-underline"
            >
              ← Kembali ke Daftar Blog
            </Link>
          </div>

          <div className="mb-6">
            <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-amber">
              {post.category}
            </span>
          </div>

          <h1 className="mb-4 text-2xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mb-8 flex items-center gap-4 border-b border-border pb-6 text-xs text-muted">
            <span>Ditulis oleh: <strong className="text-ink">{post.author}</strong></span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {post.image && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line space-y-4">
            {post.content}
          </div>

          {/* Contact Box Callout */}
          <div className="mt-12 rounded-xl border border-border bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink">
                Butuh Pemasangan atau Konsultasi CCTV?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Tim teknisi G-Tech siap survei lokasi langsung ke rumah atau tempat usaha Anda di Purwakarta.
              </p>
            </div>
            <a
              href="https://wa.me/6287722686440"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-amber px-5 py-3 text-xs sm:text-sm font-bold text-white no-underline shadow-xs hover:bg-[#083870] transition-colors"
            >
              <WhatsAppIcon size={16} />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h3 className="mb-6 text-lg font-bold text-ink">Artikel Lainnya</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedPosts.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-border p-5 hover:border-amber transition-colors"
                  >
                    <span className="text-[11px] font-mono text-amber font-semibold block mb-1">
                      {r.category}
                    </span>
                    <h4 className="font-bold text-sm text-ink mb-2 line-clamp-2">
                      <Link href={`/blog/${r.slug}`} className="no-underline text-ink hover:text-amber">
                        {r.title}
                      </Link>
                    </h4>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber no-underline"
                    >
                      Baca Artikel
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}

