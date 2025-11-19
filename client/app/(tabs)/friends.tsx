// app/(tabs)/friends.tsx

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "../../src/firebaseConfig";
import NotVerified from "../notverified";
import { Colors } from "../../src/styles/colors";

export default function FriendsScreen() {
  const [friendCode, setFriendCode] = useState("");
  const [user, loading, error] = useAuthState(auth);

  // Generate a random friend code
  useEffect(() => {
    const generateCode = () => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
      }
      code += "-";
      for (let i = 0; i < 4; i++) {
        code += numbers[Math.floor(Math.random() * numbers.length)];
      }
      return code;
    };

    setFriendCode(generateCode());
  }, []);

  if (!user?.emailVerified) {
    return <NotVerified />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Your Friend Code:</Text>
        <Text style={styles.code}>{friendCode}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Example Friends:</Text>
        <Text style={styles.friend}>Jane Doe</Text>
        <Text style={styles.friend}>John Doe</Text>
        <Text style={styles.friend}>Ben Smith</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 20,
  },
  section: {
    marginVertical: 12,
    alignItems: "center",
  },
  label: {
    color: Colors.text,
    fontSize: 14,
  },
  code: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  friend: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 4,
  },
});
