import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';

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
`;

const SignOutButton = styled.button`
  padding: 7px 12px;
  margin-right: 10px;
  background: ${secondary};
  color: ${primary};
  border: none;
  box-shadow: 0 2px 4px -1px ${black};
  border-radius: 7px;
  font-weight: bold;
  font-size: 1.6rem;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background: ${primary};
    color: ${secondary};
    border: 1px solid ${secondary};
    box-shadow: none;
  }
`;

const Logo = styled.h1`
  color: ${secondary};
  font-family: 'Lobster', cursive;
  font-size: 4rem;
  text-align: left;
  margin: 0;
`;

const UserImageContainer = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 30px;
  flex-shrink: 0;
`;

const UserImage = styled.img`
  width: 100%;
  display: block;
`;

const Heading = () => {
  const { user, handleSignOut } = useAuth();
  const history = useHistory();
  const handleClick = async () => {
    await handleSignOut();
    history.push("/");
  }

  return (
    <Header>
      <FlexWrapper>
        <Logo>Chat App</Logo>
        <HeaderItemsContainer>
          {user 
          ? <>
              <SignOutButton onClick={handleClick}>Sign Out</SignOutButton>
              <UserImageContainer>
                <UserImage src={user.photoURL} alt="your profile picture"></UserImage>
              </UserImageContainer>
            </>
          : null}
        </HeaderItemsContainer>
      </FlexWrapper>
    </Header>
  )
}

export default Heading