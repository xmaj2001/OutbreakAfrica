"use client";

import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "@vnedyalk0v/react19-simple-maps";
import { AFRICA_ISO3, getCountryByIso3 } from "@/lib/africa-countries";
import geojson from "@/lib/countries.json";

const GEO_URL = geojson;

// Mapeamento numeric id → iso3 (world-atlas usa IDs numéricos ISO 3166-1)
// Os mais relevantes para África
const NUMERIC_TO_ISO3: Record<string, string> = {
  "012": "DZA",
  "024": "AGO",
  "204": "BEN",
  "072": "BWA",
  "854": "BFA",
  "108": "BDI",
  "132": "CPV",
  "120": "CMR",
  "140": "CAF",
  "148": "TCD",
  "174": "COM",
  "180": "COD",
  "178": "COG",
  "384": "CIV",
  "262": "DJI",
  "818": "EGY",
  "226": "GNQ",
  "232": "ERI",
  "748": "SWZ",
  "231": "ETH",
  "266": "GAB",
  "270": "GMB",
  "288": "GHA",
  "324": "GIN",
  "624": "GNB",
  "404": "KEN",
  "426": "LSO",
  "430": "LBR",
  "434": "LBY",
  "450": "MDG",
  "454": "MWI",
  "466": "MLI",
  "478": "MRT",
  "480": "MUS",
  "504": "MAR",
  "508": "MOZ",
  "516": "NAM",
  "562": "NER",
  "566": "NGA",
  "646": "RWA",
  "678": "STP",
  "686": "SEN",
  "694": "SLE",
  "706": "SOM",
  "710": "ZAF",
  "728": "SSD",
  "729": "SDN",
  "834": "TZA",
  "768": "TGO",
  "788": "TUN",
  "800": "UGA",
  "894": "ZMB",
  "716": "ZWE",
};

interface AfricaMapProps {
  selectedCountries: string[];
  onCountryClick: (iso3: string) => void;
  outbreakCountries?: Set<string>; // países com surtos activos
}

export function AfricaMap({
  selectedCountries,
  onCountryClick,
  outbreakCountries = new Set(),
}: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryFill = useCallback(
    (iso3: string) => {
      if (selectedCountries.includes(iso3)) return "var(--map-selected)";
      if (outbreakCountries.has(iso3)) return "var(--map-outbreak)";
      return "var(--map-default)";
    },
    [selectedCountries, outbreakCountries],
  );

  return (
    <div className="relative w-full h-full">
      <style>{`
        :root {
          --map-default:  #1a2744;
          --map-hover:    #2d4a7a;
          --map-selected: #e63946;
          --map-outbreak: #f4a261;
          --map-border:   #2a3f6f;
        }
      `}</style>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 380, center: [20, 0] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20, 0]} zoom={1} minZoom={0.8} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  const iso3 =
                    NUMERIC_TO_ISO3[geo.id] ?? geo.properties?.iso_a3;
                  return AFRICA_ISO3.has(iso3);
                })
                .map((geo) => {
                  const iso3 =
                    NUMERIC_TO_ISO3[geo.id] ?? geo.properties?.iso_a3;
                  const country = getCountryByIso3(iso3);
                  const isHovered = hoveredCountry === iso3;
                  const isSelected = selectedCountries.includes(iso3);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => iso3 && onCountryClick(iso3)}
                      onMouseEnter={() => setHoveredCountry(iso3)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: getCountryFill(iso3),
                          stroke: "var(--map-border)",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "fill 0.2s ease",
                          cursor: "pointer",
                        },
                        hover: {
                          fill: isSelected
                            ? "var(--map-selected)"
                            : "var(--map-hover)",
                          stroke: "#4a6fa5",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "var(--map-selected)",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip de hover */}
      {hoveredCountry && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-slate-900/90 border border-slate-700 text-slate-100 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {getCountryByIso3(hoveredCountry)?.name ?? hoveredCountry}
            {outbreakCountries.has(hoveredCountry) && (
              <span className="ml-2 text-amber-400">● surto activo</span>
            )}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#f4a261]" />
          Surto activo
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#e63946]" />
          Seleccionado
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#1a2744]" />
          Sem dados
        </div>
      </div>
    </div>
  );
}
