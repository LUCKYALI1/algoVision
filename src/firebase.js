import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgZD5s9CMyyjeYsbeAsVnXZXZ04WLvFmo",
  authDomain: "algovision-3cb21.firebaseapp.com",
  projectId: "algovision-3cb21",
 storageBucket: "algovision-3cb21.appspot.com", 
  messagingSenderId: "846413410907",
  appId: "1:846413410907:web:70277610302063e74c857e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);