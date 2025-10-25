import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPfPw5qqQyKHCh8m4UoEKpOg3DTiu3_Qc",
  authDomain: "fomo-6f2ee.firebaseapp.com",
  projectId: "fomo-6f2ee",
  storageBucket: "fomo-6f2ee.firebasestorage.app",
  messagingSenderId: "268519497605",
  appId: "1:268519497605:web:7f661eb99c327c16ff2eec",
  measurementId: "G-LNVYRWY60B",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
