// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVFFrhQmy8x7PHb4OwSPXaAXmc1MPtQts",
  authDomain: "hospital-ai-eede4.firebaseapp.com",
  projectId: "hospital-ai-eede4",
  storageBucket: "hospital-ai-eede4.firebasestorage.app",
  messagingSenderId: "346176113723",
  appId: "1:346176113723:web:c50cd0e199db944f15e01e",
  measurementId: "G-QDYRE23RYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);