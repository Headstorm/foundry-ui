import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import Colors from '../../enums/Colors';

export const StyledLabel = styled.label`
  ${({ color = colors.grayDark }: { color: colors | string }) => `
    display: block;
    color: ${color};
    text-transform: uppercase;
    margin-bottom: .25rem;
    font-size: .75rem;
  `}
`;


export interface LabelProps {
  labelText: string,
  color ?: colors | string
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
