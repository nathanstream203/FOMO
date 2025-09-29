
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../app/AuthContext';
import { Colors } from '../app/theme';

console.log(AuthSession.makeRedirectUri());


WebBrowser.maybeCompleteAuthSession();

export default function LogonScreen() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com',
    androidClientId: '228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com',
    webClientId: '228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com', // for Expo Go
      redirectUri: AuthSession.makeRedirectUri(),  // ✅ Ensure this matches your Google Cloud redirect URIs
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google token:', authentication?.accessToken);

      // Here you could fetch Google profile info
      setUser(authentication?.accessToken ?? 'google-user');

      router.replace('/(tabs)'); // go to tabs after sign-in
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to continue</Text>

      <Pressable
        style={[styles.button, { backgroundColor: '#4285F4' }]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </Pressable>
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
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.button,
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
