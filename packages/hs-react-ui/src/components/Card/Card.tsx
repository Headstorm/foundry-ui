import React, { ReactNode } from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../enums/colors';
import timings from '../../enums/timings';
import { Div } from '../../htmlElements';

export const CardContainer = styled(Div)`
  ${({ elevation }: { elevation: number }) => `
    display: inline-flex;
    flex-flow: column nowrap;

    font-size: 1rem;

    border-radius: 0.25rem;

    border: ${!elevation ? `1px solid ${colors.grayXlight}` : '0px solid transparent'};

    transition: box-shadow ${timings.slow}, border ${timings.normal};
    box-shadow: 0rem ${elevation * 0.25}rem ${elevation * 0.75}rem ${elevation
    * -0.25}rem rgba(0,0,0,${0.6 - elevation * 0.1});
    background-color: ${colors.background};
  `}
`;

export const Header = styled(Div)`
  padding: 1.5rem 1.5rem 0rem;
  border-radius: 0.25rem 0.25rem 0rem 0rem;
  font-weight: bold;
  color: ${colors.grayDark};
`;

export const NoPaddingHeader = styled(Header)`
  padding: 0rem;
  overflow: hidden;
`;

export const Body = styled(Div)`
  padding: 1.5rem 1.5rem;
  color: ${colors.grayMedium};
`;

export const Footer = styled(Div)`
  padding: 1rem 1.5rem;
  display: flex;
  flex-flow: row wrap;

  justify-content: flex-end;
  text-align: right;

  color: ${colors.grayLight};

  border-top: 1px solid ${colors.grayXlight};
  border-radius: 0rem 0rem 0.25rem 0.25rem;
`;

export interface CardProps {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledBody?: string & StyledComponentBase<any, {}>;
  StyledFooter?: string & StyledComponentBase<any, {}>;

  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  elevation?: number;
}

const Card = ({
  StyledContainer = CardContainer,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,
  header,
  children,
  footer,

  elevation = 1,
}: CardProps) => (
  <StyledContainer elevation={elevation}>
    {header && <StyledHeader>{header}</StyledHeader>}
    {children && <StyledBody>{children}</StyledBody>}
    {footer && <StyledFooter>{footer}</StyledFooter>}
  </StyledContainer>
);

Card.Header = Header;
Card.NoPaddingHeader = NoPaddingHeader;
Card.Footer = Footer;
Card.Body = Body;
Card.Container = CardContainer;

export default Card;
