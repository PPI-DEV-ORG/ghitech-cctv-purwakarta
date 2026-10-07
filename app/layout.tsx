// app/layout.tsx
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Jasa Pasang CCTV Purwakarta | Ghitech CCTV — Rumah, Toko & Pabrik",
  description:
    "Butuh CCTV yang beres sekali pasang? Ghitech CCTV Purwakarta bantu survei lokasi, pilih kamera yang pas, sampai instalasi & maintenance — untuk rumah, ruko, kantor, sampai pabrik di Purwakarta, Cikampek, Karawang, Subang, dan Bandung Barat.",
  keywords: [
    "jasa pasang cctv purwakarta",
    "toko cctv purwakarta",
    "cctv rumah",
    "cctv toko",
    "kontrol akses",
    "kunci pintu digital",
    "smart home purwakarta",
  ],
  openGraph: {
    title: "Ghitech CCTV Purwakarta — Pasang CCTV Tanpa Ribet",
    description:
      "Survei, pasang, sampai maintenance CCTV & sistem keamanan properti Anda — satu tim, satu tanggung jawab.",
    locale: "id_ID",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Ghitech CCTV Purwakarta",
  description:
    "Master dealer dan jasa pasang CCTV, kontrol akses, kunci pintu digital, dan smart home di Purwakarta dan sekitarnya.",
  areaServed: ["Purwakarta", "Cikampek", "Karawang", "Subang", "Bandung Barat"],
  openingHours: "Mo-Sa 08:00-17:00",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
