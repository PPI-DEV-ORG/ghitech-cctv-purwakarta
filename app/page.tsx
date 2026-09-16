// app/page.tsx
import Header from "./components/Header";
import { CheckIcon, WhatsAppIcon } from "./components/Icons";
import Image from "next/image";

const FEEDS = [
  { id: "CAM 01", live: false, scan: true },
  { id: "CAM 02", live: true, scan: false },
  { id: "CAM 03", live: false, scan: false },
  { id: "CAM 04", live: true, scan: false },
  { id: "CAM 05", live: false, scan: true },
  { id: "CAM 06", live: true, scan: false },
];

const BRANDS = [
  { name: "Samtek", logo: "/imgs/brands/samtek.svg" },
  { name: "Hiview", logo: "/imgs/brands/hiview.webp" },
  { name: "Uniview", logo: "/imgs/brands/unv.png" },
  { name: "Hiside", logo: "/imgs/brands/hiside.png" },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Ngobrol dulu, survei lokasi",
    desc: "Kami datang lihat langsung titik rawan, jarak kabel, dan kondisi sinyal — bukan cuma tebak-tebak dari foto.",
  },
  {
    num: "02",
    title: "Rancangan sistem & harga jelas",
    desc: "Anda terima rincian jumlah titik kamera, jenis perangkat, dan estimasi biaya secara tertulis — nggak ada biaya siluman.",
  },
  {
    num: "03",
    title: "Pasang oleh teknisi berpengalaman",
    desc: "Kabel dirapikan, kamera dipasang presisi, sesuai jadwal yang sudah disepakati bareng Anda.",
  },
  {
    num: "04",
    title: "Uji coba & Anda dipandu langsung",
    desc: "Sistem dicoba di depan Anda, lalu kami ajarkan cara pantau dan atur akses dari HP.",
  },
  {
    num: "05",
    title: "Garansi & servis berkala",
    desc: "Ada masalah setelah pasang? Tim kami siap bantu, termasuk perawatan rutin biar sistem awet.",
  },
];

const PLANS = [
  {
    tag: "PAKET HUNIAN",
    title: "Rumah & Ruko",
    scope: "Pas untuk 1–4 titik pantau di rumah tinggal atau ruko kecil.",
    features: [
      "Kamera indoor & outdoor dasar",
      "DVR/NVR + akses lewat aplikasi HP",
      "Bisa tambah kunci pintu digital",
      "Pemasangan & panduan pakai",
    ],
    featured: false,
  },
  {
    tag: "PAKET USAHA",
    title: "Kantor & Toko",
    scope:
      "Untuk properti dengan beberapa area dan lalu-lalang orang lebih ramai.",
    features: [
      "Kamera cakupan area lebih luas",
      "Monitor multi-channel di ruang kontrol",
      "Kontrol akses karyawan",
      "Maintenance terjadwal",
    ],
    featured: true,
  },
  {
    tag: "PAKET INDUSTRI",
    title: "Pabrik & Kawasan",
    scope: "Untuk fasilitas besar yang butuh sistem saling terhubung penuh.",
    features: [
      "Kamera PTZ & titik pantau luas",
      "Kontrol akses bertingkat per area",
      "Integrasi smart home & otomasi fasilitas",
      "Kontrak servis & SLA khusus",
    ],
    featured: false,
  },
];

const AREAS = ["Purwakarta", "Cikampek", "Karawang", "Subang", "Bandung Barat"];

const PRODUCTS = [
  {
    wide: true,
    tag: "PALING DICARI",
    title: "CCTV & Surveillance",
    desc: "Kamera indoor, outdoor, sampai PTZ dengan pilihan resolusi dan night vision, terhubung ke NVR/DVR biar Anda bisa pantau real-time dari HP kapan saja.",
    image: "/imgs/products/cctv.png",

    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <rect x="2" y="7" width="14" height="10" rx="1.5" />
        <path d="M16 10l6-3v10l-6-3" />
      </svg>
    ),
  },
  {
    title: "Monitor",
    desc: "Layar multi-channel untuk pantau semua titik kamera sekaligus dari satu ruangan.",
    image: "/imgs/products/monitor.webp",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    title: "Kontrol Akses",
    desc: "Kartu, sidik jari, sampai pengenalan wajah — Anda yang atur siapa boleh masuk dan kapan.",
    image: "/imgs/products/access_control.jpg",

    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <rect x="4" y="10" width="16" height="10" rx="1.5" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
    ),
  },
  {
    title: "Smart Door Lock",
    desc: "Door lock dengan PIN, kartu, sidik jari, atau langsung dikendalikan dari aplikasi smartphone.",
    image: "/imgs/products/smart_door_lock.jpg",

    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2 2M15.7 15.7l2 2M6.3 17.7l2-2M15.7 8.3l2-2" />
      </svg>
    ),
  },
  {
    title: "Integrasi Smart Home",
    desc: "CCTV, kontrol akses, dan perangkat rumah pintar Anda, semuanya dalam satu aplikasi kendali.",
    image: "/imgs/products/smarthome.jpg",

    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center gap-2 font-mono text-[12px] sm:text-[12.5px] text-amber before:h-px before:w-4 before:bg-amber before:content-['']">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="border-b border-border pb-12 pt-[76px] sm:pb-16 sm:pt-[88px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 px-5 sm:px-7 sm:gap-10 lg:grid-cols-[1.05fr_0.85fr] lg:gap-14">
          <div>
            <Kicker>MASTER DEALER CCTV PURWAKARTA &amp; SEKITARNYA</Kicker>
            <h1 className="mb-5 max-w-[640px] font-display text-[clamp(30px,6vw,54px)] font-extrabold leading-[1.1] tracking-tight sm:mb-[22px]">
              Master Dealer Pertama di Purwakarta
            </h1>
            <p className="mb-7 max-w-[520px] text-[15.5px] leading-relaxed text-muted sm:mb-[34px] sm:text-[17px]">
              Dari survei, pemilihan perangkat, instalasi hingga maintenance —
              Ghitech hadir dengan solusi CCTV dan keamanan yang dirancang
              sesuai kebutuhan Anda.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/6287722686440"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-amber px-5 py-3 text-[14px] font-semibold text-white no-underline sm:px-[22px] sm:py-[13px] sm:text-[14.5px]"
              >
                Konsultasi gratis via WhatsApp
              </a>
              <a
                href="#paket"
                className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-[14px] font-semibold text-ink no-underline hover:border-muted sm:px-[22px] sm:py-[13px] sm:text-[14.5px]"
              >
                Lihat paket instalasi
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 rounded-md">
            <Image
              src="/Hero.jpeg"
              alt={"ghitech cctv purwakarta"}
              width={480}
              height={360}
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-b border-border py-6">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-5 text-[13.5px] text-muted sm:grid-cols-3 sm:px-7">
          <div>
            <b className="mb-1 block font-mono text-[13px] text-ink">
              Produk resmi & terpercaya
            </b>
            <p>
              Pilihan perangkat dari brand terpercaya dengan dukungan garansi
              resmi.
            </p>
          </div>

          <div>
            <b className="mb-1 block font-mono text-[13px] text-ink">
              Solusi sesuai kebutuhan
            </b>
            <p>
              Kami bantu dari survei dan rekomendasi hingga instalasi sesuai
              kondisi lokasi.
            </p>
          </div>

          <div>
            <b className="mb-1 block font-mono text-[13px] text-ink">
              Dukungan setelah instalasi
            </b>
            <p>
              Tidak berhenti setelah pemasangan — tersedia support, maintenance,
              dan penanganan sistem.
            </p>
          </div>
        </div>
      </div>

      {/* PRODUK */}
      <section id="produk" className="py-16 sm:py-[84px]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="mb-10 max-w-[640px] sm:mb-12">
            <Kicker>PRODUK &amp; SISTEM</Kicker>
            <h2 className="mb-3.5 font-display text-[clamp(24px,4.5vw,36px)] font-extrabold leading-tight">
              Dari kamera sampai kunci pintu, satu ekosistem yang nyambung.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-muted sm:text-[15.5px]">
              Tiap sistem bisa berdiri sendiri atau saling terhubung — jadi
              CCTV, akses masuk, dan perangkat rumah pintar Anda bisa dipantau
              dari satu titik kendali saja.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4 lg:auto-rows-[190px]">
            {PRODUCTS.map((p) => (
              <div
                key={p.title}
                className={`flex flex-col overflow-hidden rounded-md border border-border bg-panel transition-colors hover:border-[#3a4250] hover:bg-panel2 ${
                  p.wide ? "col-span-2 lg:row-span-2" : "col-span-1"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-panel2 ${
                    p.wide
                      ? "aspect-[16/10] lg:aspect-[16/11]"
                      : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-[22px]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-amber sm:h-[38px] sm:w-[38px]">
                      {p.icon}
                    </div>
                    {p.tag && (
                      <div className="hidden items-center gap-1.5 font-mono text-[10.5px] text-muted sm:flex">
                        <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-teal ring-[3px] ring-teal/20" />
                        {p.tag}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-1.5 mt-3 font-display text-[15.5px] font-bold sm:mt-3.5 sm:text-[18px]">
                      {p.title}
                    </h3>
                    <p className="text-[12.5px] leading-relaxed text-muted sm:text-[13.5px]">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND */}
      <section id="brand" className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <Kicker>Our Brand</Kicker>
          <h2 className="mb-8 max-w-[560px] font-display text-[clamp(20px,3.5vw,28px)] font-extrabold leading-tight sm:mb-10">
            Produk resmi dari brand CCTV dan keamanan yang sudah terpercaya.
          </h2>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center rounded-md border border-border bg-panel px-4 py-6 sm:py-8"
              >
                <div className="relative h-8 w-full sm:h-10">
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    fill
                    sizes="200px"
                    className="object-contain grayscale opacity-80 transition hover:grayscale-0 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKET */}
      <section id="paket" className="border-t border-border py-16 sm:py-[84px]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="mb-10 max-w-[640px] sm:mb-12">
            <Kicker>PAKET INSTALASI</Kicker>
            <h2 className="mb-3.5 font-display text-[clamp(24px,4.5vw,36px)] font-extrabold leading-tight">
              Pilih paket sesuai jenis properti Anda.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-muted sm:text-[15.5px]">
              Angka pasti soal jumlah kamera, jenis perangkat akses, dan
              kapasitas penyimpanan baru kami tentukan setelah survei singkat —
              biar Anda nggak bayar lebih dari yang dibutuhkan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-4.5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.tag}
                className={`flex flex-col rounded-md border p-5 sm:p-6 ${
                  plan.featured
                    ? "border-amber bg-amber/[0.14]"
                    : "border-border bg-panel"
                }`}
              >
                <div className="mb-2.5 font-mono text-[11px] text-muted">
                  {plan.tag}
                </div>
                <h3 className="mb-2 text-[19px] font-display font-extrabold sm:text-[20px]">
                  {plan.title}
                </h3>
                <div className="mb-5 text-[13.5px] leading-relaxed text-muted sm:mb-[22px]">
                  {plan.scope}
                </div>
                <ul className="mb-6 flex-grow list-none">
                  {plan.features.map((feature, i) => (
                    <li
                      key={feature}
                      className={`flex gap-2.5 py-2.5 text-[13.5px] text-ink sm:text-[13.8px] ${
                        i !== 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <span className="mt-[3px] flex-shrink-0 text-teal">
                        <CheckIcon />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontak"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-sm px-5 py-3 text-[14px] font-semibold no-underline sm:px-[22px] sm:py-[13px] sm:text-[14.5px] ${
                    plan.featured
                      ? "bg-amber text-white"
                      : "border border-border text-ink hover:border-muted"
                  }`}
                >
                  Minta penawaran
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROSES */}
      <section
        id="proses"
        className="border-t border-border py-16 sm:py-[84px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="mb-10 max-w-[640px] sm:mb-12">
            <Kicker>PROSES KERJA</Kicker>
            <h2 className="font-display text-[clamp(24px,4.5vw,36px)] font-extrabold leading-tight">
              Dari survei sampai sistem jalan, tanpa drama.
            </h2>
          </div>
          <div className="flex flex-col border-t border-border">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className="grid grid-cols-[44px_1fr] gap-4 border-b border-border py-5 sm:grid-cols-[70px_1fr] sm:gap-6 sm:py-6"
              >
                <div className="pt-0.5 font-mono text-[13px] text-amber sm:text-[14px]">
                  {step.num}
                </div>
                <div>
                  <h4 className="mb-1.5 font-display text-[15.5px] font-bold sm:text-[16.5px]">
                    {step.title}
                  </h4>
                  <p className="max-w-[560px] text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAKUPAN */}
      <section
        id="cakupan"
        className="border-t border-border py-16 sm:py-[84px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 lg:gap-10">
            <div>
              <Kicker>AREA LAYANAN</Kicker>
              <h2 className="mb-3.5 font-display text-[clamp(22px,4vw,32px)] font-extrabold leading-tight">
                Kami di Purwakarta, tapi jangkauan kami lebih luas dari itu.
              </h2>
              <p className="text-[14.5px] leading-relaxed text-muted sm:text-[15px]">
                Tim instalasi berbasis di Purwakarta dan rutin menjangkau
                kawasan industri serta permukiman di sekitarnya — jadi Anda
                nggak perlu cari tukang pasang dadakan tiap ada masalah.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-[18px] sm:gap-2.5">
                {AREAS.map((area, i) => (
                  <span
                    key={area}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[12px] sm:px-3.5 sm:py-2 sm:text-[12.5px] ${
                      i === 0
                        ? "border-amber text-amber"
                        : "border-border text-muted"
                    }`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-full border border-border sm:max-w-[320px]">
              <div className="absolute inset-[22%] rounded-full border border-border" />
              <div className="absolute inset-[44%] rounded-full border border-border" />
              <div
                className="absolute h-2 w-2 rounded-full bg-amber ring-[5px] ring-amber/15"
                style={{ top: "30%", left: "55%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="kontak"
        className="border-t border-border py-16 sm:py-[84px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-panel p-7 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-11">
            <div>
              <h2 className="max-w-[460px] font-display text-[clamp(20px,4vw,30px)] font-extrabold leading-tight">
                Sudah waktunya properti Anda diawasi dengan benar.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[14.5px]">
                Ceritakan lokasi dan kebutuhan Anda lewat WhatsApp, tim Ghitech
                CCTV Purwakarta akan balas dengan rekomendasi sistem dan
                estimasi biaya — tanpa dipaksa beli.
              </p>
            </div>
            <a
              href="https://wa.me/6287722686440"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-amber px-5 py-3 text-[14px] font-semibold text-white no-underline sm:w-auto sm:px-[22px] sm:py-[13px] sm:text-[14.5px]"
            >
              <WhatsAppIcon />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 pb-9 text-[13.5px] text-muted sm:py-[52px]">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="mb-3 flex items-center gap-2.5">
                <img src="logo.png" className="w-32" />
              </div>
              <p className="max-w-[280px] leading-relaxed">
                Master dealer CCTV, kontrol akses, kunci pintu digital, dan
                smart home untuk kawasan Purwakarta dan sekitarnya.
              </p>
            </div>
            <div>
              <h5 className="mb-3.5 font-mono text-[12px] text-ink">PRODUK</h5>
              <a
                href="#produk"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                CCTV & surveillance
              </a>
              <a
                href="#produk"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Kontrol akses
              </a>
              <a
                href="#produk"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Kunci pintu digital
              </a>
              <a
                href="#produk"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Smart home
              </a>
            </div>
            <div>
              <h5 className="mb-3.5 font-mono text-[12px] text-ink">
                PERUSAHAAN
              </h5>
              <a
                href="#paket"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Paket instalasi
              </a>
              <a
                href="#proses"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Proses kerja
              </a>
              <a
                href="#cakupan"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Area layanan
              </a>
            </div>
            <div>
              <h5 className="mb-3.5 font-mono text-[12px] text-ink">KONTAK</h5>
              <a
                href="#"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                WhatsApp: 087722686440
              </a>
              <a
                href="#"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Email: distri.cctv.purwakarta@gmail.com
              </a>
              <a
                href="#"
                className="block py-1.5 text-muted no-underline hover:text-ink"
              >
                Alamat: Jl. Wanayasa-Bojong-Sawit, RT.001/RW.001, Kp Nenggeng,
                Neglasari, Kec. Darangdan, Kabupaten Purwakarta, Jawa Barat
                41163
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-[22px] sm:flex-row sm:flex-wrap sm:justify-between sm:gap-2.5">
            <span>© 2026 Ghitech CCTV Purwakarta. Master dealer resmi.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
