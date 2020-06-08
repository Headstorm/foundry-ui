import React, { SyntheticEvent } from 'react';
import { darken } from 'polished';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import fonts from '../../enums/fonts';
import colors from '../../enums/colors';

export type StyledInputProps = {
  iconPrefix?: string | JSX.Element;
  rows?: number;
  cols?: number;
  isMultiline?: number;
  isValid?: boolean;
  placeholder?: string;
  value?: string;
  id?: string;
  defaultValue?: string;
  isClearable?: boolean;
};

export type TextInputContainerProps = {
  iconPrefix?: string | JSX.Element;
  isValid?: boolean;
  onClear?: (event: Event | SyntheticEvent) => void;
};

type InputType = StyledComponentBase<any, {}, StyledInputProps, never>;

const TextInputContainer = styled.input`
  ${({ iconPrefix, isValid, isClearable }: StyledInputProps) => `
    padding-left: ${iconPrefix ? '2rem' : '0.5rem'};
    border 1px solid ${isValid === false ? colors.destructive : colors.grayLight};
    border-radius: 0.5em;
    color: ${colors.grayDark};
    outline: 0 none;
    height: 2rem;
    ${fonts.body}
    font-size: 16px;
    width: 10rem;
    background-color: white;
    padding-right: ${ isClearable ? '1.5rem' : 0};
    &::placeholder {
      color: ${colors.grayLight};
    }
  `}
`;

const TextAreaInputContainer = styled.textarea`
  ${({ iconPrefix, isValid, isClearable }: StyledInputProps) => `
  padding-left: ${iconPrefix ? '2em' : '.5em'} ;
  border 1px solid ${isValid === false ? colors.destructive : colors.grayLight};
  border-radius: 0.5em;
  color: ${colors.grayDark};
  outline: 0 none;
  min-height: 2rem;
  min-width: 10rem;
  ${fonts.body}
  font-size: 16px;
  background-color: white;
  resize: none;
  padding-right: ${ isClearable ? '1.5rem' : 0};
  &::placeholder {
    color: ${colors.grayLight};
  }
`}
`;

const ClearIconContainer = styled.span`
  color: ${colors.destructive};
  margin-left: -1.5rem;
  cursor: pointer;
  &:hover {
    color: ${darken(0.05, colors.destructive)};
  }
  &:active {
    color: ${darken(0.1, colors.destructive)};
  }
`;

const IconContainer = styled.span`
  ${({ isMultiline }: { isMultiline?: boolean }) => `
  position: absolute;
  left: .5rem;
  height: 16px;
  margin-top: ${isMultiline ? '0.25rem' : '0.5rem'};
`}
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${colors.destructive};
  padding-left: 0.5rem;
`;

const Label = styled.label`
`;

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: string | JSX.Element;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onClear?: (event: Event | SyntheticEvent) => void;
  onChange?: (event: Event | SyntheticEvent) => void;
  onKeypress?: (event: KeyboardEvent) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  onKeyup?: (event: KeyboardEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  value?: string;
  rows?: number;
  cols?: number;
  isMultiline?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  Container?: StyledComponentBase<any, {}>;
  ErrorLabel?: StyledComponentBase<any, {}>;
  Input?: InputType;
  defaultValue?: string;
};

const createIcon = (iconPrefix: string | JSX.Element, isMultiline?: boolean) => {
  if (typeof iconPrefix === 'string') {
    return (
      <IconContainer isMultiline={isMultiline}>
        <Icon size="16px" path={iconPrefix} />
      </IconContainer>
    );
  }

  return <IconContainer>{iconPrefix}</IconContainer>;
};

const DEFAULT_ROWS_COUNT = 1;
const DEFAULT_COLS_COUNT = 16; // This is the same as the default width of the input at 10rem

const TextInput = ({
  id,
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange,
  onBlur,
  onFocus,
  onKeypress,
  onKeydown,
  onKeyup,
  onTouchStart,
  onTouchEnd,
  rows,
  cols,
  value,
  isValid,
  isMultiline,
  errorMessage,
  Container = Label,
  Input,
  ErrorLabel = ErrorText,
  defaultValue,
}: TextInputProps) => {

  // Find the right component to render. Doing default assignments
  // is not working. Trying to use a single styled input was breaking
  // rows and cols on a text area, so it needed to be separate.
  let InputComponent: InputType = TextInputContainer;
  if (Input) {
    InputComponent = Input;
  } else if (isMultiline) {
    InputComponent = TextAreaInputContainer;
  }

  return (
    <Container>
      {iconPrefix && createIcon(iconPrefix, isMultiline)}
      <InputComponent
        placeholder={placeholder}
        onChange={onChange}
        value={value || defaultValue}
        isValid={isValid}
        id={id}
        iconPrefix={iconPrefix}
        rows={isMultiline ? rows || DEFAULT_ROWS_COUNT : undefined}
        cols={isMultiline ? cols || DEFAULT_COLS_COUNT : undefined}
        defaultValue={defaultValue}
        isClearable={!!onClear}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeypress={onKeypress}
        onKeydown={onKeydown}
        onKeyup={onKeyup}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
      {onClear && (
        <ClearIconContainer role='button' onClick={onClear} aria-label="clear input">
          <Icon path={mdiClose} size="16px" />
        </ClearIconContainer>
      )}
      <br/>
      <ErrorLabel>{isValid === false && errorMessage}</ErrorLabel>
    </Container>
  );
};

TextInput.ErrorLabel = ErrorText;
TextInput.Container = Label;
TextInput.Input = TextInputContainer;
TextInput.TextArea = TextAreaInputContainer;
export default TextInput;
