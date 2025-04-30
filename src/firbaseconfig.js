import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAa6TuKQkzG8PuGICkeXBjAdXQEsl3574A",
  authDomain: "learning-projects-asha.firebaseapp.com",
  projectId: "learning-projects-asha",
  storageBucket: "learning-projects-asha.firebasestorage.app",
  messagingSenderId: "997581604816",
  appId: "1:997581604816:web:2e6c7a3b110a30f3a89bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};