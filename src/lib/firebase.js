import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWQaKFgcIfADrTrfCJpUYaV2ilYj-QtI8",
  authDomain: "snapshrink.firebaseapp.com",
  projectId: "snapshrink",
  storageBucket: "snapshrink.firebasestorage.app",
  messagingSenderId: "776675106456",
  appId: "1:776675106456:web:f667fa8610a129e2b43aed",
  measurementId: "G-751194RJB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
