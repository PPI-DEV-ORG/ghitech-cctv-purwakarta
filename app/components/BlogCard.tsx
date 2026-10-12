import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "./Icons";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:border-amber hover:shadow-md">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-mono text-muted">
              G-Tech CCTV Blog
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-block rounded-md bg-blue-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-white">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-2.5 flex items-center gap-3 text-xs text-muted">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="mb-2 text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-amber transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`} className="no-underline text-ink hover:text-amber">
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-[13px] text-muted leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 p-5 pt-3 sm:px-6 flex items-center justify-between text-xs">
        <span className="text-muted font-medium">{post.author}</span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-bold text-amber hover:text-[#083870] no-underline"
        >
          Baca Selengkapnya
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

