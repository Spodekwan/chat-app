import firebaseApp from '../config/firebase';
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useHistory } from 'react-router';
import Heading from './Heading';
import { colors } from '../styles/variables';

const { primary, secondary, black, background } = colors;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 88px);
  background: ${background};
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  z-index: -10;
`;

const Login = styled.button`
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 4rem;
  padding: 20px 60px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 5px 20px ${black};
  background: ${primary};
  color: ${secondary};
  font-weight: bold;
  text-transform: uppercase;
  &:hover {
    background: ${secondary};
    color: ${primary};
  }
`;

const LogIn = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const { setUser, user } = useAuth();
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
        console.log('setting user', result, user);

        // The signed-in user info.
        // setUser(result.user);

        const db = getDatabase();
        const usersRef = ref(db, 'Users');
        get(child(usersRef, `${result.user.uid}`))
          .then(snapshot => {
            if (!snapshot.exists()) {
              set(child(usersRef, `${result.user.uid}`), {
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
              })
            }
          })
        
        // send to rooms page
        if (user) {
          history.push('/rooms');
        }
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
      <Heading />
      <LoginContainer>
        <Login onClick={handleLogin}>Log In</Login>
      </LoginContainer>
    </>
  )
}

export default LogIn;