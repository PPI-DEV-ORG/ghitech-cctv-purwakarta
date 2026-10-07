import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon, MapPinIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-50/70 py-12 pb-9 text-[13.5px] text-muted">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="relative mb-4 h-12 w-48">
              <Image
                src="/logo.png"
                alt="G-Tech CCTV Purwakarta"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-[300px] leading-relaxed text-muted text-[13px]">
              Toko retail & vendor penyedia jasa pasang CCTV, IP camera, DVR/NVR,
              smart door lock, dan akses kontrol terpercaya untuk Purwakarta dan sekitarnya.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Unit Original & Garansi Resmi 1 Tahun
            </div>
          </div>

          <div>
            <h5 className="mb-3.5 font-mono text-[12px] font-bold uppercase tracking-wider text-ink">
              PRODUK &amp; PAKET
            </h5>
            <div className="flex flex-col space-y-2">
              <Link href="/produk" className="text-muted no-underline hover:text-amber">
                Paket CCTV Rumah &amp; Ruko
              </Link>
              <Link href="/produk" className="text-muted no-underline hover:text-amber">
                Paket CCTV Kantor &amp; Toko
              </Link>
              <Link href="/produk" className="text-muted no-underline hover:text-amber">
                Smart Baby Cam Wireless
              </Link>
              <Link href="/produk" className="text-muted no-underline hover:text-amber">
                CCTV Pabrik &amp; Gudang (Enterprise)
              </Link>
              <Link href="/produk" className="text-muted no-underline hover:text-amber">
                Aksesori, Kabel &amp; HDD CCTV
              </Link>
            </div>
          </div>

          <div>
            <h5 className="mb-3.5 font-mono text-[12px] font-bold uppercase tracking-wider text-ink">
              PERUSAHAAN
            </h5>
            <div className="flex flex-col space-y-2">
              <Link href="/tentang" className="text-muted no-underline hover:text-amber">
                Tentang Ghitech
              </Link>
              <Link href="/#proses" className="text-muted no-underline hover:text-amber">
                Proses Kerja &amp; Instalasi
              </Link>
              <Link href="/#cakupan" className="text-muted no-underline hover:text-amber">
                Area Jangkauan Layanan
              </Link>
              <Link href="/blog" className="text-muted no-underline hover:text-amber">
                Blog &amp; Tips Keamanan
              </Link>
            </div>
          </div>

          <div>
            <h5 className="mb-3.5 font-mono text-[12px] font-bold uppercase tracking-wider text-ink">
              KONTAK KAMI
            </h5>
            <div className="flex flex-col space-y-2.5">
              <a
                href="https://wa.me/6287722686440"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted no-underline hover:text-amber font-medium"
              >
                <WhatsAppIcon size={15} />
                WhatsApp: 0877-2268-6440
              </a>
              <a
                href="mailto:distri.cctv.purwakarta@gmail.com"
                className="text-muted no-underline hover:text-amber transition-colors"
              >
                Email: distri.cctv.purwakarta@gmail.com
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jl.+Wanayasa-Bojong-Sawit,+RT.001/RW.001,+Kp+Nenggeng,+Neglasari,+Kec.+Darangdan,+Kab.+Purwakarta,+Jawa+Barat+41163"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted flex items-start gap-1.5 leading-relaxed text-[12.5px] no-underline hover:text-amber transition-colors"
              >
                <MapPinIcon className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                <span>
                  Jl. Wanayasa-Bojong-Sawit, RT.001/RW.001, Kp Nenggeng, Neglasari,
                  Kec. Darangdan, Kab. Purwakarta, Jawa Barat 41163
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-2.5 text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} G-Tech CCTV Purwakarta. All rights reserved.</span>
          <div className="flex items-center gap-3 text-gray-400">
            <span>Unit Retail Resmi CV. Ghina Multiprima</span>
            <span>•</span>
            <Link href="/admin/produk" className="hover:text-amber text-gray-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

