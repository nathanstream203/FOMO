// /(tabs)/account.tsx
import { useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
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
      console.log('User signed out successfully : ', user?.email);
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const sendFirebaseEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser!);
      console.info('Verification email sent to : ', user?.email);
    } catch (error) {
      console.error('Error sending verification email : ', error);
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
      

  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Account screen</Text>
      <Text style={styles.text}>Welcome User: {user?.email}</Text>
      <Text style={styles.text}>Firebase UID: {user?.uid}</Text>
      <Text style={styles.text}>Email Verified: {user?.emailVerified ? 'Yes' : 'No'}</Text>

       {!user?.emailVerified ? (
        <Button title="Verify Email" onPress={sendFirebaseEmailVerification} />
      ) : (
        <Text style={[styles.text, { marginTop: 10 }]}>Your email is verified!</Text>
      )}

      <Button title="Sign Out" onPress={signOutUser} />

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
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
});
