// utils/findNearbyBar.ts
import { getDistance } from "geolib";
import { Marker } from "../types"; // make sure you have this type

interface LocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * Returns the first bar within the given radius (meters), or null if none.
 */
export function findNearbyBar(
  location: LocationCoords | null,
  markers: Marker[],
  radius = 10
): Marker | null {
  if (!location) return null;

  return (
    markers.find((bar) => {
      const distance = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: Number(bar.latitude), longitude: Number(bar.longitude) }
      );
      // Debug log
      console.log(
        `User is ${distance} meters from bar "${bar.name}"`
      );

      return distance <= radius;
    }) || null
  );
}
