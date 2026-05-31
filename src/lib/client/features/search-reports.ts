import type { SearchParams, SearchResponse } from "@/lib/types";

import { fetchApi } from "../api";

export async function searchReports(
  params: SearchParams = {},
): Promise<SearchResponse> {
  return fetchApi<SearchResponse>("/api/search", {
    country: params.country ?? "",
    country2: params.country2 ?? "",
    disease: params.disease ?? "",
    status: params.status ?? "",
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  });
}
