//signup.tsx
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../(logon)/firebaseConfig';




export default function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [createUserWithEmailAndPassword, user, _, error] = useCreateUserWithEmailAndPassword(auth);

  const router = useRouter();

  const signUp = async () => {
    await createUserWithEmailAndPassword(email, password);
  }

React.useEffect(() => {
    if (user) {
        console.log('Account created for:', user.user.email);
        console.log('Firebase UID:', user.user.uid);
        if(!user.user.emailVerified){
          console.log('User '+ user.user.email + ' NOT verified.');
          // sendEmailVerification(user.user) use this to send verification email
        } else if(user.user.emailVerified){
          console.log('User '+ user.user.email + ' IS verified.');
        } else{
          console.log('Unknown error or unknown verification status for user '+ user.user.email);
        }

        router.replace('/(tabs)');
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