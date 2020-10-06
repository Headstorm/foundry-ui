import React, { ReactNode, MouseEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import { darken } from 'polished';

import timings from '../../enums/timings';
import { Div } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
import { getShadowStyle } from '../../utils/styles';
import InteractionFeedback, {
  InteractionFeedbackProps,
} from '../InteractionFeedback/InteractionFeedback';
import FeedbackTypes from '../../enums/feedbackTypes';

const defaultOnClick = () => {};

export type CardContainerProps = {
  elevation: number;
  feedbackType: FeedbackTypes;
  onClick: (evt: MouseEvent) => void;
};

export const CardContainer = styled(Div)`
  ${({ elevation, feedbackType, onClick }: CardContainerProps) => {
    const { colors } = useTheme();

    return `
      ${onClick !== defaultOnClick ? 'cursor: pointer;' : ''}
      display: inline-flex;
      flex-flow: column nowrap;
      font-size: 1rem;
      border-radius: 0.25rem;
      border: ${!elevation ? `1px solid ${colors.grayXlight}` : '0px solid transparent'};
      transition:
        filter ${timings.slow},
        box-shadow ${timings.slow},
        border ${timings.normal},
        background-color ${timings.normal};
      ${getShadowStyle(elevation, colors.shadow)}
      background-color: ${colors.background};
      ${
        feedbackType === FeedbackTypes.simple && onClick !== defaultOnClick
          ? `
            &:active {
              background-color: ${
                colors.background !== 'transparent'
                  ? darken(0.1, colors.background)
                  : 'rgba(0, 0, 0, 0.1)'
              };
            }
          `
          : ''
      }
  `;
  }}
`;

export const Header = styled(Div)`
  ${({ hasBody, hasFooter }) => {
    const { colors } = useTheme();

    return `
      padding: 1.5rem 1.5rem ${hasBody || hasFooter ? '0rem' : ''};
      border-radius: 0.25rem 0.25rem 0rem 0rem;
      font-weight: bold;
      color: ${colors.grayDark};
    `;
  }}
`;

export const NoPaddingHeader = styled(Header)`
  padding: 0;
  overflow: hidden;
`;

export const Body = styled(Div)`
  ${() => {
    const { colors } = useTheme();

    return `
      padding: 1.5rem 1.5rem;
      color: ${colors.grayMedium};
    `;
  }}
`;

export const Footer = styled(Div)`
  ${() => {
    const { colors } = useTheme();

    return `
      padding: 1rem 1.5rem;
      display: flex;
      flex-flow: row wrap;

      justify-content: flex-end;

      color: ${colors.grayLight};

      border-radius: 0rem 0rem 0.25rem 0.25rem;
    `;
  }}
`;

const StyledFeedbackContainer = styled(InteractionFeedback.Container)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;
export interface CardProps {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledBody?: string & StyledComponentBase<any, {}>;
  StyledFooter?: string & StyledComponentBase<any, {}>;

  containerProps?: SubcomponentPropsType;
  headerProps?: SubcomponentPropsType;
  bodyProps?: SubcomponentPropsType;
  footerProps?: SubcomponentPropsType;
  interactionFeedbackProps?: Omit<InteractionFeedbackProps, 'children'>;

  onClick?: (evt: MouseEvent) => void;

  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  elevation?: number;
  disableFeedback?: boolean;
  feedbackType?: FeedbackTypes;

  containerRef?: React.RefObject<HTMLDivElement>;
  headerRef?: React.RefObject<HTMLDivElement>;
  bodyRef?: React.RefObject<HTMLDivElement>;
  footerRef?: React.RefObject<HTMLDivElement>;
  interactiveFeedbackRef?: React.RefObject<HTMLDivElement>;
}

const Card = ({
  StyledContainer = CardContainer,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,

  containerProps,
  headerProps,
  bodyProps,
  footerProps,
  interactionFeedbackProps,

  containerRef,
  headerRef,
  bodyRef,
  footerRef,
  interactiveFeedbackRef,

  onClick = defaultOnClick,

  header,
  children,
  footer,

  elevation = 1,
  feedbackType = FeedbackTypes.ripple,
}: CardProps): JSX.Element | null => {
  const transitionProps = {
    ...InteractionFeedback.defaultTransitionProps,
    enter: {
      ...InteractionFeedback.defaultTransitionProps,
      r: 300,
    },
  };
  const hasHeader = Boolean(header);
  const hasBody = Boolean(children);
  const hasFooter = Boolean(footer);

  return (
    <StyledContainer
      onClick={onClick}
      elevation={elevation}
      feedbackType={feedbackType}
      {...containerProps}
      ref={containerRef}
    >
      {header && (
        <StyledHeader hasBody={hasBody} hasFooter={hasFooter} ref={headerRef} {...headerProps}>
          {header}
        </StyledHeader>
      )}
      {children && (
        <StyledBody hasHeader={hasHeader} hasFooter={hasFooter} ref={bodyRef} {...bodyProps}>
          {children}
        </StyledBody>
      )}
      {footer && (
        <StyledFooter hasHeader={hasHeader} hasBody={hasBody} ref={footerRef} {...footerProps}>
          {footer}
        </StyledFooter>
      )}
      {feedbackType !== FeedbackTypes.simple && onClick !== defaultOnClick && (
        <InteractionFeedback
          color="rgba(0,0,0,0.1)"
          transitionProps={transitionProps}
          StyledContainer={StyledFeedbackContainer}
          containerRef={interactiveFeedbackRef}
          {...interactionFeedbackProps}
        />
      )}
    </StyledContainer>
  );
};

Card.Header = Header;
Card.NoPaddingHeader = NoPaddingHeader;
Card.Footer = Footer;
Card.Body = Body;
Card.Container = CardContainer;

export default Card;
