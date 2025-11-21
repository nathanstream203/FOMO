import { useState, useEffect, useCallback } from "react";
import { getBars, getParties } from "../api/databaseOperations"; // adjust paths
import { Marker } from "../types";

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useCallback so the function identity stays the same
  const fetchMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [barsResponse, partiesResponse] = await Promise.all([
        getBars(),
        getParties(),
      ]);
      const bars = Array.isArray(barsResponse) ? barsResponse : [];
      const parties = Array.isArray(partiesResponse) ? partiesResponse : [];
      console.log(barsResponse, partiesResponse);
      const combined = [
        ...bars.map((b: any) => ({ ...b, type: "bar" })),
        ...parties.map((p: any) => ({ ...p, type: "party" })),
      ];

      setMarkers(combined);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching markers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return { markers, loading, error, fetchMarkers, setMarkers, setLoading };
};
