import type { DisastersParams, DisastersResponse } from "@/lib/types";

import { fetchApi } from "../api";

export async function getDisasters(
  params: DisastersParams = {},
): Promise<DisastersResponse> {
  return fetchApi<DisastersResponse>("/api/disasters", {
    status: params.status ?? "ongoing",
    country: params.country ?? "",
    type: params.type ?? "EP",
    limit: String(params.limit ?? 20),
  });
}
