// firebase.js
import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey:  process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: "attendance-firebase-ed287",
    storageBucket: "attendance-firebase-ed287.appspot.com",
    messagingSenderId: "119935135559",
    appId: "1:119935135559:web:d9798a9901f61f1867e662",
  appId: "YOUR_APP_ID",
};
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
