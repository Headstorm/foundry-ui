import React, { useState } from 'react';
import styled from 'styled-components';
import { number, boolean } from '@storybook/addon-knobs';
import RangeSlider from './RangeSlider';
import { useEffect } from '@storybook/addons';
import { darken } from 'polished';

const Row = styled.div`
  display: flex;
  font-family: Gotham, Roboto, sans-serif;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 5rem;
`;

export default {
  title: 'RangeSlider',
  component: RangeSlider
};

/* Default */

const skillLabels = ['WhatJS?', 'I\'ve used it...', 'I\'m proficient', 'I\'m very good with it', 'I dream in React', 'I am React'];

const Basic = () => {
  const storyValue = number('values', 0, {
    range: true,
    min: 0,
    max: 5,
    step: 1,
  });

  const [val, setVal] = useState(storyValue);

  useEffect(() => {
    setVal(storyValue);
  }, [storyValue]);

  return (
    <Row>
      <span>ReactJS:&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <RangeSlider
        disabled={boolean('disabled', false)}
        showDomainLabels={boolean('showDomainLabels', false)}
        showSelectedRange={boolean('showSelectedRange', true)}
        min={0}
        max={5}
        values={[
          {value: val, label: skillLabels[Math.round(val)], color: darken(0.2, '#61DAFB')}
        ]}
      />
    </ Row>
  );
};

Basic.design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2'
};

export { Basic };