// app/(tabs)/_layout.tsx

import { View, Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Colors } from "../../src/styles/colors";
import { useValidateToken } from "../../src/hooks/useValidateToken";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserByFirebaseId } from "../../src/api/databaseOperations";
import { auth } from "../../src/firebaseConfig";
import { getAToken } from "../../src/tokenStorage";
import React from "react";

interface DatabaseUser {
  firebase_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  role_id: number | string;
  points: number;
}
export function HeaderPoints() {
  const [dbUser, setDbUser] = React.useState<DatabaseUser | null>(null);
  const [user, loading, error] = useAuthState(auth);
  const [dbLoading, setDbLoading] = React.useState(false);

  const fetchDatabaseUser = async (firebaseId: string) => {
    setDbLoading(true);
    try {
      const token = await getAToken();
      const userData = await getUserByFirebaseId(firebaseId, token);
      setDbUser(userData);
      console.log("DB User refreshed:", userData);
    } catch (err) {
      console.error("Error fetching user from DB:", err);
    } finally {
      setDbLoading(false);
    }
  };

  React.useEffect(() => {
    if (!loading && user?.uid) {
      fetchDatabaseUser(user.uid);
    }
  }, [loading, user]);

  return (
    <View style={styles.pointsBubble}>
      <MaterialCommunityIcons
        name="fire"
        size={16}
        color={Colors.secondaryLight}
        marginRight={4}
      />
      <Text style={styles.pointsText}>
        {dbLoading ? "..." : dbUser?.points ?? 0}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  useValidateToken();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.secondaryLight,
        tabBarInactiveTintColor: "#ccc",
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.white,
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
        headerRight: () => <HeaderPoints />,
      }}
    >
      <Tabs.Screen
        name="index" // Home page
        options={{
          headerTitle: "FOMO",
          tabBarLabel: "Map",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          headerTitle: "FOMO",
          tabBarLabel: "Friends",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people-circle" : "people-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerTitle: "FOMO",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pointsBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderWidth: 0.3,
    borderColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 15,

    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  pointsText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: Colors.secondaryLight,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
