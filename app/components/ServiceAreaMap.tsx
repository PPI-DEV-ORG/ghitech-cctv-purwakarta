"use client";

import dynamic from "next/dynamic";
import type { FeatureCollection, Geometry } from "geojson";
import { MapPin, RegionProps } from "./IndonesiaMap";
import javaGeo from "@/data/java.geo.json";
import { MapPinIcon } from "./Icons";

const IndonesiaMap = dynamic(() => import("./IndonesiaMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#0b4f9c] border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Memuat peta interaktif...</span>
      </div>
    </div>
  ),
});

const geo = javaGeo as unknown as FeatureCollection<Geometry, RegionProps>;

const centerPin: MapPin = {
  id: "purwakarta",
  name: "Purwakarta (Pusat)",
  lat: -6.5569,
  lng: 107.4431,
};

const childPins: MapPin[] = [
  { id: "cikampek", name: "Cikampek", lat: -6.4147, lng: 107.4531 },
  { id: "karawang", name: "Karawang", lat: -6.3015, lng: 107.302 },
  { id: "subang", name: "Subang", lat: -6.5716, lng: 107.7586 },
  { id: "bandung-barat", name: "Bandung Barat", lat: -6.842, lng: 107.492 },
];

const THEME = {
  backgroundColor: "#f8fafc",
  landFill: "#e2e8f0",
  focusFill: "#cfdcef",
  hoverFill: "#b4c8e6",
  landStroke: "#ffffff",
  focusStroke: "#ffffff",
  centerPinColor: "#d32f2f",
  childPinColor: "#0b4f9c",
  lineColor: "#0b4f9c",
  lineWidth: 1.5,
  lineDash: "5 6",
  labelColor: "#0f172a",
  fontFamily: "inherit",
};

export default function ServiceAreaMap() {
  const all = [centerPin, ...childPins];

  return (
    <div className="relative w-full rounded-2xl border border-border bg-white p-5 sm:p-8 shadow-md">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-xs font-bold text-amber bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            RADAR JANGKAUAN TEKNISI
          </span>
          <h3 className="mt-2 text-lg sm:text-xl font-bold text-ink">
            Peta Layanan Jawa Barat &amp; Purwakarta Sekitarnya
          </h3>
        </div>
      </div>

      <div className="my-6 overflow-hidden rounded-xl border border-border">
        <IndonesiaMap
          geoJson={geo}
          centerPin={centerPin}
          childPins={childPins}
          focusProvince="Jawa Barat"
          height={480}
          theme={THEME}
          regionColors={{ Purwakarta: "#9db8de" }}
          animateLines
          pulseRings={3}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border pt-4">
        <span className="text-xs font-mono text-muted mr-2">Titik Layanan Cepat:</span>
        {all.map((c) => {
          const isCenter = c.id === centerPin.id;
          return (
            <span
              key={c.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isCenter
                  ? "bg-red-50 text-[#d32f2f] border border-red-200"
                  : "bg-blue-50 text-amber border border-blue-200"
              }`}
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              {c.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
