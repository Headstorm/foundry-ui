import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { FoundryProvider } from '../../index';
import { select } from '@storybook/addon-knobs';
import Text from '../Text';
import Card from '../Card';
import Button from '../Button';
import { action } from '@storybook/addon-actions';

const StyledTextContainer = styled(Text.Container)`
  margin-bottom: 1rem;
`;
const StyledCardContainer = styled(Card.Container)`
  margin-bottom: 1rem;
`;
const fontFamilyOptions = {
  Montserrat: 'Montserrat,Roboto,sans-serif',
  'Times New Roman': '"Times New Roman",Times,serif',
  Monospace: '"Lucida Console",Courier,monospace',
  unset: 'unset',
};
storiesOf('Global styles', module).add('Example', () => {
  const fontFamily = select(
    'font-family',
    ['Montserrat', 'Times New Roman', 'Monospace', 'unset'],
    'Montserrat',
  );
  const globalStyles = `
    font-family: ${fontFamilyOptions[fontFamily]};
  `;
  return (
    <FoundryProvider value={{ globalStyles }}>
      <Text StyledContainer={StyledTextContainer}>Hello!</Text>
      <Card StyledContainer={StyledCardContainer} header={'Title'}>
        These components all have a global set of styles applied to them through React's Context
        API.
      </Card>
      <Button onClick={action('click button')}>Example button</Button>
    </FoundryProvider>
  );
});
