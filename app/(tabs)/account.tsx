// /(tabs)/account.tsx
import { useRouter } from 'expo-router';
import { reload, signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth } from '../(logon)/firebaseConfig';
import { getUserByFirebaseId } from '../api/databaseOperations';

interface DatabaseUser {
  firebase_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  role_id: number | string;
}
export default function AccountScreen() {
  const [user, loading, error] = useAuthState(auth);
  //const [dbUser, setDbUser] = React.useState(null);
  const [dbUser, setDbUser] = React.useState<DatabaseUser | null>(null);
  const [dbLoading, setDbLoading] = React.useState(false);
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

  // Fetch user profile from database
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        setDbLoading(true);
        try {
          const userData = await getUserByFirebaseId(user.uid);
          setDbUser(userData);
          console.log('Fetched user from DB: ', userData);
        } catch (err) {
          console.error('Error fetching user from DB: ', err);
        } finally {
          setDbLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);
      
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
      </View>
        
              {/* Display database user info */}
      <View style={styles.dbSection}>
        <Text style={styles.sectionTitle}>Database User Info</Text>

        {dbLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : dbUser ? (
          <>
            <Text style={styles.text}>First Name: {dbUser.first_name}</Text>
            <Text style={styles.text}>Last Name: {dbUser.last_name}</Text>
            <Text style={styles.text}>Birth Date: {dbUser.birth_date}</Text>
            <Text style={styles.text}>Role ID: {dbUser.role_id}</Text>
          </>
        ) : (
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            No user data found in database.
          </Text> )}


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
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 4,
  },
  dbSection: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#333842',
    width: '100%',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
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
