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
} from 'react';
import styled, { css } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import debounce from 'lodash.debounce';
import { mergeRefs } from '../../utils/refs';
import { Div, Input as InputElement, TextArea } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAnalytics, useTheme } from '../../context';
import { disabledStyles } from '../../utils/color';

const Container = styled(Div)`
  ${({ disabled = false, isValid }: { disabled?: boolean; isValid?: boolean }) => {
    const { colors } = useTheme();
    return `
      border 1px solid ${isValid === false ? colors.destructive : colors.grayMedium};
      min-width: 10rem;
      position: relative;
      display: flex;
      flex-flow: row;
      border-radius: 0.25em;
      background-color: ${colors.background};
      ${disabled ? disabledStyles() : ''}
  `;
  }}
`;

const TextInputContainer = styled(InputElement)`
  ${() => {
    const { colors } = useTheme();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      font-size: 1em;
      padding: 0.5rem;
      background-color: ${colors.transparent};
      &:focus {
        outline: none;
        box-shadow: 0 0 5px 0.150rem ${colors.tertiary};
  `;
  }}
`;

const TextAreaInputContainer = styled(TextArea)`
  ${({ multiLineIsResizable }: TextInputProps) => {
    const { colors } = useTheme();
    return `
      border: 0 none;
      flex-grow: 1;
      outline: 0 none;
      font-size: 1em;
      min-width: 0px;
      padding: .5rem;
      background-color: ${colors.transparent};
      resize: ${multiLineIsResizable ? 'both' : 'none'};
      &:focus {
        outline: none;
        box-shadow: 0 0 5px 0.150rem ${colors.tertiary};
    `;
  }}
`;

const IconContainer = styled(Div)`
  ${() => {
    const { colors } = useTheme();
    return `
      padding: 0.5em;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: ${colors.grayMedium};
      cursor: pointer;
    `;
  }}
`;

const CharacterCount = styled(Div)`
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

const ErrorContainer = styled(Div)`
  ${() => {
    const { colors } = useTheme();
    return css`
      position: absolute;
      top: calc(100% + 0.25em);
      color: ${colors.destructive};
      font-size: 0.75rem;
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
    debounceInterval?: number;
    multiLineIsResizable?: boolean;
    maxLength?: number;
    allowTextBeyondMaxLength?: boolean;
    showCharacterCount?: boolean;

    StyledContainer?: StyledSubcomponentType;
    StyledInput?: StyledSubcomponentType;
    StyledIconContainer?: StyledSubcomponentType;
    StyledErrorContainer?: StyledSubcomponentType;
    StyledTextArea?: StyledSubcomponentType;
    StyledCharacterCount?: StyledSubcomponentType;

    containerProps?: SubcomponentPropsType;
    inputProps?: SubcomponentPropsType;
    iconContainerProps?: SubcomponentPropsType;
    errorContainerProps?: SubcomponentPropsType;
    characterCountProps?: SubcomponentPropsType;

    containerRef?: React.RefObject<HTMLDivElement>;
    inputRef?: React.RefObject<HTMLInputElement>;
    errorContainerRef?: React.RefObject<HTMLDivElement>;
    characterCountRef?: React.RefObject<HTMLDivElement>;
  };

const createIcon = (StyledIconContainer: StyledSubcomponentType, iconPrefix: ReactNode) => {
  if (typeof iconPrefix === 'string') {
    return (
      <StyledIconContainer>
        <Icon size="1rem" path={iconPrefix} />
      </StyledIconContainer>
    );
  }

  return <StyledIconContainer>{iconPrefix}</StyledIconContainer>;
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
  debounceInterval = 8,
  multiLineIsResizable,
  maxLength,
  allowTextBeyondMaxLength = false,
  showCharacterCount = false,

  StyledContainer = Container,
  StyledInput = TextInputContainer,
  StyledIconContainer = IconContainer,
  StyledErrorContainer = ErrorContainer,
  StyledTextArea = TextAreaInputContainer,
  StyledCharacterCount = CharacterCount,

  containerProps = {},
  inputProps = {},
  iconContainerProps = {},
  errorContainerProps = {},
  characterCountProps = {},

  containerRef,
  inputRef,
  errorContainerRef,
  characterCountRef,

  ...nativeHTMLAttributes
}: TextInputProps): JSX.Element => {
  const handleEventWithAnalytics = useAnalytics();

  const handleDebouncedOnChange = (e: any) =>
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

  const handleClear = (e: any) => {
    const onClearToUse =
      onClear &&
      (() => {
        if (!inputRef?.current?.value && internalInputRef?.current?.value) {
          setInternalValue('');
          internalInputRef.current.value = '';
        }
      });
    handleEventWithAnalytics('TextInput', onClearToUse, 'onClear', e, containerProps);
  };

  if (internalValue !== nativeHTMLAttributes.value && nativeHTMLAttributes.value === '') {
    setInternalValue('');
  }

  return (
    <StyledContainer
      disabled={nativeHTMLAttributes.disabled}
      isValid={isValid}
      ref={containerRef}
      {...containerProps}
    >
      {iconPrefix && createIcon(StyledIconContainer, iconPrefix)}
      <InputComponent
        // Set default values above nativeHTMLAttributes
        type="text"
        disabled={false}
        cols={10}
        rows={10}
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
        ref={mergeRefs([inputRef, internalInputRef])}
        {...inputProps}
      />
      {(onClear || clearable) && (
        <StyledIconContainer onClick={handleClear} {...iconContainerProps}>
          <Icon path={mdiClose} size="1em" />
        </StyledIconContainer>
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
TextInput.TextArea = TextAreaInputContainer;
TextInput.CharacterCount = CharacterCount;

export default TextInput;
