"use client";

import { useOutbreakStats } from "@/hooks/use-outbreak-stats";
import { COUNTRY_BY_ISO3 } from "@/lib/country-data";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";

interface ComparisonModalProps {
  /** Os dois ISO3 codes dos países a comparar */
  countries: [string, string];
  /** Callback para fechar o modal */
  onClose: () => void;
}

export function ComparisonModal({ countries, onClose }: ComparisonModalProps) {
  const { lang } = useI18n();
  const { stats: statsA, loading: loadingA } = useOutbreakStats(countries[0]);
  const { stats: statsB, loading: loadingB } = useOutbreakStats(countries[1]);

  const nameA =
    lang === "pt"
      ? COUNTRY_BY_ISO3[countries[0]]?.namePt
      : COUNTRY_BY_ISO3[countries[0]]?.name;
  const nameB =
    lang === "pt"
      ? COUNTRY_BY_ISO3[countries[1]]?.namePt
      : COUNTRY_BY_ISO3[countries[1]]?.name;

  const loading = loadingA || loadingB;

  const rows = [
    {
      label: lang === "pt" ? "Surtos ativos" : "Active outbreaks",
      a: statsA.activeOutbreaks,
      b: statsB.activeOutbreaks,
    },
    {
      label: lang === "pt" ? "Países afetados" : "Affected countries",
      a: statsA.affectedCountries,
      b: statsB.affectedCountries,
    },
    {
      label: lang === "pt" ? "Relatórios" : "Reports",
      a: statsA.totalReports,
      b: statsB.totalReports,
    },
    {
      label: lang === "pt" ? "Mais reportada" : "Top disease",
      a: statsA.topDisease?.name ?? "—",
      b: statsB.topDisease?.name ?? "—",
      isText: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--background)] border border-[var(--ds-gray-alpha-200)] rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--ds-gray-alpha-200)]">
          <h2 className="my-0 font-mono font-medium text-sm uppercase tracking-tight">
            {lang === "pt" ? "Comparação" : "Comparison"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--ds-gray-alpha-200)] transition-colors cursor-pointer border-none bg-transparent text-[var(--foreground)]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center text-sm text-gray-900 py-8 animate-pulse">
              {lang === "pt" ? "A carregar dados..." : "Loading data..."}
            </div>
          ) : (
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-[var(--ds-gray-alpha-200)]">
                  <th className="text-left py-2 text-xs text-gray-900 uppercase font-medium">
                    {lang === "pt" ? "Métrica" : "Metric"}
                  </th>
                  <th className="text-right py-2 text-xs uppercase font-medium truncate max-w-[120px]">
                    {nameA ?? countries[0]}
                  </th>
                  <th className="text-right py-2 text-xs uppercase font-medium truncate max-w-[120px]">
                    {nameB ?? countries[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[var(--ds-gray-alpha-100)]"
                  >
                    <td className="py-3 text-gray-900">{row.label}</td>
                    <td className="py-3 text-right tabular-nums">
                      {row.isText
                        ? (row.a as string)
                        : (row.a as number).toLocaleString()}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {row.isText
                        ? (row.b as string)
                        : (row.b as number).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Top Diseases side by side */}
          {!loading && (
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-xs text-gray-900 uppercase font-mono font-medium mb-2">
                  {nameA} — Top{" "}
                  {lang === "pt" ? "doenças" : "diseases"}
                </h3>
                <ul className="list-none pl-0 space-y-1">
                  {statsA.topDiseases.slice(0, 5).map((d) => (
                    <li
                      key={d.name}
                      className="flex justify-between text-xs font-mono"
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="tabular-nums text-gray-900 ml-2">
                        {d.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs text-gray-900 uppercase font-mono font-medium mb-2">
                  {nameB} — Top{" "}
                  {lang === "pt" ? "doenças" : "diseases"}
                </h3>
                <ul className="list-none pl-0 space-y-1">
                  {statsB.topDiseases.slice(0, 5).map((d) => (
                    <li
                      key={d.name}
                      className="flex justify-between text-xs font-mono"
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="tabular-nums text-gray-900 ml-2">
                        {d.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
