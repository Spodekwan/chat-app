import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useState } from 'react';

const { primary, secondary, black } = colors;

const Header = styled.header`
  background: ${primary};
  padding: 10px 0;
  height: 88px;
`;

const FlexWrapper = styled(Wrapper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

const HeaderItemsContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SignOutButton = styled.button`
  width: 100%;
  padding: 15px 10px;
  background: transparent;
  color: ${secondary};
  border: none;
  border-radius: 7px;
  font-weight: bold;
  font-size: 1.6rem;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    color: ${primary};
  }
`;

const Logo = styled.h1`
  color: ${secondary};
  font-family: 'Lobster', cursive;
  font-size: 4rem;
  text-align: left;
  margin: 0;
`;

const ProfileImageContainer = styled.button`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 30px;
  flex-shrink: 0;
  border: none;
  padding: 0;
`;

const ProfileImage = styled.img`
  cursor: pointer;
  width: 100%;
  display: block;
`;

const DropDownMenu = styled.ul`
  width: 150px;
  position: absolute;
  top: 50px;
  right: -10px;
  background: ${primary};
  list-style: none;
  padding: 15px 0;
  border-radius: 7px;
  border: 2px solid ${secondary};
  overflow: hidden;
  display: ${props => props.open ? "block" : "none"};
`;

const DropDownItem = styled.li`
  width: 100%;
  cursor: pointer;
  text-align: center;
  background: ${primary};
  color: ${secondary};
  font-weight: bold;
  font-size: 1.6rem;
  text-transform: uppercase;
  &:hover {
    background: ${secondary};
    color: ${primary};
    box-shadow: none;
    & button {
      color: ${primary};
    }
  }
`;

const DropDownLink = styled(Link)`
  padding: 15px 10px;
  color: ${secondary};
  text-decoration: none;
  display: block;
  &:hover {
    color: ${primary};
  }
`;

const Heading = () => {
  const { user, handleSignOut } = useAuth();
  const history = useHistory();
  const handleClick = async () => {
    await handleSignOut();
    history.push("/");
  }

  const [ dropDownOpen, setDropDownOpen ] = useState(false);

  return (
    <Header>
      <FlexWrapper>
        <Logo>Chat App</Logo>
        <HeaderItemsContainer>
          {user 
          ? <>
              <ProfileImageContainer onClick={() => setDropDownOpen(!dropDownOpen)}>
                <ProfileImage src={user.photoURL} alt="your profile picture"></ProfileImage>
              </ProfileImageContainer>
              <DropDownMenu open={dropDownOpen}>
                <DropDownItem><DropDownLink>test</DropDownLink></DropDownItem>
                <DropDownItem><SignOutButton onClick={handleClick}>Sign Out</SignOutButton></DropDownItem>
              </DropDownMenu>
            </>
          : null}
        </HeaderItemsContainer>
      </FlexWrapper>
    </Header>
  )
}

export default Heading