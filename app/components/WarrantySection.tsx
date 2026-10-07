import { ShieldCheckIcon, CheckIcon, WrenchIcon, SparklesIcon } from "./Icons";

export default function WarrantySection() {
  const points = [
    {
      title: "Garansi Resmi 1 Tahun Penuh",
      desc: "Semua perangkat kamera, NVR/DVR, dan hard disk bergaransi distributor resmi. Rusak karena cacat pabrik langsung diganti baru.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Instalasi Rapi & Standar Keamanan",
      desc: "Kabel dilindungi conduit/klem rapi, jalur kabel tersembunyi, dan penataan kelistrikan aman dari korsleting.",
      icon: WrenchIcon,
    },
    {
      title: "Training Pemakaian & Setting Online",
      desc: "Setelah terpasang, tim kami membimbing Anda langsung cara mengoperasikan aplikasi HP, memutar ulang rekaman, dan sharing akun.",
      icon: SparklesIcon,
    },
    {
      title: "Gratis Survei & Tanpa Biaya Siluman",
      desc: "Rincian estimasi titik kamera dan kabel disepakati secara transparan di awal, tidak ada biaya tak terduga.",
      icon: CheckIcon,
    },
  ];

  return (
    <section className="border-t border-border bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mb-12 text-center">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-rec">
            KOMITMEN KUALITAS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Kenapa Memilih Paket CCTV di G-Tech Purwakarta?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted">
            Bukan sekadar menjual unit, kami memberikan solusi keamanan utuh yang awet dan mudah digunakan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-2xs transition-all hover:border-amber"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-amber">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-ink">{p.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

