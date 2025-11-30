import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../src/firebaseConfig";
import { getUserByFirebaseId, updateUser } from "../src/api/databaseOperations";
import { getAToken } from "../src/tokenStorage";

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
        setBirthDate(dbUser.birth_date || "");
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

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1b1d1f",
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
    color: "#aaa",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#2a2d31",
    padding: 12,
    borderRadius: 10,
    color: "white",
  },
  saveButton: {
    backgroundColor: "#4e9af1",
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
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ddd",
  },
});
