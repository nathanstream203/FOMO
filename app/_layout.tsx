// app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  User,
} from 'firebase/auth';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { auth } from './firebaseConfig';
import SignInScreen from './SignInScreen';

WebBrowser.maybeCompleteAuthSession();

export default function Layout() {
  const router = useRouter();

  const [userInfo, setUserInfo] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true); // start as loading

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    androidClientId: 'your-android-client-id.apps.googleusercontent.com',
    // expoClientId: 'your-expo-client-id.apps.googleusercontent.com',
  });

  // Handle auth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) => {
        console.log('Sign in error:', err);
      });
    }
  }, [response]);

  // Auth state persistence
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading || !request) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userInfo) {
    return <SignInScreen promptAsync={promptAsync} />;
  }

  // ✅ Once logged in, render the normal router layout
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}




/*
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="SignInScreen" />

        
        <Stack.Screen name="(tabs)" />
      </Stack>
    
  );
}
*/