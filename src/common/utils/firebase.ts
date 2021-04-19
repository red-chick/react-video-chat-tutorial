import firebase from "firebase";

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAYUxNhRro1HHpB-4zeyBP-UGINnmNPFkE",
  authDomain: "react-video-chat-tutorial.vercel.app",
  projectId: "react-voice-chat-tutorial",
  storageBucket: "react-voice-chat-tutorial.appspot.com",
  messagingSenderId: "1022781403240",
  appId: "1:1022781403240:web:18252c561511203eb0cbdd",
});

export const db = firebaseApp.firestore();

export const provider = new firebase.auth.GoogleAuthProvider();

export default { db, firebaseApp, provider };
