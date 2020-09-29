/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, color, number, select } from '@storybook/addon-knobs';
import * as Icons from '@mdi/js';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Rating from './Rating';
import colors from '../../enums/colors';
import variants from '../../enums/variants';
import { Span } from '../../htmlElements';

const StyledSpan = styled(Span)`
  font-size: 2rem;
`;

const options = {
  none: '',
  anvil: Icons.mdiAnvil,
  heart: Icons.mdiHeart,
  shield: Icons.mdiShield,
  circle: Icons.mdiCircle,
  crown: Icons.mdiCrown,
  cupCake: Icons.mdiCupcake,
  hamburger: Icons.mdiHamburger,
  mushroom: Icons.mdiMushroom,
  pig: Icons.mdiPigVariant,
  sofa: Icons.mdiSofa,
};

const halfOptions = {
  none: '',
  heart: Icons.mdiHeartHalfFull,
  star: Icons.mdiStarHalfFull,
  shield: Icons.mdiShieldHalfFull,
  circle: Icons.mdiCircleHalfFull,
};

const emptyOptions = {
  none: '',
  heart: Icons.mdiHeartOutline,
  star: Icons.mdiStarOutline,
  shield: Icons.mdiShieldOutline,
  circle: Icons.mdiCircleOutline,
  sofaOutline: Icons.mdiSofaOutline,
};

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
          filledRank={select('filledRank', options, '')}
          halfFilledRank={select('halfFilledRank', halfOptions, '')}
          emptyRank={select('emptyRank', emptyOptions, '')}
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
        <StyledSpan role="img" aria-label="mad-rating">
          😡
        </StyledSpan>,
        <StyledSpan role="img" aria-label="not-happy-rating">
          😞
        </StyledSpan>,
        <StyledSpan role="img" aria-label="meh-rating">
          😑
        </StyledSpan>,
        <StyledSpan role="img" aria-label="glad-rating">
          😁
        </StyledSpan>,
        <StyledSpan role="img" aria-label="geeked-out-rating">
          🤓
        </StyledSpan>,
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
