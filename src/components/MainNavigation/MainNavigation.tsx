import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
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
  ${({ bodyBelow }: { bodyBelow: boolean }) => `
  align-self: stretch;
  width: ${bodyBelow ? '100%' : 'fit-content'};
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 0 0 0 0;
  &:focus {
    box-shadow: 0 0 0;
  }
  `}
`;

export const NavText = styled(Text.Container)`
  &:hover {
    text-decoration: underline;
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
  StyledNavButtonContainer?: StyledSubcomponentType;

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
  // navButtons are a list of links as buttons with onClicks that are included in the body section before the body object
  navButtons?: NavButton[];
  labelFontSize?: string;
  activeButton?: number;
  footer?: ReactNode;

  hidden?: boolean;
  disabled?: boolean;

  // removes body, good for mobile to hide unless the body is expanded below
  hideBody?: boolean;
  // puts body below the header and footer sections
  bodyBelow?: boolean;
  // enables automatically hiding the navbar below a certain scroll position, only usable when window.onscroll
  // is available. Otherwise use the hidden prop and your own function to detect position
  hiddenBelowY?: number;
  // function to call when window.onscroll is used
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
  StyledNavButtonContainer = NavButtonContainer,

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
  activeButton,
  labelFontSize = '1rem',
  footer,

  hidden = false,
  disabled = false,
  hideBody = false,
  bodyBelow = false,
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

  const getNavColor = (index: number) => {
    if (activeButton === index) {
      return backgroundColor !== 'transparent'
        ? darken(0.08, backgroundColor)
        : 'rgba(0, 0, 0, 0.08)';
    }
    return backgroundColor;
  };

  const FinalBody = () => {
    return !hideBody ? (
      <StyledBody ref={bodyRef} bodyBelow={bodyBelow} {...bodyProps}>
        {navButtons &&
          navButtons.map((navButton, index) => (
            <Button
              containerRef={navButtonRefs[index]}
              key={navButton.label}
              onClick={navButton.onClick}
              color={getNavColor(index)}
              StyledContainer={StyledNavButtonContainer}
              containerProps={{ bodyBelow, ...navButtonProps[index] }}
            >
              <Text
                color={getFontColorFromVariant(variants.fill, backgroundColor)}
                size={labelFontSize}
                StyledContainer={NavText}
              >
                {navButton.label}
              </Text>
            </Button>
          ))}
        {body && body}
      </StyledBody>
    ) : (
      <></>
    );
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
      <NavFlex>
        {header && (
          <StyledHeader ref={headerRef} {...headerProps}>
            {header}
          </StyledHeader>
        )}
        {!bodyBelow && <FinalBody />}
        {footer && (
          <StyledFooter ref={footerRef} {...footerProps}>
            {footer}
          </StyledFooter>
        )}
      </NavFlex>
      {bodyBelow && <FinalBody />}
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
