import { initializeApp } from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDTzdFHsuHL58Cz7AbICWDAjSVzrVKIqfU",
  authDomain: "chat-app-d2945.firebaseapp.com",
  projectId: "chat-app-d2945",
  storageBucket: "chat-app-d2945.appspot.com",
  messagingSenderId: "724666457079",
  appId: "1:724666457079:web:0e774157f5a5a81849ecf2"
};

const firebase = initializeApp(firebaseConfig);

export default firebase;