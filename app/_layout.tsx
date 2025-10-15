import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* First screen is Logon */}
      <Stack.Screen name="(logon)/signin" />

      {/* Tabs (home, about, account) live inside a folder `(tabs)` */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}