// client/app/_layout.tsx
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        YourCustomFont: require("../assets/fonts/montserrat-v31-latin-regular.ttf"),
      });

      // Set global font for Text
      setCustomText({
        style: { fontFamily: "YourCustomFont" },
      });

      // Set global font for TextInput
      setCustomTextInput({
        style: { fontFamily: "YourCustomFont" },
      });

      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null; // show loading if needed
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          fontFamily: "YourCustomFont",
          fontSize: 20,
        },
      }}
    >
      {/* First screen is Logon */}
      <Stack.Screen name="(logon)/signin" />

      {/* Tabs (home, about, account) live inside a folder `(tabs)` */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
