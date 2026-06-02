import { getStats } from "@/lib/server/features/get-stats";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const data = await getStats({
    country: searchParams.get("country") ?? undefined,
    disease: searchParams.get("disease") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    year_from: searchParams.get("year_from") ?? undefined,
    year_to: searchParams.get("year_to") ?? undefined,
    status: (searchParams.get("status") as "ongoing" | "past") ?? undefined,
    interval: (searchParams.get("interval") as "year" | "month") ?? undefined,
  });

  return Response.json(data);
}
