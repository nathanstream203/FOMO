import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as React from "react";
import "react-native-gesture-handler";
import SignInScreen from "./FireBase/SignInScreen";
import Navigation from "./Navigation";

import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from 'react-native';
import { auth } from "./FireBase/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [userInfo, setUserInfo] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com",
        androidClientId: "228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com",
        //expoClientId: "228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com",
    });

    const checkLocalUser = async () => {
        try {
            setLoading(true);
            const userJSON = await AsyncStorage.getItem('@user');
            const userDATA = userJSON ? JSON.parse(userJSON) : null;
            console.log("Local User: ", userDATA);
            setUserInfo(userDATA);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if(response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
                /*
                .then((userCredential) => {
                    console.log("User signed in");
                    const user = userCredential.user;
                    setUserInfo(user);
                })
                .catch((error) => {
                    console.log("Error signing in: ", error);
                });
                */
        }
    }, [response]);

    React.useEffect(() => {
        checkLocalUser();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user) {
                //check expiration time!!
                console.log(JSON.stringify(user, null, 2));
                setUserInfo(user);
                await AsyncStorage.setItem('@user', JSON.stringify(user));
            } else {
                console.log("User is not Authenticated");
                //setUserInfo(null);
                //await AsyncStorage.removeItem('user');
            }
        return () => unsubscribe();
    });
}, []);
    if(loading) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>;
    }
    return userInfo ? <Navigation /> : <SignInScreen promptAsync={promptAsync}  />;
}