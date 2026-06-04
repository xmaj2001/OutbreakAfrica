// ---------------------------------------------------------------------------
// /search — lista de relatórios
// ---------------------------------------------------------------------------

/**
 * Parâmetros para GET /search
 *
 * @example
 * // Feed principal (todos os surtos activos)
 * fetch('/search?status=ongoing')
 *
 * @example
 * // Filtrar por país e doença
 * fetch('/search?country=cod&disease=Ebola&status=ongoing')
 *
 * @example
 * // Comparação de 3 países
 * fetch('/search?country=cod&country2=ago&country3=uga')
 *
 * @example
 * // Filtrar por fonte e ano
 * fetch('/search?source=WHO&year=2024&limit=50')
 *
 * @example
 * // Paginação
 * fetch('/search?limit=20&offset=20')
 */
export interface SearchRequest {
  /** ISO3 do país principal  ex: "cod", "ago", "nga" */
  country?: string;
  /** ISO3 do 2º país (comparação)  ex: "uga" */
  country2?: string;
  /** ISO3 do 3º país (comparação)  ex: "zaf" */
  country3?: string;
  /** Palavra-chave da doença  ex: "Ebola", "Cholera", "Mpox", "Malaria" */
  disease?: string;
  /** Status do surto */
  status?: "ongoing" | "past";
  /** Shortname da fonte  ex: "WHO", "MSF", "UNICEF", "OCHA" */
  source?: string;
  /** Ano de publicação  ex: "2024" */
  year?: string;
  /** Número de resultados por página (default: 20, máximo: 50) */
  limit?: number;
  /** Offset para paginação (default: 0) */
  offset?: number;
}

/** Um item de relatório no feed */
export interface SearchItem {
  /** ID do relatório — usar para chamar /detail */
  id: string;
  fields: {
    /** Título do relatório */
    title: string;
    /** Data de publicação ISO 8601  ex: "2026-05-01T00:00:00+00:00" */
    date: {
      original: string;
    };
    /** Nome completo do país principal */
    primary_country: {
      name: string;
      iso3: string;
    };
    /** Tipo de desastre — sempre "Epidemic" neste contexto */
    disaster_type: [
      {
        name: string;
        code: string;
      },
    ];
    /** Status do surto associado */
    disaster: [
      {
        status: "ongoing" | "past";
      },
    ];
    /** Shortname da organização fonte  ex: "WHO" */
    source: [
      {
        name: string;
        shortname: string;
        homepage?: string;
      },
    ];
    /** URL amigável na ReliefWeb */
    url_alias?: string;
  };
}

/** Resposta do endpoint /search */
export interface SearchResponse {
  time: number;
  /** Total de resultados existentes (pode ser > count se houver mais páginas) */
  totalCount: number;
  /** Número de resultados nesta página */
  count: number;
  data: SearchItem[];
}
