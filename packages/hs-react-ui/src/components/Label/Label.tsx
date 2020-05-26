import React from 'react';
import styled from 'styled-components';

import colors from '../../enums/colors';

export const StyledLabel = styled.label`
  ${({ color = colors.grayDark }: { color: colors | string }) => `
    display: block;
    color: ${color};
    text-transform: uppercase;
    margin-bottom: .25em;
    font-size: .75em;
  `}
`;

export interface LabelProps {
  labelText: string;
  color?: colors | string;
}

const Label = ({ labelText, color = colors.grayDark }: LabelProps) => (
  <StyledLabel color={color}>{labelText}</StyledLabel>
);

export default Label;
