import React, { useState, useCallback } from 'react';
import { text, select, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import * as IconPaths from '@mdi/js';
import { storiesOf } from '@storybook/react';

import TextInput from './TextInput';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29',
};
storiesOf('TextInput', module)
  .addParameters({ component: TextInput })
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
          aria-label={text('ariaLabel', 'textInput', generalGroup)}
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
  ).add(
    'Uncontrolled Text Input',
    () => {
      const options = {
        none: '',
        ...IconPaths,
      };

      // Setup callbacks to prevent unnecessary rendering
      const onChangeCallback = useCallback(event => {
        action('onChange')(event.target.value);
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
          aria-label={text('ariaLabel', 'textInput', generalGroup)}
          onChange={onChangeCallback}
          debounceInterval={number('debounceInterval', 150, undefined, debounceGroup)}
          debouncedOnChange={onDebounceCallback}
          disabled={boolean('disabled', false, generalGroup)}
          placeholder={text('placeholder', 'Placeholder', generalGroup)}
          onClear={boolean('clearable', false, generalGroup) ? onClearCallback : undefined}
          iconPrefix={select('iconPrefix', options, options.none, generalGroup)}
          isMultiline={boolean('isMultiline?', false, multilineGroup)}
          rows={number('rows', 0, undefined, multilineGroup)}
          cols={number('cols', 0, undefined, multilineGroup)}
          isValid={boolean('isValid', true, errorMessageGroup)}
          errorMessage={text('errorMessage', '', errorMessageGroup)}
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
  );
