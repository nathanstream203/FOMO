//signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
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
import { postNewUser } from "../../src/api/databaseOperations";
import { Colors } from "../../src/styles/colors";
import BASE_URL from "@/src/_base_url";
import { saveAToken, verifyToken } from "../../src/tokenStorage";
export default function signUpScreen() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();


  const signUp = async () => {
    if (!firstName || !lastName || !dateOfBirth || !email || !password) {
      Alert.alert("Error", "Please enter all fields. All fields are required.");
      return;
    } else if (!firstName || !lastName) {
      Alert.alert("Error", "First and Last Name are required.");
      return;
    } else if (!dateOfBirth) {
      Alert.alert("Error", "Date of Birth is required.");
      return;
    } else if (
      dateOfBirth.length !== 10 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    ) {
      Alert.alert("Error", "Date of Birth must be in YYYY-MM-DD format.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential?.user;
      console.log("Creating account for:", user?.email);

      if (user) {
        const firebaseUID = user.uid;
        const firebase_token = await user.getIdToken();

        const dbDateOfBirth = dateOfBirth + "T00:00:00.000Z";
        await postNewUser(firebaseUID, firstName, lastName, dbDateOfBirth, 1)
          .then((dbUser) => console.log("User stored in database:", dbUser))
          .catch((err) => {
            console.error("DB Error:", err);
            throw new Error("Failed to create database user");
          });

  // 2. THEN log in to get JWT
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebase_token }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Login failed on server");
  }

  const JWT_accessToken = await res.json();
  await saveAToken(JWT_accessToken.token);

  // 3. Verify token
  const data = await verifyToken();
  if (!data.valid) throw new Error("Invalid JWT token after signup");

  // 4. Send email verification
  await sendEmailVerification(user);
  await signOut(auth);

  Alert.alert("Please Verify Your Email", "A verification email has been sent.");
  router.replace("/signin");
}

    } catch (error: any) {
      console.error("Error signing up:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Join FOMO</Text>
          <Text style={styles.subtitle}>Join and never miss out again!</Text>

          {/* First Name */}
          <View>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#a388f6"
                style={styles.icon}
              />
              <TextInput
                onChangeText={setFirstName}
                placeholder="John"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Last Name */}
          <View>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#a388f6"
                style={styles.icon}
              />
              <TextInput
                onChangeText={setLastName}
                placeholder="Doe"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#a388f6"
                style={styles.icon}
              />
              <TextInput
                keyboardType="numbers-and-punctuation"
                onChangeText={setDateOfBirth}
                placeholder="YYYY-MM-DD"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Email */}
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
                placeholder="your@email.com"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Password */}
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
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Buttons */}
          <Pressable style={styles.buttonPrimary} onPress={signUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.buttonSecondary}>
            <Text style={{ color: "white", fontSize: 16 }}>
              Already have an account?{" "}
              <Text
                style={{
                  color: "#FFF",
                  textShadowColor: Colors.secondaryLight, // Glow color
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 20,
                  fontWeight: "bold", // Optional, makes glow stronger
                }} // Or your button text color
                onPress={() => router.replace("/signin")}
              >
                Sign In
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
    fontSize: 26,
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
    borderWidth: 0.2,
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
    marginTop: 18,
  },
  buttonSecondaryText: {
    color: Colors.secondary,
    fontSize: 15,
  },
});
