import { Globe, Layers } from "lucide-react";
import FeedItem from "./_components/feed-item";

export const metadata = {
  title: "Surtos em África | OutbreakAfrica",
  description: "Relatórios de surtos de saúde pública no continente africano",
};

export default function FeedPage() {
  const mockData = {
    id: "8513d9fc-d087-4b6f-b8a8-5a77b8ab015d",
    fields: {
      "disaster_type.code": "EBL",
      "disaster_type.name": "EBOLA",
      "date.original": "2024-01-01",
      title: "Ebola outbreak in Angola ends",
      "primary_country.iso3": "AGO",
      "primary_country.name": "Angola",
      "source.shortname": "WHO",
      "disaster.status": "ongoing",
      deaths: 50,
      date: "2024-01-01",
    },
  };
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      id="dashboard-master-grid"
    >
      <div className="lg:col-span-8 space-y-6" id="epidemic-feed-container">
        {/* Header index info */}
        <div
          className="flex items-center justify-between"
          id="feed-results-header"
        >
          <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-bento-accent" />
            FEED DE REPORTES EPIDEMIOLÓGICOS ({0})
          </h3>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            ORDENAMENTO: TEMPO DE PUBLICAÇÃO
          </span>
        </div>

        {/* Reports */}
        {/* <div
        className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-bento-card border border-bento-border"
        id="no-reports-alert"
      >
        <Globe className="h-10 w-10 text-slate-600 mb-3 animate-spin duration-3000" />
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
          Sem Boletins Ativos
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Nenhum registo de saúde localizado para o país ou critérios
          selecionados no mapa.
        </p>
      </div> */}
        {Array.from({ length: 5 }).map((_, index) => (
          <FeedItem
            key={index.toString()}
            report={mockData}
            //   onSelectCountryIso={onSelectCountryIso}
          />
        ))}
      </div>

      <div
        className="lg:col-span-4 border border-bento-border bg-bento-card rounded-sm p-4"
        id="filters-sidebar-column"
      >
        dddd
      </div>
    </div>
  );
}
