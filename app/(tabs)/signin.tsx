import * as React from 'react';
// SignInScreen.tsx
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signInWithEmailAndPassword, user, _, error] = useSignInWithEmailAndPassword(auth);
  //const user = useAuthState(auth);

  const signIn = async () => {
    await signInWithEmailAndPassword(email, password);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In With Google</Text>

      <TextInput
        keyboard-type="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={{ color: 'red' }}>{error?.message}</Text>
      <Text style={{ color: 'green' }}>{user?.user.email}</Text>

      <Pressable style={styles.button} onPress={() => signIn()}>
        <Text  style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#333842',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#5568fe',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});