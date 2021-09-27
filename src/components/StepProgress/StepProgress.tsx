import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import variants from 'src/enums/variants';
import labelTypes from 'src/enums/labelTypes';
import { getFontColorFromVariant } from 'src/utils/color';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme, useAnalytics } from '../../context';
import Button from '../Button';
import Text from '../Text';

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

const LabelList = styled.div`
  position: relative;
  height: 1rem;
  display: flex;
  width: 110%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

const LabelFlex = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

const LabelText = styled(Text.Container)`
  ${({ visible }: { visible: boolean }) => `
  text-align: center;
  align-self: center;
  justify-content: center;
  ${visible ? '' : 'visibility: hidden;'}
`}
`;

const TopText = styled(LabelText)`
  margin-bottom: 0.5rem;
  align-self: flex-start;
`;

const BottomText = styled(LabelText)`
  margin-top: 0.5rem;
  align-self: flex-end;
`;

const LabelButton = styled(Button)``;

const LabelContainer = styled(Button.Container)`
  ${({ round, clickable }: { round: boolean; clickable: boolean }) => `
  ${
    round
      ? `border-radius: 100%;
          &:before{
            content:"";
            display:block;
            margin-top:110%;
          };
          `
      : ''
  }
  ${clickable ? '' : 'pointer-events: none;'}
  width: 100%;
  height: 100%;
  display: flex;
`}
`;

export const SelectedStep = styled(LabelContainer)`
  ${({ bgColor }: { bgColor: string }) => `
color: ${getFontColorFromVariant(variants.fill, bgColor)};
background-color: ${bgColor};
&:hover {
  background-color: ${bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'};
};
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
  ${({ index, max, color }: { index: number; max: number; color: string }) => {
    return `
      left: 0%;
      width: ${100 * (index / (max - 1)) < 100 ? 100 * (index / (max - 1)) : 100}%;

      transition: left .3s, right .3s;

      background-color: ${color};
    `;
  }}
`;

export type StepProgressProps = {
  StyledContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;

  index?: number;
  labels?: string[];
  onClicks?: { (): void }[];

  labelType?: string;
  round?: boolean;
  color?: string;
  selectedStepColor?: string;
  canClickToNextStep?: boolean;
  canClickToPreviousSteps?: boolean;
  clickable?: boolean;
  disabled?: boolean;
};

export const StepProgress = ({
  StyledContainer = Container,

  containerProps = {},

  index = 0,
  labels = [],
  onClicks = [],

  labelType = labelTypes.under,
  round = false,
  color,
  selectedStepColor = '#fff',
  canClickToNextStep = false,
  canClickToPreviousSteps = false,
  clickable = true,
  disabled = false,
}: StepProgressProps): JSX.Element | null => {
  const { colors } = useTheme();
  const handleEventWithAnalytics = useAnalytics();

  const containerColor = color || colors.primaryDark;

  const SelectedStepProps: SubcomponentPropsType = {
    bgColor: selectedStepColor,
    round,
    clickable: false,
    labelType,
  };

  const getTextColor = (i: number) => {
    if (index === i) {
      return containerColor;
    }
    if (index === i - 1) {
      if (canClickToNextStep) {
        return colors.grayMedium;
      }
      return colors.grayXlight;
    }
    if (index < i) {
      return colors.grayXlight;
    }
    return '#000';
  };

  return (
    <StyledContainer disabled={disabled} {...containerProps}>
      <SlideRail />
      <SelectedRangeRail index={index} max={labels.length} color={containerColor} />
      <LabelList>
        {labels.map((label, i) => (
          <LabelFlex>
            <Text
              StyledContainer={TopText}
              containerProps={{ visible: labelType === labelTypes.over }}
              color={getTextColor(i)}
            >
              {label}
            </Text>
            <LabelButton
              color={index >= i ? containerColor : colors.grayXlight}
              StyledContainer={index === i ? SelectedStep : LabelContainer}
              containerProps={
                index === i
                  ? SelectedStepProps
                  : {
                      round,
                      clickable:
                        clickable &&
                        ((index < i && canClickToNextStep) ||
                          (index >= i && canClickToPreviousSteps)),
                      labelType,
                    }
              }
              disabled={canClickToNextStep ? index + 1 < i : index < i}
              variant={index === i ? variants.outline : variants.fill}
              onClick={
                clickable &&
                ((index < i && canClickToNextStep) || (index >= i && canClickToPreviousSteps))
                  ? () =>
                      handleEventWithAnalytics(
                        'StepProgress',
                        onClicks[i],
                        'onClick',
                        { type: 'onClick', clickIndex: i },
                        containerProps,
                      )
                  : () => {}
              }
            >
              <Text StyledContainer={LabelText} containerProps={{ visible: true }}>
                {labelType === labelTypes.inner ? label : i}
              </Text>
            </LabelButton>
            <Text
              StyledContainer={BottomText}
              containerProps={{ visible: labelType === labelTypes.under }}
              color={getTextColor(i)}
            >
              {label}
            </Text>
          </LabelFlex>
        ))}
      </LabelList>
    </StyledContainer>
  );
};

export default StepProgress;
