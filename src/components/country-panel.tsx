"use client";

import type { DisasterEvent, ReportSummary } from "@/lib/types";
import { getCountryByIso3 } from "@/lib/africa-countries";
import { X, AlertTriangle, FileText, Clock } from "lucide-react";

interface CountryPanelProps {
  iso3: string;
  disasters: DisasterEvent[];
  reports: ReportSummary[];
  loading: boolean;
  onClose: () => void;
}

export function CountryPanel({
  iso3,
  disasters,
  reports,
  loading,
  onClose,
}: CountryPanelProps) {
  const country = getCountryByIso3(iso3);
  const activeDisasters = disasters.filter(
    (d) => d.fields.status === "ongoing",
  );

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-80 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">
            País
          </p>
          <h2 className="text-lg font-semibold text-slate-100">
            {country?.name ?? iso3}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Surtos activos */}
          <div className="px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Surtos Activos
              </span>
              <span className="ml-auto text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full">
                {activeDisasters.length}
              </span>
            </div>

            {activeDisasters.length === 0 ? (
              <p className="text-sm text-slate-600 italic">
                Nenhum surto activo
              </p>
            ) : (
              <ul className="space-y-2">
                {activeDisasters.map((d) => (
                  <li
                    key={d.id}
                    className="bg-slate-800/60 rounded-lg px-3 py-2.5 border border-slate-700/50"
                  >
                    <p className="text-sm text-slate-200 font-medium leading-snug">
                      {d.fields.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs text-amber-400">Em curso</span>
                      <span className="text-slate-600 mx-1">·</span>
                      <span className="text-xs text-slate-500">
                        {d.fields.type.map((t) => t.name).join(", ")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Relatórios recentes */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-blue-400" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Relatórios Recentes
              </span>
              <span className="ml-auto text-xs bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full">
                {reports.length}
              </span>
            </div>

            {reports.length === 0 ? (
              <p className="text-sm text-slate-600 italic">
                Nenhum relatório encontrado
              </p>
            ) : (
              <ul className="space-y-2">
                {reports.slice(0, 8).map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.fields.url_alias}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-slate-800/40 hover:bg-slate-800 rounded-lg px-3 py-2.5 border border-slate-700/30 hover:border-slate-600 transition-all"
                    >
                      <p className="text-sm text-slate-300 group-hover:text-slate-100 leading-snug line-clamp-2 transition-colors">
                        {r.fields.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock size={10} className="text-slate-600" />
                        <span className="text-xs text-slate-600">
                          {new Date(
                            r.fields["date.original"],
                          ).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {r.fields["disaster.status"] === "ongoing" && (
                          <>
                            <span className="text-slate-700 mx-0.5">·</span>
                            <span className="text-xs text-amber-500">
                              Em curso
                            </span>
                          </>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
