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
import { getAToken, clearAToken, verifyToken  } from "../../src/tokenStorage";
import { sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";


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
      [{ text: "OK",
        onPress: () => { 
          signOutUser();
        }
       }]
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
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4e9af1" }]}
        onPress={async () => {
          await reloadUserData();    // Reload Firebase user
          await fetchDatabaseUser(); // Reload DB user
        }}
      >
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#251682ff" }]}
        onPress={() => router.push("../updateUser")}
      >
        <Text style={styles.buttonText}>Update Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#251682ff" }]}
        onPress={resetUserPassword}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e63946" }]}
        onPress={signOutUser}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#1b1d1f",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#25292e",
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
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4e9af1",
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
    backgroundColor: "#2a2d31",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
  },
  dbSection: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#333842",
    width: "100%",
  },
  button: {
    marginTop: 15,
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
    borderBottomColor: "#4e9af1",
    paddingBottom: 5,
  },
});
