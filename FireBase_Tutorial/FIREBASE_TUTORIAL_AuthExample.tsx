//myApplication/AuthExample.tsx
// myApplication/AuthExample.tsx

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import firebase from './FIREBASE_TUTORIAL_firebase';

const AuthExample: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSignUp = () => {
        setError('');
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log('User signed up:', user);
            })
            .catch(err => setError(err.message));
    };

    const handleSignIn = () => {
        setError('');
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                console.log('User signed in:', user);
            })
            .catch(err => setError(err.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.signup]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    signup: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default AuthExample;


/*
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

*/