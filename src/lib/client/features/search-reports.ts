import type { SearchRequest, SearchResponse } from "@/lib/search.type";

import { fetchApi } from "../api";

export async function searchReports(
  params: SearchRequest = {},
): Promise<SearchResponse> {
  return fetchApi<SearchResponse>("/api/search", {
    country: params.country ?? "",
    country2: params.country2 ?? "",
    country3: params.country3 ?? "",
    disease: params.disease ?? "",
    status: params.status ?? "",
    source: params.source ?? "",
    year: params.year ?? "",
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  });
}
