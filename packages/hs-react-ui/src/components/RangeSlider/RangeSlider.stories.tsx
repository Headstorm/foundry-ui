import React, { useState, useEffect, forwardRef } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, number, boolean } from '@storybook/addon-knobs';
import { readableColor, toColorString } from 'polished';

import fonts from '../../enums/fonts';
import colors from '../../enums/colors';
import RangeSlider, { SlideRail } from './RangeSlider';
import Card from '../Card';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2',
};

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

storiesOf('RangeSlider', module)
  .addParameters({ component: RangeSlider })
  .add(
    'Default',
    () => {
      const [val, setVal] = useState(1);

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
            onDrag={(newVal: number) => {
              setVal(Math.round(newVal));
              action('onDrag')(newVal);
            }}
            axisLock={select('axisLock', ['x', 'y', ''], 'x')}
            values={[
              {
                value: val,
                label: val,
              },
            ]}
          />
        </Row>
      );
    },
    { design, centered: true },
  )
  .add(
    'Rating',
    () => {
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
            onDrag={(newVal: number) => {
              setVal(Math.round(newVal));
              action('onDrag')(newVal);
            }}
            axisLock={select('axisLock', ['x', 'y', ''], 'x')}
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
    },
    { design, centered: true },
  )
  .add(
    'Color Picker',
    () => {
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
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  ref={ref}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                  style={{
                    backgroundImage: `linear-gradient(to right, ${allHues.join(', ')})`,
                  }}
                />
              ))}
              disabled={boolean('disabled', false)}
              showDomainLabels={boolean('showDomainLabels', false)}
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
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  ref={ref}
                  // eslint-disable-next-line react/jsx-props-no-spreading
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
    },
    { design, centered: true },
  );
