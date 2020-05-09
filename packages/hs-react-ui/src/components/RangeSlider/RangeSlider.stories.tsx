import React from 'react';
import styled from 'styled-components';
import { text, boolean } from '@storybook/addon-knobs';
import RangeSlider from './RangeSlider';

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 5rem;
`;

export default {
  title: 'RangeSlider',
  component: RangeSlider
};

/* Default */

const Basic = () => (
  <Row>
    <span>ReactJS:&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <RangeSlider
      disabled={boolean('disabled', false)}
      showDomainLabels={boolean('showDomainLabels', false)}
      showSelectedRange={boolean('showSelectedRange', true)}
      min={0}
      max={5}
      values={[
        { value: 1, label: text('1st handle label', 'first') },
        { value: 3, label: text('2nd handle label', 'second') },
        { value: 4, label: text('3rd handle label', 'third') }
      ]}
    />
  </ Row>
);

Basic.design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2'
};

export { Basic };