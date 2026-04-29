import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "student-route-finder.firebaseapp.com",
  projectId: "student-route-finder",
  storageBucket: "student-route-finder.firebasestorage.app",
  messagingSenderId: "...",
  appId: "...",
};

const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();