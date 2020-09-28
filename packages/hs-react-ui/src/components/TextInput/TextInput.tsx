import React, {
  ChangeEvent,
  EventHandler,
  ReactNode,
  SyntheticEvent,
  useCallback,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
} from 'react';
import styled, { css, StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import debounce from 'lodash.debounce';
import { Div, Input as InputElement, TextArea } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
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
    `;
  }}
`;

const IconContainer = styled(Div)`
  ${() => {
    const { colors } = useTheme();
    return `
      padding: 0.5em;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${colors.grayMedium};
      cursor: pointer;
    `;
  }}
`;

const CharacterCounter = styled(Div)`
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
    debouncedOnChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
    isValid?: boolean;
    isMultiline?: boolean;
    errorMessage?: string;
    debounceInterval?: number;
    multiLineIsResizable?: boolean;
    maxLength?: number;
    allowTextBeyondMaxLength?: boolean;
    showCharacterCount?: boolean;

    StyledContainer?: string & StyledComponentBase<any, {}>;
    containerProps?: SubcomponentPropsType;
    containerRef?: React.RefObject<HTMLDivElement>;

    StyledInput?: string & StyledComponentBase<any, {}>;
    inputProps?: SubcomponentPropsType;
    inputRef?: React.RefObject<HTMLInputElement>;

    StyledTextArea?: string & StyledComponentBase<any, {}>;

    StyledIconContainer?: string & StyledComponentBase<any, {}>;
    iconContainerProps?: SubcomponentPropsType;
    iconContainerRef?: React.RefObject<HTMLDivElement>;

    StyledErrorContainer?: string & StyledComponentBase<any, {}>;
    errorContainerProps?: SubcomponentPropsType;
    errorContainerRef?: React.RefObject<HTMLDivElement>;
  };

const createIcon = (
  StyledIconContainer: string & StyledComponentBase<any, {}>,
  iconPrefix: ReactNode,
) => {
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
  // Destructure native HTML attributes to provide default values
  defaultValue = '',
  type = 'text',
  disabled = false,
  cols = 10,
  rows = 10,

  debouncedOnChange = defaultCallback,
  onClear,
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
  containerProps = {},
  containerRef,

  StyledInput = TextInputContainer,
  inputProps = {},
  inputRef,
  StyledTextArea = TextAreaInputContainer,
  StyledIconContainer = IconContainer,
  iconContainerProps = {},
  iconContainerRef,

  StyledErrorContainer = ErrorContainer,
  errorContainerProps = {},
  errorContainerRef,

  ...nativeHTMLAttributes
}: TextInputProps): JSX.Element => {
  // Debounce the change function using useCallback so that the function is not initialized each time it renders
  const debouncedChange = useCallback(debounce(debouncedOnChange, debounceInterval), [
    debouncedOnChange,
    debounceInterval,
  ]);
  const InputComponent: string & StyledComponentBase<any, {}> = isMultiline
    ? StyledTextArea
    : StyledInput;
  const displayValue = nativeHTMLAttributes.value || defaultValue;

  return (
    <StyledContainer
      disabled={disabled}
      isValid={isValid}
      containerRef={containerRef}
      {...containerProps}
    >
      {iconPrefix && createIcon(StyledIconContainer, iconPrefix)}
      <InputComponent
        value={displayValue}
        type={type}
        disabled={disabled}
        cols={cols}
        rows={rows}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          e.persist();
          if (maxLength && maxLength >= 0) {
            e.target.value = allowTextBeyondMaxLength
              ? e.target.value
              : e.target.value.slice(0, maxLength);
          }
          if (nativeHTMLAttributes.onChange) {
            nativeHTMLAttributes.onChange(e);
          }
          debouncedChange(e);
        }}
        multiLineIsResizable={multiLineIsResizable}
        inputRef={inputRef}
        {...inputProps}
        {...nativeHTMLAttributes}
      />
      {onClear && (
        <StyledIconContainer
          onClick={onClear}
          iconContainerRef={iconContainerRef}
          {...iconContainerProps}
        >
          <Icon path={mdiClose} size="1em" />
        </StyledIconContainer>
      )}
      {showCharacterCount && maxLength && (
        <CharacterCounter
          errorMessage={errorMessage}
          isValid={isValid}
          textIsTooLong={(displayValue as string).length > maxLength}
        >
          {(displayValue as string).length} / {maxLength}
        </CharacterCounter>
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

export default TextInput;
