// /(tabs)/account.tsx
import { useRouter } from "expo-router";
import { reload, signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../src/firebaseConfig";
import { getUserByFirebaseId } from "../../src/api/databaseOperations";
import { getAToken, clearAToken, verifyToken } from "../../src/tokenStorage";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";
import { Colors } from "../../src/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DatabaseUser {
  firebase_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  role_id: number | string;
}

export default function AccountScreen() {
  const [user, loading, error] = useAuthState(auth);
  const [dbUser, setDbUser] = React.useState<DatabaseUser | null>(null);
  const [dbLoading, setDbLoading] = React.useState(false);
  const router = useRouter();
  const signOutUser = async () => {
    try {
      await clearAToken();
      await signOut(auth);
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Function to send password reset email through firebase
  const resetUserPassword = async () => {
    try {
      if (!user?.email) {
        return Alert.alert("Error", "No email address found for this account.");
      }
      await sendPasswordResetEmail(auth, user.email);

      Alert.alert(
        "Password Reset Email Sent",
        `A reset link has been sent to:\n\n${user.email} \n You will now be redirected to sign in.`,
        [
          {
            text: "OK",
            onPress: () => {
              signOutUser();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Password reset error:", error);
      let message = "An error occurred while sending the reset email.";
      if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/user-not-found") {
        message = "No user exists with this email.";
      }

      Alert.alert("Error", message);
    }
  };

  const reloadUserData = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      console.log("User data reloaded for : ", user?.email);
    }
  };

  const fetchDatabaseUser = async () => {
    if (!user?.uid) return;

    setDbLoading(true);
    try {
      const token = await getAToken();
      const data = await verifyToken();
      const userData = await getUserByFirebaseId(data.firebase_id, token);
      setDbUser(userData);
      console.log("DB User refreshed:", userData);
    } catch (err) {
      console.error("Error fetching user from DB:", err);
    } finally {
      setDbLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user?.uid) return;

    // Load data immediately
    reloadUserData();
    fetchDatabaseUser();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      console.log("Auto refreshing user data...");
      reloadUserData();
      fetchDatabaseUser();
    }, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Firebase Profile */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>
          {user?.displayName || `Welcome ${dbUser?.first_name || "User"}!`}
        </Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.pointsCard}>
        <MaterialCommunityIcons
          name="fire"
          size={30}
          color={Colors.secondary}
        />
        <Text style={styles.infoLabel}>1234</Text>
        <Text style={styles.infoValue}>FOMO Points</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Firebase UID</Text>
          <Text style={styles.infoValue}>{user?.uid}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>First Name</Text>
          <Text style={styles.infoValue}>{dbUser?.first_name || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Name</Text>
          <Text style={styles.infoValue}>{dbUser?.last_name || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{dbUser?.birth_date || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Verified</Text>
          <Text style={styles.infoValue}>
            {user?.emailVerified ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User in Database?</Text>
          <Text style={styles.infoValue}>
            {dbLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : dbUser ? (
              "Yes"
            ) : (
              "No user data found in database."
            )}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={async () => {
            await reloadUserData(); // Reload Firebase user
            await fetchDatabaseUser(); // Reload DB user
          }}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        <View style={styles.profileButtons}>
          <View style={{ width: "48%" }}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => router.push("../updateUser")}
            >
              <Text style={styles.buttonText}>Update Account</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "48%" }}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={resetUserPassword}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.signoutButton]} onPress={signOutUser}>
          <Text style={styles.signoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: Colors.darkPrimary,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  profileCard: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  emailText: {
    fontSize: 14,
    color: "#ccc",
  },
  infoCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 15,
    width: "100%",
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    color: "#fff",
    fontSize: 14,
  },
  infoValue: {
    color: Colors.secondaryLight,
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
  },
  pointsCard: {
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    padding: 20,
    borderRadius: 15,
    width: "100%",
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10, // for Android glow effect
  },
  dbSection: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#333842",
    width: "100%",
  },
  buttonsContainer: {
    width: "100%",
    gap: 15,
  },
  profileButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signoutButton: {
    borderColor: "#ff4d4d",
    borderWidth: 0.5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  signoutButtonText: {
    color: "#ff4d4d",
    fontWeight: "600",
    width: 200,
    textAlign: "center",
  },
  button: {
    borderColor: Colors.secondary,
    borderWidth: 0.5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    width: 200,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    paddingBottom: 5,
  },
});
