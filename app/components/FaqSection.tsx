"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Apakah survei lokasi ke rumah atau tempat usaha benar-benar gratis?",
    a: "Ya! Untuk wilayah Purwakarta dan sekitarnya (Cikampek, Bungursari, Jatiluhur, dsb.), kami menyediakan konsultasi dan survei titik lokasi gratis tanpa kewajiban membeli. Kami akan hitung titik blind spot dan estimasi kabel yang paling efektif.",
  },
  {
    q: "Apakah semua paket sudah lengkap siap pakai?",
    a: "Betul. Semua paket sudah include kamera indoor/outdoor, NVR/DVR perekam, hard disk surveillance khusus CCTV (WD Purple/SkyHawk), adaptor/power supply, kabel instalasi, dan jasa pemasangan teknisi profesional.",
  },
  {
    q: "Apakah bisa dipantau langsung dari HP secara live dan putar ulang?",
    a: "Bisa! Tim teknisi kami akan mengkoneksikan perangkat ke internet Wi-Fi Anda dan menginstalkan aplikasi resmi (seperti Hik-Connect, DMSS, dsb.) di smartphone Anda serta mengajarkan cara menggunakannya.",
  },
  {
    q: "Berapa lama estimasi waktu pengerjaan pemasangan?",
    a: "Untuk paket 1-4 kamera (rumah & ruko) umumnya selesai dalam 1 hari kerja (sekitar 3-5 jam). Untuk paket kantor atau pabrik 8-16 kamera disesuaikan dengan luas bangunan dan jalur kabel.",
  },
  {
    q: "Bagaimana klaim garansi jika kamera mati atau rekaman tidak tersimpan?",
    a: "Cukup hubungi tim support WhatsApp kami di 0877-2268-6440. Teknisi kami akan memberikan panduan remote terlebih dahulu, dan jika kendala fisik/hardware, teknisi kami siap datang ke lokasi Anda.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-border bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[860px] px-5 sm:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
            TANYA JAWAB
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            Seputar pemesanan, paket siap pasang, dan garansi layanan G-Tech CCTV.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-border bg-slate-50/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-ink"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-amber shadow-2xs">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-white p-5 text-xs sm:text-sm text-muted leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

