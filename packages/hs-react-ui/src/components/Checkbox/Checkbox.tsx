import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import Icon from '@mdi/react';
import { mdiCheck, mdiCheckboxBlank, mdiClose, mdiMinus } from '@mdi/js';
import { CheckboxTypes } from '../../enums/CheckboxTypes';
import colors from '../../constants/colors';

export const Input = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
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

export const Label = styled.label`
  display: flex;
  align-items: center;

  ${Input}:focus + & {
    box-shadow: 0 0 0 3px ${colors.grayXlight};
  }
`;

export const Box = styled.div`
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

  checkboxType: CheckboxTypes;
  children: string | Node;
  checked: boolean;
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

  checkboxType = CheckboxTypes.default,
  checked = false,
  children,
}: CheckboxProps) => {
  const iconPath = iconPaths[checkboxType];
  const IconComponent = iconComponents[checkboxType];
  return (
    <StyledLabel>
      <StyledCheckboxContainer>
        <StyledBox>{checked ? <IconComponent path={iconPath} /> : null}</StyledBox>
        <StyledInput checked={checked} />
      </StyledCheckboxContainer>
      {children}
    </StyledLabel>
  );
};

export default Checkbox;
