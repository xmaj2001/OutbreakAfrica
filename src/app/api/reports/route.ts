import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. O appname fica escondido aqui no servidor (podes e deves usar process.env se quiseres)
    const url =
      "https://api.reliefweb.int/v2/reports?appname=42luanda-outbreakafrica-62SMHfaCdLRfb";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        // Cabeçalhos cruciais para passar pelo firewall
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br", // O Node às vezes falha por não aceitar compressão
        Connection: "keep-alive",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua":
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
      },
    });

    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json(
        { error: "Erro na API do ReliefWeb", detalhes: errorData },
        { status: res.status },
      );
    }

    const data = await res.json();

    // Retorna os dados limpos para o teu cliente, sem expor o appname
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no proxy" },
      { status: 500 },
    );
  }
}
