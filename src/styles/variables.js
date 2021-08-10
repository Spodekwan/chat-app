import styled from 'styled-components';

export const colors = {
  white: `#fef6ee`,
  secondary: `#faebd7`,
  primary: `#39397e`,
  black: `#232323`,
}

export const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1350px;
  width: 85%;

  @media (max-width: 480px) {
    width: 95%;
  }
`;