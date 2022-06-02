/* eslint-disable dot-notation */
import React from 'react';

import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/store';

import { StyledBaseLabel } from '../../htmlElements';
import Text from '../Text';
import Toggle from './Toggle';
import variants from '../../enums/variants';

const Template: Story<typeof Toggle> = args => {
  // eslint-disable-next-line react/destructuring-assignment

  const [hookArgs, updateArgs] = useArgs();

  return (
    <>
      <h1>
        <StyledBaseLabel htmlFor="big-label">
          <Toggle
            {...args}
            inputProps={{ name: 'big-label', id: 'big-label' }}
            checked={hookArgs.checked}
            onToggle={e => {
              action('onToggle')(e);
              updateArgs({ checked: !hookArgs.checked });
            }}
          />
          <Text>&nbsp;&nbsp;H1</Text>
        </StyledBaseLabel>
      </h1>
      <h2>
        <StyledBaseLabel>
          <Toggle
            {...args}
            checked={hookArgs.checked}
            onToggle={e => {
              action('onToggle')(e);
              updateArgs({ checked: !hookArgs.checked });
            }}
          />
          <Text>&nbsp;&nbsp;H2</Text>
        </StyledBaseLabel>
      </h2>
      <StyledBaseLabel>
        <Toggle
          {...args}
          checked={hookArgs.checked}
          onToggle={e => {
            action('onToggle')(e);
            updateArgs({ checked: !hookArgs.checked });
          }}
        />
        <Text>&nbsp;&nbsp;Normal</Text>
      </StyledBaseLabel>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  checked: true,
  disabled: false,
  variant: variants.fill,
};

const containerRef = React.createRef<HTMLLabelElement>();
const handleRef = React.createRef<HTMLDivElement>();

export const Ref = Template.bind({});
Ref.args = {
  ...Default.args,
  containerRef,
  handleRef,
};

export default {
  title: 'Toggle',
  component: Toggle,
} as Meta;
