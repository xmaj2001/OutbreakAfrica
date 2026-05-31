import { searchReports } from "@/lib/server/features/search-reports";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const data = await searchReports({
    country: searchParams.get("country") ?? undefined,
    country2: searchParams.get("country2") ?? undefined,
    disease: searchParams.get("disease") ?? undefined,
    status: (searchParams.get("status") as "ongoing" | "past") ?? undefined,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
    offset: searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : undefined,
  });

  return Response.json(data);
}
