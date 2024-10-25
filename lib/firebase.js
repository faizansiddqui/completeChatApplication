// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// If you plan to use Analytics
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5pn9U5MVUEGUu2YpSNd36MMY7xDyaNTM",
  authDomain: "chat-9b662.firebaseapp.com",
  projectId: "chat-9b662",
  storageBucket: "chat-9b662.appspot.com",
  messagingSenderId: "385642087916",
  appId: "1:385642087916:web:872bffa77bbf327bacacc9",
  measurementId: "G-3Q0366L3WX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestore = getFirestore(app); // Firestore for database
const auth = getAuth(app); // Authentication
// const analytics = getAnalytics(app); // Analytics (optional)

// Export the initialized services to use in your app
export { app, firestore, auth };
