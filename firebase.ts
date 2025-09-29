// myApplication/firebase.ts
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDPfPw5qqQyKHCh8m4UoEKpOg3DTiu3_Qc",
  authDomain: "fomo-6f2ee.firebaseapp.com",
  projectId: "fomo-6f2ee",
  storageBucket: "fomo-6f2ee.firebasestorage.app",
  messagingSenderId: "268519497605",
  appId: "1:268519497605:web:7f661eb99c327c16ff2eec",
  measurementId: "G-LNVYRWY60B"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


const app = initializeApp(firebaseConfig);

export default firebase;