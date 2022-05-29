import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBkGyUb05NfIPTotfcUZYnc-gIegzSS7Vc",
  authDomain: "sab-sunno.firebaseapp.com",
  projectId: "sab-sunno",
  storageBucket: "sab-sunno.appspot.com",
  messagingSenderId: "706134238441",
  appId: "1:706134238441:web:6f2ff8f55f74919c78fc78",
  measurementId: "G-9FEKLSFPVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
const authentication = getAuth(app);

export { db, storage, app, authentication };
