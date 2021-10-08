import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import variants from '../../enums/variants';
import labelTypes from '../../enums/labelTypes';
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
    ${vertical ? `
    transform-origin: top left;
    transform: translateX(50%) rotate(90deg);
    ` : ''}
  `}
`;

const LabelList = styled(Div)`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  flex-direction: row;
  gap: 1rem;
`;

const LabelFlex = styled(Div)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  flex: 1 1 0;
  min-width: 0;
`;

export const LabelContainer = styled(Button.Container)`
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

export const SelectedStepContainer = styled(LabelContainer)`
  ${({ bgColor }: { bgColor: string }) => `
    color: ${getFontColorFromVariant(variants.fill, bgColor)};
    background-color: ${bgColor};
    &:hover {
      background-color: ${
        bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'
      };
    };
  `}
`;

export const OutOfRangeStepContainer = styled(LabelContainer)`
  ${({ bgColor }: { bgColor: string }) => `
    color: ${bgColor};
    background-color: #fff;
    &:hover {
      background-color: ${
        bgColor !== 'transparent' ? darken(0.05, bgColor) : 'rgba(0, 0, 0, 0.05)'
      };
    };
  `}
`;

export const LabelTextContainer = styled(Text.Container)`
  ${({ visible, vertical }: { visible: boolean; vertical: boolean }) => `
    display: inline-block;
    text-align: center;
    width: 100%;
    overflow-wrap: break-word;
    ${visible ? '' : 'visibility: hidden;'}
    ${vertical ? 'transform: rotate(-90deg);' : ''}
`}
`;

export const OverTextContainer = styled(LabelTextContainer)`
  ${({ vertical }: { vertical: boolean }) => `
    margin-bottom: ${vertical ? '1.5rem' : '.5rem'};
    text-align: center;
    height: 100%;
    padding-bottom: 0;
    vertical-align: bottom;
  `}
`;

export const UnderTextContainer = styled(LabelTextContainer)`
  ${({ vertical }: { vertical: boolean }) => `
    margin-top: ${vertical ? '1.5rem' : '.5rem'};
    height: 100%;
  `}
`;

export const SlideRail = styled(Div)`
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
  StyledSelectedStepContainer?: StyledSubcomponentType;
  StyledOutOfRangeStepContainer?: StyledSubcomponentType;
  StyledCompletedStepContainer?: StyledSubcomponentType;
  StyledInnerTextContainer?: StyledSubcomponentType;
  StyledOverTextContainer?: StyledSubcomponentType;
  StyledUnderTextContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  selectedStepProps?: SubcomponentPropsType;
  outOfRangeStepProps?: SubcomponentPropsType;
  completedStepProps?: SubcomponentPropsType;
  textProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLDivElement>;
  buttonRefs?: React.RefObject<HTMLButtonElement>[];
  labelRefs?: React.RefObject<HTMLDivElement>[];

  index?: number;
  labels?: string[];
  onClicks?: { (): void }[];

  labelType?: string;
  round?: boolean;
  vertical?: boolean;
  color?: string;
  selectedStepColor?: string;
  canClickToNextStep?: boolean;
  canClickToPreviousSteps?: boolean;
  clickable?: boolean;
  disabled?: boolean;
};

export const StepProgress = ({
  StyledContainer = Container,
  StyledSlideRail = SlideRail,
  StyledSelectedRangeRail = SelectedRangeRail,
  StyledSelectedStepContainer = SelectedStepContainer,
  StyledOutOfRangeStepContainer = OutOfRangeStepContainer,
  StyledCompletedStepContainer = LabelContainer,
  StyledInnerTextContainer = LabelTextContainer,
  StyledOverTextContainer = OverTextContainer,
  StyledUnderTextContainer = UnderTextContainer,

  containerProps = {},
  selectedStepProps = {},
  outOfRangeStepProps = {},
  completedStepProps = {},
  textProps = {},

  containerRef,
  buttonRefs = [],
  labelRefs = [],

  index = 0,
  labels = [],
  onClicks = [],

  labelType = labelTypes.inner,
  round = false,
  vertical = false,
  color,
  selectedStepColor = '#fff',
  canClickToNextStep = true,
  canClickToPreviousSteps = true,
  clickable = true,
  disabled = false,
}: StepProgressProps): JSX.Element | null => {
  const { colors } = useTheme();
  const handleEventWithAnalytics = useAnalytics();

  const containerColor = color || colors.primaryDark;

  const defaultSelectedStepProps: SubcomponentPropsType = {
    bgColor: selectedStepColor,
    round,
    clickable: false,
    labelType,
  };

  const defaultOutOfRangeStepProps: SubcomponentPropsType = {
    bgColor: colors.grayXlight,
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

  const getContainer = (i: number) => {
    if (index === i) {
      return StyledSelectedStepContainer;
    }
    if (index < i - 1 || (index <= i - 1 && (!canClickToNextStep || !clickable))) {
      return StyledOutOfRangeStepContainer;
    }
    return StyledCompletedStepContainer;
  };

  const getContainerProps = (i: number) => {
    if (index === i) {
      return { ...defaultSelectedStepProps, ...selectedStepProps };
    }
    if (index < i - 1 || (index <= i - 1 && (!canClickToNextStep || !clickable))) {
      return { ...defaultOutOfRangeStepProps, ...outOfRangeStepProps };
    }
    return {
      round,
      clickable:
        clickable && ((index < i && canClickToNextStep) || (index >= i && canClickToPreviousSteps)),
      labelType,
      ...completedStepProps,
    };
  };

  return (
    <StyledContainer ref={containerRef} disabled={disabled} vertical={vertical} {...containerProps}>
      <StyledSlideRail />
      <StyledSelectedRangeRail index={index} max={labels.length} color={containerColor} />
      <LabelList>
        {labels.map((label, i) => (
          <LabelFlex ref={labelRefs[i]} key={`${label}-label`}>
            <Text
              StyledContainer={StyledOverTextContainer}
              containerProps={{ visible: labelType === labelTypes.over, vertical, ...textProps }}
              color={getTextColor(i)}
            >
              {label}
            </Text>
            <Button
              containerRef={buttonRefs[i]}
              color={index >= i ? containerColor : colors.grayXlight}
              StyledContainer={getContainer(i)}
              containerProps={getContainerProps(i)}
              variant={
                index === i ||
                index < i - 1 ||
                (index <= i - 1 && (!canClickToNextStep || !clickable))
                  ? variants.outline
                  : variants.fill
              }
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
                {labelType === labelTypes.inner ? label : i}
              </Text>
            </Button>
            <Text
              StyledContainer={StyledUnderTextContainer}
              containerProps={{ visible: labelType === labelTypes.under, vertical, ...textProps }}
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

StepProgress.labelTypes = labelTypes;
StepProgress.Container = Container;
StepProgress.SlideRail = SlideRail;
StepProgress.SelectedRangeRail = SelectedRangeRail;
StepProgress.StyledSelectedStepContainer = SelectedStepContainer;
StepProgress.StyledOutOfRangeStepContainer = OutOfRangeStepContainer;
StepProgress.StyledCompletedStepContainer = LabelContainer;
StepProgress.StyledInnerTextContainer = LabelTextContainer;
StepProgress.StyledOverTextContainer = OverTextContainer;
StepProgress.StyledUnderTextContainer = UnderTextContainer;

export default StepProgress;
