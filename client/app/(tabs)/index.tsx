import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { getBars } from "../api/databaseOperations";
import { Colors } from "../styles/colors";
import MapSection from "../components/MapSection";
import ActiveMarkerPopup from "../components/ActiveMarkerPopup";
import { barImages } from "../barImages.js";
import { mapStyle } from "../styles/mapStyles";
import { useLocation } from "../hooks/useLocation";
import { findNearbyBar } from "../hooks/findNearbyBars";

interface BarLocation {
  id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  events: Event[];
}
export default function HomeScreen() {
  const [activeMarker, setActiveMarker] = useState<any | null>(null);
  const [nearbyBar, setNearbyBar] = useState<any>(null);
  const [markers, setMarkers] = useState<BarLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { location, region } = useLocation();

  // Fetch bar locations from the database
  useEffect(() => {
    const fetchBars = async () => {
      setLoading(true);
      try {
        const data = await getBars();
        setMarkers(data);

        console.log("Fetched bars:", data);
      } catch (err) {
        console.error("Error fetching bars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  // Check for nearby bars
  useEffect(() => {
    const nearby = findNearbyBar(location, markers, 10);
    setNearbyBar(nearby);
  }, [location, markers]);

  // Handle Check-In Logic
  const handleCheckIn = () => {
    if (nearbyBar?.id === activeMarker.id) {
      Alert.alert("Checked in!", `You are at ${activeMarker.name}`);
      setIsCheckedIn(true);
      setActiveTab("live");
    }
  };

  // Show loader while region is not set
  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Hang Tight, Your Night Awaits…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapSection
        region={region}
        markers={markers}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        isCheckedIn={isCheckedIn}
        setIsCheckedIn={setIsCheckedIn}
        circleRadius={5000}
        mapStyle={mapStyle}
        setActiveTab={setActiveTab}
      />

      {/* Active marker popup */}
      {activeMarker && (
        <ActiveMarkerPopup
          activeMarker={activeMarker}
          setActiveMarker={setActiveMarker}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          nearbyBar={nearbyBar}
          isCheckedIn={isCheckedIn}
          handleCheckIn={handleCheckIn}
          barImages={barImages}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.darkPrimary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#FFF", // or any color you like
    textShadowColor: "#a388f6", // Glow color
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});
