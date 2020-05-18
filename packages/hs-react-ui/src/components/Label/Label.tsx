import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ColorTypes } from '../../enums/ColorTypes';

export const StyledLabel = styled.label`
  ${({ color = ColorTypes.grayDark }: { color: ColorTypes | string }) => `
    display: block;
    color: ${color};
    text-transform: uppercase;
    margin-bottom: .25rem;
    font-size: .75rem;
  `}
`;


export interface LabelProps {
  labelText: string,
  color ?: ColorTypes | string
};

const Label: FunctionComponent<LabelProps> = ({
  labelText,
  color,
}) => (
  <StyledLabel color={color}>
    {labelText}
  </StyledLabel>
);

export default Label;
