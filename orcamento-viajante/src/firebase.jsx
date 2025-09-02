// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWQYqZSJBJK6K_xJLNE5R24MvIR8CY280",
  authDomain: "orcamento-viajante.firebaseapp.com",
  projectId: "orcamento-viajante",
  storageBucket: "orcamento-viajante.firebasestorage.app",
  messagingSenderId: "666133467386",
  appId: "1:666133467386:web:315032989919dd5c923943"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };