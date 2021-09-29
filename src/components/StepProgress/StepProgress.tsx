import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import variants from 'src/enums/variants';
import labelTypes from 'src/enums/labelTypes';
import { getFontColorFromVariant } from 'src/utils/color';
import { Div } from 'src/htmlElements';
import fonts from '../../enums/fonts';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme, useAnalytics } from '../../context';
import Button from '../Button';
import Text from '../Text';

export type ContainerProps = {
  disabled: boolean;
};
export const Container = styled(Div)`
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

const LabelList = styled(Div)`
  position: relative;
  height: 1rem;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

const LabelFlex = styled(Div)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const LabelTextContainer = styled(Text.Container)`
  ${({ visible }: { visible: boolean }) => `
  text-align: center;
  width: 100%;
  height: 100%;
  ${visible ? '' : 'visibility: hidden;'}
`}
`;

export const OverTextContainer = styled(LabelTextContainer)`
  margin-bottom: 0.5rem;
  align-self: flex-start;
`;

export const UnderTextContainer = styled(LabelTextContainer)`
  margin-top: 0.5rem;
  align-self: flex-end;
`;

export const LabelContainer = styled(Button.Container)`
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
  ${
    clickable
      ? ''
      : `pointer-events: none;
        `
  }
  width: 100%;
  height: 100%;
  transition: background-color .3s, color .3s;
  display: flex;
  `}
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

  containerRef?: React.RefObject<HTMLButtonElement>;

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
    <StyledContainer ref={containerRef} disabled={disabled} {...containerProps}>
      <SlideRail />
      <SelectedRangeRail index={index} max={labels.length} color={containerColor} />
      <LabelList>
        {labels.map((label, i) => (
          <LabelFlex>
            <Text
              StyledContainer={StyledOverTextContainer}
              containerProps={{ visible: labelType === labelTypes.over, ...textProps }}
              color={getTextColor(i)}
            >
              {label}
            </Text>
            <Button
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
                containerProps={{ visible: true, ...textProps }}
              >
                {labelType === labelTypes.inner ? label : i}
              </Text>
            </Button>
            <Text
              StyledContainer={StyledUnderTextContainer}
              containerProps={{ visible: labelType === labelTypes.under, ...textProps }}
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
