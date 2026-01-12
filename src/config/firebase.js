// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // ✔ add this

const firebaseConfig = {
  apiKey: "AIzaSyA8veTLKpyYHYe2AzEqLUKy3w2Cc-7Ee24",
  authDomain: "e-com-cd978.firebaseapp.com",
  databaseURL: "https://e-com-cd978-default-rtdb.firebaseio.com",
  projectId: "e-com-cd978",
  storageBucket: "e-com-cd978.firebasestorage.app",
  messagingSenderId: "116626849052",
  appId: "1:116626849052:web:bbdc8f5dfe5d913c5dced9",
  measurementId: "G-SYENBZ9RZ6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // ✔ now works

export default app;
