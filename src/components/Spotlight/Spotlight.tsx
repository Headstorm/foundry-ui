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
`;

const BackgroundBlurrer = styled(AnimatedDiv)`
  position: fixed;
  z-index: -1;
`;

const Annotation = styled(AnimatedDiv)`
  display: inline-block;
  position: fixed;
  top: 0;
  left: 0;

  width: fit-content;
  max-width: 50vw;
`;

export type SpotlightProps = {
  StyledContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  containerRef?: React.RefObject<HTMLDivElement>;

  annotationJustify?: 'start' | 'center' | 'end';
  annotationPosition?: 'left' | 'above' | 'right' | 'below';

  children?: React.ReactNode;
  targetElement?: HTMLElement;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  shape?: 'circular' | 'round' | 'box' | 'rounded box'; // TODO make this an enum and export it
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

  annotationJustify = 'center',
  annotationPosition = 'above',

  children,
  targetElement,
  backgroundBlur = '0.5rem',
  backgroundDarkness = 0.3,
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

  const rect = useMemo<Pick<DOMRect, 'x' | 'y' | 'width' | 'height' | 'bottom' | 'right'>>(() => {
    const defaultVal = {
      x: windowDimensions.width / 2,
      y: windowDimensions.height / 2,
      width: 0,
      height: 0,
      bottom: windowDimensions.height / 2,
      left: windowDimensions.width / 2,
      top: windowDimensions.height / 2,
      right: windowDimensions.width / 2,
    };

    if (targetElement) {
      const bounds = targetElement?.getBoundingClientRect();

      bounds.x -= padding;
      bounds.y -= padding;
      // bounds.bottom += padding;
      // bounds.right += padding;
      bounds.width += padding * 2;
      bounds.height += padding * 2;
      return bounds;
    }
    return defaultVal;
  }, [targetElement, padding, windowDimensions]);

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

  const radius = Math.max(rect.width, rect.height) / 2;
  const circularPath = `
    M ${rect.x} ${rect.y + rect.height / 2}
    A ${radius}, ${radius}, 0, 1, 1, ${rect.x} ${rect.y + rect.height / 2 + 1}
    L ${rect.x} ${rect.y + rect.height / 2}
  `;
  const finalPath = `${outerRectPath} ${shape === 'circular' ? circularPath : innerShapePath}`;

  const {
    // containerOpacity,
    containerFilter,
    containerBackgroundColor,
    lightPath,

    annotationTransform,

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
      containerBackgroundColor: 'rgba(0,0,0,0)',

      lightPath: finalPath,

      annotationTransform: `translate(${rect.x}px, ${rect.y}px) translate(0%, -100%)`,

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
    to: {
      containerOpacity: 1,
      containerFilter: `blur(${backgroundBlur})`,
      containerBackgroundColor: `rgba(0,0,0,${1 - backgroundDarkness})`,

      lightPath: finalPath,

      annotationTransform: `translate(${rect.x}px, ${rect.y}px) translate(0%, -100%)`,

      topBlurWidth: windowDimensions.width,
      topBlurHeight: rect.y - 1,

      bottomBlurY: rect.bottom,
      bottomBlurWidth: windowDimensions.width,
      bottomBlurHeight: windowDimensions.height - rect.bottom - 1,

      leftBlurY: rect.y,
      leftBlurWidth: rect.x,
      leftBlurHeight: rect.height + 2,

      rightBlurY: rect.y,
      rightBlurWidth: windowDimensions.width - rect.right,
      rightBlurHeight: rect.height + 2,
    },
    config: {
      friction: 75,
      tension: 550,
      mass: 5,
      ...animationSpringConfig,
    },
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

  return (
    <Portal>
      <StyledContainer
        ref={containerRef}
        onClick={handleClick}
        style={{
          backgroundColor: containerBackgroundColor,
          // opacity: containerOpacity,
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
        width={0}
        height={0}
        // {...windowDimensions}
      >
        <defs>
          <clipPath clipRule="evenodd" id="foundryMask">
            <animated.path fill="#FFFFFF" stroke="#000000" d={lightPath} />
          </clipPath>
        </defs>
      </svg>
      <Annotation style={{ transform: annotationTransform }}>{children}</Annotation>
    </Portal>
  );
};

Spotlight.Container = SpotlightContainer;

export default Spotlight;
