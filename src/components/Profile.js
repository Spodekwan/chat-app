import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, get, child, update } from 'firebase/database';
import { Link, useHistory } from 'react-router-dom';
import Heading from './Heading';
import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';

const { primary, secondary, black, background } = colors;

const ProfileContainer = styled.div`
  background: ${background};
  padding-top: 20px;
  min-height: calc(100vh - 88px);
`;

const BackButton = styled(Link)`
  color: ${black};
  font-size: 2rem;
  text-decoration: none;
  background: ${secondary};
  padding: 5px 10px;
  border-radius: 7px;
`;

const PageTitle = styled.h2`
  color: ${black};
  font-size: 4rem;
  margin: 10px 0 20px;
  text-align: center;
`;

const ProfileImageContainer = styled.div`
  width: 400px;
  height: 400px;
  overflow: hidden;
  border-radius: 250px;
  border: none;
  padding: 0;
  margin: 30px auto;
`;

const ProfileImage = styled.img`
  cursor: pointer;
  width: 100%;
  display: block;
`;

const DisplayName = styled.p`
  color: ${black};
  font-size: 4rem;
`;

const Profile = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [imageURL, setImageURL ] = useState('');
  // const [userImageDisplay, setUserImageDisplay] = useState(`${user.photoURL}`);

  const db = getDatabase();
  const currentUser = ref(db, `Users/${user.uid}`);

  // https://lh3.googleusercontent.com/a/AATXAJxsQ43tqs0lEb41X-AooViYQgpbCvgKRuaH2Gk=s96-c

  const handleImageUpdate = (event) => {
    event.preventDefault();
    console.log('update!');

    if (imageURL.length) {
      update(currentUser, {
        photoURL: imageURL,
      });

      console.log(user.displayName, user.photoURL);
      user.photoURL = imageURL;
      console.log(user.displayName, user.photoURL);
      
      // setUserImageDisplay(imageURL);

      setImageURL('');
    }
  }

  // get(currentUser)
  //   .then((snapshot) => {
  //       const data = snapshot.val();
  //       console.log(data.photoURL);
  // });

  // useEffect(() => {
  //   const db = getDatabase();
  //   const currentUser = ref(db, `Users/${user.uid}`);
  //   onValue(currentUser, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log(data.photoURL);
  //   });
  // }, [])

  // onValue(currentUser, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log(data.photoURL);
  // });

  return (
    <>
      <Heading />
      <ProfileContainer>
        <Wrapper>
          <BackButton to="/rooms">Back</BackButton>
          <PageTitle>Your Profile</PageTitle>
          <ProfileImageContainer>
            {/* <ProfileImage src={userImageDisplay} alt="your profile picture"></ProfileImage> */}
            <ProfileImage src={user.photoURL} alt="your profile picture"></ProfileImage>
          </ProfileImageContainer>
          {/* <form action="submit" onSubmit={(event) => handleImageUpdate(event)}>
            <label htmlFor="profileImage">Import profile image from URL: </label>
            <input 
              type="text" 
              id="profileImage"
              accept="image/png, image/jpeg"
              value={imageURL}
              onChange={(event) => setImageURL(event.target.value)}
              required
            />
            <button type="submit">Update</button>
          </form> */}
          <DisplayName>Username: {user.displayName}</DisplayName>
          <p className="tempMessage">Ability to update profile pictures coming soon!</p>
        </Wrapper>
      </ProfileContainer>
    </>
  )
}

export default Profile;