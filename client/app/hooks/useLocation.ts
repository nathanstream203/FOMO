// hooks/useLocation.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";

// Define types
interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Region extends LocationCoords {
  latitudeDelta: number;
  longitudeDelta: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    const getInitialLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setLocation(coords);
    };

    getInitialLocation();

    let subscription: Location.LocationSubscription;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
        timeInterval: 1000,
      },
      (newLoc) => {
        const coords = {
          latitude: newLoc.coords.latitude,
          longitude: newLoc.coords.longitude,
        };
        setRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        setLocation(coords);
      }
    ).then((sub) => (subscription = sub));

    return () => subscription?.remove();
  }, []);

  return { location, region };
}
