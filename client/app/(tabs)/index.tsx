import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getBars } from "../api/databaseOperations";
import { Colors } from "../theme.js";
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
  const circleRadius = 5000;
  const [region, setRegion] = useState<any>(null);
  const [nearbyBar, setNearbyBar] = useState<any>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [markers, setMarkers] = useState<BarLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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

  //Request location permission and get initial location
  useEffect(() => {
    const getInitialLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Cannot access location.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getInitialLocation();
  }, []);

  // Track location updates
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startTracking = async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (newLocation) => {
          setRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    };

    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Check for nearby bars
  useEffect(() => {
    if (!location) return;

    const closeBar = markers.find((bar) => {
      const distance = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: bar.latitude, longitude: bar.longitude }
      );
      return distance <= 10; // ~10 meters
    });

    setNearbyBar(closeBar || null);
  }, [location, markers]);

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
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          customMapStyle={mapStyle}
          region={region}
          showsUserLocation={true}
          followsUserLocation
          minZoomLevel={14}
          maxZoomLevel={18}
          toolbarEnabled={false}
        >
          <Circle
            center={{
              latitude: 44.872394,
              longitude: -91.925203,
            }}
            radius={circleRadius}
            strokeWidth={2}
            strokeColor={Colors.primary}
          />

          {/* Location Markers */}
          {markers.map((marker, index) => {
            const isActive = activeMarker?.id === marker.id;
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: Number(marker.latitude),
                  longitude: Number(marker.longitude),
                }}
                //title={marker.name}
                anchor={{ x: 0.5, y: 0.5 }} // center alignment
                onPress={() => setActiveMarker(marker)}
              >
                {marker && (
                  <View
                    style={{
                      backgroundColor: isActive
                        ? Colors.secondary
                        : Colors.primary,
                      borderRadius: 20,
                      borderColor: "#fff",
                      borderWidth: 1,
                      padding: 7, // slightly bigger when selected
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name={"beer-outline"} size={18} color="white" />
                  </View>
                )}
              </Marker>
            );
          })}
        </MapView>
      ) : null}

      {/* Active marker popup */}
      {activeMarker && (
        <View style={popupStyles.container}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setActiveMarker(null)}
            style={popupStyles.closeButton}
          >
            <Ionicons name="close" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={popupStyles.tabContainer}>
            <TouchableOpacity
              style={[
                popupStyles.tabButton,
                activeTab === "details" && popupStyles.activeTab,
              ]}
              onPress={() => setActiveTab("details")}
            >
              <Text style={popupStyles.tabText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                popupStyles.tabButton,
                activeTab === "live" && popupStyles.activeTab,
              ]}
              onPress={() => setActiveTab("live")}
            >
              <Text style={popupStyles.tabText}>Live Feed</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "details" ? (
            <>
              <View style={popupStyles.imageContainer}>
                <Image
                  source={require("../../assets/images/background-image.jpg")}
                  style={popupStyles.image}
                />
                <View style={popupStyles.badges}>
                  <View style={popupStyles.activityBadge}>
                    <Ionicons
                      name="people-circle-outline"
                      size={12}
                      color="#FFF"
                    />
                    <Text style={popupStyles.badgeText}>100</Text>
                  </View>
                </View>
              </View>

              <ScrollView style={popupStyles.detailsContainer}>
                <Text style={popupStyles.barName}>{activeMarker.name}</Text>
                <Text style={popupStyles.location}>{activeMarker.address}</Text>

                <View style={popupStyles.infoRow}>
                  <Ionicons name="location-outline" size={12} color="#7f54e2" />
                  <Text style={popupStyles.infoText}>
                    {activeMarker.address}
                  </Text>
                </View>
                <View style={popupStyles.infoRow}>
                  <Ionicons name="time-outline" size={12} color="#7f54e2" />
                  <Text style={popupStyles.infoText}>9pm-2am</Text>
                </View>
                <View style={popupStyles.infoRow}>
                  <Ionicons
                    name="people-circle-outline"
                    size={12}
                    color="#7f54e2"
                  />
                  <Text style={popupStyles.infoText}>100 checked in</Text>
                </View>

                <View style={popupStyles.actions}>
                  <TouchableOpacity
                    style={[
                      popupStyles.checkInButton,
                      nearbyBar?.id === activeMarker.id
                        ? popupStyles.buttonEnabled
                        : popupStyles.buttonDisabled,
                    ]}
                    disabled={nearbyBar?.id !== activeMarker.id}
                    onPress={() =>
                      Alert.alert(
                        "Checked in!",
                        `You are at ${activeMarker.name}`
                      )
                    }
                  >
                    <Text
                      style={[
                        popupStyles.buttonText,
                        nearbyBar?.id !== activeMarker.id &&
                          popupStyles.buttonTextDisabled,
                      ]}
                    >
                      {nearbyBar?.id === activeMarker.id
                        ? "Check In"
                        : "Too Far!"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={popupStyles.shareButton}>
                    <Text style={popupStyles.buttonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          ) : (
            <View style={popupStyles.liveFeedContainer}>
              <Text style={{ color: "#fff" }}>Live Feed Coming Soon...</Text>
              {/* Later you can map through posts, images, etc. */}
            </View>
          )}
        </View>
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
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555", // or any color you like
    textAlign: "center",
  },
});

const mapStyle = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];

const popupStyles = StyleSheet.create({
  container: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 100,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary, // highlight color
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  detailsContainer: {
    padding: 16,
  },
  liveFeedContainer: {
    padding: 16,
  },

  imageContainer: {
    height: 160,
    position: "relative",
  },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  activityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    padding: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  badges: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  barName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  location: { color: Colors.secondary, marginBottom: 8 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  vibeLabel: { color: "#aaa", marginTop: 12, marginBottom: 4 },
  vibeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  vibeBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vibeText: { fontSize: 12, color: "#fff" },
  buttonRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  checkInButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  checkedInButton: { opacity: 0.6 },
  shareButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  infoBox: {
    marginTop: 12,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 6,
  },
  infoText: { fontSize: 12, color: "#FFF" },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },

  buttonEnabled: {
    backgroundColor: Colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonTextDisabled: {
    color: "#000",
  },
});
