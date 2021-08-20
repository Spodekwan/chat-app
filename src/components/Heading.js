import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const { primary, secondary } = colors;

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

const Logo = styled.h1`
  color: ${secondary};
  font-family: 'Lobster', cursive;
  text-align: left;
  margin: 0;
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
        {user ? <button onClick={handleClick}>Sign Out</button> : null}
      </FlexWrapper>
    </Header>
  )
}

export default Heading