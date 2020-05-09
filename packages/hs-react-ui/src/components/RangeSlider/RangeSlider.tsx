import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';
import { clamp } from '../../utils/math';

export const Container = styled.div`
  position: relative;
  height: 3rem;
  width: 100%;
`;

type handleProps = {velocity?: number, value: number, min: number, max: number};
export const DragHandle = styled.div`
  ${({ velocity = 0, value, min, max }: handleProps) => `
    position: absolute;
    top: 50%;
    left: ${((value - min) / (max - min)) * 100}%;
    transform: translate(-50%, -50%);

    width: 3rem;
    height: 3rem;

    background-color: ${colors.primary};
    border: 2px solid ${colors.background};
    border-radius: 50%;
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

export const Slider = styled.div`
  ${({ elevation = 0 }) => `
    
  `}
`;

export const SelectedRange = styled.div`
  ${({ elevation = 0 }) => `
    
  `}
`;


export const MinMaxLabel = styled.div`
  ${({ elevation = 0 }) => `
    
  `}
`;

export type RangeSliderProps  = {
  StyledContainer: String & StyledComponentBase<any, {}>,
  StyledDragHandle: String & StyledComponentBase<any, {}>,
  StyledHandleLabel: String & StyledComponentBase<any, {}>,
  StyledSlider: String & StyledComponentBase<any, {}>,
  StyledSelectedRange?: String & StyledComponentBase<any, {}>,

  onHandleDrag?: Function,
  disabled?: boolean
  min: number,
  max: number,
  values?: { value: number, label?: String | number | Node, color?: String }[],
  markers?: { value: number, label?: String | number | Node, color?: String }[],
};

const RangeSlider = ({
  StyledContainer = Container,
  StyledDragHandle = DragHandle,
  StyledHandleLabel = HandleLabel,
  StyledSlider = Slider,
  StyledSelectedRange = SelectedRange,

  showDomainLabels,
  showSelectedRange,

  onHandleDrag = () => {},
  disabled = false,
  min = 0,
  max = 10,
  values,
}: RangeSliderProps) => (
  <StyledContainer>
    <StyledSlider />
    {showSelectedRange && <StyledSelectedRange min={min} max={max} values={values} />}
    {values.map(({ value, label, color }) => (
      <StyledDragHandle value={value} color={color}>
        <StyledHandleLabel value={value} label={label}></StyledHandleLabel>
      </StyledDragHandle>
    ))}
  </StyledContainer>
);

export default Card;
