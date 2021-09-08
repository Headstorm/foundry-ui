import React from 'react';
import styled from 'styled-components';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';

export type StepProgressProps = {
  StyledContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;

  disabled?: boolean;
};

export type ContainerProps = {
  disabled: boolean;
};

export const Container = styled.div`
  ${({ disabled }: ContainerProps) => `
    position: relative;
    height: 1rem;
    width: 100%;

    ${fonts.body}

    user-select: none;

    transition: filter .1s;

    ${
      disabled
        ? `
      filter: grayscale(1) contrast(.5) brightness(1.2);
      pointer-events: none;
    `
        : ''
    }
  `}
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

export const StepProgress = ({
  StyledContainer = Container,
  disabled = false,
  containerProps = {},
}: StepProgressProps): JSX.Element | null => {
  return (
    <StyledContainer disabled={disabled} {...containerProps}>
      <SlideRail />
    </StyledContainer>
  );
};

export default StepProgress;
