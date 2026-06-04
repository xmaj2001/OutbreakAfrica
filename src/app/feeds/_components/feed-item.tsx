"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Flame, MapPin } from "lucide-react";
import type { SearchItem } from "@/lib/search.type";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface FeedItemProps {
  report: SearchItem;
  //   onSelectCountryIso: (iso3: string) => void;
}

export default function FeedItem({
  report,
  //   onSelectCountryIso,
}: FeedItemProps) {
  const isOngoing = report.fields.disaster?.[0]?.status === "ongoing";

  return (
    <motion.div
      key={report.id}
      id={`report-card-${report.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      //   onClick={() => handleOpenDetail(report.id)}
      className="group relative p-4 rounded-sm bg-bento-card border border-bento-border hover:border-bento-accent/50 hover:bg-bento-inner/50 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
    >
      {/* Outbreak status flag ribbon */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-xl transition-colors ${
          isOngoing
            ? "bg-bento-accent group-hover:bg-bento-amber"
            : "bg-emerald-500 group-hover:bg-teal-400"
        }`}
      />

      <div className="space-y-3 pl-1">
        {/* Row 1: Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bento-inner text-bento-accent border border-bento-accent/20 font-mono font-bold">
              <Flame className="h-3 w-3 text-bento-accent" />
              {report.fields.disaster_type?.[0]?.code}
            </span>
            <span className="text-slate-400 font-semibold tracking-wide uppercase font-mono text-[9px]">
              {report.fields.disaster_type?.[0]?.name}
            </span>
          </div>

          {/* Report Date */}
          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <Calendar className="h-3.5 w-3.5 text-slate-600" />
            {formatDate(report.fields.date.original)}
          </div>
        </div>

        {/* Row 2: Title */}
        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-bento-accent transition-colors tracking-tight leading-snug">
          {report.fields.title}
        </h4>

        {/* Row 3: Meta details */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-bento-border text-xs">
          {/* Country tag clickable */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              //   onSelectCountryIso(report.fields["primary_country.iso3"]);
            }}
            className="flex items-center gap-1 text-slate-300 hover:text-bento-accent transition-colors bg-bento-inner px-2 py-1 rounded border border-bento-border cursor-pointer font-mono text-[10px]"
          >
            <MapPin className="h-3.5 w-3.5 text-bento-accent" />
            {report.fields.primary_country.name}
          </Button>

          {/* Source tag */}
          <Link
            href={`${report.fields.source?.[0]?.homepage}`}
            target="_blank"
            aria-label={`Página web da organização ${report.fields.source?.[0]?.name}`}
            className="text-slate-400 font-medium flex items-center gap-1"
          >
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              FONTE:
            </span>
            <span className="bg-bento-inner px-2 py-1 rounded border border-bento-border text-slate-300 font-mono text-[10px]">
              {report.fields.source?.[0]?.shortname}
            </span>
          </Link>

          {/* Status badge */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
              isOngoing
                ? "bg-bento-accent/10 border border-bento-accent/20 text-bento-accent"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}
          >
            {isOngoing ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-bento-accent animate-pulse"></span>
                ATIVO
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                CONTIDO
              </>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
