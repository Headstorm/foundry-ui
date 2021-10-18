import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { getFontColorFromVariant, disabledStyles } from '../../utils/color';
import { Div } from '../../htmlElements';
import { StyledSubcomponentType, SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';
import Button from '../Button';
import Text from '../Text';
import variants from '../../enums/variants';

export type HideAnimationPropType = {
  length?: number;
  origin?: string;
  collapsed: boolean;
};

export const defaultHideAnimation = ({
  length = 0.1,
  origin = 'top',
  collapsed,
}: HideAnimationPropType) => `
    transform: ${collapsed ? 'scaleY(0)' : 'scaleY(1)'};
    transform-origin: ${origin};
    transition: transform ${length}s cubic-bezier(0, .7, .9, 1);;    
`;

export const Container = styled(Div)`
  ${({
    color,
    height,
    position,
    location,
    animation,
    disabled,
  }: {
    color: string;
    height: string;
    position: string;
    location: string;
    animation: () => void;
    disabled: boolean;
  }) => `
    position: ${position};
    ${location}
    background-color: ${color};
    color: ${getFontColorFromVariant(variants.fill, color)};
    height: ${height};
    width: 100%;
    ${animation}    
    ${disabled ? disabledStyles() : ''}
  `}
`;

const NavFlex = styled(Div)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: stretch;
  padding-left: 1rem;
`;

export const NavSection = styled(Div)`
  ${({ bodyBelow }: { bodyBelow: boolean }) => `
    flex-direction: ${bodyBelow ? 'column' : 'row'};
    align-items: ${bodyBelow ? 'flex-start' : 'center'};
  `}
  display: flex;
  height: 100%;
`;

export const Header = styled(NavSection)`
  ${({ bodyBelow }: { bodyBelow: boolean }) => `
    align-self: ${bodyBelow ? 'flex-start' : 'center'};
  `}
  margin-right: 1rem;
  width: fit-content;
`;

export const Body = styled(NavSection)`
  width: 100%;
`;

export const NavButtonContainer = styled(Button.Container)`
  width: fit-content;
  padding: 0.25rem 0rem 0.25rem 1rem;
  height: 100%;
  border-radius: 0 0 0 0;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    box-shadow: 0 0 0;
  }
`;

export const Footer = styled(NavSection)`
  margin-left: auto;
`;

export type NavButton = {
  label: string;
  onClick: () => void;
};

const getGetScrollSpeed = (scrollSpeed = 50) => {
  let lastPos: number | null;
  let newPos: number | null;
  let timer: NodeJS.Timeout;
  let delta: number;
  const delay = scrollSpeed; // in "ms" (higher means lower fidelity )

  function clear() {
    lastPos = null;
    delta = 0;
  }

  clear();

  return () => {
    newPos = window.scrollY;
    if (lastPos != null) {
      delta = newPos - lastPos;
    }
    lastPos = newPos;
    clearTimeout(timer);
    timer = setTimeout(clear, delay);
    return delta;
  };
};

export const getScrollPosition = (): number => {
  const doc = document.documentElement;
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
};

export interface MainNavigationProps {
  StyledContainer?: StyledSubcomponentType;
  StyledHeader?: StyledSubcomponentType;
  StyledBody?: StyledSubcomponentType;
  StyledFooter?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  headerProps?: SubcomponentPropsType;
  bodyProps?: SubcomponentPropsType;
  footerProps?: SubcomponentPropsType;
  navButtonProps?: SubcomponentPropsType[];

  containerRef?: React.RefObject<HTMLDivElement>;
  headerRef?: React.RefObject<HTMLDivElement>;
  bodyRef?: React.RefObject<HTMLDivElement>;
  footerRef?: React.RefObject<HTMLDivElement>;
  navButtonRefs?: React.RefObject<HTMLButtonElement>[];

  header?: ReactNode;
  body?: ReactNode;
  navButtons?: NavButton[];
  labelFontSize?: string;
  footer?: ReactNode;

  hidden?: boolean;
  disabled?: boolean;
  hideBody?: boolean;
  bodyBelow?: boolean;
  hiddenBelowY?: number;
  onScroll?: () => void;
  HideAnimationProps?: HideAnimationPropType;
  hideAnimation?: (value: HideAnimationPropType) => void;
  // set CSS position type ie `relative`, `absolute`, `static`, etc.
  position?: string;
  // set CSS location directly like `top: 10px; left: 10px;`
  location?: string;
  height?: string;
  color?: string;
}

const MainNavigation = ({
  StyledContainer = Container,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,

  containerProps = {},
  headerProps = {},
  bodyProps = {},
  footerProps = {},
  navButtonProps = [{}],

  containerRef,
  headerRef,
  bodyRef,
  footerRef,
  navButtonRefs = [],

  header,
  body,
  navButtons,
  labelFontSize = '1rem',
  footer,

  hidden = false,
  disabled = false,
  hideBody = false,
  bodyBelow = false,
  // auto hiding below Y uses window.onscroll by default, for server-side rendering use your own onscroll to set the hidden argument
  hiddenBelowY,
  onScroll,
  HideAnimationProps,
  hideAnimation = defaultHideAnimation,
  position = 'relative',
  location = '',
  height = 'fit-content',
  color,
}: MainNavigationProps): JSX.Element => {
  const { colors } = useTheme();
  const backgroundColor = color || colors.primaryDark;
  const [isHidden, setIsHidden] = React.useState(false);
  if (typeof hiddenBelowY !== 'undefined') {
    window.onscroll = () => {
      if (onScroll) {
        onScroll();
      }
      setIsHidden(getScrollPosition() > hiddenBelowY);
    };
  }
  const animationProps = HideAnimationProps || {
    collapsed: hidden || isHidden,
  };

  return (
    <StyledContainer
      ref={containerRef}
      height={height}
      color={backgroundColor}
      position={position}
      location={location}
      animation={hideAnimation(animationProps)}
      disabled={disabled}
      {...containerProps}
    >
      {bodyBelow ? (
        <>
          <NavFlex>
            {header && (
              <StyledHeader ref={headerRef} {...headerProps}>
                {header}
              </StyledHeader>
            )}
            {footer && (
              <StyledFooter ref={footerRef} {...footerProps}>
                {footer}
              </StyledFooter>
            )}
          </NavFlex>
          {!hideBody ? (
            <StyledBody ref={bodyRef} bodyBelow={bodyBelow} {...bodyProps}>
              {navButtons &&
                navButtons.map((navButton, index) => (
                  <Button
                    containerRef={navButtonRefs[index]}
                    key={navButton.label}
                    onClick={navButton.onClick}
                    color="#0000"
                    StyledContainer={NavButtonContainer}
                    containerProps={{ ...navButtonProps[index] }}
                  >
                    <Text
                      color={getFontColorFromVariant(variants.fill, backgroundColor)}
                      size={labelFontSize}
                    >
                      {navButton.label}
                    </Text>
                  </Button>
                ))}
              {body && body}
            </StyledBody>
          ) : (
            ''
          )}
        </>
      ) : (
        <NavFlex>
          {header && (
            <StyledHeader ref={headerRef} {...headerProps}>
              {header}
            </StyledHeader>
          )}
          {!hideBody ? (
            <StyledBody ref={bodyRef} bodyBelow={bodyBelow} {...bodyProps}>
              {navButtons &&
                navButtons.map((navButton, index) => (
                  <Button
                    containerRef={navButtonRefs[index]}
                    key={navButton.label}
                    onClick={navButton.onClick}
                    color="#0000"
                    StyledContainer={NavButtonContainer}
                    containerProps={{ ...navButtonProps[index] }}
                  >
                    <Text
                      color={getFontColorFromVariant(variants.fill, backgroundColor)}
                      size={labelFontSize}
                    >
                      {navButton.label}
                    </Text>
                  </Button>
                ))}
              {body && body}
            </StyledBody>
          ) : (
            ''
          )}
          {footer && (
            <StyledFooter ref={footerRef} {...footerProps}>
              {footer}
            </StyledFooter>
          )}
        </NavFlex>
      )}
    </StyledContainer>
  );
};

MainNavigation.Container = Container;
MainNavigation.NavButtonContainer = NavButtonContainer;
MainNavigation.Header = Header;
MainNavigation.Body = Body;
MainNavigation.Footer = Footer;
// if using server-side rendering these will not work, since they use window.location, and should be handled outside the component
MainNavigation.getScrollSpeed = getGetScrollSpeed;
MainNavigation.getScrollPosition = getScrollPosition;

export default MainNavigation;
