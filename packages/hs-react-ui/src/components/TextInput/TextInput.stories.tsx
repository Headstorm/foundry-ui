import React, { useState, useCallback, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import Icon from '@mdi/react';
import * as IconPaths from '@mdi/js';
import { storiesOf } from '@storybook/react';

import TextInput from './TextInput';

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

      // Setup callbacks to prevent unnecessary rendering
      const onChangeCallback = useCallback(event => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newValue = event.target.value;
        setInputValue(newValue);
        action('onChange')(newValue);
      }, []);
      const onDebounceCallback = useCallback(event => {
        action('onDebounceCallback')(event.target.value);
      }, []);
      const onClearCallback = useCallback(() => {
        setInputValue('');
        action('onClear')();
      }, []);
      const onFocusCallback = useCallback(event => {
        action('onFocusCallback')(event.target.value);
      }, []);
      const onBlurCallback = useCallback(event => {
        action('onBlurCallback')(event.target.value);
      }, []);
      const onInputCallback = useCallback(event => {
        action('onInputCallback')(event.target.value);
      }, []);
      const onKeyPressCallback = useCallback(event => {
        action('onKeypressCallback')(event.key);
      }, []);
      const onKeyDownCallback = useCallback(event => {
        action('onKeyDownCallback')(event.key);
      }, []);
      const onKeyUpCallback = useCallback(event => {
        action('onKeyUpCallback')(event.key);
      }, []);

      const generalGroup = 'General';
      const multilineGroup = 'Multiline';
      const errorMessageGroup = 'Error messages';
      const debounceGroup = 'Debounced';
      const characterCountGroup = 'Character count';

      return (
        <TextInput
          ariaLabel={text('ariaLabel', 'textInput', generalGroup)}
          onChange={onChangeCallback}
          debounceInterval={number('debounceInterval', 150, undefined, debounceGroup)}
          debouncedOnChange={onDebounceCallback}
          disabled={boolean('disabled', false, generalGroup)}
          value={inputValue}
          placeholder={text('placeholder', 'Placeholder', generalGroup)}
          onClear={boolean('clearable', false, generalGroup) ? onClearCallback : undefined}
          iconPrefix={select('iconPrefix', options, options.none, generalGroup)}
          isMultiline={boolean('isMultiline?', false, multilineGroup)}
          rows={number('rows', 0, undefined, multilineGroup)}
          cols={number('cols', 0, undefined, multilineGroup)}
          isValid={boolean('isValid', true, errorMessageGroup)}
          errorMessage={text('errorMessage', '', errorMessageGroup)}
          defaultValue={text('defaultValue', '', generalGroup)}
          type={text('type', '', generalGroup)}
          onInput={onInputCallback}
          onKeyPress={onKeyPressCallback}
          onKeyDown={onKeyDownCallback}
          onKeyUp={onKeyUpCallback}
          onFocus={onFocusCallback}
          onBlur={onBlurCallback}
          multiLineIsResizable={boolean('multiLineIsResizable', false, multilineGroup)}
          showCharacterCount={boolean('showCharacterCount', true, characterCountGroup)}
          maxLength={select(
            'maxLength',
            { 5: 5, 20: 20, 100: 100, none: undefined },
            20,
            characterCountGroup,
          )}
          allowTextBeyondMaxLength={boolean('allowTextBeyondMaxLength', false, characterCountGroup)}
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
          onChange={event => {
            const newValue = event.target.value;
            setInputValue(newValue);
            action('onChange')(newValue);
          }}
          value={inputValue}
          placeholder={text('placeholder', 'Placeholder')}
          onClear={() => {
            setInputValue('');
            action('onClear')();
          }}
          iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
          isMultiline={isMultiline}
          errorMessage={isError}
          StyledInput={Input}
        />
      );
    },
    { design },
  );
