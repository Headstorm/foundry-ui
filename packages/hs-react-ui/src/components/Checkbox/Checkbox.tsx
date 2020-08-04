import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiCheckboxBlank, mdiClose, mdiMinus } from '@mdi/js';

import colors from '../../enums/colors';
import { Div, Input as InputElement, Label as LabelElement } from '../../htmlElements';
import { SubcomponentPropType } from '../commonTypes';

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
  display: flex;
  align-items: center;
  cursor: pointer;

  ${Input}:focus + & {
    box-shadow: 0 0 0 3px ${colors.grayXlight};
  }
`;

export const Box = styled(Div)`
  border: 1px solid ${colors.grayLight};
  border-radius: 2px;
  width: 0.75rem;
  height: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  margin-right: 0.5rem;
`;

export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const StyledIcon = styled(Icon)`
  overflow: visible;
`;

const CheckIcon = styled(StyledIcon)`
  color: ${colors.success};
  height: 2rem;
  width: 1.4rem;
  margin: 0 0 0.1rem 0.35rem;
`;

const CrossIcon = styled(StyledIcon)`
  color: ${colors.destructive};
  height: 1rem;
  width: 1rem;
`;

const DefaultIcon = styled(StyledIcon)`
  color: ${colors.grayMedium};
  height: 0.7rem;
  width: 0.7rem;
`;

const NeutralIcon = styled(StyledIcon)`
  color: ${colors.grayMedium};
  height: 0.65rem;
  width: 0.65rem;
  path {
    stroke: ${colors.grayMedium};
    stroke-width: 2px;
  }
`;

export interface CheckboxProps {
  StyledLabel?: string & StyledComponentBase<any, {}>;
  StyledCheckboxContainer?: string & StyledComponentBase<any, {}>;
  StyledBox?: string & StyledComponentBase<any, {}>;
  StyledInput?: string & StyledComponentBase<any, {}>;

  labelProps?: SubcomponentPropType;
  checkboxContainerProps?: SubcomponentPropType;
  boxProps?: SubcomponentPropType;
  inputProps?: SubcomponentPropType;

  checkboxType?: CheckboxTypes;
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

  labelProps = {},
  checkboxContainerProps = {},
  boxProps = {},
  inputProps = {},

  checkboxType = CheckboxTypes.default,
  checked = false,
  children,

  onClick,
}: CheckboxProps) => {
  const iconPath = iconPaths[checkboxType];
  const IconComponent = iconComponents[checkboxType];
  return (
    <StyledLabel data-test-id="hsui-Checkbox" {...labelProps}>
      <StyledCheckboxContainer {...checkboxContainerProps}>
        <StyledBox {...boxProps}>
          {checked ? <IconComponent data-test-id="hsui-Checkbox-Icon" path={iconPath} /> : null}
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
export default Checkbox;
