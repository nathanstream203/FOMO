// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AuthExample from './FIREBASE_TUTORIAL_AuthExample';

const App: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <AuthExample />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default App;