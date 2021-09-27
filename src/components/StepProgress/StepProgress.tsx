import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import variants from 'src/enums/variants';
import { getFontColorFromVariant } from 'src/utils/color';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
import Button from '../Button';

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

const LabelButton = styled(Button)`
  ${({ clickable }: { clickable: boolean }) => `

  ${
    clickable
      ? ''
      : `
    &:hover {
    }`
  }
`}
`;

const LabelContainer = styled(Button.Container)`
  ${({ round }: { round: boolean }) => `
  ${
    round
      ? `border-radius: 100vw;
          &:before{
            content:"";
            display:block;
            margin-top:110%;
          }
          `
      : ''
  }
  display: flex;
`}
`;

export const SelectedStep = styled(LabelContainer)`
  ${({ bgColor }: { bgColor: string }) => `
  color: ${getFontColorFromVariant(variants.fill, bgColor)};
  background-color: ${bgColor};
  &:hover {
    background-color: ${bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'};
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

export const SelectedRangeRail = styled(SlideRail)`
  ${({ index, max }: { index: number; max: number }) => {
    const { colors } = useTheme(); // TODO: don't force the color to be primary
    return `
      left: 0%;
      width: ${100 * (index / (max - 1)) < 100 ? 100 * (index / (max - 1)) : 100}%;

      transition: left .3s, right .3s;

      background-color: ${colors.primary};
    `;
  }}
`;

export type StepProgressProps = {
  StyledContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;

  onClicks?: { (): void }[];

  index?: number;
  labels?: string[];
  color?: string;
  round?: boolean;
  selectedStepColor?: string;
  clickable?: boolean;
  disabled?: boolean;
};

export const StepProgress = ({
  StyledContainer = Container,
  containerProps = {},
  onClicks = [],
  disabled = false,
  clickable = true,
  round = true,
  index = 0,
  labels = [],
  color,
  selectedStepColor = '#fff',
}: StepProgressProps): JSX.Element | null => {
  const { colors } = useTheme();

  const containerColor = color || colors.primaryDark;

  const SelectedStepProps: SubcomponentPropsType = {
    bgColor: selectedStepColor,
    round,
  };

  return (
    <StyledContainer disabled={disabled} {...containerProps}>
      <SlideRail />
      <SelectedRangeRail index={index} max={labels.length} />
      <LabelFlex>
        {labels.map((label, i) => (
          <LabelButton
            color={index >= i ? containerColor : colors.grayXlight}
            StyledContainer={index === i ? SelectedStep : LabelContainer}
            containerProps={index === i ? SelectedStepProps : { round }}
            disabled={index + 1 < i}
            variant={index === i ? variants.outline : variants.fill}
            onClick={clickable ? onClicks[i] : () => {}}
            clickable={clickable}
            round={round}
          >
            {label}
          </LabelButton>
        ))}
      </LabelFlex>
    </StyledContainer>
  );
};

export default StepProgress;
