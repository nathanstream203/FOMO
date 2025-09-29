import { Stack } from 'expo-router';
//import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../app/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* First screen is Logon */}
        <Stack.Screen name="logon" />

        {/* Tabs (home, about, account) live inside a folder `(tabs)` */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}