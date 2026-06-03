"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";

import geojson from "@/lib/countries.json";
import { AFRICA, COUNTRY_BY_ISO3, ISO3_BY_NUM } from "@/lib/country-data";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface CountryOutbreakData {
  total: number; // total de relatórios
  ongoing: number; // surtos activos (via /disasters)
}

interface Props {
  /** Record<iso3, CountryOutbreakData> — vem do useStats processado */
  data: Record<string, CountryOutbreakData>;

  /** Países actualmente seleccionados */
  selected: string[];

  /** Chamado com o iso3 do país clicado — quem gere o estado é o parent */
  onSelect: (iso3: string) => void;

  /** Versão compacta para sidebar de filtros */
  compact?: boolean;

  /** Mostrar labels nos países com mais surtos */
  showLabels?: boolean;
}

// ── Constantes ────────────────────────────────────────────────────────────────

const COLOR_NO_DATA = "oklch(0.28 0.035 255)";
const COLOR_NO_DATA_H = "oklch(0.35 0.04 255)";
const COLOR_SELECTED = "#e63946";
const COLOR_HOVER = "oklch(0.45 0.1 35)";
const STROKE = "oklch(0.18 0.03 255)";

// ── Componente ────────────────────────────────────────────────────────────────

export function AfricaOutbreakMap({
  data,
  selected,
  onSelect,
  compact = false,
  showLabels = false,
}: Props) {
  const [hover, setHover] = useState<string | null>(null);

  // Máximo de surtos activos — base para normalizar o heatmap
  const maxOngoing = useMemo(
    () => Math.max(1, ...Object.values(data).map((v) => v.ongoing)),
    [data],
  );

  function fillFor(iso3: string): string {
    const isSelected = selected.includes(iso3);
    const isHovered = hover === iso3;
    const entry = data[iso3];

    if (isSelected) return COLOR_SELECTED;
    if (!entry || entry.ongoing === 0)
      return isHovered ? COLOR_NO_DATA_H : COLOR_NO_DATA;

    // Heatmap: quanto mais surtos activos, mais vermelho/quente
    const t = Math.min(1, entry.ongoing / maxOngoing);
    const lightness = 0.55 - t * 0.15;
    const chroma = 0.12 + t * 0.12;
    return `oklch(${lightness} ${chroma} 35)`;
  }

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: compact ? 300 : 380,
          center: [20, 0] as any,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geojson}>
          {({ geographies }: { geographies: any[] }) =>
            geographies
              .filter((geo) => ISO3_BY_NUM[String(geo.id).padStart(3, "0")])
              .map((geo) => {
                const iso3 = ISO3_BY_NUM[String(geo.id).padStart(3, "0")];
                const isSelected = selected.includes(iso3);

                return (
                  <Geography
                    key={iso3}
                    geography={geo}
                    onMouseEnter={() => setHover(iso3)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onSelect(iso3)}
                    style={{
                      default: {
                        fill: fillFor(iso3),
                        stroke: STROKE,
                        strokeWidth: compact ? 0.4 : 0.6,
                        outline: "none", // Remove o foco visual
                        boxShadow: "none",
                        cursor: "pointer",
                        transition: "fill 0.15s ease",
                      },
                      hover: {
                        fill: isSelected ? COLOR_SELECTED : COLOR_HOVER,
                        outline: "none", // Garante a remoção no hover
                        boxShadow: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: COLOR_SELECTED,
                        outline: "none", // Garante a remoção ao clicar
                        boxShadow: "none",
                      },
                    }}
                    className="focus:outline-none focus:ring-0 select-none" // Classes Tailwind utilitárias extras
                  />
                );
              })
          }
        </Geographies>

        {/* Labels — só versão full, só países com >= 4 surtos activos */}
        {showLabels &&
          !compact &&
          AFRICA.filter((c) => (data[c.iso3]?.ongoing ?? 0) >= 4).map((c) => (
            <Marker key={c.iso3} coordinates={[c.lon, c.lat] as any}>
              <circle r={3} fill={COLOR_SELECTED} />
              <text
                textAnchor="middle"
                y={-6}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 9,
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

      {/* Tooltip — só versão full */}
      {hover && !compact && (
        <div className="absolute top-3 left-3 bg-popover border border-border rounded-md px-3 py-2 text-xs shadow-lg pointer-events-none z-10">
          <p className="font-semibold text-sm">
            {COUNTRY_BY_ISO3[hover]?.name ?? hover.toUpperCase()}
          </p>
          <p className="text-muted-foreground mt-0.5">
            {data[hover]?.ongoing ?? 0} activos · {data[hover]?.total ?? 0}{" "}
            total
          </p>
        </div>
      )}

      {/* Legenda */}
      {!compact && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#f4a261]" />
            Surto activo
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#e63946]" />
            Seleccionado
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: COLOR_NO_DATA }}
            />
            Sem dados
          </div>
        </div>
      )}
    </div>
  );
}
