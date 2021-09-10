import React from 'react';
import styled from 'styled-components';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
import Button from '../Button';

export type StepProgressProps = {
  StyledContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;

  index?: number;
  labels?: string[];
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

const LabelFlex = styled.div`
  position: relative;
  height: 1rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

const LabelButton = styled(Button)``;
// ${({ textColor }: { textColor: string }) => `
// color: ${getFontColorFromVariant(variants.fill, textColor, colors.background, colors.grayDark)};
// `}

const LabelContainer = styled(Button.Container)`
  display: flex;
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

export const SelectedRangeRail = styled(SlideRail)`
  ${({ index }: { index: number }) => {
    const { colors } = useTheme(); // TODO: don't force the color to be primary
    return `
      left: 0%;
      width: ${100 / (index + 1)}%;

      transition: left .3s, right .3s;

      background-color: ${colors.primary};
    `;
  }}
`;

export const StepProgress = ({
  StyledContainer = Container,
  disabled = false,
  index = 0,
  labels = [],
  containerProps = {},
}: StepProgressProps): JSX.Element | null => {
  const { colors } = useTheme();

  return (
    <StyledContainer disabled={disabled} {...containerProps}>
      <SlideRail />
      <SelectedRangeRail index={index} />
      <LabelFlex>
        {labels.map((label, i) => (
          <LabelButton
            color={index >= i ? colors.primary : colors.grayXlight}
            StyledContainer={LabelContainer}
            disabled={index < i}
          >
            {label}
          </LabelButton>
        ))}
      </LabelFlex>
    </StyledContainer>
  );
};

export default StepProgress;
