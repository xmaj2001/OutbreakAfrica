// ============================================================
// Tipos base
// ============================================================

export interface Country {
  name: string;
  shortname?: string;
  iso3: string;
  location?: { lat: number; lon: number };
  primary?: boolean;
}

export interface DisasterType {
  name: string;
  code: string;
}

export interface Disaster {
  id: number;
  name: string;
  status: "ongoing" | "past";
  glide?: string;
  type: DisasterType[];
}

export interface Source {
  id: number;
  name: string;
  shortname: string;
  homepage?: string;
}

export interface ReportDate {
  original: string;
  changed?: string;
  created?: string;
}

export interface ReportFile {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  filesize: string;
  pagecount?: number;
  preview?: {
    url: string;
    "url-large": string;
    "url-small": string;
  };
}

// ============================================================
// /search — campos mínimos para listagem e comparação
// ============================================================

export interface ReportSummary {
  id: string;
  fields: {
    title: string;
    "date.original": string;
    "primary_country.name": string;
    "primary_country.iso3": string;
    "disaster_type.name": string;
    "disaster_type.code": string;
    "disaster.name"?: string;
    "disaster.status"?: "ongoing" | "past";
    "source.shortname": string;
    url_alias: string;
  };
}

export interface SearchResponse {
  time: number;
  totalCount: number;
  count: number;
  data: ReportSummary[];
}

// ============================================================
// /detail — campos completos de um report
// ============================================================

export interface ReportDetail {
  id: string;
  fields: {
    title: string;
    body: string;
    "body-html": string;
    date: ReportDate;
    primary_country: Country;
    country: Country[];
    disaster: Disaster[];
    disaster_type: DisasterType[];
    source: Source[];
    theme: { id: number; name: string }[];
    format: { id: number; name: string }[];
    url_alias: string;
    file?: ReportFile[];
  };
}

export interface DetailResponse {
  time: number;
  data: ReportDetail[];
}

// ============================================================
// /disasters — surtos como eventos
// ============================================================

export interface DisasterEvent {
  id: string;
  fields: {
    name: string;
    status: "ongoing" | "past";
    date: { event: string; created?: string };
    country: Country[];
    primary_country?: Country;
    type: DisasterType[];
    glide?: string;
    url_alias?: string;
  };
}

export interface DisastersResponse {
  time: number;
  totalCount: number;
  count: number;
  data: DisasterEvent[];
}

// ============================================================
// Parâmetros de cada endpoint
// ============================================================

export interface SearchParams {
  country?: string;
  country2?: string;
  disease?: string;
  status?: "ongoing" | "past";
  limit?: number;
  offset?: number;
}

export interface DetailParams {
  id: string;
}

export interface DisastersParams {
  status?: "ongoing" | "past";
  country?: string;
  type?: string;
  limit?: number;
}

// ============================================================
// /stats — dados agregados para o dashboard
// ============================================================

export interface DiseaseCount {
  name: string;
  count: number;
}

export interface TimelinePoint {
  label: string;
  count: number;
}

export interface OutbreakStats {
  activeOutbreaks: number;
  affectedCountries: number;
  totalReports: number;
  topDisease: DiseaseCount | null;
  topDiseases: DiseaseCount[];
  timeline: TimelinePoint[];
}

export interface StatsParams {
  country?: string;
}

// ============================================================
// Erro genérico
// ============================================================

export interface ApiError {
  error: string;
}

// ============================================================
// /stats — parâmetros completos
// ============================================================

export interface StatsParams {
  country?: string; // ISO3 separados por vírgula: "ago,cod"
  disease?: string; // nomes separados por vírgula: "Cholera,Ebola"
  source?: string; // shortnames: "WHO,MSF"
  year_from?: string; // "2020"
  year_to?: string; // "2025"
  status?: "ongoing" | "past";
  interval?: "year" | "month";
}

// ── Facet items ───────────────────────────────────────────────────────────────

export interface FacetItem {
  value: string;
  count: number;
}

export interface TimelineFacetItem {
  value: string; // ISO date: "2020-01-01T00:00:00+00:00"
  epoch_ms: number; // timestamp em ms — útil para gráficos
  count: number;
}

// status vindo do /disasters — pode ter "alert-archive" além de "ongoing" | "past"
export type DisasterStatus = "ongoing" | "past" | "alert-archive";

export interface StatusFacetItem {
  value: DisasterStatus;
  count: number;
}

// ── Facet containers ──────────────────────────────────────────────────────────

export interface FacetData<T extends FacetItem = FacetItem> {
  type: "term" | "date";
  data: T[];
  missing: number;
  more: boolean;
}

// ── Resposta completa ─────────────────────────────────────────────────────────

export interface StatsResponse {
  time: number;
  href: string;
  took: number;
  totalCount: number; // total de relatórios — card "Relatórios"
  count: number; // sempre 0 (limit=0)
  data: [];
  embedded: {
    facets: {
      countries: FacetData<FacetItem>; // ISO3 + count
      diseases: FacetData<FacetItem>; // nome do surto + count
      timeline: FacetData<TimelineFacetItem>; // data + epoch_ms + count
      sources: FacetData<FacetItem>; // shortname + count
      status: FacetData<StatusFacetItem>; // ongoing | past | alert-archive
    };
  };
}
