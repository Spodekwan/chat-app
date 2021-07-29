import firebase from '../config/firebase';
import 'firebase/auth';
import { useState } from 'react';

const LogIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
            /** @type {firebase.auth.OAuthCredential} */
            const credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            const token = credential.accessToken;
            // ...
          }
          // The signed-in user info.
          const user = result.user;
          console.log(result);
    })

  return (
    <>
      <p>Hello</p>
      {/* 
        button for google auth
      */}
    </>
  )
}

export default LogIn;