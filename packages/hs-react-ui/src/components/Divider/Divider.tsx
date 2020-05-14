import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import { DividerTypes } from '../../enums/DividerTypes';
import colors from '../../constants/colors';

export const DefaultDivider = styled.hr`
  border: 1px, solid, ${colors.grayDark};
  width: 90%;
`;

export const DefaultDividerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: .5rem;
`;

export interface DividerProps {
  StyledDivider?: StyledComponentBase<any, {}>,
  StyledDividerContainer?: StyledComponentBase<any, {}>,
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer
  }: DividerProps) => (
    <StyledDividerContainer>
      <StyledDivider />
    </StyledDividerContainer>
  );

export default Divider;