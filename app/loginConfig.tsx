import * as AuthSession from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { User } from "firebase/auth";
import * as React from "react";
import { View } from "react-native";



import "react-native-gesture-handler";
import SignInScreen from "./SignInScreen";
import RootLayout from "./_layout";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from 'react-native';
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();
// ✅ Generate redirectUri with useProxy: true
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

// ✅ Log it for debugging
console.log("Redirect URI:", redirectUri);

export default function LoginConfig() {
    const [userInfo, setUserInfo] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com",
        androidClientId: "228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com",
        //expoClientId: "228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com",
        redirectUri,
    });

    const checkLocalUser = async () => {
        try {
            setLoading(true);
            const userJSON = await AsyncStorage.getItem('@user');
            const userDATA = userJSON ? JSON.parse(userJSON) : null;
            console.log("Local User: ", userDATA);
            setUserInfo(userDATA);
        } catch (error) {
            alert("An error occurred! loginConfig.tsx: " + error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
                /*
                .then((userCredential) => {
                    console.log("User signed in");
                    const user = userCredential.user;
                    setUserInfo(user);
                })
                .catch((error) => {
                    console.log("Error signing in: ", error);
                });
                */
        }
    }, [response]);

    React.useEffect(() => {
        checkLocalUser();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user) {
                //check expiration time!!
                console.log(JSON.stringify(user, null, 2));
                setUserInfo(user);
                await AsyncStorage.setItem('@user', JSON.stringify(user));
            } else {
                console.log("User is not Authenticated");
                //setUserInfo(null);
                //await AsyncStorage.removeItem('user');
            }
        return () => unsubscribe();
    });
}, []);
    if(loading) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>;
    }
    return userInfo ? <RootLayout /> : <SignInScreen promptAsync={promptAsync}  />;
}

/*
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri(); // ✅ simplified
  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com",
    androidClientId: "228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com",
    webClientId: "228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com",
    redirectUri,
  });


  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google token:", authentication?.accessToken);

      router.replace("/(tabs)");
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to continue</Text>

      <Pressable
        style={[styles.button, { backgroundColor: "#4285F4" }]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </Pressable>
    </View>
  );
}

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
  button: {
    backgroundColor: Colors.button,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

*/