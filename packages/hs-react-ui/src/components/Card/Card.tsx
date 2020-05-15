import React, {FunctionComponent, ReactNode} from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';
import timings from '../../constants/timings';

export const CardContainer = styled.div`
  ${({ elevation = 0 }: { elevation: number }) => `
    display: inline-flex;
    flex-flow: column nowrap;
    width: fit-content;

    font-family: Gotham;
    font-size: 1rem;

    border-radius: 0.25rem;
    margin: .25rem;

    border: 1px solid ${!elevation ? colors.grayXlight: 'transparent'};

    transition: box-shadow ${timings.slow};
    box-shadow: 0rem ${elevation * .25}rem ${elevation * .75}rem ${elevation * -.25}rem rgba(0,0,0,${.6 - elevation * .1});
    background-color: ${colors.background};
  `}
`;

export const Header = styled.div`
  padding: 1.5rem 1.5rem 0rem;
  font-weight: bold;
  text-transform: uppercase;
  color: ${colors.grayDark};
`;

export const Body = styled.div`
  padding: 1.5rem 1.5rem;
  color: ${colors.grayMedium};
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-flow: row wrap;

  justify-content: flex-end;
  text-align: right;

  color: ${colors.grayLight};

  border-top: 1px solid ${colors.grayXlight};
  border-radius: 0rem 0rem .25rem .25rem;
`;

export interface CardProps {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledHeader?: String & StyledComponentBase<any, {}>,
  StyledBody?: String & StyledComponentBase<any, {}>,
  StyledFooter?: String & StyledComponentBase<any, {}>,

  header?: ReactNode,
  footer?: ReactNode,

  elevation?: Number
}

const Card: FunctionComponent<CardProps> = ({
  StyledContainer = CardContainer,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,

  header,
  children,
  footer,

  elevation = 0
}) => (
  <StyledContainer elevation={elevation}>
    {header && <StyledHeader>{header}</StyledHeader>}
    {children && <StyledBody>{children}</StyledBody>}
    {footer && <StyledFooter>{footer}</StyledFooter>}
  </StyledContainer>
);

export default Card;
