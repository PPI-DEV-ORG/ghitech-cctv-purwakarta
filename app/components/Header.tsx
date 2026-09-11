"use client";

import { useState } from "react";
import { WhatsAppIcon } from "./Icons";

const NAV_LINKS = [
  { href: "#produk", label: "Produk" },
  { href: "#paket", label: "Paket instalasi" },
  { href: "#proses", label: "Proses kerja" },
  { href: "#cakupan", label: "Area layanan" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-7">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col leading-tight">
            <img src="logo.png" className="w-32" />
          </div>
        </div>

        <div className="hidden items-center gap-8 text-[14.5px] md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted no-underline transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#kontak"
          className="hidden items-center gap-2 whitespace-nowrap rounded-sm bg-amber px-[18px] py-2.5 text-[14px] font-semibold text-white no-underline md:inline-flex"
        >
          <WhatsAppIcon />
          Konsultasi WhatsApp
        </a>

        <button
          className="cursor-pointer border-0 bg-transparent text-[22px] text-ink md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col border-b border-border bg-bg md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-border px-7 py-3.5 text-[14.5px] text-muted no-underline"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            onClick={() => setOpen(false)}
            className="border-t border-border px-7 py-3.5 text-[14.5px] text-muted no-underline"
          >
            Konsultasi WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
