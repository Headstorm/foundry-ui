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
import { mergeRefs } from '../../utils/refs';

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

export const RatingWrapper = styled(Span)`
  ${() => {
    return `
      display: inline-flex;
      -webkit-flex-direction: row-reverse; 
      flex-direction: row-reverse;
      font-size: 1em;
      border-radius: 0.25em;
      outline: 0 none;
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
    // color: ${fontColor};
  `;
  }}
`;

const HalfRankContainer = styled(Span)`
  ${() => {
    return `
    padding: 1rem 0.5rem;
  `;
  }}
`;

const HalfFilledRank = styled(Div)`
  ${({ color, variant, hasHalfFilledRank }) => {
    const { colors } = useTheme();
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);
    return `
    position: absolute;
    color: ${fontColor};
    ${hasHalfFilledRank || 'clip-path: polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%);'}
  `;
  }}
`;

const HalfUnfilledRank = styled(Div)`
  ${({ hasHalfFilledRank }) => {
    return `
    ${
      hasHalfFilledRank
        ? `content: none;`
        : `opacity: 50%;
        filter: saturate(0);
        clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);`
    }
  `;
  }}
`;

const EmptyRank = styled(Div)`
  ${({ color, variant, hasStages, ratingSelected, isHoverable = false }: EmptyRankProps) => {
    const { colors } = useTheme();
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
    padding: 1rem 0.5rem;
    ${
      hasStages
        ? `opacity: 50%;
       filter: saturate(0);
       ${
         !ratingSelected
           ? `&:hover,
       &:hover ~ div {
        opacity: 60%;
        filter: saturate(1);
       }`
           : ''
       }`
        : `opacity: 50%;
      filter: saturate(0);
      ${
        !ratingSelected && isHoverable
          ? `&:hover,
        &:hover ~ div {
          mix-blend-mode: multiply;
          color: ${fontColor};
          opacity: 100%;
          filter: saturate(1);
      }`
          : ''
      }`
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

export type RatingContainerProps = {
  elevation: number;
  color: string;
  variant: variants;
  disabled: boolean;
};

export type EmptyRankProps = {
  color: string;
  variant: variants;
  ratingSelected: boolean;
  hasStages: boolean;
  isHoverable: boolean;
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

  stages?: Array<JSX.Element | string>;
  fractionStep?: number;
  filledRank?: string | JSX.Element;
  halfFilledRank?: string | JSX.Element;
  emptyRank?: string | JSX.Element;
  showDisplay?: boolean;

  containerProps?: SubcomponentPropsType;
  filledRankProps?: SubcomponentPropsType;
  halfFilledRankProps?: SubcomponentPropsType;
  emptyRankProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLSpanElement>;

  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledFilledRankContainer?: string & StyledComponentBase<any, {}>;
  StyledHalfRankContainer?: string & StyledComponentBase<any, {}>;
  StyledEmptyRankContainer?: string & StyledComponentBase<any, {}>;
  StyledInfo?: string & StyledComponentBase<any, {}>;
};

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

  StyledContainer = Container,
  StyledFilledRankContainer = FilledRank,
  StyledHalfRankContainer = HalfRankContainer,
  StyledEmptyRankContainer = EmptyRank,
  StyledInfo = Info,

  containerProps = {},
  filledRankProps = {},
  halfFilledRankProps = {},
  emptyRankProps = {},

  containerRef,

  ...nativeHTMLAttributes
}: RatingProps): JSX.Element => {
  let filledRankItem = filledRank || mdiStar;
  let halfFilledRankItem = halfFilledRank || mdiStarHalfFull;
  let emptyRankItem = emptyRank || mdiStarOutline;
  if (!filledRankItem) {
    // If a filledRank is not provided use default items, regardless of halfFilledRank and emptyRank's existence.
    filledRankItem = mdiStar;
    halfFilledRankItem = mdiStarHalfFull;
    emptyRankItem = mdiStarOutline;
  } else if (filledRank && !emptyRank) {
    // If filledRank is provided, but emptyRank is not, use the filledRank for all, disregarding existing halfFillRank.
    filledRankItem = filledRank;
    halfFilledRankItem = filledRank;
    emptyRankItem = filledRank;
  } else if (filledRank && !halfFilledRank && emptyRank) {
    // Use emptyRank for missing halfFilledRank
    filledRankItem = filledRank;
    halfFilledRankItem = emptyRank;
    emptyRankItem = emptyRank;
  }

  const { colors } = useTheme();
  const containerColor = color || colors.grayLight;
  const hasStages = Boolean(stages);
  const containerInternalRef = useRef();
  const hasHalfFilledRank = Boolean((halfFilledRank && emptyRank) || !filledRank);
  const [rawRating, setRawRating] = useState(0);

  const processRating = (rating: number) => {
    const step = fractionStep <= 1 && fractionStep > 0 ? fractionStep : 1;
    const inv: number = 1.0 / step;
    const usingFractions = Boolean(fractionStep !== 1);
    const newVal = usingFractions ? Math.round(rating * inv) / inv : Math.ceil(rating);
    return newVal <= max ? newVal : max;
  };

  // ratingValue is the returned value of the Rating component
  const [ratingValue, setRatingValue] = useState(processRating(value));
  // preHoverRatingValue is a temporary storage for the last selected ratingValue while the user hovers over the rating,
  // if a rating is not selected before the hover ends, the Rating component's ratingValue is reset using the preHoverRatingValue.
  const [preHoverRatingValue, setPreHoverRatingValue] = useState(processRating(value));

  // isRatingSelected is used to disable hovering styles if a ratingValue is selected or if the component is disabled
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
        setRawRating(((event.clientX - rect.left) / rect.width) * max);
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
    const current: HTMLElement | null = containerInternalRef
      ? ((containerInternalRef.current as unknown) as HTMLElement)
      : null;
    if (current) {
      current.addEventListener('mousemove', ratingListener);
    }

    if (disabled) {
      setPreDisableRatingSelected(isRatingSelected);
      setRatingSelected(true);
    } else {
      setRatingSelected(preDisableRatingSelected);
      setRatingValue(processRating(value));
      setPreHoverRatingValue(processRating(value));
    }
    return () => {};
  }, [value, fractionStep, max, showDisplay, disabled]);

  function rankContent(item: JSX.Element | string): JSX.Element {
    if (typeof item === 'string') {
      return <UnstyledIcon path={item} size="2rem" />;
    }
    return item;
  }

  const ratings: JSX.Element[] = [];

  if (stages) {
    for (let x = stages.length; x > 0; x--) {
      if (x <= Math.floor(ratingValue)) {
        ratings.push(
          <StyledFilledRankContainer onClick={clickHandler} key={x} {...filledRankProps}>
            {rankContent(stages[x - 1])}
          </StyledFilledRankContainer>,
        );
      } else {
        ratings.push(
          <StyledEmptyRankContainer
            hasStages={hasStages}
            ratingSelected={isRatingSelected}
            onClick={clickHandler}
            key={x}
            {...emptyRankProps}
          >
            {rankContent(stages[x - 1])}
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
            {rankContent(filledRankItem)}
          </StyledFilledRankContainer>,
        );
      } else if (x - 1 === Math.floor(ratingValue) && x - 1 !== ratingValue) {
        ratings.push(
          <StyledHalfRankContainer key={x}>
            <HalfFilledRank
              onClick={clickHandler}
              hasHalfFilledRank={hasHalfFilledRank}
              {...halfFilledRankProps}
            >
              {rankContent(halfFilledRankItem)}
            </HalfFilledRank>
            <HalfUnfilledRank
              onClick={clickHandler}
              hasHalfFilledRank={hasHalfFilledRank}
              {...halfFilledRankProps}
            >
              {rankContent(halfFilledRankItem)}
            </HalfUnfilledRank>
          </StyledHalfRankContainer>,
        );
      } else {
        ratings.push(
          <StyledEmptyRankContainer
            onClick={clickHandler}
            ratingSelected={isRatingSelected}
            key={x}
            isHoverable={Boolean(rawRating - x > 0 && rawRating - x < fractionStep / 2)}
            {...emptyRankProps}
          >
            {rankContent(emptyRankItem)}
          </StyledEmptyRankContainer>,
        );
      }
    }
  }

  return (
    <StyledContainer
      disabled={disabled}
      data-test-id={['hs-ui-rating', testId].join('-')}
      {...mergedContainerProps}
      {...nativeHTMLAttributes}
    >
      <RatingWrapper
        onMouseLeave={mouseLeaveHandler}
        value={ratingValue}
        ref={mergeRefs([containerRef, containerInternalRef])}
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
Rating.HalfRankContainer = HalfRankContainer;
Rating.EmptyRankContainer = EmptyRank;
Rating.Info = Info;
export default Rating;
