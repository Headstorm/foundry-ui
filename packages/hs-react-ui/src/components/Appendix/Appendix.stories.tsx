import React from 'react';
import { storiesOf } from '@storybook/react';

import styled from 'styled-components';
import { Div } from 'src/htmlElements';

const DocContainer = styled(Div)`
  justify-self: flex-start;
  padding: 2rem;
  max-width: 60rem;
`;
const FullWidthImage = styled.img`
  width: 100%;
`;

// TODO: Turn these images into html
storiesOf('Appendix', module).add('Appendix', () => {
  return (
    <DocContainer>
      <h1>Welcome to Rasa UI</h1>
      <p>
        Rasa UI is a component library which is in it for the long haul. Unlike other bootstrap
        libraries, it lets you fully customize and theme every piece of it through a
        straight-forward API, which means you won't have to rip out your components and rewrite them
        once your app is out of the "POC" phase.
      </p>
      <p>
        The components you used in the hackathon will be the same ones you use when you're a fortune
        500 megacorp.
      </p>
      <FullWidthImage src="/images/ThemingExample.png" alt="Theming Example" />
      <FullWidthImage src="/images/ThemeExampleCode.png" alt="Theming Example Code" />
    </DocContainer>
  );
});
