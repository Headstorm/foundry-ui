import React, { useState } from 'react';
import styled from 'styled-components';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Icon from '@mdi/react';
import * as IconPaths from '@mdi/js';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import TextInput from './TextInput';

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29',
};

storiesOf('TextInput', module)
  .add(
    'Basic Text Input',
    () => {
      const [inputValue, setInputValue] = useState('');
      const options = {
        none: '',
        ...IconPaths,
      };

      return (
        <TextInput
          aria-label='textInput'
          onChange={(event) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const newValue = event.target.value;
            setInputValue(newValue);
            action('onChange')(newValue);
          }}
          value={inputValue}
          placeholder={text('placeholder', 'Place Holder')}
          onClear={
            boolean('clearable', false)
              ? () => {
                  setInputValue('');
                  action('onClear')();
                }
              : undefined
          }
          iconPrefix={select('iconPrefix', options, options.none)}
          isMultiline={boolean('isMultiline?', false)}
          rows={number('rows', 0)}
          cols={number('cols', 0)}
          isValid={boolean('isValid', true)}
          errorMessage={text('errorMessage', '')}
          defaultValue={text('defaultValue', '')}
        />
      );
    },
    { design },
  )
  .add(
    'Text Input with all the gadgets',
    () => {
      const Input = styled(TextInput.Input)`
        width: 300px;
        height: 80px;
      `;
      const [inputValue, setInputValue] = useState('');
      const options = {
        none: '',
        ...IconPaths,
      };
      const getIconPath = (path: string) => (path ? <Icon size="16px" path={path} /> : undefined);
      const isMultiline = inputValue.length > 15;
      const isError =
        inputValue.length < 5 && inputValue.length > 0 ? 'Short Message Error' : undefined;

      return (
        <TextInput
          onChange={(event) => {
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
          isMultiline={isMultiline}
          errorMessage={isError}
          Input={Input}
        />
      );
    },
    { design },
  );
