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

export const Default: Story<DefaultProps> = ({ ...args }: DefaultProps) => {
  const [currStep, setCurrStep] = useState(args.index);

  useEffect(() => setCurrStep(args.index), [args.index]);

  const onClicks: any[] = [];
  args.steps = args.steps || [];
  args.steps.forEach((step, i) => {
    onClicks.push(() => setCurrStep(i));
  });

  return (
    <Row>
      <StepProgress
        onClicks={onClicks}
        disabled={args.disabled}
        showSlideRail={args.showSlideRail}
        steps={args.steps}
        index={currStep}
        completeColor={args.completeColor}
        incompleteColor={args.incompleteColor}
        selectedStepColor={args.selectedStepColor}
        nextStepColor={args.nextStepColor}
        clickable={args.clickable}
        round={args.round}
        vertical={args.vertical}
        canClickToNextStep={args.canClickToNextStep}
        canClickToPreviousSteps={args.canClickToPreviousSteps}
        stepType={args.stepType}
      />
    </Row>
  );
};
Default.args = {
  disabled: false,
  showSlideRail: true,
  index: 1,
  completeColor: colors.primaryDark,
  incompleteColor: colors.grayXlight,
  selectedStepColor: '#fff',
  nextStepColor: colors.grayXlight,
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
