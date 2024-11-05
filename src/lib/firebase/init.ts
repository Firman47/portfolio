// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiPYZ6F0JgUagO2ksixoe1CR4k4pTPpRM",
  authDomain: "portfolio-15f83.firebaseapp.com",
  projectId: "portfolio-15f83",
  storageBucket: "portfolio-15f83.firebasestorage.app",
  messagingSenderId: "386041632976",
  appId: "1:386041632976:web:b356773dd9f6d3f4eee6d5",
  measurementId: "G-QTLYVMLST9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
