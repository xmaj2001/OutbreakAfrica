// ════════════════════════════════════════════════════════════════════════════
// app/outbreaks/page.tsx
// Página SSR de listagem — filtros lidos da URL para SEO
// URL: /outbreaks?country=Angola&disease=cholera&yearFrom=2024&severity=high
// ════════════════════════════════════════════════════════════════════════════
import type { Metadata } from "next";
import { OutbreakFiltersSchema } from "@/lib/reports/types";
import { getOutbreaks } from "@/lib/reports/use-case";
interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

// Metadata dinâmica para SEO
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const country = searchParams.country as string | undefined;
  const disease = searchParams.disease as string | undefined;

  const title = [
    "Disease Outbreaks",
    country && `in ${country}`,
    disease && `— ${disease}`,
    "| OutbreakAfrica",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description: `Monitor disease outbreaks across Africa${country ? ` in ${country}` : ""}. Real-time data from WHO and humanitarian sources.`,
    openGraph: { title, type: "website" },
  };
}

export default async function OutbreaksPage({ searchParams }: PageProps) {
  // Normaliza searchParams para strings simples
  const rawParams = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : (v ?? ""),
    ]),
  );

  // Parse e validação com Zod — valores inválidos usam defaults
  const filters = OutbreakFiltersSchema.parse(rawParams);

  // Dados carregados no servidor (SSR) — prontos para hidratação
  const initialData = await getOutbreaks(filters);

  return (
    <main>
      {/*
        OutbreaksClient recebe:
        - initialData: já renderizado no servidor (SEO + first paint)
        - filters: filtros activos para o estado inicial do cliente
        O cliente toma conta do infinite scroll a partir daqui
      */}
      {/* <OutbreaksClient initialData={initialData} initialFilters={filters} /> */}
      <pre>{JSON.stringify(initialData, null, 2)}</pre>
    </main>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// app/outbreaks/[id]/page.tsx
// Página de detalhe — SSR + metadata específica para SEO
// ════════════════════════════════════════════════════════════════════════════
// import type { Metadata } from "next";
// import { getOutbreakById } from "@/lib/reports/use-cases";
// import { notFound } from "next/navigation";
//
// export async function generateMetadata(
//   { params }: { params: { id: string } }
// ): Promise<Metadata> {
//   const outbreak = await getOutbreakById(params.id);
//   if (!outbreak) return { title: "Not Found | OutbreakAfrica" };
//   return {
//     title: `${outbreak.title} | OutbreakAfrica`,
//     description: outbreak.summary,
//     openGraph: {
//       title: outbreak.title,
//       description: outbreak.summary,
//       type: "article",
//       publishedTime: outbreak.date,
//     },
//   };
// }
//
// export default async function OutbreakDetailPage(
//   { params }: { params: { id: string } }
// ) {
//   const outbreak = await getOutbreakById(params.id);
//   if (!outbreak) notFound();
//
//   return (
//     <main>
//       <h1>{outbreak.title}</h1>
//       <div dangerouslySetInnerHTML={{ __html: outbreak.bodyHtml ?? "" }} />
//       {/* ExportPanel, SourceLink, FilesPanel */}
//     </main>
//   );
// }

// ════════════════════════════════════════════════════════════════════════════
// app/country/[name]/page.tsx
// Perfil de país — SSR
// ════════════════════════════════════════════════════════════════════════════
// import { getOutbreaksByCountry } from "@/lib/reports/use-cases";
//
// export default async function CountryPage(
//   { params }: { params: { name: string } }
// ) {
//   const countryName = decodeURIComponent(params.name);
//   const data = await getOutbreaksByCountry(countryName);
//   return (
//     <main>
//       <h1>{countryName}</h1>
//       {/* CountryStatsPanel, OutbreaksList */}
//     </main>
//   );
// }
