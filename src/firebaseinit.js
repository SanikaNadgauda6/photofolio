import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyAqnXANuoUPvcNJ3rnLXM87LZvOhHjJAO8",
  authDomain: "photofolio-13a16.firebaseapp.com",
  projectId: "photofolio-13a16",
  storageBucket: "photofolio-13a16.appspot.com",
  messagingSenderId: "800868635756",
  appId: "1:800868635756:web:280f18a5660c660d847449",
  measurementId: "G-JCD3TLNX9M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const analytics = getAnalytics(app);
const storage = getStorage(app);


export {auth, db, storage};
