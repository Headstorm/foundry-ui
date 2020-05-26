import React, { useState, SyntheticEvent } from 'react';
import { text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Icon from '@mdi/react';
import * as IconPaths from '@mdi/js';
import TextInput from './TextInput';

export default {
  title: 'TextInput',
  component: TextInput,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29',
  },
};

export const Basic = () => {
  const [inputValue, setInputValue] = useState('');

  const options = {
    none: '',
    ...IconPaths,
  };

  const getIconPath = (path: string) => (path ? <Icon size="16px" path={path} /> : null);

  const isMultiLine = inputValue.length > 15;

  const isError = inputValue.length < 5 && inputValue.length > 0 ? 'Short Message Error' : null;

  return (
    <TextInput
      onChange={(event: SyntheticEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newValue = event.target.value;
        setInputValue(newValue);
        action('onChange')(newValue);
      }}
      value={inputValue}
      placeholder={text('placeholder', 'Place Holder')}
      onClear={() => {
        setInputValue('');
        action('onClear')();
      }}
      iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
      multiline={isMultiLine}
      errorMessage={isError}
    />
  );
};
