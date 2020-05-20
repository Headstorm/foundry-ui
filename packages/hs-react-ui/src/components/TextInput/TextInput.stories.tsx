import React, { useState, SyntheticEvent } from 'react';
import { text, select} from '@storybook/addon-knobs';
import TextInput from './TextInput';
import { TextInputTypes } from '../../enums/TextInputTypes';
import { mdiComment } from '@mdi/js';
import { action } from '@storybook/addon-actions';
import Icon from '@mdi/react';
import * as IconPaths from '@mdi/js';

export default {
  title: 'TextInput',
  component: TextInput,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29'
  }
};

export const Basic = () => {

  const [inputValue, setInputValue] = useState('');

  const options = {
    none: '',
    ...IconPaths
  };

  const getIconPath = (path: string) => path ? <Icon size={'16px'} path={path} /> : null
  
  const isMultiLine = (inputValue: string) => (inputValue.length > 15) ? true : false;

  const isError = (inputValue: string) => (inputValue.length < 5 && inputValue.length > 0) ? 'Short Message Error' : null;

  return (

    <TextInput 
    onChange={(event: SyntheticEvent) => {
      setInputValue(event.target.value)
      action('onChange')(event.target.value)}}
    value={inputValue}
    placeholder={text('placeholder', 'Place Holder')} 
    onClear={(event: SyntheticEvent) => {
      setInputValue('')
      action('onClear')()}}
    iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
    multiline={isMultiLine(inputValue)}
    errorMessage={isError(inputValue)}
    />
  )
};

