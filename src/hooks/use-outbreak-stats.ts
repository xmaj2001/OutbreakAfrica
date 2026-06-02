"use client";

import { useEffect, useState, useCallback } from "react";
import type { OutbreakStats } from "@/lib/types";
import { getStats } from "@/lib/client/features/get-stats";

// ============================================================
// Estado padrão (enquanto carrega)
// ============================================================

const DEFAULT_STATS: OutbreakStats = {
  activeOutbreaks: 0,
  affectedCountries: 0,
  totalReports: 0,
  topDisease: null,
  topDiseases: [],
  timeline: [],
};

// ============================================================
// Hook: useOutbreakStats
// ============================================================

/**
 * Hook que fornece estatísticas agregadas dos surtos.
 *
 * - Sem argumento → dados globais (toda a África)
 * - Com `country` (ISO3) → dados filtrados por país
 *
 * Retorna:
 *  - `stats`: OutbreakStats com todos os campos do dashboard
 *  - `loading`: true enquanto carrega
 *  - `error`: string de erro, se houver
 *  - `refetch`: função para forçar re-fetch
 *
 * @example
 * ```tsx
 * // Dados globais
 * const { stats, loading } = useOutbreakStats();
 *
 * // Dados de um país
 * const { stats, loading } = useOutbreakStats("SEN");
 * ```
 */
export function useOutbreakStats(country?: string) {
  const [stats, setStats] = useState<OutbreakStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStats(country);
      setStats(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar estatísticas";
      setError(message);
      console.error("[useOutbreakStats]", message);
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
