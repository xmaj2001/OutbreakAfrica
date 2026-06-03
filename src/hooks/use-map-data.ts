"use client";

import { useState, useEffect } from "react";
import { getDisasters } from "@/lib/client/features/get-disasters";
import type { CountryOutbreakData } from "@/components/maps/africa-outbreak-map";
import { useStats } from "./use-stats";

export function useMapData(selectedCountries: string[] = []) {
  const { raw, isLoading: statsLoading } = useStats();

  const [ongoingByCountry, setOngoingByCountry] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Busca surtos activos por país via /disasters
  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setIsLoading(true);
      try {
        const res = await getDisasters({ status: "ongoing", limit: 100 });

        if (!cancelled) {
          const counts: Record<string, number> = {};

          for (const event of res.data) {
            for (const country of event.fields.country) {
              if (country.iso3) {
                counts[country.iso3] = (counts[country.iso3] ?? 0) + 1;
              }
            }
          }

          setOngoingByCountry(counts);
        }
      } catch {
        // silencia — mapa ainda funciona com total
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  // Combina: total vem do useStats (countries facet), ongoing vem do /disasters
  const mapData: Record<string, CountryOutbreakData> = {};

  for (const item of raw?.embedded.facets.countries.data ?? []) {
    mapData[item.value] = {
      total: item.count,
      ongoing: ongoingByCountry[item.value] ?? 0,
    };
  }

  return {
    mapData,
    isLoading: statsLoading || isLoading,
  };
}
