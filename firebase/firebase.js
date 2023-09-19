import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBBc9SgD9jYZ4O8SKMv1GWU_q37zCfESFI",
    authDomain: "the-radja-kuphie.firebaseapp.com",
    projectId: "the-radja-kuphie",
    storageBucket: "the-radja-kuphie.appspot.com",
    messagingSenderId: "225379235097",
    appId: "1:225379235097:web:bedb3bf91ae26b274a4188",
    measurementId: "G-0Q7CW5WSM5",
};

const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_STORE = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_STORE, FIREBASE_STORAGE };
