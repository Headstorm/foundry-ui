import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import colors from '../../enums/colors';
import fonts from 'src/enums/fonts';

export const DefaultStyledLabel = styled.label`
  ${({ color = colors.grayLight }: { color: colors | string }) => `
    display: inline-flex;
    color: ${color};
    font-family: ${fonts.body};
    margin-bottom: .25em;
    font-size: .75em;
  `}
`;

export const DefaultStyledTextContainer = styled.div`

`;

export const DefaultStyledLabelContainer = styled.div`
  
`;

const DefaultStyledIconContainer = styled.span`
  display: inline-flex;
  margin-left: 0.25rem;
`;

export interface LabelProps {
  labelText: string;
  color?: colors | string;
  isValid?: boolean;
  colorValid?: colors | string;
  colorInvalid?: colors | string;
  htmlFor: string;
  isRequired: boolean;
  children?: JSX.Element;
  StyledLabelContainer?: string & StyledComponentBase<any, {}>;
  StyledTextContainer?: string & StyledComponentBase<any, {}>;
  StyledLabel?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
}

const Label = ({
  labelText,
  StyledLabelContainer = DefaultStyledLabelContainer,
  StyledTextContainer = DefaultStyledTextContainer,
  StyledLabel = DefaultStyledLabel,
  StyledIconContainer = DefaultStyledIconContainer,
  color = colors.grayLight,
  isValid,
  colorValid = colors.success,
  colorInvalid = colors.destructive,
  htmlFor = 'default',
  isRequired = false,
  children,
}: LabelProps) => {
    let shownColor: string | colors;
    let shownIcon: string | JSX.Element;

    if (isValid === true) {
      shownColor = colorValid;
      shownIcon = mdiCheckBold;
    } else if (isValid === false) {
      shownColor = colorInvalid;
      shownIcon = '';
    } else {
      shownColor = color;
      shownIcon = isRequired ? mdiAsterisk : '';
    }

    return (
    <StyledLabelContainer>
      <StyledTextContainer>
      <StyledLabel htmlFor={htmlFor} color={shownColor}>
        {labelText}
      </StyledLabel>
      <StyledIconContainer>
      <Icon path={shownIcon} size=".75rem" color={shownColor} />
      </StyledIconContainer>
      </StyledTextContainer>
      {children}
    </StyledLabelContainer>
    );
};

export default Label;
