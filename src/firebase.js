import firebase from 'firebase';
 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAt3rw2QnB-jopHIffERwejXNfZ5nzLbcY",
    authDomain: "webproh-6bfee.firebaseapp.com",
    projectId: "webproh-6bfee",
    storageBucket: "webproh-6bfee.appspot.com",
    messagingSenderId: "512965004860",
    appId: "1:512965004860:web:f8cd7e42b2e988cd5a3d39",
    measurementId: "G-M2JH44ELQL"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
// authontecation işlemlerini yapacağımız yer
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };