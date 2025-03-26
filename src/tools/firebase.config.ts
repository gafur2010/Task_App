import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBA3BMj8ar7XPniNhQbl1yK3XISlLx1YjQ",
  authDomain: "imtihon-c9404.firebaseapp.com",
  projectId: "imtihon-c9404",
  storageBucket: "imtihon-c9404.firebasestorage.app",
  messagingSenderId: "383806823286",
  appId: "1:383806823286:web:154d2a3fa3e95c8747f857",
  measurementId: "G-EQ6KV8M6QX",
  database: "https://imtihon-c9404-default-rtdb.firebaseio.com/",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
