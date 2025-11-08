// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFsw7F-cksZUZFPqz-GZOVciksy1mUmV0",
  authDomain: "firestore-crud-c314c.firebaseapp.com",
  projectId: "firestore-crud-c314c",
  storageBucket: "firestore-crud-c314c.firebasestorage.app",
  messagingSenderId: "874859825677",
  appId: "1:874859825677:web:7bd8fd67c0e0699d036344",
  measurementId: "G-JDQ3DC9X52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);