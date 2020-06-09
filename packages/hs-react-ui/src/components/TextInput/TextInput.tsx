import React, { ReactNode, SyntheticEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import debounce from 'lodash.debounce';
import fonts from '../../enums/fonts';
import colors from '../../enums/colors';

const Container = styled.div`
  ${({ isValid }: { isValid?: boolean }) => `
  border 2px solid ${isValid === false ? colors.destructive : colors.grayMedium};
  min-width: 10rem;
  // width: 100%;
  position: relative;
  display: flex;
  flex-flow: row;
  border-radius: 0.25em;
  ${fonts.body}

  *,
  * * {
    box-sizing: border-box;
  }
`}
`;

const TextInputContainer = styled.input`
  border: 0 none;
  outline: 0 none;
  height: 2em;
  ${fonts.body}
  font-size: 1em;
  // width: 0px;
  // flex: 1 1 100%;
  background-color: ${colors.background};
`;

const TextAreaInputContainer = styled.textarea`
  border: 0 none;
  outline: 0 none;
  min-height: 2em;
  ${fonts.body}
  font-size: 1em;
  min-width: 0px;
  // flex: 1 1 100%;
  background-color: ${colors.background};
  resize: none;
`;

const IconContainer = styled.div`
  padding: 0.5em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grayMedium};
`;

const ErrorContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.25em);
  color: ${colors.destructive};
`;

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: string | ReactNode;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent) => void;
  debouncedOnChange?: (event: SyntheticEvent) => void;
  onKeypress?: (event: SyntheticEvent) => void;
  onKeydown?: (event: SyntheticEvent) => void;
  onKeyup?: (event: SyntheticEvent) => void;
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
  debounceInterval?: number;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  Input?: string & StyledComponentBase<any, {}>;
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


const TextInput = ({
  id,
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange = (e: SyntheticEvent) => {},
  debouncedOnChange = () => {},
  onKeypress,
  onKeydown,
  onKeyup,
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
  StyledContainer = Container,
  Input, // Not defaulting here due to the issue with <input as="textarea" />
  StyledIconContainer = IconContainer,
  debounceInterval = 8,
}: TextInputProps) => {

  const debouncedChange = debounce(debouncedOnChange, debounceInterval);

  // Determine the correct input type. Using a single input and the 'as' keyword
  // to display as a text area disables the ability to set cols/rows
  let InputComponent: string & StyledComponentBase<any, {}> = TextInputContainer;
  if (Input) {
    InputComponent = Input;
  } else if (isMultiline) {
    InputComponent = TextAreaInputContainer;
  }

  console.log()
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
        onKeyPress={onKeypress}
        onKeyDown={onKeydown}
        onKeyUp={onKeyup}
        onFocus={onFocus}
        onBlur={onBlur}
        onReset={onReset}
        onInput={onInput}
        value={value ? value : defaultValue}
        id={id}
      />
      {onClear && value && (
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
