import { getDisasters } from "@/lib/server/features/get-disasters";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await getDisasters({
    status: (searchParams.get("status") as "ongoing" | "past") ?? "ongoing",
    country: searchParams.get("country") ?? undefined,
  });
  return Response.json(data);
}
