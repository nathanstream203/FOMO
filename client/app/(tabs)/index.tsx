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
  FlatList,
  TextInput,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { getBars } from "../api/databaseOperations";
import { Colors } from "../theme.js";
interface Post {
  id: number;
  content: string;
  time: number;
  likes: number;
  userReaction: "none" | "like";
  username: string;
}
const getTimeAgo = (time: number) => {
  const diffMinutes = Math.floor((Date.now() - time) / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes === 1) return "1m ago";
  return `${diffMinutes}m ago`;
};
interface LiveFeedProps {
  isCheckedIn: boolean;
}
const LiveFeedTab: React.FC<LiveFeedProps> = ({ isCheckedIn }) => {
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeRefresh, setTimeRefresh] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRefresh((prev) => prev + 1);
    }, 60000);
  }, []);
  const handleCreatePress = () => {
    // if (!isCheckedIn) {
    //   Alert.alert(
    //     "Check-in required",
    //     "Please check in to the event/bar before posting."
    //   );
    //   return;
    // }
    setShowCreateBox(!showCreateBox);
  };
  const handlePost = () => {
    if (!newPost.trim()) {
      Alert.alert("Empty Post", "Please enter some content.");
      return;
    }
    const newItem: Post = {
      id: Date.now(),
      content: newPost.trim(),
      time: Date.now(),
      likes: 0,
      userReaction: "none",
      username: "User123", // Placeholder username
    };
    setPosts([newItem, ...posts]);
    setNewPost("");
    setShowCreateBox(false);
  };
  const handleDeletePost = (postId: number) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPosts(posts.filter((post) => post.id !== postId));
        },
      },
    ]);
  };
  const handleReaction = (postId: number) => {
    //if (!isCheckedIn) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.userReaction === "like";
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            userReaction: isLiked ? "none" : "like",
          };
        }
        return post;
      })
    );
  };
  const getHeartIconName = (reaction: "none" | "like") => {
    return reaction === "like" ? "heart" : "heart-outline";
  };
  return (
    <View style={feedStyles.feedContainer}>
      <TouchableOpacity
        style={feedStyles.createPostButton}
        onPress={handleCreatePress}
      >
        <Text style={feedStyles.createPostButtonText}>
          {showCreateBox ? "Cancel" : "Create Post"}
        </Text>
      </TouchableOpacity>
      {/* Post Form - Only visible if checked in and active */}
      {showCreateBox && (
        <View style={feedStyles.postFormContainer}>
          <TextInput
            style={feedStyles.postInput}
            placeholder="What's happening?"
            placeholderTextColor="#aaa"
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={feedStyles.postButton} onPress={handlePost}>
            <Text style={feedStyles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      {posts.length > 0 && (
        <View style={feedStyles.liveIndicator}>
          <Ionicons name="flame" size={20} color="#e63946" />
          <Text style={feedStyles.liveIndicatorText}>
            {posts.length} post{posts.length > 1 ? "s" : ""} live
          </Text>
          <View style={feedStyles.liveBadge}>
            <Text style={feedStyles.liveBadgeText}>Live</Text>
          </View>
        </View>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <Text style={feedStyles.noPostsText}>
          No posts yet. Be the first to share!
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString() + timeRefresh}
          renderItem={({ item }) => (
            <View style={feedStyles.postCard}>
              <View style={feedStyles.userTimeRow}>
                {/* Placeholder for User Avatar */}
                <View style={feedStyles.avatarPlaceholder} />
                <View>
                  <Text style={feedStyles.usernameText}>{item.username}</Text>
                  <Text style={feedStyles.postTime}>
                    {getTimeAgo(item.time)}
                  </Text>
                </View>
              </View>

              <Text style={feedStyles.postContent}>{item.content}</Text>

              <View style={feedStyles.postFooter}>
                {/* Reaction button */}
                <TouchableOpacity
                  style={feedStyles.reactionButton}
                  onPress={() => handleReaction(item.id)}
                  //disabled={!isCheckedIn} - for later
                >
                  <Ionicons
                    name={getHeartIconName(item.userReaction)}
                    size={22}
                    color={item.userReaction === "like" ? "#e63946" : "#aaa"}
                  />
                  <Text
                    style={[
                      feedStyles.reactionCount,
                      {
                        color:
                          item.userReaction === "like" ? "#e63946" : "#fff",
                      },
                    ]}
                  >
                    {item.likes > 0 ? item.likes : ""}
                  </Text>
                </TouchableOpacity>
                {/* Delete button */}
                {
                  <TouchableOpacity
                    style={feedStyles.deleteIconButton}
                    onPress={() => handleDeletePost(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#aaa" />
                  </TouchableOpacity>
                }
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

import { barImages } from "../barImages.js";
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
  const [isCheckedIn, setIsCheckedIn] = useState(false);

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

  const handleCheckIn = () => {
    if (nearbyBar?.id === activeMarker.id) {
      Alert.alert("Checked in!", `You are at ${activeMarker.name}`);
      setIsCheckedIn(true);
      setActiveTab("live"); // Optional: Move to the live feed upon check-in
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
                onPress={() => {
                  setActiveMarker(marker);
                  // Reset check-in status if the new active marker is different
                  if (marker.id !== activeMarker?.id) {
                    setIsCheckedIn(false);
                  }
                }}
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
                  source={
                    barImages[activeMarker.name as keyof typeof barImages] ||
                    require("../../assets/images/background-image.jpg")
                  }
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
                  <Ionicons name="star" size={12} color="#7f54e2" />
                  <Text style={popupStyles.infoText}>4.5/5</Text>
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
                      // Logic for button color based on proximity and checked-in status
                      nearbyBar?.id === activeMarker.id && !isCheckedIn
                        ? popupStyles.buttonEnabled
                        : popupStyles.buttonDisabled,
                      isCheckedIn && popupStyles.buttonEnabled,
                    ]}
                    // Disable if too far OR if already checked in
                    disabled={nearbyBar?.id !== activeMarker.id && !isCheckedIn}
                    onPress={handleCheckIn} // Use the new handler
                  >
                    <Text
                      style={[
                        popupStyles.buttonText,
                        // Text color for disabled state
                        nearbyBar?.id !== activeMarker.id &&
                          !isCheckedIn &&
                          popupStyles.buttonTextDisabled,
                      ]}
                    >
                      {isCheckedIn
                        ? "Checked In!"
                        : nearbyBar?.id === activeMarker.id
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
            // Renders the Live Feed tab content
            <LiveFeedTab isCheckedIn={isCheckedIn} />
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

const feedStyles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  liveIndicatorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
    marginRight: 10,
  },
  liveBadge: {
    backgroundColor: "#e63946",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  liveBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#2a2d31",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#555",
    marginRight: 8,
  },
  usernameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postTime: {
    color: "#aaa",
    fontSize: 12,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  reactionCount: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  deleteIconButton: {
    padding: 5,
  },
  createPostButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  createPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postFormContainer: {
    backgroundColor: "#2a2d31",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  postInput: {
    backgroundColor: "#1f2227",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#6b3fd1ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noPostsText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
