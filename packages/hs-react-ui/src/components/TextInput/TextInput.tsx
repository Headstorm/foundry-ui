import React, {
  ChangeEvent,
  EventHandler,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useState,
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
    StyledInput?: string & StyledComponentBase<any, {}>;
    StyledTextArea?: string & StyledComponentBase<any, {}>;
    StyledIconContainer?: string & StyledComponentBase<any, {}>;
    StyledErrorContainer?: string & StyledComponentBase<any, {}>;
    containerProps?: SubcomponentPropsType;
    inputProps?: SubcomponentPropsType;
    iconContainerProps?: SubcomponentPropsType;
    errorContainerProps?: SubcomponentPropsType;
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
  StyledInput = TextInputContainer,
  StyledTextArea = TextAreaInputContainer,
  StyledIconContainer = IconContainer,
  StyledErrorContainer = ErrorContainer,
  containerProps = {},
  inputProps = {},
  iconContainerProps = {},
  errorContainerProps = {},
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

  const [internalValue, setInternalValue] = useState(
    nativeHTMLAttributes.value || nativeHTMLAttributes.defaultValue || '',
  );

  return (
    <StyledContainer disabled={nativeHTMLAttributes.disabled} isValid={isValid} {...containerProps}>
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
        {...inputProps}
      />
      {onClear && (
        <StyledIconContainer onClick={onClear} {...iconContainerProps}>
          <Icon path={mdiClose} size="1em" />
        </StyledIconContainer>
      )}
      {showCharacterCount && maxLength && (
        <CharacterCounter
          errorMessage={errorMessage}
          isValid={isValid}
          textIsTooLong={(internalValue as string).length > maxLength}
        >
          {(internalValue as string).length} / {maxLength}
        </CharacterCounter>
      )}
      {isValid === false && errorMessage && (
        <StyledErrorContainer {...errorContainerProps}>{errorMessage}</StyledErrorContainer>
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
