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
// Erro genérico
// ============================================================

export interface ApiError {
  error: string;
}
