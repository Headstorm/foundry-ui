import React from 'react';
import styled from 'styled-components';
import { text, number } from '@storybook/addon-knobs';

import { colors } from 'src/enums/colors';
import { TimingTypes } from 'src/enums/TimingsTypes';
import Card, { Header, Footer } from './Card';

export default {
  title: 'Card',
  component: Card
};

/* Default */

export const Default = () => (
  <Card
    header={text('header', 'Card title')}
    footer={text('footer', 'Actionable buttons, whatever other stuff you want to pass in!')}
    elevation={number('elevation', 2, { range: true, min: 0, max: 5, step: 1 })}
  >
    {text('children', 'A Hello, World! program generally is a computer program that outputs or displays the message Hello, World!.')}
  </Card>
);

/* Themed */

const themeColors = {
  ...colors,
  background: 'beige',
  primary: 'purple'
};

const themeTimings = {
  ...TimingTypes ,
  xSlow: '2s',
}

const ThemedContainer = styled.div`
  ${({ elevation = 0 }: { elevation: number }) => `
    border-radius: 1rem;
    width: fit-content;
    background-color: ${themeColors.background};

    transition: transform ${themeTimings.xSlow};
    transform: scale(${elevation * .05 + 1});

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

export const ThemedCard = () => (
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