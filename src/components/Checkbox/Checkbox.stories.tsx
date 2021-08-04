import React from 'react';

import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Checkbox, { CheckboxTypes } from './Checkbox';
import variants from '../../enums/variants';

const Template: Story = args => {
  const [checked, setChecked] = React.useState(args.checked);
  return (
    <Checkbox
      {...args}
      checked={checked}
      inputProps={{ onChange: () => setChecked(!checked) }}
      onClick={e => {
        return args.onClick(e);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  checked: true,
  checkboxType: CheckboxTypes.check,
  disabled: false,
  variant: variants.outline,
  children: 'The label for the checkbox',
};

const containerRef = React.createRef<HTMLDivElement>();
const boxRef = React.createRef<HTMLDivElement>();
const onClick = (e: React.SyntheticEvent) => {
  e.preventDefault();
  action('onClick')(
    `ref width x height: ${containerRef.current?.clientWidth} x ${containerRef.current?.clientHeight}`,
  );
};

export const Ref = Template.bind({});
Ref.args = {
  ...Default.args,
  containerRef,
  boxRef,
  onClick,
};

export default {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A87',
    },
  },
} as Meta;
