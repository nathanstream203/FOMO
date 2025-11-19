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
    setActiveMarker(marker);
    setIsCheckedIn(false);
    setActiveTab?.("details");

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500 // 500ms animation
      );
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
        const isActive = activeMarker?.id === marker?.id; // use optional chaining
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: Number(marker.latitude),
              longitude: Number(marker.longitude),
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View
              style={{
                backgroundColor: isActive ? Colors.secondary : Colors.primary,
                borderRadius: 20,
                borderColor: "#fff",
                borderWidth: 1,
                padding: 7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="beer-outline" size={18} color="white" />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
