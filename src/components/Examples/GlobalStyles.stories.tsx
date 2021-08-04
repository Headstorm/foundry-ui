import React from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FoundryProvider } from '../../context';
import Text from '../Text';
import Card from '../Card';
import Button from '../Button';
import colorsEnum from '../../enums/colors';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledTextContainer = styled(Text.Container)`
  margin-bottom: 1rem;
`;
const StyledCardContainer = styled(Card.Container)`
  margin-bottom: 1rem;
`;

interface ExampleProps {
  'font-family': string;
  primary: string;
  grayDark: string;
}

export const Example: Story<ExampleProps> = args => {
  const globalStyles = `
    font-family: ${args['font-family']};
  `;
  const colors = {
    primary: args.primary,
    grayDark: args.grayDark,
  };
  return (
    <FoundryProvider value={{ globalStyles, colors }}>
      <Container>
        <Text StyledContainer={StyledTextContainer}>Hello!</Text>
        <Card StyledContainer={StyledCardContainer} elevation={0} header="Title">
          These components all have a global set of styles applied to them through React's Context
          API.
        </Card>
        <Button onClick={action('click button')}>Example button</Button>
      </Container>
    </FoundryProvider>
  );
};
Example.args = {
  'font-family': 'Arial',
  primary: colorsEnum.primary,
  grayDark: colorsEnum.grayDark,
} as ExampleProps;

export default {
  title: 'Global styles',
  argTypes: {
    'font-family': {
      options: ['Arial', 'Times New Roman', 'Monospace', 'unset'],
      mapping: {
        Arial: 'Arial,Roboto,sans-serif',
        'Times New Roman': '"Times New Roman",Times,serif',
        Monospace: '"Lucida Console",Courier,monospace',
        unset: 'unset',
      },
      control: {
        type: 'radio',
      },
    },
  },
} as Meta;
