"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { zoom as d3Zoom, zoomIdentity, ZoomBehavior, ZoomTransform } from "d3-zoom";
import { select } from "d3-selection";
import "d3-transition"; // menambah .transition() ke selection
import type { Feature, FeatureCollection, Geometry } from "geojson";

/* ----------------------------- Types ----------------------------- */

export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Warna pin. Default mengikuti theme (center / child). */
  color?: string;
  /** Skala pin (1 = default). */
  scale?: number;
}

export interface RegionProps {
  name: string;
  province: string;
  [key: string]: unknown;
}

export interface MapTheme {
  backgroundColor: string;
  /** Warna wilayah biasa. */
  landFill: string;
  /** Warna wilayah di dalam `focusProvince`. */
  focusFill: string;
  /** Warna wilayah yang di-hover. */
  hoverFill: string;
  landStroke: string;
  focusStroke: string;
  centerPinColor: string;
  childPinColor: string;
  lineColor: string;
  lineWidth: number;
  /** Pola garis putus-putus, contoh "6 6". */
  lineDash: string;
  /** Warna gelombang sonar (default = centerPinColor). */
  pulseColor?: string;
  labelColor: string;
  fontFamily: string;
}

export interface IndonesiaMapProps {
  /** GeoJSON wilayah. Properti tiap feature: { name, province }. */
  geoJson: FeatureCollection<Geometry, RegionProps>;
  centerPin: MapPin;
  childPins: MapPin[];

  /** Provinsi yang diberi warna `focusFill`. */
  focusProvince?: string;
  /** Warna khusus per nama wilayah, contoh { Purwakarta: "#f59e0b" }. */
  regionColors?: Record<string, string>;
  theme?: Partial<MapTheme>;

  /** Jarak (px) antara pin terluar dan tepi saat tampilan awal. */
  fitPadding?: number;
  /** Batas zoom awal supaya tidak terlalu dekat. */
  maxInitialZoom?: number;
  minZoom?: number;
  maxZoom?: number;

  showLabels?: boolean;
  showRegionLabels?: boolean;
  showZoomControls?: boolean;
  /** Garis putus-putus bergerak dari pusat ke child. */
  animateLines?: boolean;
  /** Jumlah lingkaran gelombang sonar (0 = mati). */
  pulseRings?: number;
  pulseRadius?: number;
  /** Durasi satu siklus gelombang (detik). */
  pulseDuration?: number;

  onPinClick?: (pin: MapPin) => void;
  onRegionClick?: (region: RegionProps) => void;

  height?: number | string;
  className?: string;
}

/* ----------------------------- Defaults ----------------------------- */

export const DEFAULT_THEME: MapTheme = {
  backgroundColor: "#ffffff",
  landFill: "#e9eef2",
  focusFill: "#cfd8df",
  hoverFill: "#b8c6d1",
  landStroke: "#ffffff",
  focusStroke: "#ffffff",
  centerPinColor: "#ff6a33",
  childPinColor: "#ff6a33",
  lineColor: "#64748b",
  lineWidth: 1.5,
  lineDash: "5 6",
  labelColor: "#4b6272",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

/** Ujung bawah pin tepat di koordinat (0,0). */
const PIN_PATH = "M0,0 C-5,-9 -11,-15 -11,-22 A11,11 0 1 1 11,-22 C11,-15 5,-9 0,0 Z";
const PIN_HEIGHT = 33;

/* ----------------------------- Component ----------------------------- */

export default function IndonesiaMap({
  geoJson,
  centerPin,
  childPins,
  focusProvince,
  regionColors,
  theme,
  fitPadding = 90,
  maxInitialZoom = 10,
  initialZoom = 10,
  interactive = false,
  minZoom = 0.6,
  maxZoom = 40,
  showLabels = true,
  showRegionLabels = false,
  showZoomControls = false,
  animateLines = false,
  pulseRings = 3,
  pulseRadius = 46,
  pulseDuration = 3,
  onPinClick,
  onRegionClick,
  height = 520,
  className,
}: IndonesiaMapProps & { initialZoom?: number; interactive?: boolean }) {
  const t: MapTheme = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const initialRef = useRef<ZoomTransform>(zoomIdentity);

  const [size, setSize] = useState({ w: 800, h: 520 });
  const [tf, setTf] = useState<ZoomTransform | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  /* Ukuran container (responsif) */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      if (width > 0 && h > 0) setSize({ w: width, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Proyeksi: muat seluruh geojson ke dalam container */
  const { projection, pathGen } = useMemo(() => {
    const p = geoMercator().fitExtent(
      [
        [8, 8],
        [size.w - 8, size.h - 8],
      ],
      geoJson
    );
    return { projection: p, pathGen: geoPath(p) };
  }, [geoJson, size.w, size.h]);

  const project = useCallback(
    (pin: { lat: number; lng: number }): [number, number] =>
      (projection([pin.lng, pin.lat]) as [number, number]) ?? [0, 0],
    [projection]
  );

  /* Tampilan awal: zoom fixed 10 berpusat pada centerPin (Purwakarta) */
  const initialTransform = useMemo(() => {
    const [cx, cy] = project(centerPin);
    const kk = initialZoom;
    return zoomIdentity.translate(size.w / 2 - cx * kk, size.h / 2 - cy * kk).scale(kk);
  }, [project, centerPin, size.w, size.h, initialZoom]);

  const view = tf ?? initialTransform;

  /* Pasang d3-zoom hanya jika interactive = true */
  useEffect(() => {
    if (!svgRef.current) return;
    if (!interactive) return;

    const z = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on("zoom", (e) => setTf(e.transform));
    zoomRef.current = z;
    select(svgRef.current).call(z).on("dblclick.zoom", null);
    return () => {
      select(svgRef.current).on(".zoom", null);
    };
  }, [interactive, minZoom, maxZoom]);

  /* Reset ke tampilan awal saat ukuran / data berubah */
  useEffect(() => {
    initialRef.current = initialTransform;
    if (svgRef.current && zoomRef.current && interactive) {
      select(svgRef.current).call(zoomRef.current.transform, initialTransform);
    }
  }, [initialTransform, interactive]);

  const zoomBy = (factor: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, factor);
  };
  const resetView = () => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current)
      .transition()
      .duration(500)
      .call(zoomRef.current.transform, initialRef.current);
  };

  /* Posisi layar (setelah zoom/pan) */
  const screen = (pin: MapPin): [number, number] => {
    const [x, y] = project(pin);
    return view.apply([x, y]) as [number, number];
  };
  const [cx, cy] = screen(centerPin);

  const fillFor = (f: Feature<Geometry, RegionProps>) => {
    const { name, province } = f.properties;
    if (hovered === `${province}:${name}`) return t.hoverFill;
    if (regionColors?.[name]) return regionColors[name];
    return focusProvince && province === focusProvince ? t.focusFill : t.landFill;
  };

  const pulseColor = t.pulseColor ?? t.centerPinColor;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        height,
        width: "100%",
        background: t.backgroundColor,
        borderRadius: 8,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        style={{ display: "block", cursor: "default", pointerEvents: "none", userSelect: "none" }}
      >
        {/* Lapisan peta: ikut zoom, garis tepi tetap tipis */}
        <g transform={view.toString()}>
          {geoJson.features.map((f, i) => (
            <path
              key={`${f.properties.province}-${f.properties.name}-${i}`}
              d={pathGen(f) ?? undefined}
              fill={fillFor(f)}
              stroke={focusProvince && f.properties.province === focusProvince ? t.focusStroke : t.landStroke}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              onMouseEnter={() => setHovered(`${f.properties.province}:${f.properties.name}`)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onRegionClick?.(f.properties)}
              style={{ transition: "fill .15s" }}
            />
          ))}
        </g>

        {/* Nama wilayah (opsional) */}
        {showRegionLabels &&
          view.k >= 3 &&
          geoJson.features.map((f, i) => {
            const [x, y] = pathGen.centroid(f);
            if (!isFinite(x)) return null;
            const [sx, sy] = view.apply([x, y]);
            return (
              <text
                key={`rl-${i}`}
                x={sx}
                y={sy}
                textAnchor="middle"
                fontSize={10}
                fill={t.labelColor}
                opacity={0.7}
                fontFamily={t.fontFamily}
                pointerEvents="none"
              >
                {f.properties.name}
              </text>
            );
          })}

        {/* Garis putus-putus: pusat -> child (ukuran tetap saat zoom) */}
        <g pointerEvents="none">
          {childPins.map((c) => {
            const [x, y] = screen(c);
            return (
              <line
                key={`line-${c.id}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={t.lineColor}
                strokeWidth={t.lineWidth}
                strokeDasharray={t.lineDash}
                strokeLinecap="round"
              >
                {animateLines && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to={`-${t.lineDash.split(/\s+/).map(Number).reduce((a, b) => a + b, 0) * (t.lineDash.split(/\s+/).length % 2 ? 2 : 1)}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
            );
          })}
        </g>

        {/* Sonar / pulse di pin pusat */}
        {pulseRings > 0 && (
          <g pointerEvents="none" transform={`translate(${cx},${cy})`}>
            {Array.from({ length: pulseRings }).map((_, i) => (
              <circle key={i} r={0} fill={pulseColor} fillOpacity={0.25} stroke={pulseColor} strokeWidth={1.5}>
                <animate
                  attributeName="r"
                  from="4"
                  to={pulseRadius}
                  dur={`${pulseDuration}s`}
                  begin={`${(i * pulseDuration) / pulseRings}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0"
                  dur={`${pulseDuration}s`}
                  begin={`${(i * pulseDuration) / pulseRings}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* Pin (child dulu, pusat paling atas) */}
        {[...childPins.map((p) => ({ p, center: false })), { p: centerPin, center: true }].map(
          ({ p, center }) => {
            const [x, y] = screen(p);
            const s = (p.scale ?? 1) * (center ? 1.25 : 1);
            const color = p.color ?? (center ? t.centerPinColor : t.childPinColor);
            return (
              <g
                key={p.id}
                transform={`translate(${x},${y})`}
                onClick={() => onPinClick?.(p)}
                style={{ cursor: onPinClick ? "pointer" : "default" }}
              >
                <ellipse cx={0} cy={0} rx={5 * s} ry={2 * s} fill="#000" opacity={0.18} />
                <g transform={`scale(${s})`}>
                  <path d={PIN_PATH} fill={color} stroke="#fff" strokeWidth={1.5} />
                  <circle cx={0} cy={-22} r={4.5} fill="#fff" />
                </g>
                {showLabels && (
                  <text
                    y={-(PIN_HEIGHT * s) - 6}
                    textAnchor="middle"
                    fontSize={center ? 13 : 12}
                    fontWeight={center ? 700 : 400}
                    fill={t.labelColor}
                    fontFamily={t.fontFamily}
                    stroke={t.backgroundColor}
                    strokeWidth={3}
                    paintOrder="stroke"
                    pointerEvents="none"
                  >
                    {p.name}
                  </text>
                )}
              </g>
            );
          }
        )}
      </svg>
    </div>
  );
}
