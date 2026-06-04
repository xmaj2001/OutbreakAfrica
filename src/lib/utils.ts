import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatStatus = (status: string) => {
  return status === "ongoing" ? "Ativo" : "Passado";
};

export const formatNumberMillions = (number: number) => {
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }
  return number.toLocaleString("pt-AO");
};

export const Formatters = {
  date: formatDate,
  status: formatStatus,
  numberMillions: formatNumberMillions,
};
