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
import { auth } from "../(logon)/firebaseConfig";

export default function SignInScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  const signIn = async () => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        // If not verified, block login and sign out
        await signOut(auth);
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
        return;
      }
      // If verified, allow access to the app
      setUser(user);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Error", error.message);
    }
  };

  const byPass = async() => {
    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue with FOMO</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              secureTextEntry
              onChangeText={setPassword}
              placeholder="Password"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
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

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => router.replace("/signup")}
          >
            <Text style={styles.buttonSecondaryText}>Create a New Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#1b1f27",
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
    color: "#a0a0a0",
    fontSize: 15,
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#2b303a",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
    fontSize: 15,
  },
  buttonPrimary: {
    width: "100%",
    backgroundColor: "#5669ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#5669ff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
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
    color: "#8891f2",
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
