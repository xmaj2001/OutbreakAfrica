"use client";

import {
  AfricaOutbreakMap,
  CountryOutbreakData,
} from "../maps/africa-outbreak-map";
import { useMapData } from "@/hooks/use-map-data";
import { useState } from "react";

export default function MapContainer() {
  const [selected, setSelected] = useState<string[]>([]);
  const { mapData, isLoading } = useMapData();

  function handleSelect(iso3: string) {
    setSelected(
      (prev) =>
        prev.includes(iso3)
          ? prev.filter((c) => c !== iso3) // deselecciona
          : [...prev, iso3], // selecciona
    );
  }

  if (isLoading) return <div className="...">A carregar mapa...</div>;
  return (
    <AfricaOutbreakMap
      data={mapData}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
