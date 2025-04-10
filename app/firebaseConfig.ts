import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTZ8Drli00l_5le7HAvUNdCuwfCvorRLY",
  authDomain: "cro102-reactnative.firebaseapp.com",
  projectId: "cro102-reactnative",
  storageBucket: "cro102-reactnative.firebasestorage.app",
  messagingSenderId: "462759605626",
  appId: "1:462759605626:web:d482b6586b018cc4a892c3",
  measurementId: "G-5FZ96X072S"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);