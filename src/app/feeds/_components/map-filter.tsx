"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";
import { X } from "lucide-react";

import geojson from "@/lib/countries.json";
import { AFRICA, COUNTRY_BY_ISO3, ISO3_BY_NUM } from "@/lib/country-data";
import { Button } from "@/components/ui/button";
import { CountryOutbreakData } from "@/components/maps/africa-outbreak-map";

// ── Cores ─────────────────────────────────────────────────────────────────────

const COLOR_NO_DATA = "oklch(0.28 0.035 255)";
const COLOR_NO_DATA_H = "oklch(0.35 0.04 255)";
const COLOR_SELECTED = "red";
const COLOR_HOVER = "oklch(0.45 0.1 35)";
const STROKE = "black";

// ── Props ─────────────────────────────────────────────────────────────────────

interface MapFilterProps {
  /**
   * Dados de surtos por país — Record<iso3, CountryOutbreakData>
   * Opcional: se não vier, o mapa mostra só a África sem heatmap
   */
  data?: Record<string, CountryOutbreakData>;

  /** Mostrar labels nos países com >= N surtos activos */
  showLabels?: boolean;
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function MapFilter({
  data = {},
  showLabels = false,
}: MapFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [hover, setHover] = useState<string | null>(null);

  // País actualmente seleccionado — lê da URL para ser consistente com os outros filtros
  const selectedIso3 = searchParams.get("country") ?? "";

  // Máximo de surtos activos — base para normalizar o heatmap
  const maxOngoing = useMemo(
    () => Math.max(1, ...Object.values(data).map((v) => v.ongoing)),
    [data],
  );

  // ── Lógica de selecção ──────────────────────────────────────────────────────

  function handleSelect(iso3: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedIso3 === iso3) {
      // Clica no mesmo país → remove o filtro
      params.delete("country");
    } else {
      params.set("country", iso3);
    }

    // Sempre volta à página 1 ao mudar filtro
    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function clearCountry() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("country");
    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  // ── Fill por país ───────────────────────────────────────────────────────────

  function fillFor(iso3: string): string {
    const isSelected = selectedIso3 === iso3;
    const isHovered = hover === iso3;
    const entry = data[iso3];

    if (isSelected) return COLOR_SELECTED;
    if (!entry || entry.ongoing === 0)
      return isHovered ? COLOR_NO_DATA_H : COLOR_NO_DATA;

    // Heatmap: quanto mais surtos activos, mais quente
    const t = Math.min(1, entry.ongoing / maxOngoing);
    const lightness = 0.55 - t * 0.15;
    const chroma = 0.12 + t * 0.12;
    return `oklch(${lightness} ${chroma} 35)`;
  }

  // ── País seleccionado info ──────────────────────────────────────────────────

  const selectedCountry = selectedIso3 ? COUNTRY_BY_ISO3[selectedIso3] : null;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-2">
      {/* Label + país seleccionado */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          País{" "}
          {isPending && (
            <span className="text-bento-accent animate-pulse">·</span>
          )}
        </p>
        {selectedCountry && (
          <Button
            onClick={clearCountry}
            className="flex items-center gap-1 px-2 py-0.5 bg-bento-accent/10 border border-bento-accent/30 rounded-full text-[10px] font-mono text-bento-accent hover:bg-bento-accent/20 transition-colors"
          >
            {selectedCountry.name}
            <X className="h-2.5 w-2.5" />
          </Button>
        )}
      </div>

      {/* Mapa */}
      <div className="relative w-full rounded-sm overflow-hidden border border-bento-border bg-bento-inner">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 290,
            center: [20, 0] as any,
          }}
          style={{ width: "100%", height: "220px" }}
        >
          <Geographies geography={geojson}>
            {({ geographies }: { geographies: any[] }) =>
              geographies
                .filter((geo) => ISO3_BY_NUM[String(geo.id).padStart(3, "0")])
                .map((geo) => {
                  const iso3 = ISO3_BY_NUM[String(geo.id).padStart(3, "0")];
                  const isSelected = selectedIso3 === iso3;

                  return (
                    <Geography
                      key={iso3}
                      geography={geo}
                      onMouseEnter={() => setHover(iso3)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => handleSelect(iso3)}
                      style={{
                        default: {
                          fill: fillFor(iso3),
                          stroke: STROKE,
                          strokeWidth: 0.4,
                          outline: "none",
                          cursor: "pointer",
                          transition: "fill 0.15s ease",
                        },
                        hover: {
                          fill: isSelected ? COLOR_SELECTED : COLOR_HOVER,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: COLOR_SELECTED,
                          outline: "none",
                        },
                      }}
                      className="focus:outline-none focus:ring-0 select-none"
                    />
                  );
                })
            }
          </Geographies>

          {/* Labels — países com >= 4 surtos activos */}
          {showLabels &&
            AFRICA.filter((c) => (data[c.iso3]?.ongoing ?? 0) >= 4).map((c) => (
              <Marker key={c.iso3} coordinates={[c.lon, c.lat] as any}>
                <circle r={2.5} fill={COLOR_SELECTED} />
                <text
                  textAnchor="middle"
                  y={-5}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 7,
                    fill: "var(--foreground)",
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  {c.name}
                </text>
              </Marker>
            ))}
        </ComposableMap>

        {/* Tooltip ao hover */}
        {hover && (
          <div className="absolute top-2 left-2 bg-bento-card border border-bento-border rounded-sm px-2.5 py-1.5 text-[10px] font-mono shadow-lg pointer-events-none z-10">
            <p className="font-bold text-slate-200">
              {COUNTRY_BY_ISO3[hover]?.name ?? hover.toUpperCase()}
            </p>
            {data[hover] && (
              <p className="text-slate-500 mt-0.5">
                {data[hover].ongoing} activos · {data[hover].total} total
              </p>
            )}
            {!data[hover] && <p className="text-slate-600 mt-0.5">Sem dados</p>}
          </div>
        )}

        {/* Legenda */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f4a261]" />
            Activo
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e63946]" />
            Seleccionado
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: COLOR_NO_DATA }}
            />
            Sem dados
          </div>
        </div>
      </div>

      {/* Input fallback — ISO3 manual para quem não consegue clicar no mapa */}
      <input
        type="text"
        placeholder="ou escreve o código  ex: cod, ago..."
        value={selectedIso3}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) {
            params.set("country", e.target.value.toLowerCase());
          } else {
            params.delete("country");
          }
          params.delete("page");
          startTransition(() => router.push(`?${params.toString()}`));
        }}
        className="md:hidden w-full bg-bento-inner border border-bento-border rounded-sm px-3 py-1.5 text-[11px] font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-bento-accent/50 transition-colors"
      />
    </div>
  );
}
