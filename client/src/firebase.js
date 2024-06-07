// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1Zwbd1LczbTm1m0XFnYwsJvK9g-OOkRA",
  authDomain: "clickandcook-d165a.firebaseapp.com",
  projectId: "clickandcook-d165a",
  storageBucket: "clickandcook-d165a.appspot.com",
  messagingSenderId: "361714927600",
  appId: "1:361714927600:web:bd545a09ae7b826bd6ff35",
  measurementId: "G-MXK6907P0B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth, analytics };
