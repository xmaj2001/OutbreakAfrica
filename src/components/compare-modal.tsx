"use client";

import { useEffect } from "react";
import type { DisasterEvent, ReportSummary } from "@/lib/types";
import { getCountryByIso3 } from "@/lib/africa-countries";
import { X, AlertTriangle, FileText, TrendingUp } from "lucide-react";

interface CompareData {
  iso3: string;
  disasters: DisasterEvent[];
  reports: ReportSummary[];
  loading: boolean;
}

interface CompareModalProps {
  countries: CompareData[];
  onClose: () => void;
}

export function CompareModal({ countries, onClose }: CompareModalProps) {
  // Fechar com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-blue-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Comparação de Países
            </h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              {countries.length} países
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto">
          <div
            className="grid divide-x divide-slate-800"
            style={{ gridTemplateColumns: `repeat(${countries.length}, 1fr)` }}
          >
            {countries.map(({ iso3, disasters, reports, loading }) => {
              const country = getCountryByIso3(iso3);
              const activeDisasters = disasters.filter(
                (d) => d.fields.status === "ongoing",
              );

              return (
                <div key={iso3} className="flex flex-col">
                  {/* País header */}
                  <div className="px-5 py-4 bg-slate-800/50 border-b border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">
                      País
                    </p>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {country?.name ?? iso3}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 uppercase">
                      {iso3}
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex-1 flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="px-5 py-4 space-y-5">
                      {/* Stats rápidas */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2.5 text-center">
                          <p className="text-2xl font-bold text-amber-400">
                            {activeDisasters.length}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Surtos activos
                          </p>
                        </div>
                        <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg px-3 py-2.5 text-center">
                          <p className="text-2xl font-bold text-blue-400">
                            {reports.length}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Relatórios
                          </p>
                        </div>
                      </div>

                      {/* Surtos */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle size={12} className="text-amber-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Surtos Activos
                          </span>
                        </div>
                        {activeDisasters.length === 0 ? (
                          <p className="text-xs text-slate-600 italic">
                            Nenhum surto activo
                          </p>
                        ) : (
                          <ul className="space-y-1.5">
                            {activeDisasters.map((d) => (
                              <li
                                key={d.id}
                                className="text-xs text-slate-300 bg-slate-800/60 rounded px-2.5 py-2 border border-slate-700/40"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1.5" />
                                {d.fields.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Relatórios recentes */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText size={12} className="text-blue-400" />
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Últimos Relatórios
                          </span>
                        </div>
                        {reports.length === 0 ? (
                          <p className="text-xs text-slate-600 italic">
                            Sem relatórios
                          </p>
                        ) : (
                          <ul className="space-y-1.5">
                            {reports.slice(0, 5).map((r) => (
                              <li key={r.id}>
                                <a
                                  href={r.fields.url_alias}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block text-xs text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 rounded px-2.5 py-2 border border-slate-700/30 hover:border-slate-600 transition-all"
                                >
                                  <span className="line-clamp-2">
                                    {r.fields.title}
                                  </span>
                                  <span className="text-slate-600 mt-1 block">
                                    {new Date(
                                      r.fields["date.original"],
                                    ).toLocaleDateString("pt-PT", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
