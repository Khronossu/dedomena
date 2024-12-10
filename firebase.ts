// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtZcOmoUnQO9A2--LExglo_nJ383VLIy0",
  authDomain: "dedomena-97e07.firebaseapp.com",
  projectId: "dedomena-97e07",
  storageBucket: "dedomena-97e07.firebasestorage.app",
  messagingSenderId: "77808945096",
  appId: "1:77808945096:web:e74d70c134fe6a4cc062fd"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
