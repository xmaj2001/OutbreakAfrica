"use client";

import { useState, useEffect, useCallback } from "react";
import { searchReports } from "@/lib/client/features/search-reports";
import type { ReportSummary, SearchParams } from "@/lib/types";

const PAGE_SIZE = 20;

export function useFeed(params: Omit<SearchParams, "limit" | "offset">) {
  const [items, setItems] = useState<ReportSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const paramsKey = JSON.stringify(params);

  // Reset quando os filtros mudam
  useEffect(() => {
    setItems([]);
    setOffset(0);
    setTotal(null);
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch sempre que offset ou filtros mudam
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await searchReports({
          ...params,
          limit: PAGE_SIZE,
          offset,
        });

        if (!cancelled) {
          setTotal(res.totalCount);
          setItems((prev) =>
            offset === 0 ? res.data : [...prev, ...res.data],
          );
        }
      } catch {
        if (!cancelled) setIsError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [paramsKey, offset]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!isLoading) setOffset((prev) => prev + PAGE_SIZE);
  }, [isLoading]);

  const hasMore = total === null ? true : items.length < total;

  return { items, isLoading, isError, hasMore, total, loadMore };
}
