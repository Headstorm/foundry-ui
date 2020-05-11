import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { select, number, boolean } from '@storybook/addon-knobs';
import RangeSlider, { SlideRail } from './RangeSlider';
import colors from '../../constants/colors';

const Row = styled.div`
  display: flex;
  font-family: Gotham, Roboto, sans-serif;
  flex-flow: row nowrap;
  align-items: center;
  padding: .5rem;
  max-width: 20rem;
  width: 90%;
  margin: 0 auto;
`;

export default {
  title: 'RangeSlider',
  component: RangeSlider
};

/* Default */

const Default = () => {
  const [val, setVal] = useState(0);

  const storyValue = number('values', val, {
    range: true,
    min: 0,
    max: 5,
    step: 1,
  });

  useEffect(() => {
    setVal(storyValue);
  }, [storyValue]);

  return (
    <Row>
      <RangeSlider
        disabled={boolean('disabled', false)}
        showDomainLabels={boolean('showDomainLabels', false)}
        showSelectedRange={boolean('showSelectedRange', true)}
        min={number('min', 0, {
          range: true,
          min: -10,
          max: 10,
          step: 1,
        })}
        max={number('max', 5, {
          range: true,
          min: -10,
          max: 10,
          step: 1,
        })}
        debounceInterval={number('debounceInterval', 8, {
          range: true,
          min: 0,
          max: 100,
          step: 1,
        })}
        onDrag={(val: number) => setVal(Math.round(val))}
        axisLock={select('axisLock', ['x', 'y', null], 'x')}
        values={[
          {
            value: val,
            label: val
          }
        ]}
      />
    </ Row>
  );
};

Default.design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2'
};


/* Rating */

const skillLabels = ['WhatJS?', 'I\'ve used it...', 'We\'re aight', 'I love it', 'I dream in React', 'I am React'];
const skillColors = ['red', 'orangered', 'orange', 'goldenrod', 'yellowgreen', 'forestgreen'];

const StyledSlideRail = styled(SlideRail)`
  filter: grayscale(0.5) brightness(1.3);
  border: .5px solid ${colors.grayMedium};
  background-image: linear-gradient(to right, ${skillColors.join(', ')});
`;

const Rating = () => {
  const [val, setVal] = useState(0);

  const storyValue = number('values', val, {
    range: true,
    min: 0,
    max: 5,
    step: 1,
  });

  useEffect(() => {
    setVal(storyValue);
  }, [storyValue]);

  return (
    <Row>
      <span>ReactJS:&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <RangeSlider
        StyledSlideRail={StyledSlideRail}
        disabled={boolean('disabled', false)}
        showDomainLabels={boolean('showDomainLabels', false)}
        showSelectedRange={boolean('showSelectedRange', true)}
        min={number('min', 0, {
          range: true,
          min: -10,
          max: 10,
          step: 1,
        })}
        max={number('max', 5, {
          range: true,
          min: -10,
          max: 10,
          step: 1,
        })}
        debounceInterval={number('debounceInterval', 8, {
          range: true,
          min: 0,
          max: 100,
          step: 1,
        })}
        onDrag={(val: number) => setVal(Math.round(val))}
        axisLock={select('axisLock', ['x', 'y', null], 'x')}
        values={[
          {
            value: val,
            label: skillLabels[Math.round(val)],
            color: skillColors[Math.round(val)]
          }
        ]}
      />
    </ Row>
  );
};

Rating.design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2'
};

/* Color Picker */

const allHues = Array.from({length: 256}, (v, i) => i).map(num => `hsl(${num},100%,50%)`);
const allSats = Array.from({length: 100}, (v, i) => i).map(num => `hsl(0,${num}%,50%)`);
const allLights = Array.from({length: 100}, (v, i) => i).map(num => `hsl(0,0%,${num}%)`);

const ColorPreview = styled.div`
  height: 9rem;
`;

const HueRail = styled(SlideRail)`
  background-image: linear-gradient(to right, ${allHues.join(', ')});
`;

const SatRail = styled(SlideRail)`
  background-image: linear-gradient(to right, ${allSats.join(', ')});
`;

const LightRail = styled(SlideRail)`
  background-image: linear-gradient(to right, ${allLights.join(', ')});
`;

const ColorPicker = () => {
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(50);
  const [light, setLight] = useState(50);

  const storyHue = number('hue', hue, {
    range: true,
    min: 0,
    max: 255,
    step: 1,
  });

  const storySat = number('saturation', sat, {
    range: true,
    min: 0,
    max: 99,
    step: 1,
  });

  const storyLight = number('lightness', light, {
    range: true,
    min: 0,
    max: 99,
    step: 1,
  });

  useEffect(() => {
    setHue(storyHue);
  }, [storyHue]);

  useEffect(() => {
    setSat(storySat);
  }, [storySat]);

  useEffect(() => {
    setLight(storyLight);
  }, [storyLight]);

  return (
    <>
      <ColorPreview style={{backgroundColor: `hsl(${hue},${sat}%,${light}%)`}} />
      <Row>
        <span>Hue:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={HueRail}
          disabled={boolean('disabled', false)}
          showDomainLabels={boolean('showDomainLabels', false)}
          showSelectedRange={boolean('showSelectedRange', true)}
          min={0}
          max={255}
          onDrag={(val: number) => setHue(Math.round(val))}
          values={[
            {
              value: hue,
              label: hue,
              color: colors.grayLight
            }
          ]}
        />
      </ Row>
      <Row>
        <span>Saturation:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={SatRail}
          min={0}
          max={99}
          onDrag={(val: number) => setSat(Math.round(val))}
          showDomainLabels={false}
          values={[
            {
              value: sat,
              label: sat,
              color: colors.grayLight
            }
          ]}
        />
      </ Row>
      <Row>
      <span>Lightness:&nbsp;&nbsp;&nbsp;</span>
      <RangeSlider
        StyledSlideRail={LightRail}
        min={0}
        max={99}
        onDrag={(val: number) => setLight(Math.round(val))}
        showDomainLabels={false}
        values={[
          {
            value: light,
            label: light,
            color: colors.grayLight
          }
        ]}
      />
    </ Row>
  </>
  );
};

export { Default, Rating, ColorPicker };