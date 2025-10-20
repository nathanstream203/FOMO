//signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import * as React from 'react';
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
import { postNewUser } from '../api/databaseOperations';

export default function signUpScreen() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  const signUp = async () => {
      if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
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
        //POST to database - TEST DATA - REPLACE LATER
        // 2000-01-01T01:01:00.000Z
        const firebaseUID = user?.uid;
        postNewUser(firebaseUID, 'FirstTestFirstName', 'FirstTestLastName', '2000-01-01T01:01:00.000Z', 1)
          .then((dbUser) => console.log('User stored in database:', dbUser))
          .catch((err) => console.error('DB Error:', err));
      }

      await sendEmailVerification(user); //send verification email after account created
      console.log("Verification email sent to:", user.email);
      await signOut(auth); //sign user out after sending verfication email
      Alert.alert(
        "Please Verify Your Email",
        "A verification email has been sent to your email. Please verify your email"
      );

      router.replace("/signin");

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
          <Text style={styles.title}>Create Your FOMO Account</Text>
          <Text style={styles.subtitle}>Join and never miss out again!</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              onChangeText={setFirstName}
              placeholder="First Name"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              onChangeText={setLastName}
              placeholder="Last Name"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              keyboardType="numbers-and-punctuation"
              onChangeText={setDateOfBirth}
              placeholder="Date of Birth (MM/DD/YYYY)"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

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
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

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
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Buttons */}
          <Pressable style={styles.buttonPrimary} onPress={signUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => router.replace("/signin")}
          >
            <Text style={styles.buttonSecondaryText}>Back to Sign In</Text>
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
    fontSize: 26,
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
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
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
    marginTop: 18,
  },
  buttonSecondaryText: {
    color: "#8891f2",
    fontSize: 15,
  },
});
