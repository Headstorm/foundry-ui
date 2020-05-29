import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2',
};

storiesOf('Appendix', module).add(
  'Appendix',
  () => {
    return (
      <div>
        <h1>{'Welcome to the HS-UI Appendix'}</h1>
        {/* <img src={require('/ThemingExample.png')} alt="Theming Example" /> */}
      </div>
    );
  },
  { design },
);
