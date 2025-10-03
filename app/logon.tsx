import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

type UserInfo = {
  name: string;
  email: string;
  photoUrl: string;
} | null;

export default function LogonScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {userInfo ? (
        <View style={styles.profile}>
          <Image source={{ uri: userInfo.photoUrl }} style={styles.image} />
          <Text style={styles.text}>Welcome, {userInfo.name}!</Text>
          <Text style={styles.text}>{userInfo.email}</Text>
        </View>
      ) : (
        <OAuthButton />
      )}
    </View>
  );
}

export const OAuthButton: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const username = "fomo_25";
  const appSlug = "fomo";
  const redirectUri = `https://auth.expo.io/@${username}/${appSlug}`;
  //const redirectUri = AuthSession.makeRedirectUri({ scheme: "https" });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "963171923955-j84r8qdjg6mr68qob53s82adoe1lao1t.apps.googleusercontent.com",
    redirectUri,
  });
  console.log("Redirect URI:", redirectUri);
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params || {};
      if (id_token) {
        try {
          const decoded: any = jwtDecode(id_token);
          setUserInfo({
            name: decoded.name,
            email: decoded.email,
            photoUrl: decoded.picture,
          });
          router.replace("/(tabs)");
        } catch (err) {
          console.error("Failed to decode ID token:", err);
        }
      }
    }
  }, [response]);
  return (
    <Button
      title="Sign In with Google"
      disabled={!request}
      onPress={() => promptAsync({})}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#333842",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#5568fe",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 4,
  },
  profile: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});
