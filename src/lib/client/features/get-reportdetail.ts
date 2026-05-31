import type { DetailResponse } from "@/lib/types";
import { fetchApi } from "../api";

export async function getReportDetail(id: string): Promise<DetailResponse> {
  return fetchApi<DetailResponse>("/api/detail", { id });
}
