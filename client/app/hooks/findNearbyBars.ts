// utils/findNearbyBar.ts
import { getDistance } from "geolib";
import { BarLocation } from "../types"; // make sure you have this type

interface LocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * Returns the first bar within the given radius (meters), or null if none.
 */
export function findNearbyBar(
  location: LocationCoords | null,
  markers: BarLocation[],
  radius = 10
): BarLocation | null {
  if (!location) return null;

  return (
    markers.find((bar) => {
      const distance = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: Number(bar.latitude), longitude: Number(bar.longitude) }
      );
      return distance <= radius;
    }) || null
  );
}
