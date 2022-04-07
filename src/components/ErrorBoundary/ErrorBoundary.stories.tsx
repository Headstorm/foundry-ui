import React from 'react';

import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ErrorBoundary, { ErrorBoundaryProps } from './ErrorBoundary';
import { has } from 'lodash';

const Template: Story<ErrorBoundaryProps> = ({ hasError, ...args }: ErrorBoundaryProps) => {
  const [error, setError] = React.useState(hasError);
  return (
    <ErrorBoundary
      {...args}
      hasError={error}
      inputProps={{ onChange: () => setError(!error) }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  hasError: true,
  errorText: 'Error text',
  errorCode: 'Error code',
};

export default {
  title: 'ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    design: {
      type: 'figma',
      url: '-',
    },
  },
} as Meta;
