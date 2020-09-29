import React, { useState, useEffect, useRef } from 'react';
import UnstyledIcon from '@mdi/react';
import {
  mdiStar,
  mdiStarHalfFull,
  mdiStarOutline,
  mdiLockCheck,
  mdiLockOpenVariantOutline,
} from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { useTheme } from '../../context';
import variants from '../../enums/variants';
import { Div, Span } from '../../htmlElements';
import {
  getFontColorFromVariant,
  getBackgroundColorFromVariant,
  disabledStyles,
} from '../../utils/color';
import { SubcomponentPropsType } from '../commonTypes';
import { getShadowStyle } from '../../utils/styles';

export type RatingContainerProps = {
  elevation: number;
  color: string;
  variant: variants;
  disabled: boolean;
};

export type RatingProps = {
  value?: number;
  max?: number;
  onClick: (...args: any[]) => void;
  disabled?: boolean;
  elevation?: number;
  variant?: variants;
  color?: string;
  id?: string;
  testId?: string;

  stages?: Array<string> | Array<JSX.Element>;
  fractionStep?: number;
  filledRank?: string | JSX.Element;
  halfFilledRank?: string | JSX.Element;
  emptyRank?: string | JSX.Element;
  showDisplay?: boolean;

  containerProps?: SubcomponentPropsType;
  filledRankProps?: SubcomponentPropsType;
  halfFilledRankProps?: SubcomponentPropsType;
  emptyRankProps?: SubcomponentPropsType;

  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledFilledRankContainer?: string & StyledComponentBase<any, {}>;
  StyledHalfFilledRankContainer?: string & StyledComponentBase<any, {}>;
  StyledEmptyRankContainer?: string & StyledComponentBase<any, {}>;
  StyledInfo?: string & StyledComponentBase<any, {}>;
};

export const Container: string & StyledComponentBase<any, {}, RatingContainerProps> = styled(Span)`
  ${({ elevation = 0, color, variant, disabled }: RatingContainerProps) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
      font-size: 1em;
      border-radius: 0.25em;
      ${getShadowStyle(elevation, colors.shadow)}
      outline: 0 none;
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark};` : '0 none;'}
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
      ${disabled ? disabledStyles() : ''}
    `;
  }}
`;

export const RatingWrapper: string & StyledComponentBase<any, {}, RatingContainerProps> = styled(
  Span,
)`
  ${({ elevation = 0, color, variant }: RatingContainerProps) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
      display: inline-flex;
      -webkit-flex-direction: row-reverse; 
      flex-direction: row-reverse;
      font-size: 1em;
      border-radius: 0.25em;
      ${getShadowStyle(elevation, colors.shadow)}
      outline: 0 none;
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark};` : '0 none;'}
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
    `;
  }}
`;

const FilledRank = styled(Span)`
  ${({ color, variant }) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);
    return `
    padding: 1rem 0.5rem;
    background-color: ${backgroundColor};
    background-clip: text;
    color: ${fontColor};
  `;
  }}
`;

const HalfFilledRank = styled(Div)`
  ${({ color, variant, hasHalfFilledRank }) => {
    const { colors } = useTheme();
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);
    return `
    padding: 1rem 0.5rem;
    color: ${fontColor};
    ${hasHalfFilledRank || 'clip-path: polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%);'}
  `;
  }}
`;

const EmptyRank = styled(Div)`
  ${({ color, variant, hasStages, ratingSelected }) => {
    const { colors } = useTheme();
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
    padding: 1rem 0.5rem;
    ${
      hasStages
        ? `opacity: 50%;
       filter: saturate(0);
       ${!ratingSelected &&
         `&:hover,
       &:hover ~ div {
        opacity: 60%;
        filter: saturate(1);
       }`}`
        : `opacity: 50%;
      filter: saturate(0);
      ${!ratingSelected &&
        `&:hover,
      &:hover ~ div {
        mix-blend-mode: multiply;
       color: ${fontColor};
       opacity: 100%;
       filter: saturate(1);
      }`}`
    }
  `;
  }}
`;

const Info = styled(Div)`
  ${() => {
    return `
    position: relative;  
    text-align: right;  
    vertical-align: bottom;
    align-items: center;
    top: -1.3rem;        
    opacity: 60%;
    padding: 0px 1px;
  `;
  }}
`;

const Rating = ({
  value = 1,
  max = 5,
  onClick,
  disabled = false,
  color,
  id,
  testId,
  elevation,
  variant = variants.fill,

  stages,
  fractionStep = 1,
  filledRank,
  halfFilledRank,
  emptyRank,
  showDisplay = false,

  containerProps = {},
  filledRankProps = {},
  halfFilledRankProps = {},
  emptyRankProps = {},

  StyledContainer = Container,
  StyledFilledRankContainer = FilledRank,
  StyledHalfFilledRankContainer = HalfFilledRank,
  StyledEmptyRankContainer = EmptyRank,
  StyledInfo = Info,
}: RatingProps): JSX.Element => {
  const filledRankItem = filledRank || mdiStar;
  const emptyRankItem = emptyRank || filledRank || mdiStarOutline;
  const halfFilledRankItem = halfFilledRank || emptyRank || mdiStarHalfFull;

  const { colors } = useTheme();
  const containerColor = color || colors.grayLight;
  const hasStages = Boolean(stages);
  const containerRef = useRef();
  const hasHalfFilledRank = Boolean((halfFilledRank && emptyRank) || !filledRank);

  const processRating = (rating: number) => {
    const step = fractionStep <= 1 && fractionStep > 0 ? fractionStep : 1;
    const inv: number = 1.0 / step;
    const usingFractions = Boolean(fractionStep !== 1);
    const newVal = usingFractions ? Math.round(rating * inv) / inv : Math.ceil(rating);
    return newVal <= max ? newVal : max;
  };

  const [initialValue, setInitialValue] = useState(value);
  const [ratingValue, setRatingValue] = useState(processRating(value));
  const [preHoverRatingValue, setPreHoverRatingValue] = useState(processRating(value));

  const [isRatingSelected, _setRatingSelected] = useState(false);
  const isRatingSelectedRef = useRef(isRatingSelected);
  const setRatingSelected = (v: boolean) => {
    isRatingSelectedRef.current = v;
    _setRatingSelected(v);
  };
  const [preDisableRatingSelected, setPreDisableRatingSelected] = useState(disabled);

  const ratingListener = (ev: React.MouseEvent | Event) => {
    if (ev && ev.currentTarget) {
      const event = ev as React.MouseEvent;
      const node = event.currentTarget as HTMLElement;
      const rect = node.getBoundingClientRect();
      if (!isRatingSelectedRef.current) {
        setRatingValue(processRating(((event.clientX - rect.left) / rect.width) * max));
      }
    }
  };
  // get everything we expose + anything consumer wants to send to container
  const mergedContainerProps = {
    id,
    elevation,
    color: containerColor,
    variant,
    ...containerProps,
  };

  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreHoverRatingValue(ratingValue);
    setRatingSelected(!isRatingSelected);
    onClick(ratingValue);
  };

  const mouseLeaveHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setRatingValue(preHoverRatingValue);
  };

  useEffect(() => {
    const current: HTMLElement | null = containerRef
      ? ((containerRef.current as unknown) as HTMLElement)
      : null;
    if (current) {
      current.addEventListener('mousemove', ratingListener);
    }

    if (value !== initialValue && !disabled) {
      setRatingValue(processRating(value));
      setPreHoverRatingValue(processRating(value));
      setInitialValue(processRating(value));
    }

    if (disabled) {
      setPreDisableRatingSelected(isRatingSelected);
      setRatingSelected(true);
    } else {
      setRatingSelected(preDisableRatingSelected);
    }
    return () => {};
  }, [value, fractionStep, max, showDisplay, disabled]);

  const ratings: Array<JSX.Element> = [];

  if (stages) {
    for (let x = stages.length; x > 0; x--) {
      if (x <= Math.floor(ratingValue)) {
        ratings.push(
          <StyledFilledRankContainer onClick={clickHandler} id={x} key={x} {...filledRankProps}>
            {typeof stages[x] === 'string' && stages[x - 1] !== '' ? (
              <UnstyledIcon path={stages[x - 1] as string} size="2rem" />
            ) : (
              stages[x - 1]
            )}
          </StyledFilledRankContainer>,
        );
      } else {
        ratings.push(
          <StyledEmptyRankContainer
            hasStages={hasStages}
            ratingSelected={isRatingSelected}
            onClick={clickHandler}
            id={x}
            key={x}
            {...emptyRankProps}
          >
            {typeof stages[x] === 'string' && stages[x - 1] !== '' ? (
              <UnstyledIcon path={stages[x - 1] as string} size="2rem" />
            ) : (
              stages[x - 1]
            )}
          </StyledEmptyRankContainer>,
        );
      }
    }
  } else {
    // No rating stages. Use filled, halfFilled, and empty ratings
    for (let x = max; x > 0; x--) {
      if (x <= Math.round(ratingValue - 0.01)) {
        ratings.push(
          <StyledFilledRankContainer onClick={clickHandler} id={x} key={x} {...filledRankProps}>
            {typeof filledRankItem === 'string' && filledRankItem !== '' ? (
              <UnstyledIcon path={filledRankItem} size="2rem" />
            ) : (
              filledRankItem
            )}
          </StyledFilledRankContainer>,
        );
      } else if (x - 1 === Math.floor(ratingValue) && x - 1 !== ratingValue) {
        ratings.push(
          <StyledHalfFilledRankContainer
            onClick={clickHandler}
            hasHalfFilledRank={hasHalfFilledRank}
            id={x}
            key={x}
            {...halfFilledRankProps}
          >
            {typeof halfFilledRankItem === 'string' && halfFilledRankItem !== '' ? (
              <UnstyledIcon path={halfFilledRankItem} size="2rem" />
            ) : (
              halfFilledRankItem
            )}
          </StyledHalfFilledRankContainer>,
        );
      } else {
        ratings.push(
          <StyledEmptyRankContainer
            onClick={clickHandler}
            ratingSelected={isRatingSelected}
            id={x}
            key={x}
            {...emptyRankProps}
          >
            {typeof emptyRankItem === 'string' && emptyRankItem !== '' ? (
              <UnstyledIcon path={emptyRankItem} size="2rem" />
            ) : (
              emptyRankItem
            )}
          </StyledEmptyRankContainer>,
        );
      }
    }
  }

  return (
    <StyledContainer disabled={disabled} data-test-id={['hs-ui-rating', testId].join('-')}>
      <RatingWrapper
        onMouseLeave={mouseLeaveHandler}
        value={ratingValue}
        {...mergedContainerProps}
        ref={containerRef}
      >
        {ratings.map(ratingItem => ratingItem)}
      </RatingWrapper>
      {showDisplay && (
        <StyledInfo>
          <span style={{ marginRight: '2px', verticalAlign: 'middle' }}>{ratingValue}</span>
          <span>
            {isRatingSelectedRef.current ? (
              <UnstyledIcon style={{ verticalAlign: 'middle' }} path={mdiLockCheck} size="1rem" />
            ) : (
              <UnstyledIcon
                style={{ verticalAlign: 'middle' }}
                path={mdiLockOpenVariantOutline}
                size="1rem"
              />
            )}
          </span>{' '}
        </StyledInfo>
      )}
    </StyledContainer>
  );
};

Rating.Container = Container;
Rating.FilledRankContainer = FilledRank;
Rating.HalfFilledRankContainer = HalfFilledRank;
Rating.EmptyRankContainer = EmptyRank;
Rating.Info = Info;
export default Rating;
