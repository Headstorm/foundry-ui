import React, { useMemo } from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import { useSpring, a } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import useMeasure from 'react-use-measure';
import polyfill from '@juggle/resize-observer';

import colors from '../../constants/colors';
import { clamp } from '../../utils/math';

type valueProp = {
  value: number,
  label?: String | number | Node,
  color?: String
};

type containerPorps = { showDomainLabels?: boolean, hasHandleLabels?: boolean, disabled: boolean };
export const Container = styled.div`
  ${({ showDomainLabels, hasHandleLabels, disabled }: containerPorps) => `
    position: relative;
    height: 1rem;
    width: 100%;

    user-select: none;

    transition: filter .1s;

    ${disabled ? `
      filter: grayscale(1) contrast(.5) brightness(1.2);
      pointer-events: none;
    ` : ''}

    ${showDomainLabels ? `
        top: -.25rem;
        margin-top: .5rem;
      ` : ''};

      ${hasHandleLabels ? `
        top: -.5rem;
        margin-top: 1rem;
      ` : ''};
  `}
`;

type handleProps = {
  beingDragged?: boolean,
  velocity?: number,
  color: String
};
export const DragHandle = styled(a.div)`
  ${({
    beingDragged = false,
    color = colors.primary
  }: handleProps) => `
    position: absolute;
    bottom: -.125rem;
    left: -.5rem;

    width: 1rem;
    height: 1rem;

    background-color: ${color};
    color: ${color};
    border: .125rem solid ${colors.background};
    border-radius: 50%;

    cursor: grab;
  `}
`;

type handleLabelProps = {velocity?: number};
export const HandleLabel = styled.div`
  ${({ velocity = 0 }: handleLabelProps) => `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) rotate(${clamp(velocity, -45, 45)}deg);

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
  height: .5rem;

  overflow: hidden;

  border-radius: .25rem;
  background-color: ${colors.grayXlight};
`;

type selectedRangeProps = { min: number, max: number, values: object[], selectedRange: number[] };
export const SelectedRangeRail = styled.div`
  ${({ min, max, values, selectedRange }: selectedRangeProps) => `
    position: absolute;
    top: 0%;
    height: 100%;
    left: ${((selectedRange[0] - min) / (max - min)) * 100}%;
    right: ${((max - selectedRange[1]) / (max - min)) * 100}%;

    background-color: ${colors.primary};
  `}
`;

type domainLabelProps = { position: "left" | "right" };
export const DomainLabel = styled.div`
  ${({ position }: domainLabelProps) => `
    position: absolute;
    bottom: 100%;
    ${position}: 0rem;
    color: ${colors.grayMedium};
    font-size: .5rem;
  `}
`;

export type RangeSliderProps = {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledDragHandle?: String & StyledComponentBase<any, {}>,
  StyledHandleLabel?: String & StyledComponentBase<any, {}>,
  StyledSlideRail?: String & StyledComponentBase<any, {}>,
  StyledSelectedRangeRail?: String & StyledComponentBase<any, {}>,
  StyledDomainLabel?: String & StyledComponentBase<any, {}>,

  showDomainLabels?: boolean,
  showSelectedRange?: boolean,

  onDrag?: Function,
  disabled?: boolean
  min: number,
  max: number,
  values?: number[] | valueProp[],
  markers?: number[] | valueProp[],
};

export default ({
  StyledContainer = Container,
  StyledDragHandle = DragHandle,
  StyledHandleLabel = HandleLabel,
  StyledSlideRail = SlideRail,
  StyledSelectedRangeRail = SelectedRangeRail,
  StyledDomainLabel = DomainLabel,

  showDomainLabels = true,
  showSelectedRange = true,

  onDrag = (newVal: number) => {console.log(newVal)},
  disabled = false,
  min,
  max,
  values,
}: RangeSliderProps) => {
  let hasHandleLabels = false;
  const processedValues = values.map((val: number | valueProp) => {
    if (typeof val === 'number') {
      return { value: val, label: null };
    } else {
      if (val.hasOwnProperty('label')) {
        hasHandleLabels = true;
      }
      return val;
    }
  });
  const selectedRange = [
    Math.min(...processedValues.map((val: valueProp) => val.value)),
    Math.max(...processedValues.map((val: valueProp) => val.value)),
  ];

  const domain = max - min;

  // get the bounding box of the slider
  const [ref, sliderBounds] = useMeasure({ polyfill });
  const pixelPositions = processedValues.map((val: valueProp) => (val.value / domain) * sliderBounds.width);
  // get the x offset and an animation setter function
  const [{ x, y }, set] = useSpring(() => ({ x: pixelPositions[0], y: 0, config: {friction: 13, tension: 100} }), [values]);
  const bind = useDrag(({ down, movement: [deltaX, deltaY] }) => {
    const delta = (deltaX / sliderBounds.width) * domain;
    const newValue = clamp(delta, min, max);
    onDrag(newValue);

    set({ x: down ? deltaX : pixelPositions[0], y: down ? deltaY : 0, immediate: down, config: {friction: 13, tension: 100}});
  },
  {
    axis: 'x',
    initial: [pixelPositions[0], 0],
    bounds: { left: 0, right: sliderBounds.width + 4, top: -8, bottom: (sliderBounds.height / 2) + 8 },
    rubberband: .1
  });

  return (
    <StyledContainer
      disabled={disabled}
      hasHandleLabels={hasHandleLabels}
      showDomainLabels={showDomainLabels}
    >

      <StyledSlideRail
        ref={ref}
      >
        {showSelectedRange &&
          <StyledSelectedRangeRail
            min={min}
            max={max}
            values={processedValues}
            selectedRange={selectedRange}
          />
        }
      </StyledSlideRail>

      {showDomainLabels &&
        <>
          <StyledDomainLabel position="left">{min}</StyledDomainLabel>
          <StyledDomainLabel position="right">{max}</StyledDomainLabel>
        </>
      }

      {processedValues.map(({ value, label, color }: valueProp, i: number) => (
        <StyledDragHandle
          {...bind()}
          style={{ x, y }}
          color={color}
          key={`handle${i}`}
        >
          <StyledHandleLabel value={value}>{label}</StyledHandleLabel>
        </StyledDragHandle>
      ))}

    </StyledContainer>
  )
};
