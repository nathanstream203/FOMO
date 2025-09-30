

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


//IOS : 228207100442-iq8unmtrb33mqqcjsih768682c3j44sj.apps.googleusercontent.com
//ANDROID: 228207100442-vqk0anq8rjgmmvmc3576lp21l8g7fm6j.apps.googleusercontent.com
//WEB: 228207100442-89qtcm3iakek0ju9eitr60ta2d4n9sbf.apps.googleusercontent.com - not in video
