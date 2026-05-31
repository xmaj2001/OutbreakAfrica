import type { SearchParams, SearchResponse } from "@/lib/types";

import { fetchWorker } from "../api";

export async function searchReports(
  params: SearchParams = {},
): Promise<SearchResponse> {
  return fetchWorker<SearchResponse>("/search", {
    country: params.country ?? "",
    country2: params.country2 ?? "",
    disease: params.disease ?? "",
    status: params.status ?? "",
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  });
}
