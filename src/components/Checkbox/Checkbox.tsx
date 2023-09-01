import React, { RefObject } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiCheckboxBlank, mdiClose, mdiMinus } from '@mdi/js';

import { darken } from 'polished';
import { useCheckbox } from 'react-aria';
import { useToggleState } from '@react-stately/toggle';
import { StyledBaseDiv, StyledBaseInput, StyledBaseLabel } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAnalytics, useTheme } from '../../context';
import variants from '../../enums/variants';
import CheckboxTypes from '../../enums/checkboxTypes';
import { disabledStyles } from '../../utils/color';
import { mergeRefs } from '../../utils/refs';

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const Input = styled(StyledBaseInput).attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const Label = styled(StyledBaseLabel)`
  ${({ disabled }) => {
    return `
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 2em;
      font-size: 1em;
      
      ${disabled ? disabledStyles() : ''}
    `;
  }}
`;

export const Box = styled(StyledBaseDiv)`
  ${({ variant, checked, checkboxType }) => {
    const { colors } = useTheme();
    let color = colors.grayLight;
    if (checkboxType === CheckboxTypes.check && checked) color = colors.success;
    if (checkboxType === CheckboxTypes.cross && checked) color = colors.destructive;
    const backgroundColor = variant === variants.fill && checked ? color : colors.background;

    return `
      ${
        variant === variants.outline || variant === variants.fill
          ? `border: 1px solid ${color};`
          : ''
      } 
      background-color: ${backgroundColor};
      border-radius: 2px;
      width: 1em;
      height: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      margin-right: 0.5em;
      &:hover {
        background-color: ${darken(0.05, backgroundColor)}
      }
    `;
  }}
`;

export const CheckboxContainer = styled.div`
  ${() => {
    const { colors } = useTheme();
    return `
      display: inline-block;
      vertical-align: middle;
      &:focus-within {
        ${Box} {
          box-shadow: 0 0 5px 0.150rem ${colors.tertiary};
        }
      }
    `;
  }}
`;

export const BaseIcon = styled(Icon)`
  ${({ color }) => `
    overflow: visible;
    color: ${color};
    width: 1em;
    height: 1em;
  `}
` as StyledSubcomponentType;

const CheckIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { colors } = useTheme();
    return `
      color: ${variant === variants.fill ? colors.background : colors.success};
    `;
  }}
`;

const CrossIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { colors } = useTheme();
    return `
      color: ${variant === variants.fill ? colors.background : colors.destructive};
    `;
  }}
`;

const DefaultIcon = styled(BaseIcon)`
  ${() => {
    const { colors } = useTheme();
    return `
      color: ${colors.grayLight}
    `;
  }}
`;

const NeutralIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { colors } = useTheme();
    const color = variant === variants.fill ? colors.background : colors.grayMedium;
    return `
      color: ${color};
      path {
        stroke-width: 2px;
      }
    `;
  }}
`;

export interface CheckboxProps {
  StyledLabel?: StyledSubcomponentType;
  StyledCheckboxContainer?: StyledSubcomponentType;
  StyledBox?: StyledSubcomponentType;
  StyledInput?: StyledSubcomponentType;
  StyledIcon?: StyledSubcomponentType;

  labelProps?: SubcomponentPropsType;
  checkboxContainerProps?: SubcomponentPropsType;
  boxProps?: SubcomponentPropsType;
  inputProps?: SubcomponentPropsType;
  iconProps?: SubcomponentPropsType;

  checkboxType?: CheckboxTypes;
  variant?: variants;
  color?: string;
  children?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onClick: (event: React.MouseEvent) => void;

  containerRef?: React.RefObject<HTMLDivElement>;
  boxRef?: React.RefObject<HTMLDivElement>;
  labelRef?: React.RefObject<HTMLLabelElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const iconPaths = {
  [CheckboxTypes.check]: mdiCheck,
  [CheckboxTypes.cross]: mdiClose,
  [CheckboxTypes.neutral]: mdiMinus,
  [CheckboxTypes.default]: mdiCheckboxBlank,
  [CheckboxTypes.fill]: mdiCheckboxBlank,
};

export const iconComponents = {
  [CheckboxTypes.check]: CheckIcon,
  [CheckboxTypes.cross]: CrossIcon,
  [CheckboxTypes.neutral]: NeutralIcon,
  [CheckboxTypes.default]: DefaultIcon,
  [CheckboxTypes.fill]: DefaultIcon,
};

const Checkbox = ({
  StyledLabel = Label,
  StyledCheckboxContainer = CheckboxContainer,
  StyledBox = Box,
  StyledInput = Input,
  StyledIcon,

  labelProps = {},
  checkboxContainerProps = {},
  boxProps = {},
  inputProps = {},
  iconProps = {},

  checkboxType = CheckboxTypes.check,
  variant = variants.fill,
  color,
  checked = false,
  children,
  disabled = false,
  onClick,
  containerRef,
  boxRef,
  labelRef,
  inputRef,
}: CheckboxProps): JSX.Element => {
  const iconPath = iconPaths[checkboxType];
  const IconComponent = StyledIcon || iconComponents[checkboxType];

  // add aria-label for accessibility if no children elements are provided
  const mergedInputProps = children
    ? { isDisabled: disabled, isSelected: checked, ...inputProps, children }
    : { isDisabled: disabled, isSelected: checked, ...inputProps, 'aria-label': 'checkbox' };

  const state = useToggleState({ ...mergedInputProps });
  const internalRef = React.useRef<HTMLInputElement>();
  const { inputProps: ariaProps } = useCheckbox(
    mergedInputProps,
    state,
    internalRef as RefObject<HTMLInputElement>,
  );
  const handleEventWithAnalytics = useAnalytics();
  const handleClick = (e: any) =>
    handleEventWithAnalytics('Checkbox', onClick, 'onClick', e, checkboxContainerProps);

  return (
    <StyledLabel disabled={disabled} data-test-id="hsui-Checkbox" ref={labelRef} {...labelProps}>
      <StyledCheckboxContainer ref={containerRef} {...checkboxContainerProps}>
        <StyledBox
          checkboxType={checkboxType}
          checked={checked}
          variant={variant}
          {...boxProps}
          ref={boxRef}
        >
          {checked ? (
            <IconComponent
              aria-hidden="true"
              data-test-id="hsui-Checkbox-Icon"
              path={iconPath}
              color={color}
              variant={variant}
              {...iconProps}
            />
          ) : null}
        </StyledBox>
        <StyledInput
          role="checkbox"
          {...ariaProps}
          data-test-id="hsui-Checkbox-Input"
          onClick={handleClick}
          checked={checked}
          ref={mergeRefs<HTMLInputElement | undefined>([inputRef, internalRef])}
          {...inputProps}
        />
      </StyledCheckboxContainer>
      {children}
    </StyledLabel>
  );
};

Checkbox.Label = Label;
Checkbox.Box = Box;
Checkbox.Input = Input;
Checkbox.Container = CheckboxContainer;
Checkbox.Types = CheckboxTypes;
Checkbox.CheckIcon = CheckIcon;
Checkbox.CrossIcon = CrossIcon;
Checkbox.NeutralIcon = NeutralIcon;
Checkbox.FillIcon = DefaultIcon;
export default Checkbox;
