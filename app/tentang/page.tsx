import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { WhatsAppIcon, ShieldCheckIcon, CheckIcon, WrenchIcon, MapPinIcon } from "../components/Icons";

export const metadata = {
  title: "Tentang Kami — G-Tech CCTV Purwakarta | Vendor & Jasa Pasang CCTV",
  description:
    "G-Tech CCTV Purwakarta adalah vendor dan penyedia layanan pengadaan, pemasangan, dan maintenance CCTV terpercaya di Purwakarta dan sekitarnya.",
};

const DOC_PHOTOS = [
  {
    title: "Instalasi CCTV Pupuk Kujang",
    location: "Kawasan Industri",
    image: "/imgs/documentation/pupuk_kujang/photo_01.png",
  },
  {
    title: "Pemasangan Kamera MA ICN Purwakarta",
    location: "Instansi Pendidikan Purwakarta",
    image: "/imgs/documentation/ma_icn_purwakarta/photo_01.jpeg",
  },
  {
    title: "Setup NVR & Jalur Kabel Nuansa Fajar",
    location: "Ruko & Komersial",
    image: "/imgs/documentation/nuansa_fajar/photo_01.jpeg",
  },
  {
    title: "Maintenance & Kalibrasi Kamera Industri",
    location: "Pabrik & Gudang",
    image: "/imgs/documentation/pupuk_kujang/photo_02.jpeg",
  },
  {
    title: "Instalasi Kamera Outdoor Weatherproof",
    location: "Area Perkantoran",
    image: "/imgs/documentation/nuansa_fajar/photo_02.jpeg",
  },
  {
    title: "Uji Coba Sistem & Setting Video Online",
    location: "Purwakarta",
    image: "/imgs/documentation/pupuk_kujang/photo_03.jpeg",
  },
];

export default function TentangPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border bg-slate-50/50 py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
              TENTANG G-TECH CCTV PURWAKARTA
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              Vendor Pasang &amp; Perawatan CCTV Terpercaya di Purwakarta
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
              Kami adalah penyedia solusi keamanan visual terintegrasi untuk rumah, toko, ruko, kantor,
              hingga pabrik di wilayah Purwakarta, Karawang, Cikampek, Subang, dan sekitarnya.
            </p>
          </div>
        </div>
      </section>

      {/* Company Profile Brief */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-rec">
                DEDIKASI KAMI
              </div>
              <h2 className="mb-4 text-2xl sm:text-3xl font-extrabold text-ink">
                Fokus Pada Kerapian, Keandalan, dan Pelayanan Ramah
              </h2>
              <p className="mb-4 text-xs sm:text-sm text-muted leading-relaxed">
                Banyak pengguna CCTV mengeluhkan kabel yang berantakan, kamera cepat rusak, atau kesulitan menghubungi
                tukang pasang saat sistem offline. Di G-Tech, kami menerapkan standar instalasi tertutup conduit,
                kamera bergaransi resmi, dan tim teknisi tetap yang mudah dihubungi kapan pun Anda membutuhkan bantuan.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-amber mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-ink">Teknisi Berpengalaman &amp; Berlisensi</strong>
                    <span className="text-xs text-muted">Bukan tenaga lepas dadakan, memahami teknik grounding dan sudut pandang lensa presisi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-amber mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-ink">Produk Distributor Resmi</strong>
                    <span className="text-xs text-muted">Bekerja sama langsung dengan brand utama (Hikvision, Dahua, Uniview, Samtek).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-amber mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-sm text-ink">Bagian Dari CV. Ghina Multiprima</strong>
                    <span className="text-xs text-muted">Legalitas badan usaha resmi dan berpengalaman menangani instalasi skala korporat dan retail.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/6287722686440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber px-5 py-3 text-xs sm:text-sm font-bold text-white no-underline hover:bg-[#083870] transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  Hubungi Admin G-Tech
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-slate-100 shadow-sm">
              <Image
                src="/Hero.jpeg"
                alt="Teknisi Ghitech CCTV Purwakarta"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dokumentasi Lapangan */}
      <section className="border-t border-border bg-slate-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mb-10 text-center">
            <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
              DOKUMENTASI PEKERJAAN
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Foto Pemasangan di Lapangan
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              Bukti pengerjaan instalasi CCTV kami untuk rumah, ruko, sekolah, dan industri.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOC_PHOTOS.map((item, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-xl border border-border bg-white shadow-2xs transition-all hover:border-amber hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-1 text-[11px] font-mono font-semibold text-amber uppercase">
                    {item.location}
                  </div>
                  <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

