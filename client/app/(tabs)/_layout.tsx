// app/(tabs)/_layout.tsx

import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Colors } from "../../src/styles/colors";

const HeaderPoints = () => {
  const userPoints = 1234;
  return (
  <View style={styles.pointsBubble}>
    <Ionicons
    name="server"
    size={16}
    color={Colors.secondaryLight}
    style={{ marginRight: 4}}
    />
    <Text style={styles.pointsText}>{userPoints}</Text>
  </View>
  );
};

export default function TabLayout() {
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
          title: "Map",
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
          title: "Friends",
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
          title: "Profile",
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
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  pointsText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: Colors.secondaryLight,
    textShadowOffset: { width: 0, height: 0},
    textShadowRadius: 10,
  }
});