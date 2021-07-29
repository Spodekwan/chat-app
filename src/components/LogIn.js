import firebase from '../config/firebase';

const LogIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);

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