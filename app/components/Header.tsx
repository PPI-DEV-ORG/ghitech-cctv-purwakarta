"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon } from "./Icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/produk", label: "Produk & Paket CCTV" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/blog", label: "Blog & Tips" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="relative h-11 w-44 sm:h-12 sm:w-52">
            <Image
              src="/logo.png"
              alt="G-Tech CCTV Purwakarta"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-[14.5px] font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted no-underline transition-colors hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href="https://wa.me/6287722686440"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 whitespace-nowrap rounded-md bg-amber px-4 py-2.5 text-[14px] font-semibold text-white no-underline shadow-xs hover:bg-[#083870] transition-colors md:inline-flex"
        >
          <WhatsAppIcon size={16} />
          Konsultasi WhatsApp
        </a>

        <button
          className="cursor-pointer border-0 bg-transparent text-[24px] text-ink md:hidden p-1"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col border-b border-border bg-white md:hidden animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-border px-6 py-3.5 text-[15px] font-medium text-ink no-underline hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/6287722686440"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="border-t border-border bg-slate-50 px-6 py-3.5 text-[15px] font-bold text-amber no-underline flex items-center gap-2"
          >
            <WhatsAppIcon size={16} />
            Konsultasi WhatsApp (0877-2268-6440)
          </a>
        </div>
      )}
    </header>
  );
}
