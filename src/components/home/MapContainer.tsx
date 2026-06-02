"use client";

import { AfricaMap } from "../AfricaMap";

export default function MapContainer() {
  return (
    <AfricaMap
      selectedCountries={[]}
      onCountryClick={(country) => console.log("country", country)}
    />
  );
}
