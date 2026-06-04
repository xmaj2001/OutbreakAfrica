import { Globe } from "lucide-react";
import { searchReports } from "@/lib/server/features/search-reports";
import FeedItem from "./feed-item";
import FeedPagination from "./feed-pagination";

const LIMIT = 20;

interface FeedListProps {
  page: number;
  country?: string;
  disease?: string;
  source?: string;
  year?: string;
  status?: "ongoing" | "past";
}

export default async function FeedList({
  page,
  country,
  disease,
  source,
  year,
  status,
}: FeedListProps) {
  const offset = (page - 1) * LIMIT;

  const res = await searchReports({
    limit: LIMIT,
    offset,
    country,
    disease,
    source,
    year,
    status,
  });

  const totalPages = Math.ceil(res.totalCount / LIMIT);

  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-mono">
        {res.totalCount.toLocaleString()} resultados — página {page} de{" "}
        {totalPages}
      </span>

      {res.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-bento-card border border-bento-border">
          <Globe className="h-10 w-10 text-slate-600 mb-3" />
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Sem Boletins
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Nenhum registo localizado para os critérios seleccionados.
          </p>
        </div>
      ) : (
        res.data.map((report) => <FeedItem key={report.id} report={report} />)
      )}

      {totalPages > 1 && (
        <FeedPagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
