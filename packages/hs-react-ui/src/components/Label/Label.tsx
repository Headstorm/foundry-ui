import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import colors from '../../enums/colors';

export const StyledLabel = styled.label`
  ${({ color = colors.grayLight }: { color: colors | string }) => `
    display: inline-flex;
    color: ${color};
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: .25em;
    font-size: .8em;
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
}: LabelProps) => {
    let shownColor: string | colors;
    let shownIcon: string | JSX.Element;

    if (checkValidity) {
      shownColor = isValid ? colorValid : colorInvalid;
    } else {
      shownColor = color;
    }

    if (isRequired) {
      shownIcon = checkValidity && isValid ? mdiCheckBold : mdiAsterisk;
    } else {
      shownIcon = checkValidity && isValid ? mdiCheckBold : '';
    }

    return(
    <StyledDiv>
      <StyledLabel htmlFor={htmlFor} color={shownColor}>
        {labelText}
      </StyledLabel>
      <IconContainer>
      <Icon path={shownIcon} size="11px" color={shownColor}/>
      </IconContainer>
      <Child id={htmlFor} color={shownColor}/>
    </StyledDiv>
    )
};

export default Label;
