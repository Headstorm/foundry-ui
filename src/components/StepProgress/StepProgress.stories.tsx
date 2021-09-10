import React from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';
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

export const Default: Story<DefaultProps> = ({ disabled }: DefaultProps) => {
  // const [val, setVal] = useState(value);

  // useEffect(() => {
  //   setVal(value);
  // }, [value]);

  // const markersSelection = markers;
  // const markersArray = [];
  // if (markersSelection === 'all values') {
  //   for (let i = min; i <= max; i++) {
  //     markersArray.push(markerLabels ? { value: i, label: `${i}` } : i);
  //   }
  // } else if (markersSelection === 'middle value') {
  //   const midpoint = (min + max) / 2;
  //   markersArray.push(markerLabels ? { value: midpoint, label: `${midpoint}` } : midpoint);
  // }

  const labels = ['inconsistent', 'inconsistent', 'inconsistent', 'inconsistent'];
  const index = 1;

  return (
    <Row>
      <StepProgress disabled={disabled} labels={labels} index={index} />
    </Row>
  );
};
Default.args = {
  disabled: false,
};

export default {
  title: 'StepProgress',
  // argTypes: {
  //   value: {
  //     control: {
  //       type: 'range',
  //       min: 0,
  //       max: 5,
  //       step: 1,
  //     },
  //   },
  //   min: {
  //     control: { type: 'range', min: -10, max: 10, step: 1 },
  //   },
  //   max: {
  //     control: {
  //       type: 'range',
  //       min: -10,
  //       max: 10,
  //       step: 1,
  //     },
  //   },
  //   debounceInterval: {
  //     control: {
  //       type: 'range',
  //       min: 0,
  //       max: 100,
  //       step: 1,
  //     },
  //   },
  //   axisLock: {
  //     options: ['x', 'y', ''],
  //     control: {
  //       type: 'select',
  //     },
  //   },
  //   markers: {
  //     options: ['none', 'all values', 'middle value'],
  //     control: {
  //       type: 'radio',
  //     },
  //   },
  //   hue: {
  //     control: {
  //       type: 'range',
  //       min: 0,
  //       max: 360,
  //       step: 1,
  //     },
  //   },
  //   saturation: {
  //     control: {
  //       type: 'range',
  //       min: 0,
  //       max: 100,
  //       step: 1,
  //     },
  //   },
  //   lightness: {
  //     control: {
  //       type: 'range',
  //       min: 0,
  //       max: 100,
  //       step: 1,
  //     },
  //   },
  // },
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=126%3A2',
  //   },
  // },
} as Meta;
