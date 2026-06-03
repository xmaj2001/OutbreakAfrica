"use client";

import { useState } from "react";
import { FeedList } from "./feed-list";
import { FiltersSidebar } from "./filters-sidebar";
import { FiltersSheet } from "./filters-sheet";
import type { FeedFilters } from "./filters-panel";

export function FeedPageClient() {
  const [filters, setFilters] = useState<FeedFilters>({});

  return (
    <div className="relative flex gap-6 items-start max-w-7xl mx-auto px-4 py-6">
      {/* Feed — lado esquerdo */}
      <main className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Surtos em África</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Relatórios de surtos de saúde pública no continente africano
          </p>
        </div>
        <FeedList filters={filters} />
      </main>

      {/* Sidebar de filtros — lado direito, só desktop */}
      <FiltersSidebar filters={filters} onChange={setFilters} />

      {/* Sheet de filtros — só mobile */}
      <FiltersSheet filters={filters} onChange={setFilters} />
    </div>
  );
}
