import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCUI5Ngr-Ih9LKEZ9l4Dq-6ocZvwhc8r00",
  authDomain: "website-database-56159.firebaseapp.com",
  databaseURL: "https://website-database-56159-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "website-database-56159",
  storageBucket: "website-database-56159.appspot.com",
  messagingSenderId: "180368249258",
  appId: "1:180368249258:web:2db386751a77ac80f61bd3",
  measurementId: "G-90XYD19XCR"
};
  
const app = initializeApp(firebaseConfig);
const db = new getDatabase();
const dbRef = ref(db , "feedback/");

// console.log(get(child(dbRef, "feedback")));
push(dbRef, "the game is too slow to pick on the way out. Please include a save feature");