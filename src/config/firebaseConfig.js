// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfm8VKXcr0mWnezC2GD5ALsleaRmN4X9k",
  authDomain: "inventorymanagement-2b663.firebaseapp.com",
  projectId: "inventorymanagement-2b663",
  storageBucket: "inventorymanagement-2b663.appspot.com",
  messagingSenderId: "362145594088",
  appId: "1:362145594088:web:8dcf2477291295a50be75d",
  measurementId: "G-Y5G2B01FJY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
