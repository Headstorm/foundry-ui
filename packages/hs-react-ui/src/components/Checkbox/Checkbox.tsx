import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiCheckboxBlank, mdiClose, mdiMinus } from '@mdi/js';

import { Div, Input as InputElement, Label as LabelElement } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useColors } from '../../context';
import variants from '../../enums/variants';
import { darken } from 'polished';

export enum CheckboxTypes {
  fill = 'fill',
  cross = 'cross',
  check = 'check',
  default = 'default',
  neutral = 'neutral',
}

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const Input = styled(InputElement).attrs({ type: 'checkbox' })`
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

export const Label = styled(LabelElement)`
  ${() => {
    const { grayXlight } = useColors();
    return `
      display: flex;
      align-items: center;
      cursor: pointer;
    
      ${Input}:focus + & {
        box-shadow: 0 0 0 3px ${grayXlight};
      }
    `;
  }}
`;

export const Box = styled(Div)`
  ${({ variant, checked, checkboxType }) => {
    const { grayLight, success, destructive, background } = useColors();
    let color = grayLight;
    if (checkboxType === CheckboxTypes.check && checked) color = success;
    if (checkboxType === CheckboxTypes.cross && checked) color = destructive;
    const backgroundColor = variant === variants.fill && checked ? color : background;
    
    return `
      ${(variant === variants.outline || variant === variants.fill) ? `border: 1px solid ${color};` : ''} 
      background-color: ${backgroundColor};
      border-radius: 2px;
      width: 1rem;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      margin-right: 0.5rem;
      &:hover {
        background-color: ${darken(0.05, backgroundColor)}
      }
    `;
  }}
`;

export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const BaseIcon = styled(Icon)`
  overflow: visible;
  height: 1rem;
  width: 1rem;
` as string & StyledComponentBase<any, {}>;

const CheckIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { success, background } = useColors();
    console.log({ variant })
    return `
      color: ${variant === variants.fill ? background : success };
    `;
  }}
`;

const CrossIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { destructive, background } = useColors();
    return `
      color: ${variant === variants.fill ? background : destructive };
    `;
  }}
`;

const DefaultIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { grayMedium, background } = useColors();
    
    return `
      color: ${variant === variants.fill ? background : grayMedium };
    `;
  }}
`;

const NeutralIcon = styled(BaseIcon)`
  ${({ variant }) => {
    const { grayMedium, background } = useColors();
    const color = variant === variants.fill ? background : grayMedium;
    return `
      color: ${color};
      path {
        stroke: ${color};
        stroke-width: 2px;
      }
    `;
  }}
`;

export interface CheckboxProps {
  StyledLabel?: string & StyledComponentBase<any, {}>;
  StyledCheckboxContainer?: string & StyledComponentBase<any, {}>;
  StyledBox?: string & StyledComponentBase<any, {}>;
  StyledInput?: string & StyledComponentBase<any, {}>;
  StyledIcon?: string & StyledComponentBase<any, {}>;

  labelProps?: SubcomponentPropsType;
  checkboxContainerProps?: SubcomponentPropsType;
  boxProps?: SubcomponentPropsType;
  inputProps?: SubcomponentPropsType;
  iconProps?: SubcomponentPropsType;

  checkboxType?: CheckboxTypes;
  variant?: variants;
  children?: React.ReactNode;
  checked?: boolean;
  onClick: (event: React.MouseEvent) => void;
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

  checkboxType = CheckboxTypes.default,
  variant = variants.fill,
  checked = false,
  children,

  onClick,
}: CheckboxProps) => {
  const iconPath = iconPaths[checkboxType];
  const IconComponent = StyledIcon || iconComponents[checkboxType];
  return (
    <StyledLabel data-test-id="hsui-Checkbox" {...labelProps}>
      <StyledCheckboxContainer {...checkboxContainerProps}>
        <StyledBox checkboxType={checkboxType} checked={checked} variant={variant} {...boxProps}>
          {checked ? <IconComponent data-test-id="hsui-Checkbox-Icon" path={iconPath} variant={variant} {...iconProps} /> : null}
        </StyledBox>
        <StyledInput
          data-test-id="hsui-Checkbox-Input"
          onClick={onClick}
          checked={checked}
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
