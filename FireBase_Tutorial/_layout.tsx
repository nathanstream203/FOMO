import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* First screen is Logon */}
      <Stack.Screen name="App" />
    </Stack>
  );
}