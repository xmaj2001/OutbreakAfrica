"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapFilter } from "./map-filter";
import type { SearchParams } from "@/lib/types";

export interface FeedFilters extends Omit<SearchParams, "limit" | "offset"> {
  year_from?: string;
  year_to?: string;
}

interface Props {
  filters: FeedFilters;
  onChange: (filters: FeedFilters) => void;
  onClose?: () => void; // só na versão sheet
}

const DISEASE_OPTIONS = [
  "Cholera",
  "Ebola",
  "Measles",
  "Yellow Fever",
  "Polio",
  "Mpox",
  "Meningitis",
  "Malaria",
];

export function FiltersPanel({ filters, onChange, onClose }: Props) {
  const selectedCountries = filters.country
    ? filters.country.split(",").filter(Boolean)
    : [];

  function setFilter<K extends keyof FeedFilters>(
    key: K,
    value: FeedFilters[K],
  ) {
    onChange({ ...filters, [key]: value || undefined });
  }

  function handleCountrySelect(iso3: string) {
    const current = selectedCountries;
    const next = current.includes(iso3)
      ? current.filter((c) => c !== iso3)
      : [...current, iso3];
    setFilter("country", next.join(",") || undefined);
  }

  function handleClear() {
    onChange({});
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filtros</h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Search por título/doença */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Pesquisar
        </label>
        <Input
          placeholder="Ebola, Cólera, Varíola..."
          value={filters.disease ?? ""}
          onChange={(e) => setFilter("disease", e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Mapa compacto */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          País (clica no mapa)
        </label>
        <MapFilter
          selected={selectedCountries}
          onSelect={handleCountrySelect}
        />
        {/* Badges dos países seleccionados */}
        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedCountries.map((iso3) => (
              <Badge
                key={iso3}
                variant="secondary"
                className="cursor-pointer text-xs"
                onClick={() => handleCountrySelect(iso3)}
              >
                {iso3.toUpperCase()} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Estado
        </label>
        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) =>
            setFilter(
              "status",
              v === "all" ? undefined : (v as "ongoing" | "past"),
            )
          }
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ongoing">Activo</SelectItem>
            <SelectItem value="past">Encerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intervalo de anos */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Período
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="De"
            type="number"
            min={2000}
            max={2026}
            value={filters.year_from ?? ""}
            onChange={(e) => setFilter("year_from" as any, e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder="Até"
            type="number"
            min={2000}
            max={2026}
            value={filters.year_to ?? ""}
            onChange={(e) => setFilter("year_to" as any, e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Doenças rápidas */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Doença
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DISEASE_OPTIONS.map((d) => {
            const active = filters.disease === d;
            return (
              <Badge
                key={d}
                variant={active ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setFilter("disease", active ? undefined : d)}
              >
                {d}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Botão de fechar (só sheet) */}
      {onClose && (
        <Button onClick={onClose} className="mt-2 w-full" size="sm">
          Ver resultados
        </Button>
      )}
    </div>
  );
}
