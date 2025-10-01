// loginConfig.tsx
import * as AuthSession from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";

import RootLayout from "./(tabs)/_layout"; // ✅ your app's main tabs
import SignInScreen from "./SignInScreen";

import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

// Build redirect URI
const redirectUri = AuthSession.makeRedirectUri();


console.log("Redirect URI:", redirectUri);

export default function LoginConfig() {
  const [userInfo, setUserInfo] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Google sign-in request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com",
    webClientId: "228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com",
    redirectUri,

    /*

    //iosClientId: "228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com",
    //androidClientId: "228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com",
    //webClientId: "228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com",
    //redirectUri,

    */
  });

  // Handle Google login response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(err => {
        console.log("Error signing in:", err);
      });
    }
  }, [response]);

  // Check AsyncStorage + listen for Firebase auth changes
  React.useEffect(() => {
    const checkLocalUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@user');
        const userDATA = userJSON ? JSON.parse(userJSON) : null;
        if (userDATA) setUserInfo(userDATA);
      } catch (error) {
        console.log("Error reading user from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLocalUser();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const minimalUser = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setUserInfo(minimalUser);
        await AsyncStorage.setItem('@user', JSON.stringify(minimalUser));
      } else {
        setUserInfo(null);
        await AsyncStorage.removeItem('@user');
      }
    });

    return () => unsubscribe();
  }, []);

  // While checking auth state
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // ✅ If not logged in → start on SignInScreen
  if (!userInfo) {
    return <SignInScreen promptAsync={promptAsync} />;
  }

  // ✅ If logged in → show app
  return <RootLayout />;
}