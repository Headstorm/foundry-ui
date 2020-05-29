import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold } from '@mdi/js';
import { mdiAsterisk } from '@mdi/js';
import colors from '../../enums/colors';

export const StyledLabel = styled.label`
  ${({ color = colors.grayLight }: { color: colors | string }) => `
    display: inline-flex;
    color: ${color};
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: .25em;
    font-size: .75em;
  `}
`;

export const Child = styled.input`
  ${({ color = colors.grayLight }: { color: colors | string }) => `
  display: block;  
  border: solid 2px ${color};
  width: 15%;
  `}
`;

export const StyledDiv = styled.div`
  
`;

const IconContainer = styled.span`
  display: inline-flex;
  margin-left: 0.25rem;
`;

export interface LabelProps {
  labelText: string;
  color?: colors | string;
  isValid: boolean;
  checkValidity: boolean;
  colorValid: colors | string;
  colorInvalid: colors | string;
  htmlFor: string;
  isRequired: boolean;
}

const Label = ({
  labelText,
  color = colors.grayLight,
  isValid = false,
  checkValidity = false,
  colorValid = colors.success,
  colorInvalid = colors.destructive,
  htmlFor = 'default',
  isRequired = false,
}: LabelProps) => (
  <StyledDiv>
    <StyledLabel htmlFor={htmlFor} color={checkValidity ? (isValid ? colorValid : colorInvalid) : color}>
      {labelText}
    </StyledLabel>
    <IconContainer>
    <Icon path={isRequired ? (checkValidity && isValid ? mdiCheckBold : mdiAsterisk) : (checkValidity && isValid ? mdiCheckBold : '')} size="11px" color={checkValidity ? (isValid ? colorValid : colorInvalid) : color}/>
    </IconContainer>
    <Child id={htmlFor} color={checkValidity ? (isValid ? colorValid : colorInvalid) : color}/>
  </StyledDiv>
);

export default Label;
