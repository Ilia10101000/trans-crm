import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };
const firebaseConfig = {
  apiKey: 'AIzaSyDruv_DdPVHhOKL4eO9X1cv_m6UxKTqrOY',
  authDomain: 'my-first-project-2bae3.firebaseapp.com',
  projectId: 'my-first-project-2bae3',
  storageBucket: 'my-first-project-2bae3.appspot.com',
  messagingSenderId: '1022775780432',
  appId: '1:1022775780432:web:cc8f596a642a0a54609d55'
};


 export const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
 export const googleProvider = new GoogleAuthProvider();
 export const facebookProvider = new FacebookAuthProvider();