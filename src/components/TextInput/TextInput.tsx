import React, {
  ChangeEvent,
  EventHandler,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useState,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
  useRef,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';
import Icon from '@mdi/react';
import debounce from 'lodash.debounce';
import { mdiClose } from '@mdi/js';
import { darken } from 'polished';

import { StyledBaseDiv, StyledBaseInput, StyledBaseTextArea } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { mergeRefs } from '../../utils/refs';
import { useAnalytics, useTheme } from '../../context';
import { disabledStyles } from '../../utils/color';
import variants from '../../enums/variants';
import Button from '../Button';

export type TextInputContainerProps = {
  disabled?: boolean;
  isValid?: boolean;
  variant?: variants;
};

const Container = styled(StyledBaseDiv)`
  ${({ disabled = false, isValid, variant = variants.outline }: TextInputContainerProps) => {
    const { colors } = useTheme();
    const borderColor = isValid === false ? colors.destructive : colors.grayMedium;
    return `
      min-width: 10em;
      position: relative;
      display: flex;
      flex-flow: row;
      align-items: stretch;
      border-radius: 0.25em;
      border: ${
        variant === variants.outline ? `1px solid ${borderColor}` : '1px solid transparent'
      };

      &:focus-within {
        outline: none;
        box-shadow: 0 0 5px 0.150rem ${colors.tertiary};
      }
      
      ${
        variant === variants.fill
          ? `border-bottom: 1px solid ${borderColor}; 
            border-bottom-left-radius: 0; 
            border-bottom-right-radius: 0;`
          : ''
      }
      background-color: ${
        variant === variants.fill ? darken(0.1, colors.background) : colors.background
      };
      ${disabled ? disabledStyles() : ''}
    `;
  }}
`;

const TextInputContainer = styled(StyledBaseInput)`
  ${() => {
    const { colors } = useTheme();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      font-size: 1em;
      padding: 0.5em;
      background-color: ${colors.transparent};
  `;
  }}
`;

const TextAreaInputContainer = styled(StyledBaseTextArea)`
  ${({ multiLineIsResizable }: TextInputProps) => {
    const { colors } = useTheme();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      font-size: 1em;
      min-width: 0px;
      padding: .5em;
      background-color: ${colors.transparent};
      resize: ${multiLineIsResizable ? 'both' : 'none'};
    `;
  }}
`;

const ClearButtonContainer = styled(Button.Container)`
  padding: 0.5em;
  height: 100%;
`;

const IconContainer = styled(StyledBaseDiv)`
  ${() => {
    const { colors } = useTheme();
    return `
      padding: 0.5em;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${colors.grayMedium};
      cursor: text;
    `;
  }}
`;

const CharacterCount = styled(StyledBaseDiv)`
  ${({ textIsTooLong, isValid, errorMessage }) => {
    const { colors } = useTheme();
    return css`
      position: absolute;
      top: calc(100% + ${isValid && (!errorMessage || errorMessage !== '') ? '0.25em' : '2em'});
      right: 0.25em;
      color: ${textIsTooLong ? colors.destructive : colors.grayLight};
    `;
  }}
`;

const ErrorContainer = styled(StyledBaseDiv)`
  ${() => {
    const { colors } = useTheme();
    return css`
      position: absolute;
      top: calc(100% + 0.25em);
      color: ${colors.destructive};
      font-size: 0.75em;
    `;
  }}
`;

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    iconPrefix?: string | ReactNode;
    onClear?: (event: SyntheticEvent) => void;
    clearable?: boolean;
    debouncedOnChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
    isValid?: boolean;
    isMultiline?: boolean;
    errorMessage?: string;
    variant?: variants;
    debounceInterval?: number;
    multiLineIsResizable?: boolean;
    maxLength?: number;
    allowTextBeyondMaxLength?: boolean;
    showCharacterCount?: boolean;

    StyledContainer?: StyledSubcomponentType;
    StyledInput?: StyledSubcomponentType;
    StyledIconContainer?: StyledSubcomponentType;
    StyledClearButtonContainer?: StyledSubcomponentType;
    StyledErrorContainer?: StyledSubcomponentType;
    StyledTextArea?: StyledSubcomponentType;
    StyledCharacterCount?: StyledSubcomponentType;

    containerProps?: SubcomponentPropsType;
    inputProps?: SubcomponentPropsType;
    iconContainerProps?: SubcomponentPropsType;
    clearButtonContainerProps?: SubcomponentPropsType;
    errorContainerProps?: SubcomponentPropsType;
    characterCountProps?: SubcomponentPropsType;

    containerRef?: React.RefObject<HTMLDivElement>;
    inputRef?: React.RefObject<HTMLInputElement> | ((inst: HTMLInputElement) => void);
    iconContainerRef?: React.RefObject<HTMLDivElement>;
    clearButtonContainerRef?: React.RefObject<HTMLButtonElement>;
    errorContainerRef?: React.RefObject<HTMLDivElement>;
    characterCountRef?: React.RefObject<HTMLDivElement>;
  };

const defaultCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

const TextInput = ({
  debouncedOnChange = defaultCallback,
  onClear,
  clearable,
  iconPrefix,
  isValid = true,
  isMultiline,
  errorMessage,
  variant = variants.outline,
  debounceInterval = 8,
  multiLineIsResizable,
  maxLength,
  allowTextBeyondMaxLength = false,
  showCharacterCount = false,

  StyledContainer = Container,
  StyledInput = TextInputContainer,
  StyledIconContainer = IconContainer,
  StyledClearButtonContainer = ClearButtonContainer,
  StyledErrorContainer = ErrorContainer,
  StyledTextArea = TextAreaInputContainer,
  StyledCharacterCount = CharacterCount,

  containerProps = {},
  inputProps = {},
  iconContainerProps = {},
  clearButtonContainerProps = {},
  errorContainerProps = {},
  characterCountProps = {},

  containerRef,
  inputRef,
  iconContainerRef,
  clearButtonContainerRef,
  errorContainerRef,
  characterCountRef,

  ...nativeHTMLAttributes
}: TextInputProps): JSX.Element => {
  const handleEventWithAnalytics = useAnalytics();
  const theme = useTheme();

  const handleDebouncedOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    handleEventWithAnalytics(
      'TextInput',
      debouncedOnChange,
      'debouncedOnChange',
      e,
      containerProps,
    );

  // Debounce the change function using useCallback so that the function is not initialized each time it renders
  const debouncedChange = useCallback(debounce(handleDebouncedOnChange, debounceInterval), [
    handleDebouncedOnChange,
    debounceInterval,
  ]);

  const internalInputRef = useRef<HTMLInputElement>(null);

  const InputComponent: StyledSubcomponentType = isMultiline ? StyledTextArea : StyledInput;

  const [internalValue, setInternalValue] = useState(
    nativeHTMLAttributes.value || nativeHTMLAttributes.defaultValue || '',
  );

  const onClearToUse = useCallback(
    (evt: SyntheticEvent<Element, Event>) => {
      // if this is an uncontrolled input
      if (nativeHTMLAttributes.value === undefined) {
        if (internalInputRef?.current) {
          internalInputRef.current.value = '';
        }
        setInternalValue('');
      }
      if (onClear) {
        onClear(evt);
      }
    },
    [nativeHTMLAttributes.value, onClear],
  );

  const handleClear = (e: any) => {
    handleEventWithAnalytics('TextInput', onClearToUse, 'onClear', e, containerProps);
  };

  useEffect(() => {
    if (internalValue !== nativeHTMLAttributes.value && nativeHTMLAttributes.value === '') {
      setInternalValue('');
    }
  }, [internalValue, nativeHTMLAttributes.value]);

  return (
    <StyledContainer
      disabled={nativeHTMLAttributes.disabled}
      isValid={isValid}
      variant={variant}
      ref={containerRef}
      {...containerProps}
    >
      {iconPrefix &&
        (typeof iconPrefix === 'string' ? (
          <StyledIconContainer
            onClick={() => internalInputRef.current?.focus()}
            {...iconContainerProps}
            ref={iconContainerRef}
          >
            <Icon aria-hidden="true" size="1em" path={iconPrefix} />
          </StyledIconContainer>
        ) : (
          <StyledIconContainer onClick={() => internalInputRef.current?.focus()}>
            {iconPrefix}
          </StyledIconContainer>
        ))}
      <InputComponent
        // Set default values above nativeHTMLAttributes
        type="text"
        disabled={false}
        cols={10}
        rows={10}
        role="textbox"
        {...nativeHTMLAttributes}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          e.persist();
          if (maxLength && maxLength >= 0) {
            e.target.value = allowTextBeyondMaxLength
              ? e.target.value
              : e.target.value.slice(0, maxLength);
          }
          setInternalValue(e.target.value);
          if (nativeHTMLAttributes.onChange) {
            nativeHTMLAttributes.onChange(e);
          }
          debouncedChange(e);
        }}
        multiLineIsResizable={multiLineIsResizable}
        ref={internalInputRef ? mergeRefs<HTMLInputElement>([inputRef, internalInputRef]) : null}
        {...inputProps}
      />
      {clearable && (
        <Button
          StyledContainer={StyledClearButtonContainer}
          containerRef={clearButtonContainerRef}
          containerProps={{
            'aria-label': 'Clear',
            style: { lineHeight: '0' },
            ...clearButtonContainerProps,
          }}
          iconPrefix={mdiClose}
          leftIconProps={{ style: { height: '1em', width: '1em' } }}
          disabled={internalValue === ''}
          onClick={handleClear}
          color={theme.colors.grayMedium}
          variant={variants.text}
        />
      )}
      {showCharacterCount && (
        <StyledCharacterCount
          ref={characterCountRef}
          errorMessage={errorMessage}
          isValid={isValid}
          textIsTooLong={maxLength ? (internalValue as string).length > maxLength : false}
          {...characterCountProps}
        >
          {(internalValue as string).length} {maxLength !== undefined ? `/ ${maxLength}` : null}
        </StyledCharacterCount>
      )}
      {isValid === false && errorMessage && (
        <StyledErrorContainer ref={errorContainerRef} {...errorContainerProps}>
          {errorMessage}
        </StyledErrorContainer>
      )}
    </StyledContainer>
  );
};

TextInput.Container = Container;
TextInput.ErrorContainer = ErrorContainer;
TextInput.Input = TextInputContainer;
TextInput.IconContainer = IconContainer;
TextInput.ClearButtonContainer = ClearButtonContainer;
TextInput.TextArea = TextAreaInputContainer;
TextInput.CharacterCount = CharacterCount;

export default TextInput;
