import { useState, useEffect, useCallback } from "react";
import { getBars, getParties } from "../api/databaseOperations"; // adjust paths
import { Marker } from "../types";
import { getAToken } from "../tokenStorage";

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useCallback so the function identity stays the same
  const fetchMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const JWT_token = await getAToken();
      const [barsResponse, partiesResponse] = await Promise.all([
        getBars(JWT_token),
        getParties(JWT_token),
      ]);
      const bars = Array.isArray(barsResponse) ? barsResponse : [];
      const parties = Array.isArray(partiesResponse) ? partiesResponse : [];
      console.log(barsResponse, partiesResponse);
      const combined = [
        ...bars.map((b: any) => ({
          ...b,
          type: "bar",
          id: `bar-${b.id}`, // unique key for frontend
          numericId: b.id, // actual ID to send to backend
        })),
        ...parties.map((p: any) => ({
          ...p,
          type: "party",
          id: `party-${p.id}`, // unique key for frontend
          numericId: p.id, // actual ID to send to backend
        })),
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
