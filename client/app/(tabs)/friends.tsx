import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../../src/firebaseConfig";
import NotVerified from "../notverified";

const Colors = {
  background: "#110124ff",
  primary: "#7C4DFF",
  secondary: "#C77DFF",
  text: "#FFFFFF",
  textFaded: "#bbbbbb",
  tabBackground: "#3e0078",
  activeTabBackground: "#5e00b8",
  onlineDot: "#4CAF50",
  shadowNeon: "rgba(255, 0, 255, 0.4)",
};

type TabType = "All Friends" | "Active Now" | "Suggestions";

/**
 * Interface defining the expected data structure for a User/Friend
 * once fetched from the database.
 */
interface Friend {
  id: string;
  name: string;
  username: string;
  points: number;
  statusText: string;
  action: "View" | "Join" | "Add"; // Determines button text and logic
  isOnline: boolean;
  avatarPlaceholder: string; // Used for a simple avatar display
}

// Mock Data Definition
const MOCK_FRIENDS_DATA: Record<TabType, Friend[]> = {
  "All Friends": [
    {
      id: "1",
      name: "Sarah Wilson",
      username: "@sarahw",
      points: 3421,
      statusText: "At The Arena",
      action: "View",
      isOnline: true,
      avatarPlaceholder: "SC",
    },
    {
      id: "2",
      name: "Mike Torres",
      username: "@miket",
      points: 2847,
      statusText: "At The Arena",
      action: "View",
      isOnline: true,
      avatarPlaceholder: "MT",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "@emmar",
      points: 4102,
      statusText: "2h ago",
      action: "View",
      isOnline: false,
      avatarPlaceholder: "ER",
    },
    {
      id: "4",
      name: "Liam O'Connell",
      username: "@liamo",
      points: 1560,
      statusText: "Yesterday",
      action: "View",
      isOnline: false,
      avatarPlaceholder: "LO",
    },
    {
      id: "5",
      name: "Chloe Dupont",
      username: "@chloed",
      points: 520,
      statusText: "3d ago",
      action: "View",
      isOnline: false,
      avatarPlaceholder: "CD",
    },
  ],
  "Active Now": [
    {
      id: "1",
      name: "Sarah Wilson",
      username: "@sarahw",
      points: 3421,
      statusText: "At Silver Dollar",
      action: "Join",
      isOnline: true,
      avatarPlaceholder: "SC",
    },
    {
      id: "2",
      name: "Mike Torres",
      username: "@miket",
      points: 2847,
      statusText: "At The Market",
      action: "Join",
      isOnline: true,
      avatarPlaceholder: "MT",
    },
  ],
  Suggestions: [
    {
      id: "7",
      name: "Alex Kim",
      username: "@alexk",
      points: 2134,
      statusText: "5 mutual friends",
      action: "Add",
      isOnline: false,
      avatarPlaceholder: "AK",
    },
    {
      id: "8",
      name: "Jordan Lee",
      username: "@jordanl",
      points: 1876,
      statusText: "3 mutual friends",
      action: "Add",
      isOnline: false,
      avatarPlaceholder: "JL",
    },
  ],
};

// Update data references
const friendsData = MOCK_FRIENDS_DATA;

const TAB_COUNTS: Record<TabType, number> = {
  "All Friends": friendsData["All Friends"].length, // Should be 5
  "Active Now": friendsData["Active Now"].length, // Should be 2
  Suggestions: friendsData["Suggestions"].length, // Should be 2
};

const AvatarPlaceholder = ({ letter }: { letter: string }) => (
  <View style={componentStyles.avatar}>
    <Text style={componentStyles.avatarText}>{letter}</Text>
  </View>
);

const FriendCard: React.FC<{ friend: Friend }> = ({ friend }) => {
  const isSuggestion = friend.action === "Add";
  const isJoinButton = friend.action === "Join";

  return (
    <View style={componentStyles.cardContainer}>
      <View style={componentStyles.avatarWrapper}>
        <AvatarPlaceholder letter={friend.avatarPlaceholder} />
        {/* Only show online dot if isOnline is true AND action is not 'Add' (suggestions are usually not 'online') */}
        {friend.isOnline && !isSuggestion && (
          <View style={componentStyles.onlineDot} />
        )}
      </View>
      <View style={componentStyles.cardContent}>
        <View style={componentStyles.nameRow}>
          <Text style={componentStyles.friendName}>{friend.name}</Text>
          {/* Fire Icon for points/activity */}
          <MaterialCommunityIcons
            name="fire"
            size={16}
            color={Colors.secondary}
          />
          <Text style={componentStyles.points}>{friend.points}</Text>
        </View>
        <Text style={componentStyles.friendUsername}>{friend.username}</Text>
        <View style={componentStyles.statusRow}>
          {isSuggestion ? (
            // Mutual Friends Icon for suggestions
            <MaterialCommunityIcons
              name="account-multiple"
              size={12}
              color={Colors.textFaded}
              style={{ marginRight: 4 }}
            />
          ) : (
            // Location Icon for status (Only for View/Join, not for time status)
            // Check if statusText is a location (starts with 'At' or 'Near')
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
      <TouchableOpacity
        style={[
          componentStyles.actionButton,
          isSuggestion && componentStyles.addButton,
          isJoinButton && componentStyles.joinButton, // Optionally customize Join button
        ]}
        onPress={() => console.log(`${friend.action} ${friend.name}`)}
      >
        <Text style={componentStyles.actionButtonText}>{friend.action}</Text>
        {isSuggestion && ( // Add Person Icon for Suggestions
          <Ionicons
            name="person-add-outline"
            size={16}
            color={Colors.text}
            style={{ marginLeft: 4 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const TabButton: React.FC<{
  tab: TabType;
  isActive: boolean;
  onPress: (tab: TabType) => void;
}> = ({ tab, isActive, onPress }) => {
  const text = `${tab} (${TAB_COUNTS[tab]})`;
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

// --- Main Screen Component ---

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("All Friends");

  const [user] = useAuthState(auth);

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState("");

  if (!user?.emailVerified) {
    return <NotVerified />;
  }

  const currentFriendsData = MOCK_FRIENDS_DATA[activeTab];

  const renderActiveContent = (dataLength: number) => {
    // Banner only shows up if there are active friends
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
                  backgroundColor: Colors.onlineDot,
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
    } // Header for Suggestions tab

    if (activeTab === "Suggestions") {
      return (
        <Text style={styles.suggestionHeader}>
          People you might know based on mutual friends and activity
        </Text>
      );
    }

    return null;
  };

  const FriendsModal = () => (
    <View style={componentStyles.modalOverlay}>
      <View style={componentStyles.modalContent}>
        <Text style={componentStyles.modalTitle}>Add Friend</Text>
        <Text style={componentStyles.modalSubtitle}>
          Scan their code or enter their username/friend code.
        </Text>
        {/* Option 1: Scan Code */}
        <TouchableOpacity
          style={[componentStyles.modalButton, { marginBottom: 15 }]}
          onPress={() => {
            console.log("Opening Camera for scanning...");
            setModalVisible(false);
          }}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={Colors.text}
            style={{ marginRight: 8 }}
          />
          <Text style={componentStyles.actionButtonText}>Scan Friend Code</Text>
        </TouchableOpacity>
        <Text style={[componentStyles.modalSubtitle, { marginBottom: 15 }]}>
          -- OR --
        </Text>
        {/* Option 2: Input Option (Typing) */}
        <TextInput
          style={componentStyles.modalInput}
          placeholder="Enter Username or Code (e.g., @user / ABCD-1234)"
          placeholderTextColor={Colors.textFaded}
          value={friendCodeInput}
          onChangeText={setFriendCodeInput}
        />
        <TouchableOpacity
          style={componentStyles.modalButton}
          onPress={() => {
            console.log(`Searching for: ${friendCodeInput}`);
            setModalVisible(false);
            setFriendCodeInput("");
          }}
        >
          <Text style={componentStyles.actionButtonText}>Search & Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={componentStyles.modalCloseButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={componentStyles.modalCloseText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Header (Title + Scan Button) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Friends</Text>
          <Text style={styles.subHeading}>
            Connect and see where they're at
          </Text>
        </View>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setModalVisible(true)} // Opens modal with both scan/type options
        >
          <Ionicons name="camera-outline" size={20} color={Colors.text} />
          {}
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textFaded} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={Colors.textFaded}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {Object.keys(MOCK_FRIENDS_DATA).map((tabKey) => {
          const tab = tabKey as TabType;
          return (
            <TabButton
              key={tab}
              tab={tab}
              isActive={activeTab === tab}
              onPress={setActiveTab}
            />
          );
        })}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Conditional Content (Banner / Suggestions Header) */}
        {renderActiveContent(currentFriendsData.length)}
        {/* Friend List */}
        {currentFriendsData.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
        {/* Display Message when the list is empty (Shouldn't happen with mock data) */}
        {currentFriendsData.length === 0 && (
          <Text style={styles.emptyText}>
            No friends in this list yet. Try adding a friend using the Scan
            button above!
          </Text>
        )}
      </ScrollView>
      {/* Add Friend Modal (Only appears if isModalVisible is true) */}
      {isModalVisible && <FriendsModal />}
    </View>
  );
}

// --- Component Styles ---

const componentStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.tabBackground,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
  avatarText: { color: Colors.text, fontSize: 18, fontWeight: "bold" },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.onlineDot,
    borderWidth: 2,
    borderColor: Colors.tabBackground,
  },
  cardContent: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  friendName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  points: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  friendUsername: { color: Colors.textFaded, fontSize: 12, marginTop: 2 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusText: { color: Colors.textFaded, fontSize: 12 },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: { color: Colors.text, fontSize: 14, fontWeight: "bold" },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
  },
  joinButton: {
    backgroundColor: Colors.onlineDot,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  }, // Tab Styles
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: "center",
  },
  tabActive: { backgroundColor: Colors.activeTabBackground },
  tabText: { color: Colors.textFaded, fontSize: 14, fontWeight: "600" },
  tabTextActive: { color: Colors.text },
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
    backgroundColor: Colors.tabBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  modalSubtitle: { fontSize: 14, color: Colors.textFaded, textAlign: "center" },
  modalInput: {
    width: "100%",
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalCloseButton: { marginTop: 10, padding: 10 },
  modalCloseText: { color: Colors.primary, fontSize: 16, fontWeight: "600" },
});

// --- Main Screen Styles ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  subHeading: {
    fontSize: 12,
    color: Colors.textFaded,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: Colors.text,
    marginLeft: 6,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.tabBackground,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    marginLeft: 8,
    fontSize: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.tabBackground,
    marginHorizontal: 16,
    padding: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  banner: {
    backgroundColor: Colors.tabBackground,
    marginHorizontal: 16,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.onlineDot,
  },
  bannerText: {
    color: Colors.onlineDot,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bannerSubtext: {
    color: Colors.textFaded,
    fontSize: 14,
  },
  suggestionHeader: {
    color: Colors.textFaded,
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textFaded,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});
