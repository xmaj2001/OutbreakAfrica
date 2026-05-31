import { getReportDetail } from "@/lib/server/features/get-reportdetail";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !/^\d+$/.test(id)) {
    return Response.json(
      { error: "Parâmetro 'id' é obrigatório e deve ser numérico." },
      { status: 400 },
    );
  }

  const data = await getReportDetail({ id });

  return Response.json(data);
}
