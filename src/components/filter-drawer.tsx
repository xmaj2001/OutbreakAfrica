"use client";

import { useEffect } from "react";
import { X, Filter } from "lucide-react";

export interface FilterValues {
  disease: string;
  status: "ongoing" | "past" | "";
}

interface FilterDrawerProps {
  open: boolean;
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClose: () => void;
}

const DISEASES = [
  "Ebola",
  "Cholera",
  "Mpox",
  "Measles",
  "Malaria",
  "Yellow Fever",
  "Meningitis",
  "COVID-19",
  "Marburg",
];

export function FilterDrawer({
  open,
  values,
  onChange,
  onClose,
}: FilterDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Drawer — desliza da direita */}
      <div
        className={`
          fixed right-0 top-0 h-full z-40 w-72 bg-slate-900 border-l border-slate-800
          shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-100">
              Filtros
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Status */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">
              Estado do Surto
            </label>
            <div className="space-y-2">
              {[
                { value: "", label: "Todos" },
                { value: "ongoing", label: "Em curso" },
                { value: "past", label: "Passados" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    onChange({
                      ...values,
                      status: opt.value as FilterValues["status"],
                    })
                  }
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                    ${
                      values.status === opt.value
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doença */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">
              Doença
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => onChange({ ...values, disease: "" })}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                  ${
                    values.disease === ""
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-slate-800 border border-transparent"
                  }
                `}
              >
                Todas
              </button>
              {DISEASES.map((disease) => (
                <button
                  key={disease}
                  onClick={() => onChange({ ...values, disease })}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                    ${
                      values.disease === disease
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  {disease}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — limpar filtros */}
        <div className="px-5 py-4 border-t border-slate-800">
          <button
            onClick={() => onChange({ disease: "", status: "" })}
            className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors py-2"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </>
  );
}
