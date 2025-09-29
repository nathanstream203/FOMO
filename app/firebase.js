/*
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
//import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPfPw5qqQyKHCh8m4UoEKpOg3DTiu3_Qc",
  authDomain: "fomo-6f2ee.firebaseapp.com",
  projectId: "fomo-6f2ee",
  storageBucket: "fomo-6f2ee.firebasestorage.app",
  messagingSenderId: "268519497605",
  appId: "1:268519497605:web:7f661eb99c327c16ff2eec",
  measurementId: "G-LNVYRWY60B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
*/


// firebase.js
// ❌ Old way (won’t work in v9+)
// import firebase from 'firebase';
// firebase.initializeApp(firebaseConfig);

// ✅ New way
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPfPw5qqQyKHCh8m4UoEKpOg3DTiu3_Qc",
  authDomain: "fomo-6f2ee.firebaseapp.com",
  projectId: "fomo-6f2ee",
  storageBucket: "fomo-6f2ee.firebasestorage.app",
  messagingSenderId: "268519497605",
  appId: "1:268519497605:web:7f661eb99c327c16ff2eec",
  measurementId: "G-LNVYRWY60B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
