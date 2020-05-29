import React, { SyntheticEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import fonts from '../../enums/fonts';

const TextInputContainer = styled.input`
  ${({ hasIconPrefix, hasMultiline }: { hasIconPrefix: boolean; hasMultiline: boolean }) => `
padding-left: ${hasIconPrefix ? '2em' : '.5em'} ;
cols: ${hasMultiline ? '100' : ''};
rows: ${hasMultiline ? '10' : ''};
border-radius: 0.5em;
border 0 none;
outline: 0 none;
height: 2em;
${fonts.body}
font-size: 16px; 
width: 100%;
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

const IconContainer = styled.div`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

const ErrorContainer = styled.div`
  top: 100px;
  postition: abosolute;
  color: red;
`;

const DivContainer = styled.div`
  width: 10rem;
  position: relative;
`;

export type TextInputProps = {
  placeholder?: string;
  iconPrefix?: any;
  onClear?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent) => void;
  value?: string;
  isMultiline?: any;
  errorMessage?: string;
  StyledDivContainer?: StyledComponentBase<any, {}>;
};

const TextInput = ({
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange,
  value,
  isMultiline,
  errorMessage,
  StyledDivContainer = DivContainer,
}: TextInputProps) => {
  const StyledTextInputContainer = TextInputContainer;
  return (
    <StyledDivContainer>
      {iconPrefix && <IconContainer>{iconPrefix}</IconContainer>}
      {onClear && value && (
        <ClearIconContainer onClick={onClear}>
          <Icon path={mdiClose} size="16px" />
        </ClearIconContainer>
      )}
      <StyledTextInputContainer
        as={isMultiline ? 'textarea' : 'input'}
        hasMultiline={!!isMultiline}
        hasIconPrefix={!!iconPrefix}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      {errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}
    </StyledDivContainer>
  );
};
export default TextInput;
