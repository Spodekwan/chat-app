import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import Heading from './Heading';
import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';

const { primary, secondary, black, background } = colors;

const Body = styled.body`
  background: ${background};
  padding-top: 10px;
  min-height: calc(100vh - 88px);
`;

const PageTitle = styled.h2`
  color: ${black};
  font-size: 4rem;
  margin: 10px 0 20px;
`;

const ProfileImageContainer = styled.div`
  width: 500px;
  height: 500px;
  overflow: hidden;
  border-radius: 250px;
  border: none;
  padding: 0;
  margin: 0 auto;
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
  const { user, handleSignOut } = useAuth();

    return (
        <>
            <Heading />
            <Body>
              <Wrapper>
                <PageTitle>Your Profile</PageTitle>
                <ProfileImageContainer>
                  <ProfileImage src={user.photoURL} alt="your profile picture"></ProfileImage>
                </ProfileImageContainer>
                {/* <label for="avatar">Choose a profile picture:</label>
                <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" /> */}
                <DisplayName>Username: {user.displayName}</DisplayName>
              </Wrapper>
            </Body>
        </>
    )
}

export default Profile;