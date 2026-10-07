import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard, { ProductItem } from "./components/ProductCard";
import ServiceAreaMap from "./components/ServiceAreaMap";
import {
  CheckIcon,
  WhatsAppIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CameraIcon,
  WrenchIcon,
  MapPinIcon,
} from "./components/Icons";
import productsData from "../data/products.json";

const TRUST_POINTS = [
  "Produk Resmi Original",
  "Teknisi Berpengalaman",
  "Instalasi Rapi & Berstandar",
  "Garansi 1 Tahun Penuh",
  "Support After Sales Cepat",
];

const SOLUTIONS = [
  {
    title: "Survei Lokasi & Konsultasi Gratis",
    desc: "Kami datang langsung cek sudut pandang, jarak kabel, dan titik rawan — tanpa biaya dan tanpa dipaksa beli.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Pemasangan CCTV Rumah & Ruko",
    desc: "Paket kamera indoor dan outdoor weatherproof dengan harga terjangkau, kabel dipasang rapi dan tersembunyi.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="7" width="14" height="10" rx="1.5" />
        <path d="M16 10l6-3v10l-6-3" />
      </svg>
    ),
  },
  {
    title: "Instalasi CCTV Kantor & Usaha",
    desc: "Sistem pengawasan multi-channel untuk toko, kasir, klinik, dan kantor dengan kontrol akses dan monitor terpusat.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    title: "Sistem Keamanan Pabrik & Gudang",
    desc: "Solusi IP kamera skala enterprise, NVR berkapasitas besar, PTZ zoom jauh, dan integrasi ruang sekuriti.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14" />
      </svg>
    ),
  },
  {
    title: "Maintenance & Upgrade Sistem",
    desc: "Perbaikan kamera mati, ganti hard disk rusak, pembersihan lensa berkala, atau upgrade analog ke IP kamera.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Remote Monitoring HP & Komputer",
    desc: "Pantau tayangan langsung maupun rekaman kapan saja dari smartphone atau laptop dengan panduan teknisi.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
];

const BRANDS = [
  { name: "Hikvision", logo: "/imgs/brands/hikvision.png" },
  { name: "Uniview (UNV)", logo: "/imgs/brands/uniview.png" },
  { name: "HiView", logo: "/imgs/brands/hiview.webp" },
  { name: "Bosch Security", logo: "/imgs/brands/bosch.png" },
  { name: "Hanwha Vision", logo: "/imgs/brands/hanwha.png" },
  { name: "Tiandy Technologies", logo: "/imgs/brands/tiandy.png" },
  { name: "Axis Communications", logo: "/imgs/brands/axis.png" },
  { name: "CP PLUS", logo: "/imgs/brands/cpplus.png" },
  { name: "HiSide", logo: "/imgs/brands/hiside.png" },
];

const PARTNERS = [
  { name: "Pertamina", logo: "/imgs/partners/Pertamina.png" },
  { name: "Telkom Indonesia", logo: "/imgs/partners/Telkom.png" },
  { name: "Jasa Marga", logo: "/imgs/partners/Jasa Marga.webp" },
  { name: "Pupuk Kujang", logo: "/imgs/partners/Pupuk Kujang.webp" },
  { name: "United Tractors", logo: "/imgs/partners/United Tractors.webp" },
  { name: "Unilever", logo: "/imgs/partners/Unilever.webp" },
  { name: "Kawasan Berikat Nusantara (KBN)", logo: "/imgs/partners/LogoKBN.webp" },
  { name: "Garuda Yamato Steel", logo: "/imgs/partners/Garuda Yamato Steel.webp" },
  { name: "Blibli", logo: "/imgs/partners/Blibli.webp" },
  { name: "Icon+", logo: "/imgs/partners/icon+.webp" },
  { name: "IPC Marine Pelindo", logo: "/imgs/partners/IPC Marine.png" },
  { name: "Plaza Cibubur", logo: "/imgs/partners/Plaza Cibubur.png" },
  { name: "Grand Wisata Bekasi", logo: "/imgs/partners/grand Wisata Bekasi.webp" },
  { name: "Wastec International", logo: "/imgs/partners/Wastec International.webp" },
  { name: "UTAC Manufacturing Indonesia", logo: "/imgs/partners/UTac Indo.jpeg" },
  { name: "Kementerian Agama", logo: "/imgs/partners/Kemenag.webp" },
  { name: "Multi Kontrol Nusantara", logo: "/imgs/partners/Multi Kontrol Nusantara.webp" },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Ngobrol dulu, survei lokasi gratis",
    desc: "Kami datang langsung cek titik rawan, jarak kabel, dan kondisi pencahayaan — bukan sekadar tebak-tebak dari foto.",
  },
  {
    num: "02",
    title: "Rancangan sistem & harga transparan",
    desc: "Anda menerima rincian jumlah kamera, spesifikasi perangkat, dan estimasi biaya tertulis — tidak ada biaya siluman.",
  },
  {
    num: "03",
    title: "Dipasang teknisi profesional",
    desc: "Kabel dirapikan memakai pipa pelindung, kamera disetel presisi, sesuai jadwal yang sudah Anda sepakati.",
  },
  {
    num: "04",
    title: "Uji coba & dipandu pantau dari HP",
    desc: "Sistem diuji di depan Anda, lalu teknisi kami pandu cara melihat live view dan memutar rekaman dari HP.",
  },
  {
    num: "05",
    title: "Garansi 1 tahun & support after sales",
    desc: "Ada kendala setelah pemasangan? Tim WhatsApp kami siap bantu cepat dan teknisi siap datang berkala.",
  },
];

export default function Home() {
  const allProducts = productsData as ProductItem[];
  // Featured preview packages
  const previewProducts = [
    allProducts.find((p) => p.id === "prod-ho-4ch") || allProducts[0],
    allProducts.find((p) => p.id === "prod-sec-4ch") || allProducts[2],
    allProducts.find((p) => p.id === "prod-babycam-1") || allProducts[4],
  ].filter(Boolean);

  return (
    <>
      <Header />

      {/* 1. HERO SECTION (Agresif Penjualan Retail) */}
      <section className="border-b border-border bg-gradient-to-b from-white via-blue-50/20 to-white pb-14 pt-10 sm:pb-20 sm:pt-14">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-amber">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              MASTER DEALER &amp; JASA PASANG CCTV PURWAKARTA
            </div>

            <h1 className="mb-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-tight leading-[1.15]">
              CCTV Purwakarta untuk Rumah, Toko &amp; Kantor
            </h1>

            <p className="mb-6 max-w-[540px] text-sm sm:text-base text-muted leading-relaxed">
              Konsultasi, pengadaan, pemasangan, dan maintenance CCTV di Purwakarta dan sekitarnya.
              Teknisi siap survei langsung ke lokasi Anda, harga transparan, dan bergaransi resmi 1 tahun.
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/6287722686440"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-amber px-6 py-3.5 text-xs sm:text-sm font-bold text-white no-underline shadow-md hover:bg-[#083870] transition-colors"
              >
                <WhatsAppIcon size={17} />
                Konsultasi via WhatsApp
              </a>
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-ink no-underline hover:border-amber hover:text-amber transition-colors shadow-2xs"
              >
                Lihat Paket CCTV
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Checklist Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              {TRUST_POINTS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-amber shrink-0">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src="/Hero.jpeg"
                alt="Instalasi CCTV Purwakarta"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOLUSI & JASA CCTV (Solusi Kita) */}
      <section id="solusi" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-rec">
              SOLUSI KAMI
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Layanan CCTV &amp; Sistem Keamanan Lengkap
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Dari pengawasan hunian pribadi hingga sistem keamanan terintegrasi skala pabrik, kami siap bantu mulai dari nol.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-xl border border-border bg-slate-50/50 p-6 transition-all hover:border-amber hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-amber group-hover:bg-amber group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-ink">{item.title}</h3>
                  <p className="text-xs sm:text-[13px] text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION PREVIEW CATALOG SEDIKIT */}
      <section id="paket-preview" className="border-t border-border bg-slate-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
                PILIHAN TERPOPULER
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                Paket CCTV Siap Pasang &amp; Bergaransi
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted">
                Paket lengkap sudah termasuk kamera, hard disk rekaman, adaptor, kabel, dan jasa instalasi teknisi.
              </p>
            </div>
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-amber px-4 py-2.5 text-xs sm:text-sm font-bold text-white no-underline shadow-xs hover:bg-[#083870] transition-colors"
            >
              Lihat Semua Paket Lengkap
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previewProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BRAND RESMI (Full Warna & Hover Tooltip) */}
      <section className="border-t border-border bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-8 text-center">
            <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-rec">
              BRAND RESMI TERPERCAYA
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-ink tracking-tight">
              Didukung Perangkat Berkualitas &amp; Bergaransi
            </h3>
            <p className="mt-1 text-xs text-muted">
              Pilihan kamera, NVR/DVR, dan perangkat keamanan dari prinsipal terkemuka dunia.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            {BRANDS.map((b, i) => (
              <div
                key={i}
                className="group relative flex h-24 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(20%-0.8rem)] items-center justify-center rounded-xl border border-border bg-white p-4 transition-all duration-200 hover:border-amber hover:shadow-md cursor-pointer"
              >
                {/* Floating Tooltip Name on Hover */}
                <div className="pointer-events-none absolute -top-9 z-20 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-md opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap">
                  {b.name}
                  <div className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                </div>

                <div className="relative h-10 w-full transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={b.logo}
                    alt={b.name}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENT / PARTNER KITA (Auto-Scrolling Carousel, Full Color & Hover Name) */}
      <section className="border-t border-border bg-slate-50/60 py-14 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 mb-8 text-center">
          <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-amber">
            DIPERCAYA OLEH
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-ink tracking-tight">
            Klien &amp; Instansi yang Telah Menggunakan Layanan Kami
          </h3>
          <p className="mt-1 text-xs text-muted">
            Dipercaya untuk pengawasan hunian, kawasan industri, perkantoran, dan fasilitas publik.
          </p>
        </div>

        {/* Carousel Wrapper with subtle side gradient masks */}
        <div className="relative w-full overflow-hidden pt-10 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-12 before:bg-gradient-to-r before:from-slate-50/80 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-12 after:bg-gradient-to-l after:from-slate-50/80 after:to-transparent">
          <div className="animate-marquee gap-4 py-2">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="group relative flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-white px-5 shadow-2xs transition-all duration-200 hover:border-amber hover:shadow-md cursor-pointer"
              >
                {/* Floating Tooltip Name on Hover */}
                <div className="pointer-events-none absolute -top-8 z-20 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-md opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap">
                  {p.name}
                  <div className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                </div>

                <div className="relative h-10 w-full transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROSES INSTALASI */}
      <section id="proses" className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-rec">
              PROSES KERJA
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Dari Survei Sampai Sistem Jalan, Tanpa Ribet
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Alur pengerjaan jelas dan transparan demi kenyamanan dan kepuasan Anda.
            </p>
          </div>

          <div className="flex flex-col border-t border-border">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className="grid grid-cols-[44px_1fr] gap-4 border-b border-border py-5 sm:grid-cols-[70px_1fr] sm:gap-6 sm:py-6"
              >
                <div className="font-mono text-base sm:text-lg font-bold text-amber">
                  {step.num}
                </div>
                <div>
                  <h4 className="mb-1.5 text-base font-bold text-ink">{step.title}</h4>
                  <p className="max-w-[600px] text-xs sm:text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AREA LAYANAN (Dengan Grafik Peta Radar) */}
      <section id="cakupan" className="border-t border-border bg-slate-50/70 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
              AREA LAYANAN CEPAT
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Melayani Pemasangan di Purwakarta &amp; Sekitarnya
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Tim instalasi berbasis di Purwakarta dan rutin menjangkau kawasan industri, perkantoran, dan permukiman di Jawa Barat.
            </p>
          </div>

          {/* Grafik Radar Map */}
          <div className="max-w-[900px] mx-auto">
            <ServiceAreaMap />
          </div>
        </div>
      </section>

      {/* 8. CONTACT & CTA SECTION */}
      <section id="kontak" className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12 shadow-sm">
            <div className="max-w-xl">
              <span className="font-mono text-xs font-bold text-amber uppercase">
                KONSULTASI GRATIS &amp; SURVEI LOKASI
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                Ingin Pasang CCTV Hari Ini?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Ceritakan lokasi dan kebutuhan Anda lewat WhatsApp. Tim teknisi G-Tech CCTV Purwakarta
                akan segera membalas dengan rekomendasi paket terbaik dan jadwal survei gratis.
              </p>
            </div>
            <a
              href="https://wa.me/6287722686440"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber px-6 py-4 text-sm font-bold text-white no-underline shadow-md hover:bg-[#083870] transition-colors shrink-0"
            >
              <WhatsAppIcon size={18} />
              Chat WhatsApp (0877-2268-6440)
            </a>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <Footer />
    </>
  );
}

