import React, { ReactNode, SyntheticEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import fonts from '../../enums/fonts';
import colors from '../../enums/colors';
import { Div, Input as InputElement } from '../../htmlElements';

const Container = styled.div`
  width: 10rem;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  border 2px solid ${colors.grayMedium};
  border-radius: 0.25em;
  ${fonts.body}

  *,
  * * {
    box-sizing: border-box;
  }
`;

const TextInputContainer = styled(InputElement)`
  border: 0 none;
  outline: 0 none;
  height: 2em;
  ${fonts.body}
  font-size: 1em;
  width: 0px;
  flex: 1 1 100%;
  background-color: ${colors.background};
`;

const IconContainer = styled(Div)`
  padding: 0.5em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grayMedium};
`;

const ErrorContainer = styled(Div)`
  position: absolute;
  top: calc(100% + 0.25em);
  color: ${colors.destructive};
`;

export type TextInputProps = {
  id?: string;
  placeholder?: string;
  iconPrefix?: ReactNode;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent) => void;
  cols?: number;
  rows?: number;
  value?: string;
  isMultiline?: boolean;
  errorMessage?: string;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledTextInputContainer?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
};

const TextInput = ({
  id,
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange,
  cols = 10,
  rows = 10,
  value,
  isMultiline,
  errorMessage,
  StyledContainer = Container,
  StyledTextInputContainer = TextInputContainer,
  StyledIconContainer = IconContainer,
}: TextInputProps) => (
  <StyledContainer>
    {iconPrefix && <StyledIconContainer>{iconPrefix}</StyledIconContainer>}
    {/*
      // @ts-ignore */}
    <StyledTextInputContainer
      as={isMultiline ? 'textarea' : 'input'}
      cols={cols}
      rows={rows}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      id={id}
    />
    {onClear && value && (
      <StyledIconContainer onClick={onClear}>
        <Icon path={mdiClose} size="1em" />
      </StyledIconContainer>
    )}
    {errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}
  </StyledContainer>
);

TextInput.Container = Container;
TextInput.TextInputContainer = TextInputContainer;
TextInput.IconContainer = IconContainer;

export default TextInput;
