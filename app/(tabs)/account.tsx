import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function AccountScreen() {

  const router = useRouter();

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account screen</Text>
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
