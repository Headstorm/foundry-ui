import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import { TextInputTypes } from '../../enums/TextInputTypes';


const TextInputContainer = styled.input`
${({ hasIconPrefix, hasMultiline }: { hasIconPrefix: boolean, hasMultiline: boolean }) => `
padding-left: ${ hasIconPrefix ? '2em' : '.5em'} ;
cols: ${hasMultiline ? '100' : ''};
rows: ${hasMultiline ? '10' : ''};
border-radius: 0.5em;
border 0 none;
outline: 0 none;
height: 2em;
font-family: Gothic;
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
color: red
`;

const IconContainer = styled.div`
position: absolute;
left: .5rem;
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
  textInputType?: TextInputTypes,
  placeholder?: string,
  iconPrefix?: any,
  onClear?: (event: SyntheticEvent) => void,
  onChange?: (event: SyntheticEvent) => void,
  value?: string,
  multiline?: any,
  cols?: any,
  rows?: any,
  errorMessage?: string,
  style?: any;
}

// const TextInputContainers = {
//   [TextInputTypes.icon]: IconInputContainer
// };


const getTextArea = (rows, cols) => {
  
}

const TextInput = ({
  placeholder = 'test props',
  iconPrefix,
  onClear,
  onChange,
  value,
  multiline,
  errorMessage,
  style, 

}: TextInputProps) => {
  const TextInput = TextInputContainer
  return (
    <DivContainer>
      {<IconContainer>{iconPrefix}</IconContainer>}
      {onClear && value && <ClearIconContainer onClick={onClear}><Icon path={mdiClose} size='16px' /></ClearIconContainer>}
      <TextInput as={multiline ? 'textarea' : 'input'} hasMultiline={!!multiline} hasIconPrefix={!!iconPrefix} placeholder={placeholder} onChange={onChange} value={value} />
      {<ErrorContainer>{errorMessage}</ErrorContainer>}
    </DivContainer>
  )
}
export default TextInput;