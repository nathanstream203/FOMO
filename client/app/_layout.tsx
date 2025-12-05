// client/app/_layout.tsx
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  //const { loading, loggedIn } = useAuthBootstrap();

  return (
    <Stack screenOptions={{ headerShown: false }} />

    /*<Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          fontFamily: "YourCustomFont",
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack> */
  );
}
