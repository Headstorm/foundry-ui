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
    text-transform: uppercase;
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
  value?: string;
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
  value,
  htmlFor = 'default',
  isRequired = false,
}: LabelProps) => (
  <StyledDiv>
    <StyledLabel htmlFor={htmlFor} color={checkValidity ? (isValid ? colorValid : colorInvalid) : color}>
      {labelText}
    </StyledLabel>
    <IconContainer>
    <Icon path={isRequired ? (checkValidity && isValid ? mdiCheckBold : mdiAsterisk) : (checkValidity && isValid ? mdiCheckBold : '')} size="16px" color={checkValidity ? (isValid ? colorValid : colorInvalid) : color}/>
    </IconContainer>
    <Child id={htmlFor} color={checkValidity ? (isValid ? colorValid : colorInvalid) : color} value={value}/>
  </StyledDiv>
);

export default Label;
