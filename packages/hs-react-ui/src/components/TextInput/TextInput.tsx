import React, { SyntheticEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import fonts from '../../enums/fonts';

export type StyledInputProps = {
  iconPrefix?: string | JSX.Element;
  rows?: number;
  cols?: number;
  isMultiline?: number;
};

const TextInputContainer = styled.textarea`
  ${({ isMultiline, iconPrefix }: StyledInputProps) => `
    padding-left: ${!!iconPrefix ? '2em' : '.5em'} ;
    border-radius: 0.5em;
    border 1px solid;
    outline: 0 none;
    height: ${ isMultiline ? undefined : '2em'};
    ${fonts.body}
    font-size: 16px;
    width: 10rem;
    background-color: white;
  `}
`;

const ClearIconContainer = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  color: red;
`;

const IconContainer = styled.span`
${({ isMultiline, }: { isMultiline?: boolean }) => `
  position: absolute;
  left: .5rem;
  height: 16px;
  margin-top: ${ isMultiline ? '0.25rem' : '0.5rem'};
`}`;

const ErrorText = styled.span`
  font-size: .75rem;
  color: red;
`;

const Label = styled.label`
  display: grid;
`

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: string | JSX.Element;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent) => void;
  value?: string;
  rows?: number;
  cols?: number;
  isMultiline?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  Container?: StyledComponentBase<any, {}>;
  ErrorLabel?: StyledComponentBase<any, {}>;
  Input?: StyledComponentBase<"input", any, StyledInputProps, never>;

};

const createIcon = (iconPrefix: string | JSX.Element, isMultiline?: boolean) => {
  if (typeof iconPrefix === 'string') {
    return <IconContainer isMultiline={isMultiline}><Icon size="16px" path={iconPrefix} /></IconContainer>;
  }

  return <IconContainer>{iconPrefix}</IconContainer>;
}

const TextInput = ({
  id,
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange,
  rows,
  cols,
  value,
  isValid,
  isMultiline,
  errorMessage,
  Container = Label,
  Input = TextInputContainer,
  ErrorLabel = ErrorText,

}: TextInputProps) => {

  return (
    <Container>
      {iconPrefix && createIcon(iconPrefix, isMultiline)}
      {onClear && value && (
        <ClearIconContainer onClick={onClear}>
          <Icon path={mdiClose} size="16px" />
        </ClearIconContainer>
      )}
      <Input
        as={isMultiline ? 'textarea' : 'input'}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        onChange={onChange}
        value={value}
        id={id}
        iconPrefix={iconPrefix}
      />
      <ErrorLabel>{isValid === false && errorMessage}</ErrorLabel>
    </Container>
  );
}

TextInput.ErrorLabel = ErrorText;
TextInput.Container = Label;
TextInput.Input = TextInputContainer;
export default TextInput;
