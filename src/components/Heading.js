import styled from 'styled-components';
import { Wrapper, colors } from '../styles/variables';

const { primary } = colors;

const Logo = styled.h1`
  color: ${primary};
  font-family: 'Lobster', cursive;
  text-align: left;
`;

const Heading = () => {
  return (
    <Wrapper>
      <header>
        <Logo>Chat App</Logo>
      </header>
    </Wrapper>
  )
}

export default Heading