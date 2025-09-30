import { signOut } from 'firebase/auth';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account screen</Text>
      <Button title="Sign Out" onPress={async () => await signOut(auth)} />
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
