// /(tabs)/account.tsx
import { useRouter } from "expo-router";
import { reload, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../(logon)/firebaseConfig";

export default function AccountScreen() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully : ", user?.email);
      router.replace("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const reloadUserData = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      console.log("User data reloaded for : ", user?.email);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
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
          {user?.displayName || "Welcome User!"}
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
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{user?.displayName || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>N/A</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Verified</Text>
          <Text style={styles.infoValue}>
            {user?.emailVerified ? "✅ Yes" : "❌ No"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e63946" }]}
          onPress={signOutUser}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4e9af1" }]}
          onPress={reloadUserData}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#1b1d1f",
    justifyContent: "center",
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 15,
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
  button: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
