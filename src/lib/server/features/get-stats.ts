import type { StatsParams, StatsResponse } from "@/lib/types";
import { fetchWorker } from "../api";

export async function getStats(
  params: StatsParams = {},
): Promise<StatsResponse> {
  return fetchWorker<StatsResponse>("/stats", {
    country: params.country ?? "",
    disease: params.disease ?? "",
    source: params.source ?? "",
    year_from: params.year_from ?? "",
    year_to: params.year_to ?? "",
    status: params.status ?? "",
    interval: params.interval ?? "year",
  });
}
