import { useEffect, useState } from "react";
import { DisasterEvent, DisastersResponse } from "@/lib/types";
import { getDisasters } from "@/lib/client/features/get-disasters";

interface UseDisastersFilters {
  status?: string;
  country?: string;
  disease?: string;
  limit?: number;
}

export const useDisasters = (filters: UseDisastersFilters) => {
  const [loading, setLoading] = useState(true);
};

export const useGlobalDisasters = () => {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDisasters()
      .then((res: DisastersResponse) => {
        setDisasters(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);
  return { disasters, loading };
};
