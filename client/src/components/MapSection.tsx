import React, { useRef } from "react";
import { View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { MapSectionProps } from "../types";

export default function MapSection({
  region,
  markers,
  activeMarker,
  setActiveMarker,
  setActiveTab,
  setIsCheckedIn,
  circleRadius = 5000,
  mapStyle = [],
}: MapSectionProps) {
  if (!region) return null;

  const mapRef = useRef<MapView | null>(null);

  const handleMarkerPress = (marker: any) => {
    try {
      setActiveMarker(marker);
      setIsCheckedIn(false);
      setActiveTab?.("details");
    } catch (error) {
      console.error("Error handling marker press:", error);
    }
  };

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      region={region}
      customMapStyle={mapStyle}
      showsUserLocation
      followsUserLocation={true}
      minZoomLevel={14}
      maxZoomLevel={18}
      toolbarEnabled={false}
      showsMyLocationButton={false}
    >
      {/* Example circle around a fixed location */}
      <Circle
        center={{
          latitude: 44.872394,
          longitude: -91.925203,
        }}
        radius={circleRadius}
        strokeWidth={2}
        strokeColor={Colors.primary}
      />

      {/* Render markers */}
      {markers.map((marker, index) => {
        if (!marker.latitude || !marker.longitude) return null;

        const lat = Number(marker.latitude);
        const lng = Number(marker.longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        const isActive = activeMarker?.id === marker?.id; // still works

        return (
          <Marker
            key={index}
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View
              style={{
                backgroundColor: isActive
                  ? Colors.secondary
                  : marker.type === "party"
                  ? Colors.party // some color for party
                  : Colors.bar, // some color for bar
                borderRadius: 20,
                borderColor: "#fff",
                borderWidth: 1,
                padding: 7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={marker.type === "party" ? "home-outline" : "beer-outline"}
                size={18}
                color="white"
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
