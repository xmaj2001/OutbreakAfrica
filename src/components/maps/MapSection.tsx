"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsResponse } from "@/lib/types";
import { AfricaOutbreakMap, CountryOutbreakData } from "./africa-outbreak-map";

interface MapSectionProps {
  stats: StatsResponse;
}

export default function MapSection({ stats }: MapSectionProps) {
  const router = useRouter();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // 1. Processar e estruturar os dados que o Mapa exige
  const mapData = useMemo(() => {
    const formatted: Record<string, CountryOutbreakData> = {};

    // Pegamos a lista de países das facetas retornadas pelo servidor
    const countriesFacet = stats.embedded.facets.countries.data;

    countriesFacet.forEach((item) => {
      const iso3 = item.value.toLowerCase();

      formatted[iso3] = {
        total: item.count,
        // Como o endpoint /stats principal é agregado, aproximamos o ongoing.
        // Dica: Para precisão exata do heatmap por país ativo, o ideal seria cruzar com /disasters.
        ongoing: stats.embedded.facets.status.data.find(
          (s) => s.value === "ongoing",
        )
          ? item.count
          : 0,
      };
    });

    return formatted;
  }, [stats]);

  // 2. Manipular o clique no mapa
  const handleCountrySelect = (iso3: string) => {
    const code = iso3.toLowerCase();

    setSelectedCountries((prev) => {
      let next: string[];
      if (prev.includes(code)) {
        next = prev.filter((c) => c !== code);
      } else {
        next = [...prev, code];
      }

      // Se selecionou 2 países, abre um prompt/modal de confirmação para comparação
      if (next.length >= 2) {
        const confirmar = window.confirm(
          `Deseja comparar os dados entre os países selecionados (${next.join(", ").toUpperCase()})?`,
        );
        if (confirmar) {
          // Redireciona para a página de busca/comparação enviando os dois países
          router.push(`/search?country=${next[0]}&country2=${next[1]}`);
          return []; // limpa a seleção após redirecionar
        }
      } else if (next.length === 1) {
        // Se selecionou apenas 1, recarrega a página atual filtrando apenas esse país
        router.push(`/?country=${next[0]}`);
      } else {
        // Se desmarcou tudo, volta para a visão global
        router.push(`/`);
      }

      return next;
    });
  };

  return (
    <div className="w-full h-[450px] md:h-[600px] relative">
      <AfricaOutbreakMap
        data={mapData}
        selected={selectedCountries}
        onSelect={handleCountrySelect}
        showLabels={true}
      />
    </div>
  );
}
