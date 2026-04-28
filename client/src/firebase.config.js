import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDFIzFdDZFvvlcficvTEGb6IB3WnxXm5f8",
  authDomain: "student-route-finder.firebaseapp.com",
  projectId: "student-route-finder",
  storageBucket: "student-route-finder.firebasestorage.app",
  messagingSenderId: "35748114130",
  appId: "1:35748114130:web:de1c4f69c3f1eae9bf870b",
};

const app = initializeApp(firebaseConfig);

export default app;