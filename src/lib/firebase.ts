
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';
import { getDatabase } from 'firebase/database';

// Updated Firebase configuration as provided
const firebaseConfig = {
  apiKey: "AIzaSyCjykrq-gEwdzuCkbi-T0V0U5xrY9mH3P4",
  authDomain: "bancharampur-digital-infoguide.firebaseapp.com",
  databaseURL: "https://bancharampur-digital-infoguide-default-rtdb.firebaseio.com",
  projectId: "bancharampur-digital-infoguide",
  storageBucket: "bancharampur-digital-infoguide.firebasestorage.app",
  messagingSenderId: "342061327201",
  appId: "1:342061327201:web:f20dbc964b54760d0fdb20",
  measurementId: "G-98H12Y6M5F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
export default app;
