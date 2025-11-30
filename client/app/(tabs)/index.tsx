import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../src/styles/colors";
import MapSection from "../../src/components/MapSection";
import ActiveMarkerPopup from "../../src/components/ActiveMarkerPopup";
import CreatePartyForm from "../../src/components/CreatePartyForm";
import { barImages } from "../../src/barImages.js";
import { mapStyle } from "../../src/styles/mapStyles";
import { useLocation } from "../../src/hooks/useLocation";
import { useMarkers } from "../../src/hooks/useMarkers";
import { findNearbyBar } from "../../src/hooks/findNearbyBars";
import { getAToken } from "../../src/tokenStorage";

export default function HomeScreen() {
  const [activeMarker, setActiveMarker] = useState<any | null>(null);
  const [nearbyBar, setNearbyBar] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { location, region } = useLocation();
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch bar locations from the database
  const { markers, loading, error, fetchMarkers, setMarkers, setLoading } =
    useMarkers();

  // Handle party creation and refresh markers
  const handlePartyCreated = async (partyData: any) => {
    // Party is already created in CreatePartyForm
    // Just refresh the markers to show the new party
    await fetchMarkers();
  };

  // Fetch bar and party locations from the database
  useEffect(() => {
    const fetchBars = async () => {
      setLoading(true);
      try {
        const JWT_token = await getAToken();
        const data = await getBars(JWT_token);
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
    if (!activeMarker) return;
    if (nearbyBar?.id === activeMarker.id) {
      Alert.alert("Checked in!", `You are at ${activeMarker.name}`);
      setIsCheckedIn(true);
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

  // Show loading state
  if (loading && markers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading markers...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#ff4444", fontSize: 16 }}>
          Error loading markers
        </Text>
        <Text style={{ color: "#aaa", marginTop: 8 }}>{error.message}</Text>
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

      {/* Create Party Button and Modal*/}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="home-outline" size={18} color="white" />
          <Text style={{ color: "white", fontWeight: "700" }}>
            Create Party
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5} // makes background greyed out
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={styles.modalContent}>
            <CreatePartyForm
              onClose={() => setModalVisible(false)}
              onSubmit={handlePartyCreated}
            />
          </View>
        </View>
      </Modal>
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
    textShadowColor: Colors.secondaryLight, // Glow color
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  fab: {
    overflow: "visible",
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "80%",
    backgroundColor: Colors.primary,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
