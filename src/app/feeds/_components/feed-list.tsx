"use client";

import { useEffect, useRef } from "react";
import { ReportCard } from "./report-card";
import { useFeed } from "@/hooks/use-feed";
import type { SearchParams } from "@/lib/types";

interface Props {
  filters: Omit<SearchParams, "limit" | "offset">;
}

export function FeedList({ filters }: Props) {
  const { items, isLoading, isError, hasMore, total, loadMore } =
    useFeed(filters);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Erro ao carregar relatórios.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Contador */}
      {total !== null && (
        <p className="text-xs text-muted-foreground">
          {total.toLocaleString("pt-PT")} relatórios encontrados
        </p>
      )}

      {/* Cards */}
      {items.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}

      {/* Skeleton enquanto carrega */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-muted animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Sem resultados */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Nenhum relatório encontrado.</p>
          <p className="text-xs mt-1">Tenta ajustar os filtros.</p>
        </div>
      )}

      {/* Fim da lista */}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-6">
          Fim dos resultados
        </p>
      )}

      {/* Sentinel para o IntersectionObserver */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
