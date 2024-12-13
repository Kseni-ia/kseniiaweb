// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4NlOr9JeGqHdzCKHX74AUDQWCm-vQg6w",
  authDomain: "tutoting-webwite.firebaseapp.com",
  projectId: "tutoting-webwite",
  storageBucket: "tutoting-webwite.appspot.com",
  messagingSenderId: "855366625201",
  appId: "1:855366625201:web:65817a16358b9b16223f90",
  measurementId: "G-MKGFT0HJQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, auth, db, functions, analytics, storage };