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
  contain: strict;
  clip-path: url(#foundryMask);
  background-color: colors.black;

  z-index: 1000;
`;

const BackgroundBlurrer = styled(AnimatedDiv)`
  position: fixed;
`;

export type SpotlightProps = {
  StyledContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  containerRef?: React.RefObject<HTMLDivElement>;

  children?: React.ReactNode;
  targetElementRef?: React.MutableRefObject<HTMLElement | undefined>;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  shape?: 'circular' | 'box' | 'rounded box'; // TODO make this an enum and export it
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
  backgroundBlur = '0.5rem',
  backgroundDarkness = 0.2,
  shape = 'circular',
  roundedCornerRadius = 4,
  padding = 16, // 8px === .5rem
  onClick,
  animateTargetChanges = true,
  animationSpringConfig,
}: SpotlightProps): JSX.Element | null => {
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const rect = useMemo<DOMRect>(() => {
    if (targetElementRef?.current) {
      const bounds = targetElementRef?.current?.getBoundingClientRect();
      bounds.x -= padding;
      bounds.y -= padding;
      bounds.width += padding * 2;
      bounds.height += padding * 2;
      return bounds;
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }, [targetElementRef, padding, windowDimensions]);

  console.log(rect);
  const {
    containerOpacity,
    containerFilter,
    containerBackgroundColor,

    topBlurHeight,
    topBlurWidth,
    bottomBlurY,
    bottomBlurHeight,
    bottomBlurWidth,
    leftBlurY,
    leftBlurHeight,
    leftBlurWidth,
    rightBlurY,
    rightBlurHeight,
    rightBlurWidth,
  } = useSpring({
    from: {
      containerOpacity: 0,
      containerFilter: `blur(${backgroundBlur})`,
      containerBackgroundColor: `rgba(0,0,0,${1 - backgroundDarkness})`,

      topBlurWidth: windowDimensions.width / 2,
      topBlurHeight: windowDimensions.height / 2,

      bottomBlurY: windowDimensions.height / 2,
      bottomBlurWidth: windowDimensions.width,
      bottomBlurHeight: windowDimensions.height / 2,

      leftBlurY: windowDimensions.height / 2,
      leftBlurWidth: windowDimensions.width / 2,
      leftBlurHeight: windowDimensions.height / 2,

      rightBlurY: windowDimensions.height / 2,
      rightBlurWidth: windowDimensions.width / 2,
      rightBlurHeight: windowDimensions.height / 2,
    },
    to: {
      containerOpacity: 1,
      containerFilter: `blur(${backgroundBlur})`,
      containerBackgroundColor: `rgba(0,0,0,${1 - backgroundDarkness})`,

      topBlurWidth: windowDimensions.width,
      topBlurHeight: rect.y,

      bottomBlurY: rect.bottom,
      bottomBlurWidth: windowDimensions.width,
      bottomBlurHeight: windowDimensions.height - rect.bottom,

      leftBlurY: rect.y,
      leftBlurWidth: rect.x,
      leftBlurHeight: rect.height,

      rightBlurY: rect.y,
      rightBlurWidth: windowDimensions.width - rect.right,
      rightBlurHeight: rect.height,
    },
    config: {
      friction: 75,
      tension: 550,
      mass: 5,
      clamp: true,
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
          backgroundColor: containerBackgroundColor,
          opacity: containerOpacity,
        }}
        {...containerProps}
      >
        <BackgroundBlurrer
          style={{
            backdropFilter: containerFilter,
            top: 0,
            left: 0,
            width: topBlurWidth,
            height: topBlurHeight,
          }}
        />
        <BackgroundBlurrer
          style={{
            backdropFilter: containerFilter,
            top: bottomBlurY,
            left: 0,
            width: bottomBlurWidth,
            height: bottomBlurHeight,
          }}
        />
        <BackgroundBlurrer
          style={{
            backdropFilter: containerFilter,
            top: leftBlurY,
            left: 0,
            width: leftBlurWidth,
            height: leftBlurHeight,
          }}
        />
        <BackgroundBlurrer
          style={{
            backdropFilter: containerFilter,
            top: rightBlurY,
            right: 0,
            width: rightBlurWidth,
            height: rightBlurHeight,
          }}
        />
      </StyledContainer>
      <svg
        style={{ position: 'fixed', top: 0, left: 0 }}
        viewBox={`0 0 ${windowDimensions.width} ${windowDimensions.height}`}
        width={windowDimensions.width}
        height={windowDimensions.height}
      >
        <defs>
          <clipPath clipRule="evenodd" id="foundryMask">
            <animated.path fill="#FFFFFF" stroke="#000000" d={finalPath} />
          </clipPath>
        </defs>
      </svg>
      {children}
    </Portal>
  );
};

Spotlight.Container = SpotlightContainer;

export default Spotlight;
