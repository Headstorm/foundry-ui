import React from 'react';
import styled from 'styled-components';
import { text, number } from '@storybook/addon-knobs';

import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import colors from '../../../src/constants/colors';
import timings from '../../../src/constants/timings';
import Card, { Header, Footer } from './Card';

addDecorator(withA11y);
addDecorator(withDesign);
export default {
  title: 'Card',
  component: Card,
};

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A0',
};

storiesOf('Card', module)
  .add('Default', () => (
    <Card
      header={text('header', 'Card title')}
      footer={text('footer', 'Actionable buttons, whatever other stuff you want to pass in!')}
      elevation={number('elevation', 2, { range: true, min: 0, max: 5, step: 1 })}
    >
    {text(
      'children',
      'A Hello, World! program generally is a computer program that outputs or displays the message Hello, World!.',
    )}
    </Card>
  ), { design })
  .add('Themed', () => {
    const themeColors = {
      ...colors,
      background: 'beige',
      primary: 'purple',
    };

    const themeTimings = {
      ...timings,
      xSlow: '2s',
    };

    const ThemedContainer = styled.div`
      ${({ elevation = 0 }: { elevation: number }) => `
        border-radius: 1rem;
        width: fit-content;
        background-color: ${themeColors.background};
    
        transition: transform ${themeTimings.xSlow};
        transform: scale(${elevation * 0.05 + 1});
    
        font-family: Roboto, sans-serif;
        font-size: 1rem;
        border: 1px solid ${themeColors.primary};
      `}
    `;

    const ThemedHeader = styled(Header)`
      font-family: Parchment, serif;
      line-height: 0;
      font-size: 4rem;
      padding-top: 2.5rem;
      padding-left: .75rem;
      padding-bottom: 1rem;
      text-transform: unset;
      color: ${themeColors.primary};
    `;

    const ThemedFooter = styled(Footer)`
      border-top: 1px solid ${themeColors.primary};
    `;

    return (
      <Card
        StyledContainer={ThemedContainer}
        StyledHeader={ThemedHeader}
        StyledFooter={ThemedFooter}
        header={text('header', 'Card title')}
        footer={text('footer', 'Actionable buttons, whatever other stuff you want to pass in!')}
        elevation={number('elevation', 0, { range: true, min: 0, max: 5, step: 1 })}
      >
      {text('children', 'A Hello, World! program generally is a computer program that outputs or displays the message Hello, World!.')}
      </Card>
    );
  });
