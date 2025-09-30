//myApplication/AuthExample.tsx

import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import firebase from './FIREBASE_TUTORIAL_firebase';

const AuthExample: React.FC = () => {
    const [email, setEmail] = useState < string > ('');
    const [password, setPassword] = useState < string > ('');

    const handleSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log('User signed up:', user);
            })
            .catch(error => {
                console.error('Error signing up:', error);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default AuthExample;