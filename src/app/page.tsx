import MapContainer from "@/components/home/MapContainer";
import {
  RegionCount,
  StatsGrid,
  TopDiseases,
  AffectedCountries,
} from "@/components/home/StatsDisplay";
import { getStats } from "@/lib/server/features/get-stats";

export default async function Home() {
  const stats = await getStats(); // África toda, sem filtros

  const activeOutbreaks =
    stats.embedded.facets.status.data.find((s) => s.value === "ongoing")
      ?.count ?? 0;

  const affectedCountries = stats.embedded.facets.countries.data.length;
  const totalReports = stats.totalCount;
  const topDiseases = stats.embedded.facets.diseases.data;
  const timeline = stats.embedded.facets.timeline.data;
  console.log("STATS", stats.embedded.facets.diseases);
  return (
    <main className="font-mono min-h-screen max-w-[min(100vw,1800px)] mx-auto relative overflow-hidden md:rounded-md flex flex-col md:block px-6 pt-12 md:pt-16">
      <div className="w-full space-y-1.5 mx-auto mt-1 mb-12">
        <div className="flex flex-col min-[961px]:hidden">
          <header className="flex flex-col items-start font-mono text-sm uppercase gap-2 mb-6">
            <p className="text-gray-1000 font-mono my-0 whitespace-nowrap">
              Outbreak Africa{" "}
              <span className="block font-mono text-gray-900">
                Visão continental
              </span>
            </p>
          </header>

          <section className="pb-6 w-full">
            <div className="flex flex-col gap-y-6">
              <AffectedCountries
                countries={affectedCountries}
                totalReports={totalReports}
              />
              <TopDiseases diseases={topDiseases} />
            </div>
            <RegionCount />
          </section>

          <div className="w-full flex justify-center pointer-events-none">
            <MapContainer />
          </div>
        </div>

        <div className="relative hidden min-[961px]:flex flex-row max-lg:items-end lg:items-center lg:justify-between">
          <header className="flex flex-col items-start font-mono text-sm xl:text-base uppercase gap-2 max-lg:mb-8 mb-auto">
            <p className="text-gray-1000 font-mono my-0 whitespace-nowrap">
              Outbreak Africa{" "}
              <span className="block font-mono text-gray-900">
                Visão continental
              </span>
            </p>
          </header>

          <section className="lg:absolute lg:bottom-0 pb-6 w-fit z-10 relative">
            <div className="flex flex-col gap-y-8">
              <AffectedCountries
                countries={affectedCountries}
                totalReports={totalReports}
              />
              <TopDiseases diseases={topDiseases} />
            </div>
            <RegionCount />
          </section>

          <div className="w-full h-full pointer-events-none max-lg:scale-[1.5] max-lg:-translate-y-16 max-lg:translate-x-[-20%]">
            <MapContainer />
          </div>
        </div>

        <section className="mt-8">
          <StatsGrid />
        </section>
      </div>
    </main>
  );
}
