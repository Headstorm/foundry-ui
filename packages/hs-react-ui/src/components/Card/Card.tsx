import React, { ReactNode, MouseEvent } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import useMeasure from 'react-use-measure';
import { ResizeObserver } from '@juggle/resize-observer';
import { darken } from 'polished';

import timings from '../../enums/timings';
import { Div } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
import { getShadowStyle } from '../../utils/styles';
import InteractionFeedback, {
  InteractionFeedbackProps,
} from '../InteractionFeedback/InteractionFeedback';
import FeedbackTypes from 'src/enums/feedbackTypes';

export type CardContainerProps = {
  elevation: number;
  feedbackType: FeedbackTypes;
  disableFeedback: boolean;
};

export const CardContainer = styled(Div)`
  ${({ elevation, feedbackType, disableFeedback }: CardContainerProps) => {
    const { colors } = useTheme();

    return `
      display: inline-flex;
      flex-flow: column nowrap;
      font-size: 1rem;
      border-radius: 0.25rem;
      border: ${!elevation ? `1px solid ${colors.grayXlight}` : '0px solid transparent'};
      transition: filter ${timings.slow}, box-shadow ${timings.slow}, border ${timings.normal};
      ${getShadowStyle(elevation, colors.shadow)}
      background-color: ${colors.background};
      ${
        feedbackType === FeedbackTypes.simple && !disableFeedback
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
  ${() => {
    const { colors } = useTheme();

    return `
      padding: 1.5rem 1.5rem 0rem;
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
}

const defaultOnClick = () => {};

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

  onClick = defaultOnClick,

  header,
  children,
  footer,

  elevation = 1,
  disableFeedback,
  feedbackType = FeedbackTypes.ripple,
}: CardProps): JSX.Element | null => {
  const { colors } = useTheme();
  // get the bounding box of the card so that we can set it's width to r
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [ref, cardBounds] = useMeasure({ polyfill: ResizeObserver });

  if (!disableFeedback && feedbackType !== FeedbackTypes.simple && onClick !== defaultOnClick) {
    // 5% larger than the width to account for the circle to cover the entire card
    const feedbackRadius = cardBounds.width * 1.05;
    const feedbackRatio = feedbackRadius / 100; // 100 is the default r
    const tension = (750 / feedbackRatio) * 2; // 750 is the default tension, x2 makes it look a little quicker over large cards
    const transitionProps = {
      from: {
        r: 0,
        opacity: 0.25,
        fill: colors.grayLight,
      },
      enter: {
        r: feedbackRadius,
        opacity: 0.25,
        fill: colors.grayLight,
      },
      leave: {
        r: 0,
        opacity: 0,
        fill: colors.grayLight,
      },
      config: {
        mass: 1,
        tension: tension,
        friction: 35,
      },
    };
    return (
      <InteractionFeedback transitionProps={transitionProps} {...interactionFeedbackProps}>
        <StyledContainer
          ref={ref}
          onClick={onClick}
          elevation={elevation}
          feedbackType={feedbackType}
          disableFeedback={disableFeedback || onClick === defaultOnClick}
          {...containerProps}
        >
          {header && <StyledHeader {...headerProps}>{header}</StyledHeader>}
          {children && <StyledBody {...bodyProps}>{children}</StyledBody>}
          {footer && <StyledFooter {...footerProps}>{footer}</StyledFooter>}
        </StyledContainer>
      </InteractionFeedback>
    );
  }
  return (
    <StyledContainer
      onClick={onClick}
      elevation={elevation}
      feedbackType={feedbackType}
      disableFeedback={disableFeedback || onClick === defaultOnClick}
      {...containerProps}
    >
      {header && <StyledHeader {...headerProps}>{header}</StyledHeader>}
      {children && <StyledBody {...bodyProps}>{children}</StyledBody>}
      {footer && <StyledFooter {...footerProps}>{footer}</StyledFooter>}
    </StyledContainer>
  );
};

Card.Header = Header;
Card.NoPaddingHeader = NoPaddingHeader;
Card.Footer = Footer;
Card.Body = Body;
Card.Container = CardContainer;

export default Card;
