"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function FeedPagination({
  currentPage,
  totalPages,
}: FeedPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-bento-border">
      <Button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 font-mono text-[10px] uppercase bg-bento-inner border border-bento-border text-slate-300 hover:text-bento-accent disabled:opacity-30"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Anterior
      </Button>

      <span className="text-[10px] font-mono text-slate-500">
        {currentPage} / {totalPages}
      </span>

      <Button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 font-mono text-[10px] uppercase bg-bento-inner border border-bento-border text-slate-300 hover:text-bento-accent disabled:opacity-30"
      >
        Próxima
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
