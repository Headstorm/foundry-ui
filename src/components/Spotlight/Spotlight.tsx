import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { Portal } from 'react-portal';

import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { AnimatedDiv } from '../../htmlElements';

const SpotlightContainer = styled(AnimatedDiv)`
  height: 100%;
  width: 100%;

  position: fixed;
  top: 0;
  left: 0;
  clip-path: url(#foundryMask);

  z-index: 1000;
`;

export type SpotlightProps = {
  StyledContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  containerRef?: React.RefObject<HTMLDivElement>;

  children?: React.ReactNode;
  targetElementRef?: React.MutableRefObject<HTMLElement | undefined>;
  backgroundDarkness?: number;
  backgroundBlur?: string;
  shape?: 'circle' | 'box' | 'rounded box'; // TODO make this an enum and export it
  roundedCornerRadius?: number;
  padding?: number;
  onClick?: (e: React.MouseEvent) => void;
  animateTargetChanges?: boolean;
  animationSpringConfig?: Record<string, unknown>;
};

const Spotlight = ({
  StyledContainer = SpotlightContainer,
  containerProps,
  containerRef,

  children,
  targetElementRef,
  // backgroundBlur = '0rem',
  backgroundDarkness = 0.2,
  shape = 'circle',
  roundedCornerRadius = 4,
  padding = 8, // 8px === .5rem
  onClick,
  animateTargetChanges = true,
  animationSpringConfig,
}: SpotlightProps): JSX.Element | null => {
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const rect = useMemo<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>(() => {
    console.log(targetElementRef?.current);

    if (targetElementRef?.current) {
      return {
        x: targetElementRef?.current.clientLeft,
        y: targetElementRef?.current.clientTop,
        width: targetElementRef?.current.clientWidth,
        height: targetElementRef?.current.clientHeight,
      };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }, [targetElementRef]);

  const { containerOpacity, containerBackgroundColor } = useSpring({
    from: {
      containerOpacity: 0,
      // containerFilter: 'blur(0rem) brightness(1)',
      containerBackgroundColor: 'rgba(0, 0, 0, 0)',
    },
    to: {
      containerOpacity: 1,
      // containerFilter: `blur(${backgroundBlur}) brightness(${1 - backgroundDarkness})`,
      containerBackgroundColor: `rgba(0, 0, 0, ${1 - backgroundDarkness})`,
    },
    config: {
      friction: 75,
      tension: 550,
      mass: 5,
    },
    ...animationSpringConfig,
  });

  // TODO: use a resize observer to detect when the bounds of the target change
  const updateWindowBounds = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowBounds);

    return () => {
      window.removeEventListener('resize', updateWindowBounds);
    };
  }, []);

  const handleClick = (evt: React.MouseEvent) => {
    // TODO: analytics stuff here once that is merged
    if (onClick) {
      onClick(evt);
    }
  };

  // TODO: pass this to useSpring - ensure number of points don't change
  const outerRectPath = `M 0 0 h${windowDimensions.width} v${windowDimensions.height} h-${windowDimensions.width}`;
  const innerShapePath = `
    M ${rect.x} ${rect.y + rect.height / 2}
    Q ${rect.x} ${rect.y}, ${rect.x + rect.width / 2} ${rect.y}
    Q ${rect.x + rect.width} ${rect.y}, ${rect.x + rect.width} ${rect.y + rect.height / 2}
    Q ${rect.x + rect.width} ${rect.y + rect.height}, ${rect.x + rect.width / 2} ${
    rect.y + rect.height
  }
    Q ${rect.x} ${rect.y + rect.height}, ${rect.x} ${rect.y + rect.height / 2}
  `;
  const finalPath = `${outerRectPath} ${innerShapePath}`;

  return (
    <Portal>
      <StyledContainer
        ref={containerRef}
        onClick={handleClick}
        style={{
          // backdropFilter: containerFilter,
          backgroundColor: containerBackgroundColor,
          opacity: containerOpacity,
        }}
        {...containerProps}
      />
      <svg
        style={{ position: 'fixed', top: 0, left: 0 }}
        viewBox={`0 0 ${windowDimensions.width} ${windowDimensions.height}`}
        width={windowDimensions.width}
        height={windowDimensions.height}
      >
        <defs>
          <clipPath clipRule="evenodd" id="foundryMask">
            <animated.path
              stroke-width="1.5794"
              stroke-miterlimit="10"
              fill="#FFFFFF"
              stroke="#000000"
              d={finalPath}
            />
          </clipPath>
        </defs>
      </svg>
      {children}
    </Portal>
  );
};

Spotlight.Container = SpotlightContainer;

export default Spotlight;
