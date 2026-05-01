import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmsMho5cOuRqEBmysmKaaDHIEafU7iLJA",
  authDomain: "finmind-ai.firebaseapp.com",
  projectId: "finmind-ai",
  storageBucket: "finmind-ai.appspot.com",
  messagingSenderId: "1086255152285",
  appId: "1:1086255152285:web:8e1d611d9296419a955d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
