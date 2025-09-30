// SignInScreen.tsx
import { AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SignInScreenProps = {
  promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
};


export default function SignInScreen({ promptAsync }: SignInScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In With Google</Text>
      <Pressable style={styles.button} onPress={() => promptAsync()}>
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