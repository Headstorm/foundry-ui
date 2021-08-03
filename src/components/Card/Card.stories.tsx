import React from 'react';
import styled from 'styled-components';

import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Card, { Header, Footer } from './Card';
import colors from '../../enums/colors';
import timings from '../../enums/timings';
import fonts from '../../enums/fonts';
import feedbackTypes from '../../enums/feedbackTypes';

const Template: Story = args => {
  return <Card {...args} disableFeedback={true} />;
};

export const Default = Template.bind({});
Default.args = {
  header: 'Card title',
  footer: 'Actionable buttons, whatever other stuff you want to pass in!',
  elevation: 2,
  feedbackType: feedbackTypes.ripple,
  disableFeedback: false,
  children:
    'A Hello, World! program generally is a computer program that outputs or displays the message Hello, World!.',
};

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

      ${fonts.body}
      font-size: 1rem;
      border: 1px solid ${themeColors.primary};
    `}
`;

const ThemedHeader = styled(Header)`
  font-family: Parchment, serif;
  line-height: 0;
  font-size: 4rem;
  padding-top: 2.5rem;
  padding-left: 0.75rem;
  padding-bottom: 1rem;
  text-transform: unset;
  color: ${themeColors.primary};
`;

const ThemedFooter = styled(Footer)`
  border-top: 1px solid ${themeColors.primary};
`;

export const Themed = Template.bind({});
Themed.args = {
  ...Default.args,
  elevation: 0,
  StyledContainer: ThemedContainer,
  StyledHeader: ThemedHeader,
  StyledFooter: ThemedFooter,
};

const cardContainerRef = React.createRef<HTMLDivElement>();
const cardHeaderRef = React.createRef<HTMLDivElement>();
const cardBodyRef = React.createRef<HTMLDivElement>();
const cardFooterRef = React.createRef<HTMLDivElement>();
const interactiveFeedbackRef = React.createRef<HTMLDivElement>();
const onClick = (e: React.SyntheticEvent) => {
  e.preventDefault();
  action('onClick')(
    `container width x height: ${cardContainerRef.current?.clientWidth} x ${cardContainerRef.current?.clientHeight}
    header width x height: ${cardHeaderRef.current?.clientWidth} x ${cardHeaderRef.current?.clientHeight}
    body width x height: ${cardBodyRef.current?.clientWidth} x ${cardBodyRef.current?.clientHeight}
    footer width x height: ${cardFooterRef.current?.clientWidth} x ${cardFooterRef.current?.clientHeight}
    interactive width x height: ${interactiveFeedbackRef.current?.clientWidth} x ${interactiveFeedbackRef.current?.clientHeight}`,
  );
};

export const Ref = Template.bind({});
Ref.args = {
  ...Default.args,
  header: 'View the Actions tab below',
  footer:
    'Try adjusting the width of the viewport. New clicks will return the updated dimensions for each element.',
  onClick: onClick,
  containerRef: cardContainerRef,
  headerRef: cardHeaderRef,
  bodyRef: cardBodyRef,
  footerRef: cardFooterRef,
  interactiveFeedbackRef: interactiveFeedbackRef,
  children:
    'Then click anywhere on the Card to see the width/height of the child elements calculated via the Ref props!',
};

export default {
  title: 'Card',
  component: Card,
  argTypes: {
    elevation: { control: { type: 'range', min: -5, max: 5, step: 1 } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A0',
    },
  },
} as Meta;
