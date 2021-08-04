import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { Story, Meta } from '@storybook/react';
import { readableColor, toColorString } from 'polished';

import fonts from '../../enums/fonts';
import colors from '../../enums/colors';
import RangeSlider, { SlideRail } from './RangeSlider';
import Card from '../Card';

const Row = styled.div`
  ${fonts.body}
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem;
  min-width: 20rem;
  width: 90%;
  margin: 0 auto;
`;

const ColorPreview = styled.div`
  ${fonts.body}

  height: 12rem;
  width: 34rem;
  transition: color 0.5s;
  font-size: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: 900;
`;

const skillLabels = [
  'WhatJS?',
  "I've used it...",
  "We're aight",
  'I love it',
  'I dream in React',
  'I am React',
];

const skillColors = ['red', 'orangered', 'orange', 'goldenrod', 'yellowgreen', 'forestgreen'];

const StyledSlideRail = styled(SlideRail)`
  filter: grayscale(0.5) brightness(1.3);
  border: 0.5px solid ${colors.grayLight};
  height: 0.5rem;
  border-radius: 0.25rem;
  background-image: linear-gradient(to right, ${skillColors.join(', ')});
`;

export const Default: Story = args => {
  const [val, setVal] = useState(args.value);

  useEffect(() => {
    setVal(args.value);
  }, [args.value]);

  const markersSelection = args.markers;
  const markerLabels = args['use marker labels'];
  const markersArray: any[] = [];
  if (markersSelection === 'all values') {
    for (let i = args.min; i <= args.max; i++) {
      markersArray.push(markerLabels ? { value: i, label: `${i}` } : i);
    }
  } else if (markersSelection === 'middle value') {
    const midpoint = (args.min + args.max) / 2;
    markersArray.push(markerLabels ? { value: midpoint, label: `${midpoint}` } : midpoint);
  }

  return (
    <Row>
      <RangeSlider
        disabled={args.disabled}
        showDomainLabels={args.showDomainLabels}
        showHandleLabels = {args.showHandleLabels}
        showSelectedRange={args.showSelectedRange}
        motionBlur={args.motionBlur}
        springOnRelease={args.springOnRelease}
        min={args.min}
        max={args.max}
        debounceInterval={args.debounceInterval}
        onDrag={(newVal: number) => {
          setVal(Math.round(newVal));
          action('onDrag')(newVal);
        }}
        axisLock={args.axisLock}
        values={[
          {
            value: val,
            label: val,
          },
        ]}
        markers={markersArray}
      />
    </Row>
  );
};
Default.args = {
  value: 1,
  min: 0,
  max: 5,
  markers: 'none',
  'use marker labels': false,
  disabled: false,
  showDomainLabels: false,
  showHandleLabels: true,
  showSelectedRange: true,
  motionBlur: false,
  springOnRelease: true,
  debounceInterval: 8,
  axisLock: 'x',
};

export const Rating: Story = args => {
  const [val, setVal] = useState(args.value);

  useEffect(() => {
    setVal(args.value);
  }, [args.value]);

  return (
    <Row>
      <span>ReactJS:&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <RangeSlider
        StyledSlideRail={StyledSlideRail}
        disabled={args.disabled}
        showDomainLabels={args.showDomainLabels}
        showSelectedRange={args.showSelectedRange}
        motionBlur={args.motionBlur}
        springOnRelease={args.springOnRelease}
        min={args.min}
        max={args.max}
        debounceInterval={args.debounceInterval}
        onDrag={(newVal: number) => {
          setVal(Math.round(newVal));
          action('onDrag')(newVal);
        }}
        axisLock={args.axisLock}
        values={[
          {
            value: val,
            label: skillLabels[Math.round(val)],
            color: skillColors[Math.round(val)],
          },
        ]}
      />
    </Row>
  );
};
Rating.args = {
  value: 0,
  disabled: false,
  showDomainLabels: false,
  showSelectedRange: false,
  motionBlur: false,
  springOnRelease: true,
  min: 0,
  max: 5,
  debounceInterval: 8,
  axisLock: 'x',
};

export const ColorPicker: Story = args => {
  const [hue, setHue] = useState(args.hue);
  const [sat, setSat] = useState(args.saturation);
  const [light, setLight] = useState(args.lightness);

  useEffect(() => {
    setHue(args.hue);
  }, [args.hue]);

  useEffect(() => {
    setSat(args.saturation);
  }, [args.saturation]);

  useEffect(() => {
    setLight(args.lightness);
  }, [args.lightness]);

  const allHues = Array.from({ length: 360 }, (_, i) => i).map(
    num => `hsl(${num}, ${sat}%, ${light}%)`,
  );
  const allSats = [`hsl(${hue}, 0%, ${light}%)`, `hsl(${hue}, 100%, ${light}%`];
  const allLights = [`hsl(${hue}, ${sat}%, 10%)`, `hsl(${hue}, ${sat}%, 90%)`];

  return (
    <Card
      elevation={2}
      StyledHeader={Card.NoPaddingHeader}
      header={
        <ColorPreview
          style={{
            backgroundColor: `hsl(${hue},${sat}%,${light}%)`,
            color: readableColor(`hsl(${hue},${sat}%,${light}%)`),
          }}
        >
          {toColorString({
            hue,
            saturation: sat / 100,
            lightness: light / 100,
          })}
        </ColorPreview>
      }
    >
      <Row>
        <span>H:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={forwardRef((props, ref) => (
            <SlideRail
              ref={ref as React.RefObject<HTMLDivElement>}
              {...props}
              style={{
                backgroundImage: `linear-gradient(to right, ${allHues.join(', ')})`,
              }}
            />
          ))}
          disabled={args.disabled}
          showDomainLabels={args.showDomainLabels}
          showSelectedRange={false}
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
              color: colors.grayLight,
            },
          ]}
        />
      </Row>
      <Row>
        <span>S:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={forwardRef((props, ref) => (
            <SlideRail
              ref={ref as React.RefObject<HTMLDivElement>}
              {...props}
              style={{
                backgroundImage: `linear-gradient(to right, ${allSats.join(', ')})`,
              }}
            />
          ))}
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
              color: colors.grayLight,
            },
          ]}
        />
      </Row>
      <Row>
        <span>L:&nbsp;&nbsp;&nbsp;</span>
        <RangeSlider
          StyledSlideRail={forwardRef((props, ref) => (
            <SlideRail
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref={ref}
              {...props}
              style={{
                backgroundImage: `linear-gradient(to right, ${allLights.join(', ')})`,
              }}
            />
          ))}
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
              color: colors.grayLight,
            },
          ]}
        />
      </Row>
    </Card>
  );
};
ColorPicker.args = {
  hue: 0,
  saturation: 50,
  lightness: 50,
  disabled: false,
  showDomainLabels: false,
};

export default {
  title: 'RangeSlider',
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 5,
        step: 1,
      },
    },
    min: {
      control: { type: 'range', min: -10, max: 10, step: 1 },
    },
    max: {
      control: {
        type: 'range',
        min: -10,
        max: 10,
        step: 1,
      },
    },
    debounceInterval: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    axisLock: {
      options: ['x', 'y', ''],
      control: {
        type: 'select',
      },
    },
    markers: {
      options: ['none', 'all values', 'middle value'],
      control: {
        type: 'radio',
      },
    },
    hue: {
      control: {
        type: 'range',
        min: 0,
        max: 360,
        step: 1,
      },
    },
    saturation: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    lightness: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2',
    },
  },
} as Meta;
