import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, color, number, select } from '@storybook/addon-knobs';
import { mdiSprout, mdiSproutOutline } from '@mdi/js';
import { storiesOf } from '@storybook/react';

import Rating from './Rating';
import colors from '../../enums/colors';
import variants from '../../enums/variants';

const components: Record<string, JSX.Element | string> = {
  none: '',
  sproutMdi: mdiSprout,
  sproutOutlineMdi: mdiSproutOutline,
  sproutSVG: (
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 1.1V3.3C21 5.34217 20.1849 7.30069 18.7339 8.74472C17.283 10.1888 15.3151 11 13.2632 11H12.1579V12.1H17.6842V19.8C17.6842 20.3835 17.4513 20.9431 17.0368 21.3556C16.6222 21.7682 16.06 22 15.4737 22H6.63158C6.04531 22 5.48305 21.7682 5.0685 21.3556C4.65395 20.9431 4.42105 20.3835 4.42105 19.8V12.1H9.94737V8.8C9.94737 6.75784 10.7625 4.79931 12.2134 3.35528C13.6644 1.91125 15.6323 1.1 17.6842 1.1H21ZM3.86842 2.70518e-06C5.19471 -0.00106684 6.50184 0.315025 7.67976 0.921664C8.85769 1.5283 9.87191 2.40773 10.6371 3.4859C9.46919 5.01334 8.83848 6.88063 8.8421 8.8V9.9H8.28947C6.09097 9.9 3.98251 9.03081 2.42793 7.48363C0.873353 5.93646 0 3.83804 0 1.65V2.70518e-06H3.86842Z"
        fill="#B4E727"
      />
    </svg>
  ),
  sproutOutlineSVG: (
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.42105 2.92073e-07C5.83113 -0.000386174 7.21449 0.382759 8.42166 1.10803C9.62882 1.8333 10.6139 2.87311 11.2704 4.1151C11.9336 3.18239 12.8121 2.42173 13.832 1.89707C14.8519 1.37241 15.9835 1.09906 17.1316 1.1H21V3.85C21 5.7463 20.2431 7.56493 18.8958 8.90581C17.5485 10.2467 15.7212 11 13.8158 11H12.1579V12.1H17.6842V19.8C17.6842 20.3835 17.4513 20.9431 17.0368 21.3556C16.6222 21.7682 16.06 22 15.4737 22H6.63158C6.04531 22 5.48305 21.7682 5.0685 21.3556C4.65395 20.9431 4.42105 20.3835 4.42105 19.8V12.1H9.94737V9.9H7.73684C5.6849 9.9 3.71701 9.08875 2.26607 7.64472C0.815129 6.20069 0 4.24217 0 2.2V2.92073e-07H4.42105ZM15.4737 14.3H6.63158V19.8H15.4737V14.3ZM18.7895 3.3H17.1316C15.8125 3.3 14.5474 3.82152 13.6147 4.74982C12.6819 5.67813 12.1579 6.93718 12.1579 8.25V8.8H13.8158C14.4689 8.8 15.1157 8.67197 15.7191 8.4232C16.3226 8.17444 16.8709 7.80983 17.3327 7.35018C17.7946 6.89053 18.1609 6.34485 18.4109 5.74428C18.6608 5.14372 18.7895 4.50004 18.7895 3.85V3.3ZM4.42105 2.2H2.21053C2.21053 3.65869 2.79276 5.05764 3.82915 6.08909C4.86553 7.12054 6.27117 7.7 7.73684 7.7H9.94737C9.94737 6.24131 9.36513 4.84236 8.32875 3.81091C7.29236 2.77946 5.88672 2.2 4.42105 2.2Z"
        fill="#D3D6D7"
      />
    </svg>
  ),
};

const options: Array<string> = [
  'none',
  'sproutMdi',
  'sproutOutlineMdi',
  'sproutSVG',
  'sproutOutlineSVG',
];

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=105%3A5',
};

storiesOf('Rating', module)
  .addParameters({ component: Rating })
  .add(
    'Basic Rating',
    () => {
      const [val, setVal] = useState(1);
      const stepValue = number('fractionStep', 0.5, {
        range: false,
        min: 0.25,
        max: 1,
        step: 0.25,
      });
      return (
        <Rating
          value={number('value', val)}
          max={number('max', 5)}
          fractionStep={stepValue}
          variant={select('variant', variants, variants.text)}
          color={color('color', 'rgba(244,184,24,1)')}
          onClick={(newVal: number) => {
            setVal(newVal);
            action('onClick')(newVal);
          }}
          disabled={boolean('disabled', false)}
          elevation={number('elevation', 0)}
          filledRank={components[select('filledRank', options, 'none')]}
          halfFilledRank={components[select('halfFilledRank', options, 'none')]}
          emptyRank={components[select('emptyRank', options, 'none')]}
          showDisplay={boolean('showDisplay', true)}
        />
      );
    },
    { design },
  )
  .add(
    'Stages Rating',
    () => {
      const [val, setVal] = useState(1);
      const stages = [
        <span style={{ fontSize: '2rem' }} role="img" aria-label="mad-rating">
          {' '}
          😡{' '}
        </span>,
        <span style={{ fontSize: '2rem' }} role="img" aria-label="not-happy-rating">
          {' '}
          😞{' '}
        </span>,
        <span style={{ fontSize: '2rem' }} role="img" aria-label="meh-rating">
          {' '}
          😑{' '}
        </span>,
        <span style={{ fontSize: '2rem' }} role="img" aria-label="glad-rating">
          {' '}
          😁{' '}
        </span>,
        <span style={{ fontSize: '2rem' }} role="img" aria-label="geeked-out-rating">
          {' '}
          🤓{' '}
        </span>,
      ];

      return (
        <Rating
          variant={select('variant', variants, variants.text)}
          color={color('color', colors.primaryDark)}
          onClick={(newVal: number) => {
            setVal(newVal);
            action('onClick')(newVal);
          }}
          stages={stages}
          disabled={boolean('disabled', false)}
          elevation={number('elevation', 1)}
          value={number('value', val)}
          showDisplay={boolean('showDisplay', true)}
        />
      );
    },
    { design },
  );
