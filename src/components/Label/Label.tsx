import React from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiAsterisk } from '@mdi/js';
import { useLabel } from 'react-aria';
import { Div, Label as LabelElement, Span } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useTheme } from '../../context';

export const DefaultStyledLabel = styled(LabelElement)`
  ${({ color }: { color: string }) => {
    const { colors } = useTheme();
    const labelColor = color || colors.grayLight;
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
  StyledLabelContainer?: StyledSubcomponentType;
  StyledTextContainer?: StyledSubcomponentType;
  StyledLabel?: StyledSubcomponentType;
  StyledIconContainer?: StyledSubcomponentType;

  labelContainerProps?: SubcomponentPropsType;
  textContainerProps?: SubcomponentPropsType;
  labelProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;

  labelContainerRef?: React.RefObject<HTMLDivElement>;
  textContainerRef?: React.RefObject<HTMLDivElement>;
  iconContainerRef?: React.RefObject<HTMLSpanElement>;
  labelRef?: React.RefObject<HTMLLabelElement>;

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
  labelContainerRef,
  textContainerRef,
  iconContainerRef,
  labelRef,

  labelText,
  color,
  isValid,
  colorValid,
  colorInvalid,
  htmlFor = 'default',
  isRequired = false,
  children,
}: LabelProps): JSX.Element => {
  const { colors } = useTheme();
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

  // add aria-label for accessibility if no labelText provided
  let mergedLabelProps;
  if (labelText) {
    mergedLabelProps = { ...labelProps, label: labelText };
  } else {
    mergedLabelProps = { ...labelProps, 'aria-label': 'label' };
  }

  const { labelProps: ariaProps, fieldProps: ariaFieldProps } = useLabel(mergedLabelProps);

  // add aria props to the child component
  const childrenWithAriaProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // dont overwrite any preexisting props
      return React.cloneElement(child, { ...ariaFieldProps, ...child.props });
    }
    return child;
  });

  return (
    <StyledLabelContainer ref={labelContainerRef} {...labelContainerProps}>
      <StyledTextContainer ref={textContainerRef} {...textContainerProps}>
        <StyledLabel
          {...ariaProps}
          htmlFor={htmlFor}
          color={shownColor}
          ref={labelRef}
          {...labelProps}
        >
          {labelText}
        </StyledLabel>
        <StyledIconContainer aria-hidden="true" ref={iconContainerRef} {...iconContainerProps}>
          <Icon path={shownIcon} size=".75rem" color={shownColor} />
        </StyledIconContainer>
      </StyledTextContainer>
      {/* Only render children with aria props if there is one child */}
      {React.Children.count(children) === 1 ? childrenWithAriaProps : children}
    </StyledLabelContainer>
  );
};

Label.LabelContainer = DefaultStyledLabelContainer;
Label.TextContainer = DefaultStyledTextContainer;
Label.Label = DefaultStyledLabel;
Label.IconContainer = DefaultStyledIconContainer;

export default Label;
