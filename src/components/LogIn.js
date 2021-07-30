import firebaseApp from '../config/firebase';
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useHistory } from 'react-router';

const Login = styled.button`
  cursor: pointer;
`;

const LogIn = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const { setUser } = useAuth();
  const history = useHistory();

  const handleLogin = () => {
    signInWithRedirect(auth, provider);
  }

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        console.log(result);

        // The signed-in user info.
        setUser(result.user);
        history.push('/rooms');

      }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }, [auth, history, setUser]);

  return (
    <>
      <p>Hello</p>
      <Login onClick={handleLogin}>Log In!</Login>
    </>
  )
}

export default LogIn;