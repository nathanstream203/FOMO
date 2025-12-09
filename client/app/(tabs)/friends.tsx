// friends.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../src/styles/colors";
import { auth } from "../../src/firebaseConfig";
import NotVerified from "../notverified";
import { useCurrentUserId } from "../../src/hooks/useCurrentUserInfo";
import { getAToken } from "../../src/tokenStorage";
import {
  getFriendsList,
  getPendingRequests,
} from "../../src/api/databaseOperations";

type TabType = "All Friends" | "Active Now" | "Requests";

/**
 * Interface defining the expected data structure for a User/Friend
 */
interface Friend {
  id: number;
  name: string;
  points: number;
  statusText: string;
  action: "View" | "Join" | "Pending";
  isOnline: boolean;
  avatarPlaceholder: string;
  friendshipId?: number; // Used mainly for request management
}

// Mock Data (For initial structure while loading)
const INITIAL_FRIENDS_DATA: Record<TabType, Friend[]> = {
  "All Friends": [],
  "Active Now": [],
  Requests: [],
};

const AvatarPlaceholder = ({ letter }: { letter: string }) => (
  <View style={componentStyles.avatar}>
    <Text style={componentStyles.avatarText}>{letter}</Text>
  </View>
);

const FriendCard: React.FC<{
  friend: Friend;
  onActionPress: (friend: Friend) => void;
}> = ({ friend, onActionPress }) => {
  const isPendingButton = friend.action === "Pending";
  const isJoinButton = friend.action === "Join";

  return (
    <View style={componentStyles.cardContainer}>
      <View style={componentStyles.avatarWrapper}>
        <AvatarPlaceholder letter={friend.avatarPlaceholder} />
        {friend.isOnline && !isPendingButton && (
          <View style={componentStyles.onlineDot} />
        )}
      </View>
      <View style={componentStyles.cardContent}>
        <View style={componentStyles.nameRow}>
          <Text style={componentStyles.friendName}>{friend.name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.primaryLight,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 12,
            }}
          >
            <MaterialCommunityIcons
              name="fire"
              size={16}
              color={Colors.secondaryLight}
            />
            <Text style={componentStyles.points}>{friend.points}</Text>
          </View>
        </View>
        <View style={componentStyles.statusRow}>
          {/* Mail Icon for Requests */}
          {isPendingButton ? (
            <Ionicons
              name="mail-outline"
              size={12}
              color={Colors.secondary}
              style={{ marginRight: 4 }}
            />
          ) : (
            // Location Icon for status
            (friend.statusText.startsWith("At") ||
              friend.statusText.startsWith("Near")) && (
              <Ionicons
                name="location-sharp"
                size={12}
                color={Colors.secondary}
                style={{ marginRight: 4 }}
              />
            )
          )}
          <Text style={componentStyles.statusText}>{friend.statusText}</Text>
        </View>
      </View>
      {/* Button: If Pending, display text; otherwise, display action button */}
      <TouchableOpacity
        style={[
          componentStyles.actionButton,
          isPendingButton && componentStyles.pendingButton,
          isJoinButton && { backgroundColor: Colors.secondary },
        ]}
        onPress={isPendingButton ? undefined : () => onActionPress(friend)}
      >
        {isPendingButton ? (
          <Text style={componentStyles.pendingButtonText}>Review</Text>
        ) : (
          <Text style={componentStyles.actionButtonText}>{friend.action}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const TabButton: React.FC<{
  tab: TabType;
  isActive: boolean;
  onPress: (tab: TabType) => void;
  count: number;
}> = ({ tab, isActive, onPress, count }) => {
  const text = `${tab} (${count})`;
  return (
    <TouchableOpacity
      style={[componentStyles.tabButton, isActive && componentStyles.tabActive]}
      onPress={() => onPress(tab)}
    >
      <Text
        style={[
          componentStyles.tabText,
          isActive && componentStyles.tabTextActive,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const mapToFriendInterface = (
  rawFriendships: any[],
  tab: TabType,
  currentUserId: number
): Friend[] => {
  if (tab === "Requests") {
    // For requests, we display the REQUESTOR's details
    return rawFriendships.map((req) => {
      const requestor = req.requestor || {
        id: req.requestor_id,
        first_name: `User`,
        last_name: `${req.requestor_id}`,
        points: 0,
        is_online: false,
        current_location: "Wants to connect",
      };

      return {
        id: requestor.id,
        name: `${requestor.first_name} ${requestor.last_name}`,
        points: requestor.points || 0,
        statusText: requestor.current_location || "Wants to connect",
        action: "Pending",
        isOnline: requestor.is_online || false,
        avatarPlaceholder:
          (requestor.first_name || "?").substring(0, 1) +
          (requestor.last_name || "?").substring(0, 1),
        friendshipId: req.id, // ID of the friendship entry
      } as Friend;
    });
  }

  // For 'All Friends' and 'Active Now'
  return rawFriendships.map((friendship: any) => {
    // Determine which user ID is the *friend* (not the current user)
    const friendUserId =
      friendship.requestor_id === currentUserId
        ? friendship.reciever_id
        : friendship.requestor_id;
    const friendUser = friendship.friendUser || {
      id: friendUserId,
      first_name: `Friend`,
      last_name: `${friendUserId}`,
      points: Math.floor(Math.random() * 1000), // Mock data
      is_online: Math.random() < 0.3, // Mock data
      current_location:
        Math.random() < 0.5 ? "At Downtown Bar" : "Last seen 2h ago",
    };

    return {
      id: friendUser.id,
      name: `${friendUser.first_name} ${friendUser.last_name}`,
      points: friendUser.points,
      statusText:
        friendUser.current_location ||
        (friendUser.is_online ? "Online" : "Last seen 2h ago"),
      action: tab === "Active Now" && friendUser.is_online ? "Join" : "View",
      isOnline: friendUser.is_online || false,
      avatarPlaceholder:
        friendUser.first_name.substring(0, 1) +
        friendUser.last_name.substring(0, 1),
    };
  });
};

// --- Main Screen Component ---

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("All Friends");
  const [user, loadingAuth] = useAuthState(auth);
  const { currentUserId, isUserIdLoading } = useCurrentUserId();
  const [friendData, setFriendData] =
    useState<Record<TabType, Friend[]>>(INITIAL_FRIENDS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const appIsLoading = loadingAuth || isUserIdLoading || isLoading;

  const fetchData = useCallback(async () => {
    // Check if we have the database ID before proceeding
    if (!currentUserId || !user?.emailVerified) return;

    setIsLoading(true);
    try {
      // 1. Get Token
      const JWT_token = await getAToken();

      // 2. Fetch ACCEPTED Friends (Friendship records)
      const friendsList = await getFriendsList(currentUserId, JWT_token);

      // 3. Map Friendships to Friend Interface
      const mappedFriends = mapToFriendInterface(
        friendsList,
        "All Friends",
        currentUserId
      );

      // Update All Friends & Active Now (Simplified filter)
      setFriendData((prev) => ({
        ...prev,
        "All Friends": mappedFriends,
        "Active Now": mappedFriends.filter((f) => f.isOnline),
      }));

      // 4. Fetch PENDING Requests (Friendship records where we are the reciever)
      const requestsList = await getPendingRequests(currentUserId, JWT_token);
      const mappedRequests = mapToFriendInterface(
        requestsList,
        "Requests",
        currentUserId
      );

      setFriendData((prev) => ({ ...prev, Requests: mappedRequests }));
    } catch (error) {
      console.error("Failed to fetch friends data:", error);
      Alert.alert("Error", "Could not load friends data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, user?.emailVerified]); // Depend on currentUserId and verification status

  // Effect to load data on mount and when the user's DB ID is finally resolved
  useEffect(() => {
    if (currentUserId && user?.emailVerified) {
      fetchData();
    }
  }, [currentUserId, fetchData, user?.emailVerified]);

  const handleActionPress = (friend: Friend) => {
    if (friend.action === "Join") {
      Alert.alert(
        "Action",
        `Navigating to join ${friend.name} at their location.`
      );
    } else if (friend.action === "View") {
      Alert.alert("Action", `Viewing profile for ${friend.name}.`);
    } else if (friend.action === "Pending") {
      // This is hit if the button wasn't disabled for 'Pending' status, but should be handled by the 'Review' text
      Alert.alert("Action", `Reviewing pending request from ${friend.name}.`);
    }
  };

  // --- Render Logic ---

  // Check for firebase auth loading OR custom hook loading
  if (appIsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={{ color: Colors.white, marginTop: 10 }}>
          Loading User Data...
        </Text>
      </View>
    );
  }

  if (!user?.emailVerified) {
    return <NotVerified />;
  }

  // Fallback if the user is logged in but has no database ID
  if (!currentUserId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.white }}>
          Authentication Error: Database ID not found.
        </Text>
      </View>
    );
  }

  // The rest of the component uses the loaded data
  const currentFriendsData = friendData[activeTab];
  const tabCounts: Record<TabType, number> = {
    "All Friends": friendData["All Friends"].length,
    "Active Now": friendData["Active Now"].length,
    Requests: friendData.Requests.length,
  };

  const renderActiveContent = (dataLength: number) => {
    if (activeTab === "Active Now" && dataLength > 0) {
      return (
        <View style={styles.banner}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                componentStyles.onlineDot,
                {
                  marginHorizontal: 0,
                  marginRight: 8,
                  backgroundColor: Colors.green,
                  position: "relative",
                  top: 0,
                  right: 0,
                },
              ]}
            />
            <Text style={styles.bannerText}>
              {dataLength} friends are out right now
            </Text>
          </View>
          <Text style={styles.bannerSubtext}>
            Join them and earn bonus FOMO points!
          </Text>
        </View>
      );
    }
    if (activeTab === "Requests") {
      return (
        <Text style={styles.suggestionHeader}>
          Pending requests sent to you.
        </Text>
      );
    }
    return null;
  };

  // Updated FriendsModal component to match "Scan Friend Code" layout
  const FriendsModal = () => (
    <View style={componentStyles.modalOverlay}>
      <View
        style={[componentStyles.modalContent, componentStyles.scanModalContent]}
      >
        <View style={componentStyles.modalHeader}>
          <Text style={componentStyles.modalTitle}>Scan Friend Code</Text>
          <TouchableOpacity
            style={componentStyles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color={Colors.lightWhite} />
          </TouchableOpacity>
        </View>

        {/* Camera View Area */}
        <View style={componentStyles.cameraContainer}>
          <Ionicons name="camera-outline" size={48} color={Colors.secondary} />
          <Text style={componentStyles.cameraText}>Camera would open here</Text>
        </View>

        <Text style={componentStyles.modalScanPrompt}>
          Point your camera at a friend's QR code to connect
        </Text>

        {/* Removed: Initiate Scan button */}
      </View>
    </View>
  );

  const filteredData = currentFriendsData; // No search bar, so use unfiltered data

  return (
    <View style={styles.safeArea}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <FriendsModal />
      </Modal>

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Friends</Text>
          <Text style={styles.subHeading}>
            Connect and see where they're at
          </Text>
        </View>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="person-add-outline" size={15} color={Colors.white} />
          <Text style={styles.scanButtonText}> Add Friend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {(["All Friends", "Active Now", "Requests"] as TabType[]).map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            count={tabCounts[tab]}
            isActive={activeTab === tab}
            onPress={setActiveTab}
          />
        ))}
      </View>
      <ScrollView style={{ flex: 1 }}>
        {isLoading && filteredData.length === 0 ? (
          <ActivityIndicator
            style={{ marginTop: 50 }}
            size="large"
            color={Colors.secondary}
          />
        ) : (
          <>
            {renderActiveContent(filteredData.length)}
            {filteredData.map((friend) => (
              <FriendCard
                // Using ID + Action ensures unique keys
                key={friend.id + friend.action}
                friend={friend}
                onActionPress={handleActionPress}
              />
            ))}
            {filteredData.length === 0 && (
              <Text style={styles.emptyText}>
                {activeTab === "Requests"
                  ? "No pending friend requests."
                  : activeTab === "Active Now"
                  ? "No friends are out right now."
                  : "No friends found. Use the 'Add Friend' button to connect."}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// --- Component Styles  ---
const componentStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderColor: Colors.secondary,
    borderWidth: 0.2,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarWrapper: {
    marginRight: 12,
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  avatarText: { color: Colors.white, fontSize: 18, fontWeight: "bold" },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },

  cardContent: { flex: 1 },

  nameRow: { flexDirection: "row", alignItems: "center" },

  friendName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },

  points: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },

  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  statusText: { color: Colors.secondary, fontSize: 12, fontWeight: "500" },

  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  pendingButton: {
    backgroundColor: Colors.primaryLight,
    shadowOpacity: 0.3,
    borderColor: Colors.secondaryLight,
    borderWidth: 1,
  },
  pendingButtonText: {
    color: Colors.secondaryLight,
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  // Tabs
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  tabActive: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    color: Colors.lightWhite,
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: Colors.white,
  },

  // Modal
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "85%",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  scanModalContent: {
    padding: 0,
    overflow: "hidden",
    borderColor: Colors.secondary,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  modalScanPrompt: {
    fontSize: 14,
    color: Colors.lightWhite,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: Colors.darkPrimary,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 12,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  cameraText: {
    color: Colors.secondary,
    marginTop: 10,
  },
  modalButton: {
    width: "90%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalCloseButton: { padding: 5 },
  modalCloseText: { color: Colors.secondaryLight, fontSize: 16 },
});

// --- Main Screen Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkPrimary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
  },
  subHeading: {
    fontSize: 14,
    color: Colors.secondaryLight,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scanButtonText: {
    marginLeft: 6,
    color: Colors.white,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
    borderColor: Colors.secondary,
    borderWidth: 0.2,
    shadowColor: Colors.secondaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  banner: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 0.2,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  bannerText: {
    color: Colors.white,
    fontWeight: "600",
  },
  bannerSubtext: {
    color: Colors.secondaryLighter,
    marginTop: 4,
  },
  suggestionHeader: {
    color: Colors.secondaryLight,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 14,
  },
  emptyText: {
    color: Colors.lightWhite,
    textAlign: "center",
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.darkPrimary,
  },
});
