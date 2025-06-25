import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged } from "firebase/auth";
// import { getFirestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGDyep_O5DVnf8dVJ8wDHTxzINI58Pzt0",
  authDomain: "carbclex.firebaseapp.com",
  projectId: "carbclex",
  storageBucket: "carbclex.firebasestorage.app",
  messagingSenderId: "994747652510",
  appId: "1:994747652510:web:aa8075ac59954f62cd9e8f",
  measurementId: "G-7N9ZE9QQSS"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); // user.uid and user.email available
      } else {
        resolve(null);
      }
    });
  });
};
