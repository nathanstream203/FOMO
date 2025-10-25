// app/(tabs)/NotVerified.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from './theme';

export default function NotVerified() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You have not verified your email yet.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/account')}
      >
        <Text style={styles.buttonText}>Go to Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary || '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
