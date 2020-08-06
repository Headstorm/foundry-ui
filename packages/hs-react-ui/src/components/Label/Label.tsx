import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import { Div, Label as LabelElement, Span } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useColors } from '../../context';

export const DefaultStyledLabel = styled(LabelElement)`
  ${({ color }: { color: string }) => {
    const { grayLight } = useColors();
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
  StyledLabelContainer?: string & StyledComponentBase<any, {}>;
  StyledTextContainer?: string & StyledComponentBase<any, {}>;
  StyledLabel?: string & StyledComponentBase<any, {}>;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;

  labelContainerProps?: SubcomponentPropsType;
  textContainerProps?: SubcomponentPropsType;
  labelProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;

  labelText?: string;
  color?: string;
  isValid?: boolean;
  colorValid?: string;
  colorInvalid?: string;
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
  color,
  isValid,
  colorValid,
  colorInvalid,
  htmlFor = 'default',
  isRequired = false,
  children,
}: LabelProps) => {
  const colors = useColors();
  let shownColor: string;
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
