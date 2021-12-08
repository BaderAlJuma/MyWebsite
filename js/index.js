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
  measurementId: "${config.measurementId}"
};
  
const app = initializeApp(firebaseConfig);
const db = new getDatabase();
const dbRef = ref(db , "feedback/");

document.getElementById("butt").addEventListener("click", processFeedback);

function processFeedback(){
  
  const formbox = document.getElementById("feedbackBox");
  document.getElementById("modal").style.display = "block";
  if(formbox.value != ""){
    const output = formbox.value;
    push(dbRef, output);
  }
  
}
