import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { useLocation } from "../hooks/useLocation";
import { auth } from "../../src/firebaseConfig";
import {
  getUserByFirebaseId,
  postNewLocation,
  testConnection,
} from "../api/databaseOperations";
import { getAToken, verifyToken } from "../tokenStorage";
import { useMarkers } from "../hooks/useMarkers";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    address: string;
    start_time: string;
    end_time: string;
    user_id: number;
    longitude: number;
    latitude: number;
  }) => void;
};

export default function CreatePartyForm({ onClose, onSubmit }: Props) {
  const [partyName, setPartyName] = useState("");
  const [partyDescription, setPartyDescription] = useState("");
  const [partyAddress, setPartyAddress] = useState("");
  const [partyStartTime, setPartyStartTime] = useState("");
  const [partyEndTime, setPartyEndTime] = useState("");
  const { location: currentLocation } = useLocation();
  const [usingCustomLocation, setUsingCustomLocation] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { fetchMarkers } = useMarkers();
  const [user, loading, error] = useAuthState(auth);

  const handleCreate = async () => {
    // Validation
    if (
      !partyName ||
      !partyDescription ||
      !partyStartTime ||
      !partyEndTime ||
      !partyAddress
    ) {
      Alert.alert("Error", "Please enter all fields. All fields are required.");
      return;
    }

    let finalLocation = null;

    if (usingCustomLocation) {
      // Validate latitude and longitude
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        Alert.alert(
          "Error",
          "Please enter valid latitude and longitude values."
        );
        return;
      }

      if (lat < -90 || lat > 90) {
        Alert.alert("Error", "Latitude must be between -90 and 90.");
        return;
      }

      if (lng < -180 || lng > 180) {
        Alert.alert("Error", "Longitude must be between -180 and 180.");
        return;
      }

      finalLocation = {
        latitude: lat,
        longitude: lng,
      };
    } else if (currentLocation) {
      finalLocation = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
    } else {
      Alert.alert("Error", "Please provide a location for the party.");
      return;
    }

    try {
      console.log("Creating party:", partyName);

      // Get the current authenticated user from Firebase
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Error", "You must be signed in to create a party.");
        return;
      }

      const token = await getAToken();
      console.log("Token:", token);
      console.log("Firebase UID:", user?.uid);
      console.log("getting user from database...");


      // Get the database user object using the Firebase UID
      const dbUser = await getUserByFirebaseId(user?.uid, token);

      if (!dbUser) {
        Alert.alert(
          "Error",
          "User not found in database. Please try signing in again."
        );
        return;
      }

      // Extract the user ID from the user object
      const userDbId = dbUser.id; // or dbUser.user_id, depending on your schema
      console.log("Database User ID:", userDbId);

      // Format times to ISO string with milliseconds for datetime(3)
      const formatTimeForDB = (timeString: string) => {
        // Split manually instead of using new Date() — safer.
        const [hourStr, minuteStr] = timeString.split(":");

        const hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);

        if (
          isNaN(hours) ||
          isNaN(minutes) ||
          hours < 0 ||
          hours > 23 ||
          minutes < 0 ||
          minutes > 59
        ) {
          throw new Error("Invalid time format. Use HH:mm");
        }

        const hh = hours.toString().padStart(2, "0");
        const mm = minutes.toString().padStart(2, "0");

        return `${hh}:${mm}:00`; // SQL TIME format
      };

      const formattedStartTime = formatTimeForDB(partyStartTime);
      const formattedEndTime = formatTimeForDB(partyEndTime);

      console.log("Formatted start time:", formattedStartTime);
      console.log("Formatted end time:", formattedEndTime);

      // POST to database
      const partyData = {
        name: partyName,
        description: partyDescription,
        address: partyAddress,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        user_id: userDbId,
        longitude: finalLocation.longitude,
        latitude: finalLocation.latitude,
      };

      console.log("Party data being sent:", JSON.stringify(partyData, null, 2));
      console.warn("Using token:", token);
      console.log("postNewLocation() called");
      const dbParty = await postNewLocation(partyData, token);

      console.log("Party stored in database:", dbParty);
      Alert.alert("Success", "Party created successfully!");

      // CALL onSubmit to notify parent component
      // This triggers handlePartyCreated in HomeScreen
      onSubmit(partyData);
      fetchMarkers();

      onClose();

      // Optionally navigate to the party details or party list
      // router.push(`/party/${dbParty.id}`);
    } catch (error: any) {
      console.error("Error creating party:", error);
      console.error("Error message:", error.message);
      Alert.alert("Error", `Failed to create party: ${error.message}`);
    }
  };

  const toggleCustomLocation = () => {
    const newCustomState = !usingCustomLocation;
    setUsingCustomLocation(newCustomState);

    // Initialize with current location when switching TO custom mode
    if (newCustomState && currentLocation) {
      setLatitude(currentLocation.latitude.toFixed(4));
      setLongitude(currentLocation.longitude.toFixed(4));
    }
    // Clear when switching back to current location
    else if (!newCustomState) {
      setLatitude("");
      setLongitude("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create A Party</Text>
          <Text style={styles.subtitle}>
            Host your own event and invite your friends!
          </Text>

          {/* Party Name */}
          <View>
            <Text style={styles.label}>Party Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={setPartyName}
                placeholder="My Epic Party"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Description */}
          <View>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={setPartyDescription}
                placeholder="Explain what your party is about"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Party Start Time */}
          <View>
            <Text style={styles.label}>Party Start Time</Text>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="numbers-and-punctuation"
                onChangeText={setPartyStartTime}
                placeholder="21:00"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Party End Time */}
          <View>
            <Text style={styles.label}>Party End Time</Text>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="numbers-and-punctuation"
                onChangeText={setPartyEndTime}
                placeholder="00:00"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Party Address */}
          <View>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={setPartyAddress}
                placeholder="123 Party St, Fun City"
                style={styles.input}
                placeholderTextColor="#a388f6"
              />
            </View>
          </View>

          {/* Location */}
          <View>
            <View style={styles.formRow}>
              <Text style={styles.label}>Map Location</Text>

              <Pressable
                style={styles.customLocationButton}
                onPress={toggleCustomLocation}
              >
                <Text style={styles.buttonText}>
                  {usingCustomLocation ? "Use Current" : "Custom Location"}
                </Text>
              </Pressable>
            </View>

            {/* ---- ADD THIS ---- */}
            <View style={{ marginTop: 10 }}>
              {usingCustomLocation ? (
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  {/* Latitude */}
                  <View style={{ width: "48%", marginRight: "2%" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 13,
                        marginBottom: 6,
                        fontWeight: "bold",
                      }}
                    >
                      Latitude
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholderTextColor="#a388f6"
                        style={styles.input}
                        value={
                          latitude || currentLocation?.latitude.toFixed(4) || ""
                        }
                        onChangeText={setLatitude}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Longitude */}
                  <View style={{ width: "48%", marginLeft: "2%" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 13,
                        marginBottom: 6,
                        fontWeight: "bold",
                      }}
                    >
                      Longitude
                    </Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholderTextColor="#a388f6"
                        style={styles.input}
                        value={
                          longitude ||
                          currentLocation?.longitude.toFixed(4) ||
                          ""
                        }
                        onChangeText={setLongitude}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              ) : (
                currentLocation && (
                  <View style={styles.currentLocationBox}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#a388f6"
                      style={styles.icon}
                    />
                    <View>
                      <Text
                        style={{
                          flex: 1,
                          color: "#fff",
                          paddingVertical: 2,
                          fontSize: 15,
                        }}
                      >
                        Using your current location:
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: Colors.secondaryLight,
                          paddingVertical: 2,
                          fontSize: 15,
                        }}
                      >
                        {currentLocation.latitude.toFixed(4)},{" "}
                        {currentLocation.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>
            {/* ---- END FIX ---- */}
          </View>

          {/* Buttons */}
          <Pressable style={styles.buttonPrimary} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Party</Text>
          </Pressable>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    marginTop: 20,
    paddingBottom: 40,
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
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
    borderColor: Colors.secondaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: Colors.secondaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8, // for Android glow effect
  },
  currentLocationBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#251442",
    borderWidth: 0.2,
    borderColor: Colors.secondaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
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
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  valueBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#251442",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },

  valueText: {
    color: Colors.secondaryLight,
    fontSize: 14,
  },
  customLocationButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  buttonSecondaryText: {
    color: Colors.secondary,
    fontSize: 15,
  },
});
