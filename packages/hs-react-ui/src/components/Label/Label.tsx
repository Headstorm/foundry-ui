import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import colors from '../../enums/colors';
import { Div, Label as LabelElement, Span } from '../../htmlElements';
import { useColors } from '../../context';

export const DefaultStyledLabel = styled(LabelElement)`
  ${({ color }: { color: colors | string }) => {
    const grayLight = useColors('grayLight');
    const labelColor = color || grayLight;
    return `
      display: inline-flex;
      color: ${labelColor};
      margin-bottom: .25em;
      font-size: .75em;
    `;
  }}
`;

export const DefaultStyledTextContainer = styled(Div)``;

export const DefaultStyledLabelContainer = styled(Div)``;

const DefaultStyledIconContainer = styled(Span)`
  display: inline-flex;
  margin-left: 0.25rem;
`;

export interface LabelProps {
  labelText?: string;
  color?: colors | string;
  isValid?: boolean;
  colorValid?: colors | string;
  colorInvalid?: colors | string;
  htmlFor?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
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
  color,
  isValid,
  colorValid,
  colorInvalid,
  htmlFor = 'default',
  isRequired = false,
  children,
}: LabelProps) => {
  const colors = useColors();
  let shownColor: string | colors;
  let shownIcon: string | JSX.Element;

  if (isValid === true) {
    shownColor = colorValid || colors.success;
    shownIcon = mdiCheckBold;
  } else if (isValid === false) {
    shownColor = colorInvalid || colors.destructive;
    shownIcon = isRequired ? mdiAsterisk : '';
  } else {
    shownColor = color || colors.grayLight;
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

Label.LabelContainer = DefaultStyledLabelContainer;
Label.TextContainer = DefaultStyledTextContainer;
Label.Label = DefaultStyledLabel;
Label.IconContainer = DefaultStyledIconContainer;

export default Label;
