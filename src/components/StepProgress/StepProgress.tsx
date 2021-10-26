import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import variants from '../../enums/variants';
import stepTypes from '../../enums/stepTypes';
import { getFontColorFromVariant } from '../../utils/color';
import { Div } from '../../htmlElements';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme, useAnalytics } from '../../context';
import Button from '../Button';
import Text from '../Text';

export type ContainerProps = {
  disabled: boolean;
  vertical: boolean;
};
export const Container = styled(Div)`
  ${({ disabled, vertical }: ContainerProps) => `
    width: fit-content;
    position: relative;

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
    ${
      vertical
        ? `
    transform-origin: top left;
    transform: translateX(50%) rotate(90deg);
    `
        : ''
    }
  `}
`;

const StepList = styled(Div)`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  flex-direction: row;
  gap: 1rem;
`;

const StepFlex = styled(Div)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  flex: 1 1 0;
  min-width: 0;
`;

export const StepContainer = styled(Button.Container)`
  ${({ round, clickable }: { round: boolean; clickable: boolean }) => `
  ${
    round
      ? `border-radius: 100%;
      `
      : ''
  }
    ${
      clickable
        ? ''
        : `pointer-events: none;
      `
    }
    transition: background-color .3s, color .3s;
  `}
  width: 100%;
  &:before {
    display: block;
    content: '';
    height: 0;
    padding-bottom: 110%;
  }
`;

export const SelectedStepContainer = styled(StepContainer)`
  ${({ bgColor, borderColor }: { bgColor: string; borderColor: string }) => `
    color: ${getFontColorFromVariant(variants.fill, bgColor)};
    background-color: ${bgColor};
    border: 1px solid ${borderColor};
    &:hover {
      background-color: ${
        bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'
      };
    };
  `}
`;

export const NextStepContainer = styled(StepContainer)`
  ${({ bgColor, borderColor }: { bgColor: string; borderColor: string }) => `
    color: ${getFontColorFromVariant(variants.fill, bgColor)};
    background-color: ${bgColor};
    border: 1px solid ${borderColor};
    &:hover {
      background-color: ${
        bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'
      };
    };
  `}
`;

export const OutOfRangeStepContainer = styled(StepContainer)`
  ${({ bgColor, borderColor }: { bgColor: string; borderColor: string }) => `
    color: ${borderColor};
    background-color: ${bgColor};
    border: 1px solid ${borderColor};
    &:hover {
      background-color: ${
        bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'
      };
    };
  `}
`;

export const StepTextContainer = styled(Text.Container)`
  ${({ visible, vertical }: { visible: boolean; vertical: boolean }) => `
    display: inline-block;
    text-align: center;
    width: 100%;
    overflow-wrap: break-word;
    ${visible ? '' : 'visibility: hidden;'}
    ${vertical ? 'transform: rotate(-90deg);' : ''}
`}
`;

export const OverTextContainer = styled(StepTextContainer)`
  ${({ vertical }: { vertical: boolean }) => `
    margin-bottom: ${vertical ? '1.5rem' : '.5rem'};
    text-align: center;
    height: 100%;
    padding-bottom: 0;
    vertical-align: bottom;
  `}
`;

export const UnderTextContainer = styled(StepTextContainer)`
  ${({ vertical }: { vertical: boolean }) => `
    margin-top: ${vertical ? '1.5rem' : '.5rem'};
    height: 100%;
  `}
`;

export const SlideRail = styled(Div)`
  ${({ color }: { color: string }) => `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);

      width: 100%;
      height: 0.25rem;

      overflow: hidden;

      border-radius: 0.125rem;
      background-color: ${color};
    `}
`;

export const SelectedRangeRail = styled(SlideRail)`
  ${({ index, max, color }: { index: number; max: number; color: string }) => {
    return `
      left: 0;
      width: ${100 * (index / (max - 1)) < 100 ? 100 * (index / (max - 1)) : 100}%;

      transition: width .3s;

      background-color: ${color};
    `;
  }}
`;

export type StepProgressProps = {
  StyledContainer?: StyledSubcomponentType;
  StyledSlideRail?: StyledSubcomponentType;
  StyledSelectedRangeRail?: StyledSubcomponentType;
  StyledNextStepContainer?: StyledSubcomponentType;
  StyledSelectedStepContainer?: StyledSubcomponentType;
  StyledOutOfRangeStepContainer?: StyledSubcomponentType;
  StyledCompletedStepContainer?: StyledSubcomponentType;
  StyledInnerTextContainer?: StyledSubcomponentType;
  StyledOverTextContainer?: StyledSubcomponentType;
  StyledUnderTextContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  completedStepProps?: SubcomponentPropsType;
  selectedStepProps?: SubcomponentPropsType;
  nextStepProps?: SubcomponentPropsType;
  outOfRangeStepProps?: SubcomponentPropsType;
  allStepsProps?: SubcomponentPropsType;
  textProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLDivElement>;
  buttonRefs?: React.RefObject<HTMLButtonElement>[];
  stepRefs?: React.RefObject<HTMLDivElement>[];

  index?: number;
  steps?: string[];
  onClicks?: { (): void }[];

  stepType?: string;
  round?: boolean;
  vertical?: boolean;
  completeColor?: string;
  incompleteColor?: string;
  selectedStepColor?: string;
  nextStepColor?: string;
  canClickToNextStep?: boolean;
  canClickToPreviousSteps?: boolean;
  showSlideRail?: boolean;
  clickable?: boolean;
  disabled?: boolean;
};

export const StepProgress = ({
  StyledContainer = Container,
  StyledSlideRail = SlideRail,
  StyledSelectedRangeRail = SelectedRangeRail,
  StyledSelectedStepContainer = SelectedStepContainer,
  StyledNextStepContainer = NextStepContainer,
  StyledOutOfRangeStepContainer = OutOfRangeStepContainer,
  StyledCompletedStepContainer = StepContainer,
  StyledInnerTextContainer = StepTextContainer,
  StyledOverTextContainer = OverTextContainer,
  StyledUnderTextContainer = UnderTextContainer,

  containerProps = {},
  completedStepProps = {},
  selectedStepProps = {},
  nextStepProps = {},
  outOfRangeStepProps = {},
  allStepsProps = {},
  textProps = {},

  containerRef,
  buttonRefs = [],
  stepRefs = [],

  index = 0,
  steps = [],
  onClicks = [],

  stepType = stepTypes.inner,
  round = false,
  vertical = false,
  completeColor,
  incompleteColor,
  selectedStepColor = '#fff',
  nextStepColor,
  canClickToNextStep = true,
  canClickToPreviousSteps = true,
  showSlideRail = true,
  clickable = true,
  disabled = false,
}: StepProgressProps): JSX.Element | null => {
  const { colors } = useTheme();
  const handleEventWithAnalytics = useAnalytics();

  const finishedColor = completeColor || colors.primaryDark;
  const unfinishedColor = incompleteColor || colors.grayXlight;
  const nextStepFinalColor = nextStepColor || colors.grayXlight;

  const defaultCompletedStepProps: SubcomponentPropsType = {
    bgColor: finishedColor,
    round,
    clickable: clickable && canClickToPreviousSteps,
    stepType,
  };

  const defaultSelectedStepProps: SubcomponentPropsType = {
    bgColor: selectedStepColor,
    borderColor: finishedColor,
    round,
    clickable: false,
    stepType,
  };

  const defaultNextStepProps: SubcomponentPropsType = {
    bgColor: nextStepFinalColor,
    borderColor: unfinishedColor,
    round,
    clickable: true,
    stepType,
  };

  const defaultOutOfRangeStepProps: SubcomponentPropsType = {
    bgColor: '#fff',
    borderColor: unfinishedColor,
    round,
    clickable: false,
    stepType,
  };

  const getTextColor = (i: number) => {
    if (index === i) {
      return finishedColor;
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

  const getContainer = (i: number) => {
    if (index === i) {
      return StyledSelectedStepContainer;
    }
    // The next step if clickable
    if (i === index + 1 && clickable && canClickToNextStep) {
      return StyledNextStepContainer;
    }
    // Anything past the selected step
    if (i > index) {
      return StyledOutOfRangeStepContainer;
    }
    // Previous steps
    return StyledCompletedStepContainer;
  };

  const getContainerProps = (i: number) => {
    // Selected step
    if (index === i) {
      return { ...defaultSelectedStepProps, ...selectedStepProps, ...allStepsProps };
    }
    // The next step
    if (i === index + 1 && clickable && canClickToNextStep) {
      return {
        ...defaultNextStepProps,
        ...nextStepProps,
        ...allStepsProps,
      };
    }
    // Anything past the selected step
    if (i > index) {
      return { ...defaultOutOfRangeStepProps, ...outOfRangeStepProps, ...allStepsProps };
    }
    // Previous steps
    return { ...defaultCompletedStepProps, ...completedStepProps, ...allStepsProps };
  };

  return (
    <StyledContainer ref={containerRef} disabled={disabled} vertical={vertical} {...containerProps}>
      {showSlideRail ? (
        <>
          <StyledSlideRail color={unfinishedColor} />
          <StyledSelectedRangeRail index={index} max={steps.length} color={finishedColor} />
        </>
      ) : (
        ''
      )}
      <StepList>
        {steps.map((step, i) => (
          <StepFlex ref={stepRefs[i]} key={`${step}-step`}>
            <Text
              StyledContainer={StyledOverTextContainer}
              containerProps={{ visible: stepType === stepTypes.over, vertical, ...textProps }}
              color={getTextColor(i)}
            >
              {step}
            </Text>
            <Button
              containerRef={buttonRefs[i]}
              color={String(getContainerProps(i).bgColor)}
              StyledContainer={getContainer(i)}
              containerProps={getContainerProps(i)}
              variant={variants.fill}
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
              <Text
                StyledContainer={StyledInnerTextContainer}
                containerProps={{ visible: true, vertical, ...textProps }}
              >
                {stepType === stepTypes.inner ? step : i}
              </Text>
            </Button>
            <Text
              StyledContainer={StyledUnderTextContainer}
              containerProps={{ visible: stepType === stepTypes.under, vertical, ...textProps }}
              color={getTextColor(i)}
            >
              {step}
            </Text>
          </StepFlex>
        ))}
      </StepList>
    </StyledContainer>
  );
};

StepProgress.stepTypes = stepTypes;
StepProgress.Container = Container;
StepProgress.SlideRail = SlideRail;
StepProgress.SelectedRangeRail = SelectedRangeRail;
StepProgress.StyledSelectedStepContainer = SelectedStepContainer;
StepProgress.StyledNextStepContainer = NextStepContainer;
StepProgress.StyledOutOfRangeStepContainer = OutOfRangeStepContainer;
StepProgress.StyledCompletedStepContainer = StepContainer;
StepProgress.StyledInnerTextContainer = StepTextContainer;
StepProgress.StyledOverTextContainer = OverTextContainer;
StepProgress.StyledUnderTextContainer = UnderTextContainer;

export default StepProgress;
