import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* First screen is Logon */}
      <Stack.Screen name="logon" />

      {/* Tabs (home, about, account) live inside a folder `(tabs)` */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}