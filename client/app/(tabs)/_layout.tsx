// app/(tabs)/_layout.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Colors } from "../styles/colors";

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
