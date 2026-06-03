import {
  RegionCount,
  StatsGrid,
  TopDiseases,
  AffectedCountries,
} from "@/components/home/StatsDisplay";
import MapSection from "@/components/maps/MapSection";
import { getStats } from "@/lib/server/features/get-stats";

interface HomeProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { country } = await searchParams;

  // Se o usuário clicou em um país, passamos o parâmetro ISO3 para a API do Servidor
  const stats = await getStats({ country });

  const affectedCountries = stats.embedded.facets.countries.data;
  const totalReports = stats.totalCount;
  const topDiseases = stats.embedded.facets.diseases.data;

  return (
    <main className="font-mono min-h-screen max-w-[min(100vw,1800px)] mx-auto relative overflow-hidden md:rounded-md flex flex-col md:block px-6 pt-12 md:pt-16">
      <div className="w-full space-y-1.5 mx-auto mt-1 mb-12">
        {/* Layout Mobile / Telas pequenas */}
        <div className="flex flex-col min-[961px]:hidden">
          <header className="flex flex-col items-start font-mono text-sm uppercase gap-2 mb-6">
            <p className="text-gray-1000 font-mono my-0 whitespace-nowrap">
              Outbreak Africa{" "}
              <span className="block font-mono text-gray-900">
                {country
                  ? `Filtro: ${country.toUpperCase()}`
                  : "Visão continental"}
              </span>
            </p>
          </header>

          <section className="pb-6 w-full">
            <div className="flex flex-col gap-y-6">
              <AffectedCountries
                countries={affectedCountries.length}
                totalReports={totalReports}
              />
              <TopDiseases diseases={topDiseases} />
            </div>
            <RegionCount />
          </section>

          <div className="w-full flex justify-center">
            <MapSection stats={stats} />
          </div>
        </div>

        {/* Layout Desktop */}
        <div className="relative hidden min-[961px]:flex flex-row max-lg:items-end lg:items-center lg:justify-between">
          <header className="flex flex-col items-start font-mono text-sm xl:text-base uppercase gap-2 max-lg:mb-8 mb-auto">
            <p className="text-gray-1000 font-mono my-0 whitespace-nowrap">
              Outbreak Africa{" "}
              <span className="block font-mono text-gray-900">
                {country
                  ? `Filtro: ${country.toUpperCase()}`
                  : "Visão continental"}
              </span>
            </p>

            <TopDiseases diseases={topDiseases} />
          </header>

          <section className="pb-6 w-fit z-10 relative"></section>
          {/* O mapa agora reage interativamente no lado do cliente */}
          <div className="w-full h-full max-lg:scale-[1.5] max-lg:-translate-y-16 max-lg:translate-x-[-20%]">
            <MapSection stats={stats} />
            <div className="absolute top-4 right-4 z-50">
              <AffectedCountries
                countries={affectedCountries.length}
                totalReports={totalReports}
              />
            </div>
          </div>
        </div>

        <section className="mt-8">
          <StatsGrid />
        </section>
      </div>
    </main>
  );
}
