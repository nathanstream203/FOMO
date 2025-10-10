import * as React from 'react';
// SignInScreen.tsx
import { useRouter } from 'expo-router';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from './firebaseConfig';



export default function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  //const [signInWithEmailAndPassword, user, _, error] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword, user, _, error] = useCreateUserWithEmailAndPassword(auth);
  //const user = useAuthState(auth);

  const router = useRouter();

  const signUp = async () => {
    await createUserWithEmailAndPassword(email, password);
  }

React.useEffect(() => {
    if (user) {
        console.log('Account created for:', user.user.email);
        auth.signOut();
        router.replace('/signin');
    }
  }, [user]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New FOMO Account</Text>

      <TextInput
        keyboardType="email-address"
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

      <Text style={{ color: 'green' }}>{user?.user.email}</Text>

      <Pressable style={styles.button} onPress={() => signUp()}>
        <Text  style={styles.buttonText}>Create</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.replace('/signin')}>
        <Text  style={styles.buttonText}>Back to Sign In</Text>
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