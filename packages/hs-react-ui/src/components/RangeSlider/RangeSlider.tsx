import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

import { useSpring, a } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import useMeasure from 'react-use-measure';
import { ResizeObserver } from '@juggle/resize-observer';

import fonts from '../../enums/fonts';
import { clamp } from '../../utils/math';

import {
  ValueProp,
  ContainerProps,
  HandleProps,
  HandleLabelProps,
  RangeSliderProps,
  SelectedRangeProps,
  DomainLabelProps,
} from './types';
import { useTheme } from '../../context';
import { Div } from '../../htmlElements';

export const Container = styled.div`
  ${({ showDomainLabels, hasHandleLabels, disabled, beingDragged = false }: ContainerProps) => `
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
  ${({ beingDragged = false, color }: HandleProps) => {
    const { colors } = useTheme();
    const handleColor = color || colors.primary;
    return `
      position: absolute;
      bottom: -.125rem;
      left: -.5rem;

      width: 1rem;
      height: 1rem;

      background-color: ${handleColor};
      color: ${handleColor};
      border: .125rem solid ${colors.background};
      border-radius: 50%;

      filter: url(#blur);

      cursor: ${beingDragged ? 'grabbing' : 'grab'};
      z-index: 2;
    `;
  }}
`;

export const HandleLabel = styled.div`
  ${({ velocity = 0 }: HandleLabelProps) => {
    const { colors } = useTheme();
    return `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) rotate(${clamp(velocity, -45, 45)}deg);

      background-color: ${colors.background};
      border-radius: 4px;
      font-weight: bold;
      white-space: nowrap;

      pointer-events: none;
      z-index: 2;
    `;
  }}
`;

export const SlideRail = styled.div`
  ${() => {
    const { colors } = useTheme();
    return `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      width: 100%;
      height: 0.25rem;

      overflow: hidden;

      border-radius: 0.125rem;
      background-color: ${colors.grayXlight};
    `;
  }}
`;

export const SelectedRangeRail = styled.div`
  ${({ min, max, selectedRange }: SelectedRangeProps) => {
    const { colors } = useTheme();
    return `
      position: absolute;
      top: 0%;
      height: 100%;
      left: ${((selectedRange[0] - min) / (max - min)) * 100}%;
      right: ${((max - selectedRange[1]) / (max - min)) * 100}%;

      transition: left .3s, right .3s;

      background-color: ${colors.primary};
    `;
  }}
`;

export const DomainLabel = styled.div`
  ${({ position }: DomainLabelProps) => {
    const { colors } = useTheme();
    return `
      position: absolute;
      bottom: 100%;
      ${position}: 0rem;
      color: ${colors.grayMedium};
      font-size: .5rem;
    `;
  }}
`;

export const Marker = styled(Div)`
  ${({ sliderPosition = 0 }) => {
    const { colors } = useTheme();
    return `
      position: absolute;
      text-align: center;
      display: flex;
      justify-content: center;
      height: 1rem;
      width: 2px;
      left: ${sliderPosition}px;
      background-color: ${colors.grayLight};
    `;
  }}
`;
export const MarkerLabel = styled(Div)`
  ${({ color }) => {
    const { colors } = useTheme();
    return `
    position: absolute;
    bottom: 100%;
    white-space: nowrap;
    font-size: .375rem;
    color: ${color || colors.grayLight};
  `;
  }}
`;

export const RangeSlider = ({
  StyledContainer = Container,
  StyledDragHandle = DragHandle,
  StyledHandleLabel = HandleLabel,
  StyledSlideRail = SlideRail,
  StyledSelectedRangeRail = SelectedRangeRail,
  StyledDomainLabel = DomainLabel,
  StyledMarker = Marker,
  StyledMarkerLabel = MarkerLabel,
  containerProps = {},
  dragHandleProps = {},
  handleLabelProps = {},
  slideRailProps = {},
  selectedRangeRailProps = {},
  domainLabelProps = {},
  markerProps = {},
  markerLabelProps = {},

  showDomainLabels = true,
  showSelectedRange = true,

  motionBlur = false,
  springOnRelease = true,

  debounceInterval = 8,
  axisLock = 'x',
  onDrag = (newVal: number) => {
    console.log(newVal); // eslint-disable-line no-console
  },
  disabled = false,
  min,
  max,
  values,
  markers = [],
  testId,
}: RangeSliderProps): JSX.Element | null => {
  let hasHandleLabels = false;
  const processedValues = values
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This expression is not callable.
      values.map((val: number | ValueProp) => {
        if (typeof val === 'number') {
          return { value: val, label: null };
        }
        if (Object.prototype.hasOwnProperty.call(val, 'label')) {
          hasHandleLabels = true;
        }
        return val;
      })
    : [];
  const processedMarkers = markers
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This expression is not callable.
      markers.map((val: number | ValueProp) => {
        if (typeof val === 'number') {
          return { value: val, label: null };
        }
        return val;
      })
    : [];

  const selectedRange = [
    Math.min(
      ...processedValues.map((val: ValueProp) => val.value),
      showSelectedRange && values && values.length === 1 ? min : Infinity,
    ),
    Math.max(...processedValues.map((val: ValueProp) => val.value)),
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
  const [ref, sliderBounds] = useMeasure({ polyfill: ResizeObserver });
  const pixelPositions = processedValues.map(
    (val: ValueProp) => (val.value / domain) * sliderBounds.width,
  );

  // get the x offset and an animation setter function
  const [{ x, y }, set] = useSpring(
    () => ({ to: { x: pixelPositions[0], y: 0 }, config: { friction: 13, tension: 100 } }),
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

  useEffect(() => {
    set({
      x: pixelPositions[0],
      y: 0,

      immediate: true,
      config: { friction: 13, tension: 100 },
    });
  }, [pixelPositions, set]);

  return (
    <StyledContainer
      data-test-id={['hs-ui-range-slider', testId].join('-')}
      disabled={disabled}
      hasHandleLabels={hasHandleLabels}
      showDomainLabels={showDomainLabels}
      {...containerProps}
    >
      <StyledSlideRail ref={ref} {...slideRailProps}>
        {showSelectedRange && (
          <StyledSelectedRangeRail
            min={min}
            max={max}
            values={processedValues}
            selectedRange={selectedRange}
            {...selectedRangeRailProps}
          />
        )}
      </StyledSlideRail>

      {showDomainLabels && (
        <>
          <StyledDomainLabel position="left" {...domainLabelProps}>
            {min}
          </StyledDomainLabel>
          <StyledDomainLabel position="right" {...domainLabelProps}>
            {max}
          </StyledDomainLabel>
        </>
      )}

      {processedValues.map(({ value, label, color }: ValueProp, i: number) => (
        <StyledDragHandle
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bind()}
          draggable={false}
          beingDragged={i === draggedHandle}
          style={{ x, y }}
          color={color}
          key={`handle${i}`}
          {...dragHandleProps}
        >
          <StyledHandleLabel value={value} {...handleLabelProps}>
            {label}
          </StyledHandleLabel>
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

      {processedMarkers.map(({ value, label, color }: ValueProp) => {
        const position = (value / domain) * sliderBounds.width;
        return (
          <StyledMarker
            key={`marker-${value}`}
            id={`marker-${value}`}
            sliderPosition={position}
            {...markerProps}
          >
            <StyledMarkerLabel color={color} {...markerLabelProps}>
              {label}
            </StyledMarkerLabel>
          </StyledMarker>
        );
      })}
    </StyledContainer>
  );
};

RangeSlider.Container = Container;
RangeSlider.DragHandle = DragHandle;
RangeSlider.HandleLabel = HandleLabel;
RangeSlider.SlideRail = SlideRail;
RangeSlider.SelectedRangeRail = SelectedRangeRail;
RangeSlider.DomainLabel = DomainLabel;
RangeSlider.Marker = Marker;
RangeSlider.MarkerLabel = MarkerLabel;

export default RangeSlider;
