// import type { SearchItem, SearchResponse } from "@/lib/search.type";

// // ─────────────────────────────────────────────────────────────────────────────
// // Tipo mastigado — o que o cliente consome directamente
// // ─────────────────────────────────────────────────────────────────────────────

// export interface FeedItem {
//   /** ID do relatório — usar para chamar /detail */
//   id: string;

//   /** Título do relatório */
//   title: string;

//   /** Data de publicação ISO 8601  ex: "2026-06-04T00:00:00+00:00" */
//   date: string;

//   /** País principal */
//   country: {
//     name: string; // "Democratic Republic of the Congo"
//     iso3: string; // "cod"
//   };

//   /**
//    * Tipo de desastre principal
//    * Pega o primeiro do array — para esta plataforma será sempre "Epidemic"
//    */
//   disasterType: string | null;

//   /**
//    * Status do surto associado
//    * Pega o primeiro do array
//    * null = relatório sem surto associado (ex: relatórios de preparação)
//    */
//   status: "ongoing" | "past" | null;

//   /**
//    * Fontes que publicaram o relatório
//    * Array completo — um relatório pode ter múltiplas fontes
//    * ex: ["Logistics Cluster", "WFP"]
//    */
//   sources: string[];

//   /**
//    * Fonte principal (primeira do array) — usar nos cards do feed
//    * ex: "WHO"
//    */
//   primarySource: string | null;

//   /** URL amigável do relatório na ReliefWeb */
//   url: string | null;
// }

// export interface FeedResponse {
//   /** Total de resultados existentes na API (para paginação) */
//   totalCount: number;

//   /** Número de resultados nesta página */
//   count: number;

//   /** Tem próxima página? */
//   hasNextPage: boolean;

//   /** Tem página anterior? */
//   hasPrevPage: boolean;

//   /** Items mastigados prontos a renderizar */
//   items: FeedItem[];
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Transformer de um item individual
// // ─────────────────────────────────────────────────────────────────────────────

// function transformItem(item: SearchItem): FeedItem {
//   const f = item.fields;

//   return {
//     id:           item.id,
//     title:        f.title,
//     date:         f.date.original,
//     country: {
//       name: f.primary_country.name,
//       iso3: f.primary_country.iso3,
//     },
//     disasterType:  f.disaster_type?.[0]?.name  ?? null,
//     status:       (f.disaster?.[0]?.status     ?? null) as FeedItem["status"],
//     sources:       f.source?.map((s) => s.shortname) ?? [],
//     primarySource: f.source?.[0]?.shortname           ?? null,
//     url:           f.url_alias                        ?? null,
//   };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Transformer da resposta completa
// // ─────────────────────────────────────────────────────────────────────────────

// export function transformSearchResponse(raw: SearchResponse): FeedResponse {
//   return {
//     totalCount:  raw.totalCount,
//     count:       raw.count,
//     hasNextPage: !!raw.links?.next,
//     hasPrevPage: !!raw.links?.prev,
//     items:       raw.data.map(transformItem),
//   };
// }
