import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface ChakraTemplatesProps {}

const StyledChakraTemplates = styled.div`
  color: pink;
`;

export function ChakraTemplates(props: ChakraTemplatesProps) {
  return (
    <StyledChakraTemplates>
      <h1>Welcome to ChakraTemplates!</h1>
    </StyledChakraTemplates>
  );
}

export default ChakraTemplates;
