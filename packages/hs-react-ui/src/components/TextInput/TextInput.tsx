import React, { ReactNode, SyntheticEvent, useCallback } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import debounce from 'lodash.debounce';
import colors from '../../enums/colors';
import { Div, TextArea, Input as InputElement } from '../../htmlElements';

const Container = styled(Div)`
  ${({ isValid }: { isValid?: boolean }) => `
  border 2px solid ${isValid === false ? colors.destructive : colors.grayMedium};
  min-width: 10rem;
  position: relative;
  display: flex;
  flex-flow: row;
  border-radius: 0.25em;
  background-color: ${colors.background};
`}
`;

const TextInputContainer = styled(InputElement)`
  border: 0 none;
  outline: 0 none;
  height: 2em;
  font-size: 1em;
  padding-left: 0.5rem;
  background-color: ${colors.background};
`;

const TextAreaInputContainer = styled(TextArea)`
  ${({ multiLineIsResizable }: TextInputProps) => `
    border: 0 none;
    outline: 0 none;
    min-height: 2em;
    font-size: 1em;
    min-width: 0px;
    background-color: ${colors.background};
    resize: ${multiLineIsResizable ? 'both' : 'none'};
  `}
`;

const IconContainer = styled(Div)`
  padding: 0.5em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grayMedium};
  cursor: pointer;
`;

const ErrorContainer = styled(Div)`
  position: absolute;
  top: calc(100% + 0.25em);
  color: ${colors.destructive};
  font-size: 0.75rem;
`;

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: string | ReactNode;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent) => void;
  debouncedOnChange?: (event: SyntheticEvent) => void;
  onKeyPress?: (event: SyntheticEvent) => void;
  onKeyDown?: (event: SyntheticEvent) => void;
  onKeyUp?: (event: SyntheticEvent) => void;
  onBlur?: (event: SyntheticEvent) => void;
  onInput?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onReset?: (event: SyntheticEvent) => void;
  cols?: number;
  rows?: number;
  value?: string;
  defaultValue?: string;
  isValid?: boolean;
  isMultiline?: boolean;
  errorMessage?: string;
  ariaLabel?: string;
  type?: string;
  debounceInterval?: number;
  multiLineIsResizable?: boolean;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledInput?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
};

const createIcon = (
  StyledIconContainer: string & StyledComponentBase<any, {}>,
  iconPrefix: ReactNode,
) => {
  if (typeof iconPrefix === 'string') {
    return (
      <StyledIconContainer>
        <Icon size="16px" path={iconPrefix} />
      </StyledIconContainer>
    );
  }

  return <StyledIconContainer>{iconPrefix}</StyledIconContainer>;
};

const defaultCallback = () => {};

const TextInput = ({
  id,
  placeholder,
  iconPrefix,
  onClear,
  onChange = defaultCallback,
  debouncedOnChange = defaultCallback,
  onKeyPress,
  onKeyDown,
  onKeyUp,
  onBlur,
  onInput,
  onFocus,
  onReset,
  cols = 10,
  rows = 10,
  value,
  defaultValue,
  isValid,
  isMultiline,
  errorMessage,
  ariaLabel,
  type = 'text',
  StyledContainer = Container,
  StyledInput, // Not defaulting here due to the issue with <input as="textarea" />
  StyledIconContainer = IconContainer,
  debounceInterval = 8,
  multiLineIsResizable,
}: TextInputProps) => {
  // Debounce the change function using useCallback so that the function is not initialized each time it renders
  const debouncedChange = useCallback(debounce(debouncedOnChange, debounceInterval), []);

  // Determine the correct input type. Using a single input and the 'as' keyword
  // to display as a text area disables the ability to set cols/rows
  let InputComponent: string & StyledComponentBase<any, {}> = TextInputContainer;
  if (StyledInput) {
    InputComponent = StyledInput;
  } else if (isMultiline) {
    InputComponent = TextAreaInputContainer;
  }

  return (
    <StyledContainer isValid={isValid}>
      {iconPrefix && createIcon(StyledIconContainer, iconPrefix)}
      {/*
        // @ts-ignore */}
      <InputComponent
        cols={cols}
        rows={rows}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(e: SyntheticEvent) => {
          e.persist();
          onChange(e);
          debouncedChange(e);
        }}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
        onReset={onReset}
        onInput={onInput}
        value={value || defaultValue}
        id={id}
        type={type}
        multiLineIsResizable={multiLineIsResizable}
      />
      {onClear && (
        <StyledIconContainer onClick={onClear}>
          <Icon path={mdiClose} size="1em" />
        </StyledIconContainer>
      )}
      {isValid === false && errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}
    </StyledContainer>
  );
};

TextInput.Container = Container;
TextInput.Input = TextInputContainer;
TextInput.IconContainer = IconContainer;
TextInput.TextArea = TextAreaInputContainer;

export default TextInput;
