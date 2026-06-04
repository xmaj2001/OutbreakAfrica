import { Suspense } from "react";
import FeedList from "./_components/feed-list";
import { Layers } from "lucide-react";
import FeedSkeleton from "./_components/feed-skeleton";
import FilterPanel from "./_components/filter-panel";
import { getStats } from "@/lib/server/features/get-stats";

interface FeedPageProps {
  searchParams: Promise<{
    page?: string;
    country?: string;
    disease?: string;
    source?: string;
    year?: string;
    status?: string;
  }>;
}

export const metadata = {
  title: "Surtos em África | OutbreakAfrica",
  description: "Relatórios de surtos de saúde pública no continente africano",
};

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1"));
  // const stats = await getStats();
  // const outbreakData = stats.data.map((item) => {
  //   return {
  //     country: item.name,
  //     count: item.count,
  //   };
  // });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-bento-accent" />
            FEED DE REPORTES EPIDEMIOLÓGICOS
          </h3>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            ORDENAMENTO: TEMPO DE PUBLICAÇÃO
          </span>
        </div>

        {/* Suspense aqui — fallback enquanto o FeedList carrega */}
        <Suspense fallback={<FeedSkeleton />} key={currentPage}>
          <FeedList
            page={currentPage}
            country={params.country}
            disease={params.disease}
            source={params.source}
            year={params.year}
            status={params.status as "ongoing" | "past" | undefined}
          />
        </Suspense>
      </div>

      <div className="lg:col-span-4 border border-bento-border bg-bento-card rounded-sm p-4">
        <FilterPanel />
      </div>
    </div>
  );
}
