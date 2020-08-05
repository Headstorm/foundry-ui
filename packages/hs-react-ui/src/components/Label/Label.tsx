import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import colors from '../../enums/colors';
import { Div, Label as LabelElement, Span } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';

export const DefaultStyledLabel = styled(LabelElement)`
  ${({ color = colors.grayLight }: { color: colors | string }) => `
    display: inline-flex;
    color: ${color};
    margin-bottom: .25em;
    font-size: .75em;
  `}
`;

export const DefaultStyledTextContainer = styled(Div)``;

export const DefaultStyledLabelContainer = styled(Div)``;

const DefaultStyledIconContainer = styled(Span)`
  display: inline-flex;
  margin-left: 0.25rem;
`;

export interface LabelProps {
  StyledLabelContainer?: string & StyledComponentBase<any, {}>;
  StyledTextContainer?: string & StyledComponentBase<any, {}>;
  StyledLabel?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;

  labelContainerProps?: SubcomponentPropsType;
  textContainerProps?: SubcomponentPropsType;
  labelProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;

  labelText?: string;
  color?: colors | string;
  isValid?: boolean;
  colorValid?: colors | string;
  colorInvalid?: colors | string;
  htmlFor?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
}

const Label = ({
  StyledLabelContainer = DefaultStyledLabelContainer,
  StyledTextContainer = DefaultStyledTextContainer,
  StyledLabel = DefaultStyledLabel,
  StyledIconContainer = DefaultStyledIconContainer,
  labelContainerProps = {},
  textContainerProps = {},
  labelProps = {},
  iconContainerProps = {},

  labelText,
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
    shownIcon = isRequired ? mdiAsterisk : '';
  } else {
    shownColor = color;
    shownIcon = isRequired ? mdiAsterisk : '';
  }

  return (
    <StyledLabelContainer {...labelContainerProps}>
      <StyledTextContainer {...textContainerProps}>
        <StyledLabel htmlFor={htmlFor} color={shownColor} {...labelProps}>
          {labelText}
        </StyledLabel>
        <StyledIconContainer {...iconContainerProps}>
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
