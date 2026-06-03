import { FiltersPanel } from "./filters-panel";
import type { FeedFilters } from "./filters-panel";

interface Props {
  filters: FeedFilters;
  onChange: (f: FeedFilters) => void;
}

export function FiltersSidebar({ filters, onChange }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0">
      <div className="sticky top-6 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <FiltersPanel filters={filters} onChange={onChange} />
      </div>
    </aside>
  );
}
