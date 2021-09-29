import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';
import colors from 'src/enums/colors';
import labelTypes from 'src/enums/labelTypes';
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
  labels,
  canClickToNextStep,
  canClickToPreviousSteps,
  labelType,
}: DefaultProps) => {
  const [currStep, setCurrStep] = useState(index);

  useEffect(() => setCurrStep(index), [index]);

  const onClicks: any[] = [];
  labels = labels || [];
  labels.forEach((label, i) => {
    onClicks.push(() => setCurrStep(i));
  });

  return (
    <Row>
      <StepProgress
        onClicks={onClicks}
        disabled={disabled}
        labels={labels}
        index={currStep}
        selectedStepColor={selectedStepColor}
        color={color}
        clickable={clickable}
        round={round}
        canClickToNextStep={canClickToNextStep}
        canClickToPreviousSteps={canClickToPreviousSteps}
        labelType={labelType}
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
  labels: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
  canClickToNextStep: true,
  canClickToPreviousSteps: true,
  labelType: labelTypes.inner,
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
    labelType: {
      options: [labelTypes.inner, labelTypes.under, labelTypes.over],
      control: {
        type: 'select',
      },
    },
  },
} as Meta;
