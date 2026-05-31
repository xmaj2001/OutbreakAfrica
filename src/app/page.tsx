"use client";

import { useState, useEffect, useCallback } from "react";
import { CountryPanel } from "@/components/country-panel";
import { CompareModal } from "@/components/compare-modal";
import { FilterDrawer, type FilterValues } from "@/components/filter-drawer";
import type {
  DisasterEvent,
  ReportSummary,
  DisastersResponse,
  SearchResponse,
} from "@/lib/types";
import { getDisasters } from "@/lib/client/features/get-disasters";
import { searchReports } from "@/lib/client/features/search-reports";
import { SlidersHorizontal, GitCompare, X } from "lucide-react";
import { AfricaMap } from "@/components/AfricaMap";

// Dados por país
interface CountryData {
  disasters: DisasterEvent[];
  reports: ReportSummary[];
  loading: boolean;
}

export default function Home() {
  // Estado global de surtos — para colorir o mapa
  const [globalDisasters, setGlobalDisasters] = useState<DisasterEvent[]>([]);

  // País único seleccionado (painel lateral)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Países em modo comparação
  const [compareCountries, setCompareCountries] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Dados carregados por país
  const [countryData, setCountryData] = useState<Record<string, CountryData>>(
    {},
  );

  // Filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    disease: "",
    status: "",
  });

  // Países com surtos activos — para colorir o mapa
  const outbreakCountries = new Set(
    globalDisasters.flatMap((d) => d.fields.country.map((c) => c.iso3)),
  );

  // Carrega surtos globais ao montar
  useEffect(() => {
    getDisasters({ status: "ongoing", limit: 100 })
      .then((res: DisastersResponse) => setGlobalDisasters(res.data))
      .catch(console.error);
  }, []);

  // Carrega dados de um país
  const loadCountryData = useCallback(
    async (iso3: string) => {
      if (countryData[iso3]) return; // já tem dados

      setCountryData((prev) => ({
        ...prev,
        [iso3]: { disasters: [], reports: [], loading: true },
      }));

      try {
        const [disRes, repRes] = await Promise.all([
          getDisasters({
            country: iso3.toLowerCase(),
            status: filters.status || undefined,
            limit: 20,
          }) as Promise<DisastersResponse>,
          searchReports({
            country: iso3.toLowerCase(),
            disease: filters.disease || undefined,
            status: filters.status as "ongoing" | "past" | undefined,
            limit: 10,
          }) as Promise<SearchResponse>,
        ]);

        setCountryData((prev) => ({
          ...prev,
          [iso3]: {
            disasters: disRes.data,
            reports: repRes.data,
            loading: false,
          },
        }));
      } catch {
        setCountryData((prev) => ({
          ...prev,
          [iso3]: { disasters: [], reports: [], loading: false },
        }));
      }
    },
    [countryData, filters],
  );

  // Clique num país
  const handleCountryClick = useCallback(
    (iso3: string) => {
      if (isComparing) {
        // Modo comparação — acumula países
        setCompareCountries((prev) => {
          if (prev.includes(iso3)) return prev.filter((c) => c !== iso3);
          const next = [...prev, iso3];
          loadCountryData(iso3);
          return next;
        });
      } else {
        // Modo normal — painel lateral
        setSelectedCountry((prev) => (prev === iso3 ? null : iso3));
        loadCountryData(iso3);
      }
    },
    [isComparing, loadCountryData],
  );

  // Quando filtros mudam, limpa cache de dados
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCountryData({}); // força reload com novos filtros
  };

  const selectedData = selectedCountry ? countryData[selectedCountry] : null;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0 z-10">
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight">
            Outbreak Africa
          </h1>
          <p className="text-xs text-slate-500">
            Monitorização de surtos em tempo real
          </p>
        </div>

        {/* Stats globais */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-amber-400">
              {globalDisasters.length}
            </p>
            <p className="text-xs text-slate-500">Surtos activos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">
              {outbreakCountries.size}
            </p>
            <p className="text-xs text-slate-500">Países afectados</p>
          </div>
        </div>

        {/* Acções */}
        <div className="flex items-center gap-2">
          {/* Toggle modo comparação */}
          <button
            onClick={() => {
              setIsComparing((prev) => !prev);
              setCompareCountries([]);
              setSelectedCountry(null);
            }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${
                isComparing
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800 border border-slate-700"
              }
            `}
          >
            <GitCompare size={14} />
            {isComparing ? `Comparar (${compareCountries.length})` : "Comparar"}
          </button>

          {/* Abrir modal de comparação */}
          {isComparing && compareCountries.length >= 2 && (
            <button
              onClick={() => setIsComparing(false) /* modal abre abaixo */}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Ver comparação →
            </button>
          )}
        </div>
      </header>

      {/* Modo comparação — banner */}
      {isComparing && (
        <div className="px-6 py-2 bg-blue-500/10 border-b border-blue-500/20 text-xs text-blue-300 flex items-center gap-2 shrink-0">
          <GitCompare size={12} />
          Modo comparação activo — selecciona 2 ou mais países no mapa
          {compareCountries.length > 0 && (
            <span className="ml-1 text-blue-200">
              ({compareCountries.join(", ")})
            </span>
          )}
          <button
            onClick={() => {
              setIsComparing(false);
              setCompareCountries([]);
            }}
            className="ml-auto text-blue-400 hover:text-blue-200"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mapa */}
        <div className="flex-1 relative">
          <AfricaMap
            selectedCountries={
              isComparing
                ? compareCountries
                : selectedCountry
                  ? [selectedCountry]
                  : []
            }
            onCountryClick={handleCountryClick}
            outbreakCountries={outbreakCountries}
          />

          {/* Botão flutuante de filtros */}
          <button
            onClick={() => setFilterOpen(true)}
            className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 px-4 py-2.5 rounded-full shadow-xl text-sm font-medium transition-all"
          >
            <SlidersHorizontal size={15} />
            Filtros
            {(filters.disease || filters.status) && (
              <span className="w-2 h-2 rounded-full bg-blue-400 ml-0.5" />
            )}
          </button>
        </div>

        {/* Painel lateral do país */}
        {selectedCountry && !isComparing && selectedData && (
          <CountryPanel
            iso3={selectedCountry}
            disasters={selectedData.disasters}
            reports={selectedData.reports}
            loading={selectedData.loading}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </div>

      {/* Modal de comparação */}
      {isComparing && compareCountries.length >= 2 && (
        <CompareModal
          countries={compareCountries.map((iso3) => ({
            iso3,
            disasters: countryData[iso3]?.disasters ?? [],
            reports: countryData[iso3]?.reports ?? [],
            loading: countryData[iso3]?.loading ?? true,
          }))}
          onClose={() => {
            setIsComparing(false);
            setCompareCountries([]);
          }}
        />
      )}

      {/* Drawer de filtros */}
      <FilterDrawer
        open={filterOpen}
        values={filters}
        onChange={handleFilterChange}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
}
