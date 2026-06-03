"use client";

import { AfricaOutbreakMap } from "@/components/maps/africa-outbreak-map";
import { useMapData } from "@/hooks/use-map-data";

interface Props {
  selected: string[];
  onSelect: (iso3: string) => void;
}

export function MapFilter({ selected, onSelect }: Props) {
  const { mapData, isLoading } = useMapData();

  if (isLoading) {
    return <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border border-border">
      <AfricaOutbreakMap
        data={mapData}
        selected={selected}
        onSelect={onSelect}
        compact
      />
    </div>
  );
}
