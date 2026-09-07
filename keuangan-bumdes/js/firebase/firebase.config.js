// =========================================
// FIREBASE CONFIG
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyBFU6TAtYIrtDyO9JfLg5cmlTsGg095838",

    authDomain: "keuanganbumdessumber.firebaseapp.com",

    projectId: "keuanganbumdessumber",

    storageBucket: "keuanganbumdessumber.firebasestorage.app",

    messagingSenderId: "187323627010",

    appId: "1:187323627010:web:36e52246452321b4c2d91b"

};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


window.db = db;


console.log("Firebase berhasil terhubung.");

console.log(
    "Project Firebase:",
    firebaseConfig.projectId
);