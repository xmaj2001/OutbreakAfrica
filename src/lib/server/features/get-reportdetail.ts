import type { DetailResponse, DetailParams } from "@/lib/types";
import { fetchWorker } from "../api";

export async function getReportDetail(
  params: DetailParams,
): Promise<DetailResponse> {
  return fetchWorker<DetailResponse>("/detail", {
    id: params.id,
  });
}
