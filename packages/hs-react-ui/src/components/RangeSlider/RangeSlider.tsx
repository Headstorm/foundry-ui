import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { useSpring, a } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import useMeasure from 'react-use-measure';
import polyfill from '@juggle/resize-observer';

import fonts from '../../enums/fonts';
import colors from '../../enums/colors';
import { clamp } from '../../utils/math';

import {
  valueProp,
  containerProps,
  handleProps,
  handleLabelProps,
  RangeSliderProps,
  selectedRangeProps,
  domainLabelProps,
} from './types';

export const Container = styled.div`
  ${({ showDomainLabels, hasHandleLabels, disabled, beingDragged = false }: containerProps) => `
    position: relative;
    height: 1rem;
    width: 100%;

    ${fonts.body}

    user-select: none;

    ${beingDragged ? 'cursor: grabbing;' : ''}

    transition: filter .1s;

    ${
      disabled
        ? `
      filter: grayscale(1) contrast(.5) brightness(1.2);
      pointer-events: none;
    `
        : ''
    }

    ${
      showDomainLabels
        ? `
        top: -.5rem;
        margin-top: 1rem;
      `
        : ''
    };

      ${
        hasHandleLabels
          ? `
        top: -.75rem;
        margin-top: 1.5rem;
      `
          : ''
      };
  `}
`;

export const DragHandle = styled(a.div)`
  ${({ beingDragged = false, color = colors.primary }: handleProps) => `
    position: absolute;
    bottom: -.125rem;
    left: -.5rem;

    width: 1rem;
    height: 1rem;

    background-color: ${color};
    color: ${color};
    border: .125rem solid ${colors.background};
    border-radius: 50%;

    filter: url(#blur);

    cursor: ${beingDragged ? 'grabbing' : 'grab'};
  `}
`;

export const HandleLabel = styled.div`
  ${({ velocity = 0 }: handleLabelProps) => `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) rotate(${clamp(velocity, -45, 45)}deg);

      background-color: ${colors.background};
      border-radius: 4px;
      font-weight: bold;
      white-space: nowrap;

      pointer-events: none;
  `}
`;

export const SlideRail = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 100%;
  height: 0.25rem;

  overflow: hidden;

  border-radius: 0.125rem;
  background-color: ${colors.grayXlight};
`;

export const SelectedRangeRail = styled.div`
  ${({ min, max, selectedRange }: selectedRangeProps) => `
    position: absolute;
    top: 0%;
    height: 100%;
    left: ${((selectedRange[0] - min) / (max - min)) * 100}%;
    right: ${((max - selectedRange[1]) / (max - min)) * 100}%;

    transition: left .3s, right .3s;

    background-color: ${colors.primary};
  `}
`;

export const DomainLabel = styled.div`
  ${({ position }: domainLabelProps) => `
    position: absolute;
    bottom: 100%;
    ${position}: 0rem;
    color: ${colors.grayMedium};
    font-size: .5rem;
  `}
`;

export default ({
  StyledContainer = Container,
  StyledDragHandle = DragHandle,
  StyledHandleLabel = HandleLabel,
  StyledSlideRail = SlideRail,
  StyledSelectedRangeRail = SelectedRangeRail,
  StyledDomainLabel = DomainLabel,

  showDomainLabels = true,
  showSelectedRange = true,

  motionBlur = false,
  springOnRelease = true,

  debounceInterval = 8,
  axisLock = 'x',
  onDrag = (newVal: number) => {
    console.log(newVal);
  },
  disabled = false,
  min,
  max,
  values,
}: RangeSliderProps) => {
  let hasHandleLabels = false;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This expression is not callable.
  const processedValues = values.map((val: number | valueProp) => {
    if (typeof val === 'number') {
      return { value: val, label: null };
    }
    if (Object.prototype.hasOwnProperty.call(val, 'label')) {
      hasHandleLabels = true;
    }
    return val;
  });
  const selectedRange = [
    Math.min(
      ...processedValues.map((val: valueProp) => val.value),
      showSelectedRange && values && values.length === 1 ? min : Infinity,
    ),
    Math.max(...processedValues.map((val: valueProp) => val.value)),
  ];

  const domain = max - min;

  // set the drag value asynchronously at a lower frequency for better performance
  const valueBuffer = useRef(0);
  const debouncedDrag = debounce(() => onDrag(valueBuffer.current), debounceInterval);
  const blurRef = useRef(null);

  // keep track of which handle is being dragged (if any)
  const [draggedHandle, setDraggedHandle] = useState(-1);
  // get the bounding box of the slider
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [ref, sliderBounds] = useMeasure({ polyfill });
  const pixelPositions = processedValues.map(
    (val: valueProp) => (val.value / domain) * sliderBounds.width,
  );
  // get the x offset and an animation setter function
  const [{ x = pixelPositions[0], y }, set] = useSpring(
    () => ({ x: pixelPositions[0], y: 0, config: { friction: 13, tension: 100 } }),
    [values],
  );
  const bind = useDrag(
    ({ active, down, movement: [deltaX, deltaY], vxvy: [vx] }) => {
      const delta = (deltaX / sliderBounds.width) * domain;
      valueBuffer.current = clamp(delta, min, max);
      if (motionBlur) {
        requestAnimationFrame(() => {
          const blurSize = Math.round(Math.abs(vx * 10)) || 0;
          if (blurRef.current === null) {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore ts(2531)
          blurRef.current.setAttribute('stdDeviation', `${down && active ? blurSize : 0}, 0`);
        });
      }

      setDraggedHandle(down ? 0 : -1);
      debouncedDrag();
      set({
        x: down ? deltaX : pixelPositions[0],
        y: down ? deltaY : 0,

        immediate: springOnRelease ? down : true,
        config: { friction: 13, tension: 100 },
      });
    },
    {
      axis: axisLock,
      initial: [pixelPositions[0], 0],
      threshold: 1,
      bounds: {
        left: 0,
        right: sliderBounds.width + 4,
        top: -8,
        bottom: sliderBounds.height / 2 + 8,
      },
      rubberband: 0.1,
    },
  );

  return (
    <StyledContainer
      disabled={disabled}
      hasHandleLabels={hasHandleLabels}
      showDomainLabels={showDomainLabels}
    >
      <StyledSlideRail ref={ref}>
        {showSelectedRange && (
          <StyledSelectedRangeRail
            min={min}
            max={max}
            values={processedValues}
            selectedRange={selectedRange}
          />
        )}
      </StyledSlideRail>

      {showDomainLabels && (
        <>
          <StyledDomainLabel position="left">{min}</StyledDomainLabel>
          <StyledDomainLabel position="right">{max}</StyledDomainLabel>
        </>
      )}

      {processedValues.map(({ value, label, color }: valueProp, i: number) => (
        <StyledDragHandle
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bind()}
          draggable={false}
          beingDragged={i === draggedHandle}
          style={{ x, y }}
          color={color}
          key={`handle${i}`}
        >
          <StyledHandleLabel value={value}>{label}</StyledHandleLabel>
        </StyledDragHandle>
      ))}

      {motionBlur && (
        <svg viewBox="-200 -100 200 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="blur">
              <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0,0" />
            </filter>
          </defs>
        </svg>
      )}
    </StyledContainer>
  );
};
