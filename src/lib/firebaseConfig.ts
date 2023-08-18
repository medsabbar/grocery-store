// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8TXZa2vvETZf7jkVTHb4ANRv-zWuvjzU",
  authDomain: "grocery-store-a234c.firebaseapp.com",
  projectId: "grocery-store-a234c",
  storageBucket: "grocery-store-a234c.appspot.com",
  messagingSenderId: "794209394388",
  appId: "1:794209394388:web:d12868a8ca5eda124b6541",
  measurementId: "G-SSDHT1VS23",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
