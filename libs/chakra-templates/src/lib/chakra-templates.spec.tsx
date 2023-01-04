import { render } from '@testing-library/react';

import ChakraTemplates from './chakra-templates';

describe('ChakraTemplates', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChakraTemplates />);
    expect(baseElement).toBeTruthy();
  });
});
