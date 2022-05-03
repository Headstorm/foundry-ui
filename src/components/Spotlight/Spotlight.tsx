import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { animated, useSpring } from '@react-spring/web';
import { Portal } from 'react-portal';

import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useScrollObserver, useWindowSizeObserver } from '../../utils/hooks';
import { useAnalytics } from '../../context';
import { AnimatedDiv } from '../../htmlElements';

const SpotlightContainer = styled(AnimatedDiv)`
  height: 100%;
  width: 100%;

  position: fixed;
  top: 0;
  left: 0;
  contain: strict;
  clip-path: url(#foundryMask);
  z-index: 200;
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
  padding-bottom: 1rem;

  z-index: 201;

  width: fit-content;
  max-width: 50vw;
`;

export enum SpotlightShapes {
  circular = 'circular',
  round = 'round',
  box = 'box',
  'roundedBox' = 'rounded box',
}

export type SpotlightProps = {
  StyledContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  containerRef?: React.RefObject<HTMLElement>;

  StyledAnnotation?: StyledSubcomponentType;
  annotationProps?: SubcomponentPropsType;
  annotationRef?: React.RefObject<HTMLElement>;

  children?: React.ReactNode;
  targetElement?: HTMLElement;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  shape?: SpotlightShapes;
  cornerRadius?: number;
  padding?: number;
  onClick?: (e: React.MouseEvent) => void;
  animateTargetChanges?: boolean;
  // onAnimationEnd?: ControllerProps['onRest'];
  onAnimationEnd?: () => void;
  animationSpringConfig?: Record<string, unknown>;
  resizeUpdateInterval?: number;
  scrollUpdateInterval?: number;
};

const Spotlight = ({
  StyledContainer = SpotlightContainer,
  containerProps,
  containerRef,

  StyledAnnotation = Annotation,
  annotationProps,
  annotationRef,

  children,
  targetElement,
  backgroundBlur = '0.25rem',
  backgroundDarkness = 0.3,
  shape = SpotlightShapes.circular,
  cornerRadius = 12,
  padding = 12, // 8px === .5rem
  onClick,
  animateTargetChanges = true,
  onAnimationEnd,
  animationSpringConfig,
  resizeUpdateInterval = 0,
  scrollUpdateInterval = 0,
}: SpotlightProps): JSX.Element | null => {
  const handleEventWithAnalytics = useAnalytics();
  const {
    width: windowWidth,
    height: windowHeight,
    isResizing,
  } = useWindowSizeObserver(resizeUpdateInterval);
  const { scrollY, isScrolling } = useScrollObserver(scrollUpdateInterval);

  const rect = useMemo<Pick<DOMRect, 'x' | 'y' | 'width' | 'height' | 'bottom' | 'right'>>(() => {
    const defaultVal = {
      x: windowWidth / 2,
      y: windowHeight / 2,
      width: 0,
      height: 0,
      bottom: windowHeight / 2,
      left: windowWidth / 2,
      top: windowHeight / 2,
      right: windowWidth / 2,
    };

    if (targetElement) {
      const bounds = targetElement?.getBoundingClientRect();

      if (shape === SpotlightShapes.circular) {
        if (bounds.width > bounds.height) {
          const newHeight = bounds.width;
          bounds.y -= (newHeight - bounds.height) * 0.5;
          bounds.height = newHeight;
        } else if (bounds.width < bounds.height) {
          const newWidth = bounds.height;
          bounds.x -= (newWidth - bounds.width) / 2;
          bounds.width = newWidth;
        }
      }

      bounds.x -= padding;
      bounds.y -= padding;
      bounds.width += padding * 2;
      bounds.height += padding * 2;
      return bounds;
    }
    return defaultVal;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetElement, padding, windowWidth, windowHeight, shape, scrollY]);

  const radii = [Math.min(cornerRadius, rect.width / 2), Math.min(cornerRadius, rect.height / 2)];
  if (shape === SpotlightShapes.round) {
    radii[0] = rect.width / 2;
    radii[1] = rect.height / 2;
  } else if (shape === SpotlightShapes.box) {
    radii[0] = 0;
    radii[1] = 0;
  }

  const outerRectPath = `M 0 0 h${windowWidth} v${windowHeight} h-${windowWidth}`;
  const innerShapePath = `
    M ${rect.x} ${rect.y + radii[1]}
    Q ${rect.x} ${rect.y}, ${rect.x + radii[0]} ${rect.y}
    L ${rect.x + rect.width - radii[0]} ${rect.y}
    Q ${rect.x + rect.width} ${rect.y}, ${rect.x + rect.width} ${rect.y + radii[1]}
    L ${rect.x + rect.width} ${rect.y + rect.height - radii[1]}
    Q ${rect.x + rect.width} ${rect.y + rect.height}, ${rect.x + rect.width - radii[0]} ${
    rect.y + rect.height
  }
    L ${rect.x + radii[0]} ${rect.y + rect.height}
    Q ${rect.x} ${rect.y + rect.height}, ${rect.x} ${rect.y + rect.height - radii[1]}
    L ${rect.x} ${rect.y + radii[1]}
  `;

  const radius = Math.max(rect.width, rect.height) / 2;
  const circularPath = `${outerRectPath} 
    M ${rect.x} ${rect.y + rect.height / 2}
    A ${radius}, ${radius}, 0, 1, 1, ${rect.x} ${rect.y + rect.height / 2 + 1}
    L ${rect.x} ${rect.y + rect.height / 2}
  `;
  const finalRectangularPath = `${outerRectPath} ${innerShapePath}`;

  const [
    {
      containerFilter,
      containerBackgroundColor,
      lightPath,
      circularLightPath,

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
    },
    setSpring,
  ] = useSpring(() => ({
    containerOpacity: 0,
    containerFilter: 'blur(0rem)',
    containerBackgroundColor: 'rgba(0,0,0,0)',

    lightPath: finalRectangularPath,
    circularLightPath: circularPath,

    annotationTransform: `translate(${rect.x}px, ${rect.y}px) translate(0%, -100%)`,

    topBlurWidth: windowWidth,
    topBlurHeight: rect.y - 1,

    bottomBlurY: rect.bottom,
    bottomBlurWidth: windowWidth,
    bottomBlurHeight: windowHeight - rect.bottom - 1,

    leftBlurY: rect.y,
    leftBlurWidth: rect.x,
    leftBlurHeight: rect.height + 2,

    rightBlurY: rect.y,
    rightBlurWidth: windowWidth - rect.right,
    rightBlurHeight: rect.height + 2,

    friction: 75,
    tension: 550,
    mass: 5,
    immediate: !animateTargetChanges || isScrolling || isResizing,
    onRest: onAnimationEnd,
    ...animationSpringConfig,
  }));

  useEffect(() => {
    setSpring(() => ({
      containerOpacity: 1,
      containerFilter: `blur(${backgroundBlur})`,
      containerBackgroundColor: `rgba(0,0,0,${1 - backgroundDarkness})`,

      lightPath: finalRectangularPath,
      circularLightPath: circularPath,

      annotationTransform: `translate(${rect.x}px, ${rect.y}px) translate(0%, -100%)`,

      topBlurWidth: windowWidth,
      topBlurHeight: rect.y - 1,

      bottomBlurY: rect.bottom,
      bottomBlurWidth: windowWidth,
      bottomBlurHeight: windowHeight - rect.bottom - 1,

      leftBlurY: rect.y,
      leftBlurWidth: rect.x,
      leftBlurHeight: rect.height + 2,

      rightBlurY: rect.y,
      rightBlurWidth: windowWidth - rect.right,
      rightBlurHeight: rect.height + 2,

      friction: 75,
      tension: 550,
      mass: 5,
      immediate: !animateTargetChanges || isScrolling || isResizing,

      onRest: onAnimationEnd,
      ...animationSpringConfig,
    }));
  }, [
    targetElement,
    shape,
    backgroundBlur,
    backgroundDarkness,
    padding,
    cornerRadius,
    windowWidth,
    windowHeight,
    isScrolling,
    isResizing,
    setSpring,
    finalRectangularPath,
    circularPath,
    rect.x,
    rect.y,
    rect.bottom,
    rect.height,
    rect.right,
    animateTargetChanges,
    animationSpringConfig,
    onAnimationEnd,
  ]);

  const handleClick = (evt: React.MouseEvent) => {
    handleEventWithAnalytics('Spotlight', onClick, 'onClick', evt, containerProps);
  };

  return (
    <Portal>
      <StyledContainer
        onClick={handleClick}
        style={{
          backgroundColor: containerBackgroundColor,
        }}
        ref={containerRef}
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
        viewBox={`0 0 ${windowWidth} ${windowHeight}`}
        width={0}
        height={0}
      >
        <defs>
          <clipPath clipRule="evenodd" id="foundryMask">
            <animated.path
              fill="#FFFFFF"
              d={shape === SpotlightShapes.circular ? circularLightPath : lightPath}
            />
          </clipPath>
        </defs>
      </svg>
      <StyledAnnotation
        style={{ transform: annotationTransform }}
        ref={annotationRef}
        {...annotationProps}
      >
        {children}
      </StyledAnnotation>
    </Portal>
  );
};

Spotlight.Container = SpotlightContainer;
Spotlight.Annotation = Annotation;
Spotlight.SpotlightShapes = SpotlightShapes;

export default Spotlight;
