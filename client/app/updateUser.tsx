import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../src/firebaseConfig";
import { getUserByFirebaseId, updateUser } from "../src/api/databaseOperations";
import { getAToken } from "../src/tokenStorage";
import { Colors } from "../src/styles/colors";

// Update user profile in database through API
export default function UpdateUserTab() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        const token = await getAToken();
        const dbUser = await getUserByFirebaseId(user.uid, token);

        setFirstName(dbUser.first_name || "");
        setLastName(dbUser.last_name || "");
        const date = new Date(dbUser.birth_date);
        const formatted = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
        setBirthDate(formatted);
      } catch (err) {
        console.error("Error loading user data:", err);
        Alert.alert("Error", "Unable to load your account data.");
      }
    };

    loadUserData();
  }, [user]);

  // Function to save updated user info
  const handleSave = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    if (birthDate.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      Alert.alert("Error", "Date of Birth must be in YYYY-MM-DD format.");
      return;
    }
    const dbDateOfBirth = birthDate + "T00:00:00.000Z";

    // Bind data with only the fields that are defined -> allows partial updates
    const userData = {
      firebase_id: user.uid,
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(dbDateOfBirth && { birth_date: dbDateOfBirth }),
    };

    // Text preview of user changes
    const dataPreview = Object.entries(userData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    Alert.alert(
      "Confirm Update",
      `Update your account with the following info?\n\n${dataPreview}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            (async () => {
              try {
                const token = await getAToken();
                await updateUser(userData, token);
                Alert.alert("Success", "Account updated!");
                router.back();
              } catch (err) {
                console.error("Update failed:", err);
                Alert.alert("Error", "Failed to update user.");
              }
            })();
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Your Information</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter first name"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter last name"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.darkPrimary,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderWidth: 0.2,
    borderColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8, // for Android glow effect
  },
  saveButton: {
    backgroundColor: Colors.secondary,
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.bar,
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.bar,
    fontWeight: "700",
  },
});
