import React from 'react';
import styled from 'styled-components';

import { DividerTypes } from '../../enums/DividerTypes';
import colors from '../../constants/colors';

const DefaultDivider = styled.hr`
  display: block;
  margin: .25rem;
  border: 1px, solid, ${colors.grayDark};
`;

const PrimaryDivider = styled(DefaultDivider)`
  border: 1px, solid, ${colors.primary};
`;

const Dividers = {
  [DividerTypes.default]: DefaultDivider,
  [DividerTypes.primary]: PrimaryDivider,
}

export interface DividerProps {
  dividerType: DividerTypes
}

const Divider = ({dividerType}: DividerProps) => {
  const RenderedDivider = Dividers[dividerType];
  return (
    <RenderedDivider />
  ) 
};

export default Divider;