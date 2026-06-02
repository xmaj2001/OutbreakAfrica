import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";
import { useI18n } from "@/lib/i18n";

import geojson from "@/lib/countries.json";
import { AFRICA, COUNTRY_BY_ISO3, ISO3_BY_NUM } from "@/lib/country-data";

const GEO_URL = geojson;

// ============================================================
// Props
// ============================================================

export interface OutbreakByCountry {
  total: number;
  ongoing: number;
}

interface Props {
  /** Dados de surtos por país ISO3 → { total, ongoing } */
  outbreakData: Record<string, OutbreakByCountry>;
  /** Países atualmente selecionados pelo user */
  selectedCountries: string[];
  /** Callback quando o user clica num país */
  onCountryClick: (iso3: string) => void;
  compact?: boolean;
  showLabels?: boolean;
}

// ============================================================
// Component
// ============================================================

export function AfricaMap2({
  outbreakData,
  selectedCountries,
  onCountryClick,
  compact = false,
  showLabels = false,
}: Props) {
  const { lang } = useI18n();
  const [hover, setHover] = useState<string | null>(null);

  const maxOngoing = useMemo(
    () =>
      Math.max(
        1,
        ...Object.values(outbreakData).map((v) => v.ongoing),
      ),
    [outbreakData],
  );

  const fillFor = (iso3: string) => {
    const data = outbreakData[iso3];
    const isSelected = selectedCountries.includes(iso3);
    const isHovered = hover === iso3;
    if (isSelected) return "var(--gold, #e63946)";
    if (!data || data.ongoing === 0) {
      return isHovered ? "oklch(0.35 0.04 255)" : "oklch(0.28 0.035 255)";
    }
    // Heatmap: quanto mais surtos ativos, mais vermelho/laranja
    const t = Math.min(1, data.ongoing / maxOngoing);
    const lightness = 0.55 - t * 0.15;
    const chroma = 0.12 + t * 0.12;
    return `oklch(${lightness} ${chroma} 35)`;
  };

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 380, center: [20, 0] as any }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies
              .filter((geo) => ISO3_BY_NUM[String(geo.id).padStart(3, "0")])
              .map((geo) => {
                const iso3 = ISO3_BY_NUM[String(geo.id).padStart(3, "0")];
                const country = COUNTRY_BY_ISO3[iso3];
                const data = outbreakData[iso3];
                return (
                  <Geography
                    key={iso3}
                    geography={geo}
                    onMouseEnter={() => setHover(iso3)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onCountryClick(iso3)}
                    style={{
                      default: {
                        fill: fillFor(iso3),
                        stroke: "oklch(0.18 0.03 255)",
                        strokeWidth: compact ? 0.4 : 0.6,
                        outline: "none",
                        cursor: "pointer",
                        transition: "fill 0.15s ease",
                      },
                      hover: {
                        fill: selectedCountries.includes(iso3)
                          ? "var(--gold, #e63946)"
                          : "oklch(0.45 0.1 35)",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { fill: "var(--gold, #e63946)", outline: "none" },
                    }}
                    data-iso3={iso3}
                    data-name={country?.name}
                    data-ongoing={data?.ongoing ?? 0}
                  />
                );
              })
          }
        </Geographies>
        {showLabels &&
          !compact &&
          AFRICA.filter((c) => (outbreakData[c.iso3]?.ongoing ?? 0) >= 4).map(
            (c) => (
              <Marker
                key={c.iso3}
                coordinates={[c.lon, c.lat] as any}
              >
                <circle r={3} fill="var(--gold, #e63946)" />
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
                  {lang === "pt" ? c.namePt : c.name}
                </text>
              </Marker>
            ),
          )}
      </ComposableMap>

      {/* Tooltip hover */}
      {hover && !compact && (
        <div className="absolute top-3 left-3 bg-popover border border-border rounded-md px-3 py-2 text-xs shadow-lg pointer-events-none">
          <div className="font-serif text-sm">
            {lang === "pt"
              ? COUNTRY_BY_ISO3[hover]?.namePt
              : COUNTRY_BY_ISO3[hover]?.name}
          </div>
          <div className="text-muted-foreground mt-0.5">
            {outbreakData[hover]?.ongoing ?? 0}{" "}
            {lang === "pt" ? "ativos" : "ongoing"} ·{" "}
            {outbreakData[hover]?.total ?? 0} {lang === "pt" ? "total" : "total"}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#f4a261]" />
          {lang === "pt" ? "Surto activo" : "Active outbreak"}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#e63946]" />
          {lang === "pt" ? "Selecionado" : "Selected"}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#1a2744]" />
          {lang === "pt" ? "Sem dados" : "No data"}
        </div>
      </div>
    </div>
  );
}
