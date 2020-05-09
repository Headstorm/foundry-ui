import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';
import { clamp } from '../../utils/math';

type containerPorps = {showDomainLabels?: boolean, disabled: boolean};
export const Container = styled.div`
  ${({ showDomainLabels, disabled }: containerPorps) => `
    position: relative;
    height: 1rem;
    width: 100%;
    
    transition: top .1s, margin-top .1s, filter .1s;

    ${disabled ? `
      filter: grayscale(1) contrast(.5) brightness(1.2);
      pointer-events: none;
    ` : ''}

    ${showDomainLabels ? `
        top: -.25rem;
        margin-top: .5rem;
      ` : ''};
  `}
`;

type handleProps = { beingDragged?: boolean, velocity?: number, value: number, min: number, max: number };
export const DragHandle = styled.div`
  ${({ beingDragged = false, velocity = 0, value, min, max }: handleProps) => `
    position: absolute;
    top: 50%;
    left: ${((value - min) / (max - min)) * 100}%;
    transform: translate(-50%, -50%);

    width: 1rem;
    height: 1rem;

    background-color: ${colors.primary};
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

export type RangeSliderProps  = {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledDragHandle?: String & StyledComponentBase<any, {}>,
  StyledHandleLabel?: String & StyledComponentBase<any, {}>,
  StyledSlideRail?: String & StyledComponentBase<any, {}>,
  StyledSelectedRangeRail?: String & StyledComponentBase<any, {}>,
  StyledDomainLabel?: String & StyledComponentBase<any, {}>,

  showDomainLabels?: boolean,
  showSelectedRange?: boolean,

  onHandleDrag?: Function,
  disabled?: boolean
  min: number,
  max: number,
  values?: { value: number, label?: String | number | Node, color?: String }[],
  markers?: { value: number, label?: String | number | Node, color?: String }[],
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

  onHandleDrag = () => {},
  disabled = false,
  min,
  max,
  values,
}: RangeSliderProps) => {
  const selectedRange = [
    Math.min(...values.map(val => val.value)),
    Math.max(...values.map(val => val.value)),
  ];

  return (
    <StyledContainer disabled={disabled} showDomainLabels={showDomainLabels}>

      <StyledSlideRail>
        {showSelectedRange &&
          <StyledSelectedRangeRail
            min={min}
            max={max}
            values={values}
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

      {values.map(({ value, label, color }) => (
        <StyledDragHandle value={value} min={min} max={max} color={color}>
          <StyledHandleLabel value={value}>{label}</StyledHandleLabel>
        </StyledDragHandle>
      ))}

    </StyledContainer>
  )
};
