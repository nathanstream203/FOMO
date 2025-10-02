// App.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import AuthExample from './FIREBASE_TUTORIAL_AuthExample';

const App: React.FC = () => {
    return (
        <View style={styles.container}>
            <AuthExample />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default App;