// signin.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import * as React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../src/firebaseConfig";
import { Colors } from "../../src/styles/colors";
import { saveTokens } from "../../src/tokenStorage.js";
import BASE_URL from '../../src/_base_url';
import * as SecureStore from 'expo-secure-store';

// Debugging logs
import { firebaseConfig } from "../../src/firebaseConfig";
console.log("FIREBASE CONFIG:", firebaseConfig);



export default function SignInScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const signIn = async () => {
  try {
    setError(null);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await signOut(auth);
      Alert.alert("Email Not Verified", "Please verify your email before logging in. Check your inbox for the verification link.");
      return;
    }

    // get firebase ID token (short-lived)
    const idToken = await user.getIdToken();

    // Send ID token to backend for verification and to get JWT tokens
    const res = await fetch(`${BASE_URL}/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login failed on server");
    }

    const { accessToken, refreshToken } = await res.json();

    // DEBUGGING LOG
    console.log("Server login response:", {
      accessToken,
      refreshToken
    });

    await saveTokens(accessToken, refreshToken);

    const test = await SecureStore.getItemAsync("refreshToken");
    console.log("Read back refresh token:", test);


    setUser(user);
    router.replace("/(tabs)");
  } catch (error: any) {
    console.error(error);
    Alert.alert("Login Error", error.message || "Could not sign in");
  }
};

  const byPass = async () => {
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue with FOMO</Text>

          {/* Email Input */}
          <View>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#a388f6"
                style={styles.icon}
              />
              <TextInput
                keyboardType="email-address"
                onChangeText={setEmail}
                // onFocus={() => setFocusedField("email")}
                // onBlur={() => setFocusedField(null)}
                placeholder="your@email.com"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#a388f6"
                style={styles.icon}
              />
              <TextInput
                secureTextEntry
                onChangeText={setPassword}
                placeholder="••••••••"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Error Messages */}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {user && <Text style={styles.successText}>{user.email}</Text>}

          {/* Buttons */}
          <Pressable style={styles.buttonPrimary} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <Pressable style={styles.buttonPrimary} onPress={byPass}>
            <Text style={styles.buttonText}>Sign In - BYPASS</Text>
          </Pressable>

          <View style={styles.buttonSecondary}>
            <Text style={{ color: "white", fontSize: 16 }}>
              Don't have an account?{" "}
              <Text
                style={{
                  color: "#FFF",
                  textShadowColor: Colors.secondaryLight, // Glow color
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 20,
                  fontWeight: "bold", // Optional, makes glow stronger
                }} // Or your button text color
                onPress={() => router.replace("/signup")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 40,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#a388f6",
    fontSize: 15,
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: Colors.primary,
    borderWidth: 0.3,
    borderColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  inputContainerFocused: {
    borderWidth: 0.4,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 12,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
    fontSize: 15,
  },
  buttonPrimary: {
    width: "100%",
    overflow: "visible",
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    marginTop: 20,
  },
  buttonSecondaryText: {
    color: Colors.secondary,
    fontSize: 15,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    color: "#66ff99",
    fontSize: 14,
    marginTop: 4,
  },
});