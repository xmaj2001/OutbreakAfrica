"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryOutbreakData } from "@/components/maps/africa-outbreak-map";
import MapFilter from "./map-filter";

const DISEASES = [
  "Ebola",
  "Cholera",
  "Mpox",
  "Malaria",
  "Marburg",
  "Lassa",
  "Yellow Fever",
  "Measles",
];
const SOURCES = ["WHO", "MSF", "UNICEF", "OCHA", "IFRC", "IOM", "UNHCR", "CDC"];
const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

interface FilterPanelProps {
  outbreakData?: Record<string, CountryOutbreakData>;
}
export default function FilterPanel({ outbreakData }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Lê os filtros actuais da URL
  const current = {
    country: searchParams.get("country") ?? "",
    disease: searchParams.get("disease") ?? "",
    source: searchParams.get("source") ?? "",
    year: searchParams.get("year") ?? "",
    status: searchParams.get("status") ?? "",
  };

  // Actualiza um filtro na URL — mantém os outros
  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Sempre volta à página 1 ao mudar filtro
      params.delete("page");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  function clearAll() {
    startTransition(() => {
      router.push("?");
    });
  }

  const hasFilters = Object.values(current).some(Boolean);

  return (
    <div className="space-y-4 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-bento-accent" />
          FILTROS
          {isPending && (
            <Loader2 className="h-3 w-3 animate-spin text-bento-accent" />
          )}
        </h3>
        {hasFilters && (
          <Button
            onClick={clearAll}
            className="text-[10px] font-mono text-slate-500 hover:text-bento-accent transition-colors uppercase tracking-wider"
          >
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Pesquisa por país (texto livre — ISO3 ou nome) */}
      <MapFilter data={outbreakData} />

      {/* Status */}
      <FilterSection label="Status">
        <div className="flex gap-2">
          {(["", "ongoing", "past"] as const).map((s) => (
            <Button
              key={s}
              onClick={() => setFilter("status", s)}
              className={`flex-1 py-1.5 text-[10px] font-mono font-bold uppercase rounded-sm border transition-colors ${
                current.status === s
                  ? s === "ongoing"
                    ? "bg-bento-accent/10 border-bento-accent/40 text-bento-accent"
                    : s === "past"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-bento-inner border-bento-accent/40 text-slate-300"
                  : "bg-bento-inner border-bento-border text-slate-500 hover:text-slate-300 hover:border-bento-border/80"
              }`}
            >
              {s === "" ? "TODOS" : s === "ongoing" ? "● ATIVO" : "○ CONTIDO"}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Doença */}
      <FilterSection label="Doença">
        <div className="flex flex-wrap gap-1.5">
          {DISEASES.map((d) => (
            <FilterChip
              key={d}
              label={d}
              active={current.disease === d}
              onClick={() =>
                setFilter("disease", current.disease === d ? "" : d)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Fonte */}
      <FilterSection label="Fonte">
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              active={current.source === s}
              onClick={() => setFilter("source", current.source === s ? "" : s)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Ano */}
      <FilterSection label="Ano">
        <div className="flex flex-wrap gap-1.5">
          {YEARS.map((y) => (
            <FilterChip
              key={y}
              label={y}
              active={current.year === y}
              onClick={() => setFilter("year", current.year === y ? "" : y)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Filtros activos resumo */}
      {hasFilters && (
        <div className="pt-3 border-t border-bento-border space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Filtros activos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(current)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <span
                  key={k}
                  className="flex items-center gap-1 px-2 py-0.5 bg-bento-accent/10 border border-bento-accent/20 rounded-full text-[10px] font-mono text-bento-accent"
                >
                  {k}: {v}
                  <Button
                    onClick={() => setFilter(k, "")}
                    className="hover:text-white transition-colors"
                  >
                    ×
                  </Button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-componentes ──────────────────────────────────────────────────────────

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold border transition-colors ${
        active
          ? "bg-bento-accent/10 border-bento-accent/40 text-bento-accent"
          : "bg-bento-inner border-bento-border text-slate-500 hover:text-slate-300 hover:border-slate-600"
      }`}
    >
      {label}
    </Button>
  );
}
