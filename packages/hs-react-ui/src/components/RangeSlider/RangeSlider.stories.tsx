import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, number, boolean } from '@storybook/addon-knobs';
import { readableColor, toColorString } from 'polished';

import colors from '../../constants/colors';
import RangeSlider, { SlideRail } from './RangeSlider';
import Card, { NoPaddingHeader } from '../Card/Card';

const Row = styled.div`
  display: flex;
  font-family: Gotham, Roboto, sans-serif;
  flex-flow: row nowrap;
  align-items: center;
  padding: .5rem;
  min-width: 20rem;
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
        motionBlur={boolean('motionBlur', false)}
        springOnRelease={boolean('springOnRelease', true)}
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
        onDrag={(val: number) => {
          setVal(Math.round(val));
          action('onDrag')(val);
        }}
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
  border: .5px solid ${colors.grayLight};
  height: .5rem;
  border-radius: .25rem;
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
        showSelectedRange={boolean('showSelectedRange', false)}
        motionBlur={boolean('motionBlur', false)}
        springOnRelease={boolean('springOnRelease', true)}
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
        onDrag={(val: number) => {
          setVal(Math.round(val));
          action('onDrag')(val);
        }}
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

const ColorPreview = styled.div`
  height: 12rem;
  width: 34rem;
  transition: color .5s;
  font-size: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-family: Gotham, Roboto, sans-serif;
  font-weight: bold;
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

  const allHues   = Array.from({length: 360}, (_, i) => i).map(num => `hsl(${num}, ${sat}%, ${light}%)`);
  const allSats   = [`hsl(${hue}, 0%, ${light}%)`, `hsl(${hue}, 100%, ${light}%`];
  const allLights = [`hsl(${hue}, ${sat}%, 10%)`, `hsl(${hue}, ${sat}%, 90%)`];

  return (
    <Card
      elevation={2}
      StyledHeader={NoPaddingHeader}
      header={(<ColorPreview
        style={{
          backgroundColor: `hsl(${hue},${sat}%,${light}%)`,
          color: readableColor(`hsl(${hue},${sat}%,${light}%)`)
        }}>
        {toColorString({
          hue: hue,
          saturation: sat/100,
          lightness: light/100
        })}
      </ColorPreview>)}
    >
      <Row>
        <span>H:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={forwardRef((props, ref) => <SlideRail ref={ref} {...props} style={{
            backgroundImage: `linear-gradient(to right, ${allHues.join(', ')})`
          }} />)}
          disabled={boolean('disabled', false)}
          showDomainLabels={boolean('showDomainLabels', false)}
          showSelectedRange={false}
          motionBlur
          min={0}
          max={360}
          onDrag={(val: number) => {
            setHue(Math.round(val));
            action('onDrag hue')(val);
          }}
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
        <span>S:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={forwardRef((props, ref) => <SlideRail ref={ref} {...props} style={{
            backgroundImage: `linear-gradient(to right, ${allSats.join(', ')})`
          }} />)}
          min={0}
          max={100}
          onDrag={(val: number) => {
            setSat(Math.round(val));
            action('onDrag saturation')(val);
          }}
          showDomainLabels={false}
          showSelectedRange={false}
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
      <span>L:&nbsp;&nbsp;&nbsp;</span>
      <RangeSlider
        StyledSlideRail={forwardRef((props, ref) => <SlideRail ref={ref} {...props} style={{
          backgroundImage: `linear-gradient(to right, ${allLights.join(', ')})`
        }} />)}
        min={0}
        max={100}
        onDrag={(val: number) => {
          setLight(Math.round(val));
          action('onDrag light')(val);
        }}
        showDomainLabels={false}
        showSelectedRange={false}
        values={[
          {
            value: light,
            label: light,
            color: colors.grayLight
          }
        ]}
      />
    </ Row>
  </Card>
  );
};

export { Default, Rating, ColorPicker };