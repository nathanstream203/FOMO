// /(tabs)/account.tsx
import { useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth } from '../(logon)/firebaseConfig';

export default function AccountScreen() {
  const [user, loading, error] = useAuthState(auth);
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
