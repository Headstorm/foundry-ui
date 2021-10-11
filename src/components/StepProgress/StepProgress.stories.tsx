import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';
import colors from '../../enums/colors';
import stepTypes from '../../enums/stepTypes';
import StepProgress, { StepProgressProps } from './StepProgress';
import fonts from '../../enums/fonts';

type DefaultProps = StepProgressProps;

const Row = styled.div`
  ${fonts.body}
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem;
  min-width: 20rem;
  width: 90%;
  margin: 0 auto;
`;

export const Default: Story<DefaultProps> = ({
  disabled,
  index,
  selectedStepColor,
  color,
  clickable,
  round,
  vertical,
  steps,
  canClickToNextStep,
  canClickToPreviousSteps,
  stepType,
}: DefaultProps) => {
  const [currStep, setCurrStep] = useState(index);

  useEffect(() => setCurrStep(index), [index]);

  const onClicks: any[] = [];
  steps = steps || [];
  steps.forEach((step, i) => {
    onClicks.push(() => setCurrStep(i));
  });

  return (
    <Row>
      <StepProgress
        onClicks={onClicks}
        disabled={disabled}
        steps={steps}
        index={currStep}
        selectedStepColor={selectedStepColor}
        color={color}
        clickable={clickable}
        round={round}
        vertical={vertical}
        canClickToNextStep={canClickToNextStep}
        canClickToPreviousSteps={canClickToPreviousSteps}
        stepType={stepType}
      />
    </Row>
  );
};
Default.args = {
  disabled: false,
  index: 1,
  selectedStepColor: '#fff',
  color: colors.primaryDark,
  clickable: true,
  round: false,
  vertical: false,
  steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
  canClickToNextStep: true,
  canClickToPreviousSteps: true,
  stepType: stepTypes.inner,
};

export default {
  title: 'StepProgress',
  argTypes: {
    index: {
      control: {
        type: 'range',
        min: 0,
        max: 10,
        step: 1,
      },
    },
    stepType: {
      options: [stepTypes.inner, stepTypes.under, stepTypes.over],
      control: {
        type: 'select',
      },
    },
  },
} as Meta;
