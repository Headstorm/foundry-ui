import React, { useState, useCallback } from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as IconPaths from '@mdi/js';

import TextInput, { TextInputProps } from './TextInput';
import variants from '../../enums/variants';

const iconOptions = {
  none: '',
  ...IconPaths,
};

const maxLengthOptions = {
  5: 5,
  20: 20,
  100: 100,
  none: undefined,
};

const callbacks: {
  [i: string]: (event: React.ChangeEvent<HTMLTextAreaElement> & React.KeyboardEvent) => void;
} = {
  onChange: event => action('onChange')(event.target.value),
  debouncedOnChange: event => action('debouncedOnChange')(event.target.value),
  onClear: () => action('onClear')(),
  onFocus: () => action('onFocus')(),
  onBlur: () => action('onBlur')(),
  onInput: event => action('onInput')(event.target.value),
  onKeyPress: event => action('onKeyPress')(event.key),
  onKeyUp: event => action('onKeyUp')(event.key),
  onKeyDown: event => action('onKeyDown')(event.key),
};

type BasicTextInputProps = TextInputProps & {
  clearable: boolean;
};

export const BasicTextInput: Story<BasicTextInputProps> = ({
  clearable,
  onChange,
  onClear,
  ...args
}: BasicTextInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const onChangeCallback = useCallback(
    event => {
      setInputValue(event.target.value);
      if (onChange) onChange(event);
    },
    [onChange],
  );
  const onClearCallback = useCallback(
    event => {
      setInputValue('');
      if (onClear) onClear(event);
    },
    [onClear],
  );

  return (
    <TextInput
      {...args}
      value={inputValue}
      onChange={onChangeCallback}
      onClear={clearable ? onClearCallback : undefined}
    />
  );
};
BasicTextInput.args = {
  'aria-label': 'textInput',
  debounceInterval: 150,
  disabled: false,
  placeholder: 'Placeholder',
  iconPrefix: 'none',
  isMultiline: false,
  rows: 0,
  cols: 0,
  isValid: true,
  errorMessage: '',
  variant: variants.outline,
  type: '',
  multiLineIsResizable: false,
  showCharacterCount: true,
  maxLength: 20,
  allowTextBeyondMaxLength: false,
  clearable: false,
  ...callbacks,
};

export const UncontrolledTextInput: Story<TextInputProps> = (args: TextInputProps) => {
  return <TextInput {...args} onClear={undefined} />;
};
UncontrolledTextInput.args = { ...BasicTextInput.args };

export default {
  title: 'TextInput',
  argTypes: {
    iconPrefix: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: {
        type: 'select',
      },
    },
    maxLength: {
      options: Object.keys(maxLengthOptions),
      mapping: maxLengthOptions,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: Object.keys(variants),
      mapping: variants,
      control: {
        type: 'radio',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29',
    },
  },
} as Meta;
