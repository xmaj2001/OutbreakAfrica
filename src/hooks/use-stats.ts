import { useState, useEffect } from "react";
import { getStats } from "@/lib/client/features/get-stats";
import type { StatsParams, StatsResponse, FacetItem } from "@/lib/types";

export interface UseStatsResult {
  activeOutbreaks: number;
  affectedCountries: number;
  totalReports: number;
  topDiseases: FacetItem[];
  timeline: FacetItem[];
  sources: FacetItem[];

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  raw: StatsResponse | undefined;
}

export function useStats(params: StatsParams = {}): UseStatsResult {
  const [data, setData] = useState<StatsResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serializa params para usar como dependência do useEffect
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await getStats(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setIsError(true);
          setError(err instanceof Error ? err.message : "Erro desconhecido");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetch();

    return () => {
      cancelled = true;
    };
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    activeOutbreaks:
      data?.embedded.facets.status.data.find((s) => s.value === "ongoing")
        ?.count ?? 0,
    affectedCountries: data?.embedded.facets.countries.data.length ?? 0,
    totalReports: data?.totalCount ?? 0,
    topDiseases: data?.embedded.facets.diseases.data ?? [],
    timeline: data?.embedded.facets.timeline.data ?? [],
    sources: data?.embedded.facets.sources.data ?? [],

    isLoading,
    isError,
    error,
    raw: data,
  };
}
