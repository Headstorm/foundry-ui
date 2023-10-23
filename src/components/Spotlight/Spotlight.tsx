import React, {
  MouseEvent,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { animated, useSpring } from '@react-spring/web';
import { Portal } from 'react-portal';

import { mergeRefs } from '../../utils/refs';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useScrollObserver, useWindowSizeObserver } from '../../utils/hooks';
import { useTheme, useAnalytics } from '../../context';
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

// Recursively crawl the dom to find the nearest scrolling parent of the target element
const findNearestScrollingParent = (el: HTMLElement | Element): HTMLElement | Element | null => {
  const parent = el.parentElement;

  if (parent && parent.tagName !== 'html') {
    if (parent?.scrollHeight > parent?.clientHeight) {
      // found it!
      return parent;
    }
    return findNearestScrollingParent(parent);
  }

  // passing it back down
  return null;
};

export type SpotlightProps = {
  StyledContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  containerRef?: RefObject<HTMLElement>;

  StyledAnnotation?: StyledSubcomponentType;
  annotationProps?: SubcomponentPropsType;
  annotationRef?: RefObject<HTMLElement>;

  children?: ReactNode;
  targetElement?: HTMLElement | Element;
  scrollingParentElement?: HTMLElement | Element;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  shape?: SpotlightShapes;
  cornerRadius?: number;
  padding?: number;
  onClick?: (e: MouseEvent) => void;
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
  scrollingParentElement, // this will get automatically picked if not defined
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
  const scrollTarget = useRef(scrollingParentElement || null);

  const {
    width: windowWidth,
    height: windowHeight,
    isResizing,
  } = useWindowSizeObserver(resizeUpdateInterval, 50);

  const { scrollY, isScrolling } = useScrollObserver(scrollUpdateInterval, 50, {
    target: scrollTarget.current || undefined,
  });

  const {
    performanceInfo: { tier: gpuTier },
    accessibilityPreferences: { prefersReducedMotion },
  } = useTheme();

  const internalAnnotationRef: RefObject<HTMLElement> = useRef(null);

  /* Scroll to new position if need-be */

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  useEffect(() => {
    if (targetElement && !scrollTarget.current) {
      scrollTarget.current = findNearestScrollingParent(targetElement);
    }
  }, [targetElement]);

  useEffect(() => {
    if (targetElement) {
      const newTargetTop = targetElement?.getBoundingClientRect().top ?? 0;
      const annotationHeight = internalAnnotationRef?.current?.getBoundingClientRect().height;
      // TODO: This assumes the annotation is above the target
      // when custom above/under alignment is implemented, this logic should change
      // (if the annotation is below the target, this should be an addition, not subtraction)
      const offset = annotationHeight ? newTargetTop - annotationHeight : newTargetTop;

      if (scrollTarget.current) {
        // TODO:
        // compare offset with the scrollTarget scrollHeight,
        // if it's larger, subtract them and scroll the window next

        scrollTarget.current.scrollTo({
          top: offset,
          left: 0,
          behavior: !animateTargetChanges || prefersReducedMotion ? 'auto' : 'smooth',
        });
      } else {
        window.scrollBy({
          top: offset,
          left: 0,
          behavior: !animateTargetChanges || prefersReducedMotion ? 'auto' : 'smooth',
        });
      }

      setIsAutoScrolling(true);
    }
  }, [
    animateTargetChanges,
    internalAnnotationRef,
    prefersReducedMotion,
    scrollTarget,
    targetElement,
  ]);

  useEffect(() => {
    // check if auto scroll has completed
    if (isScrolling === false && isAutoScrolling === true) {
      setIsAutoScrolling(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolling]);

  /* Build spotlight shape */

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

  /* Setup animation */

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
    spring,
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
    rightBlurWidth: windowWidth - rect.right - padding - 4,
    rightBlurHeight: rect.height + 2,
    immediate:
      !animateTargetChanges ||
      prefersReducedMotion ||
      (isScrolling && !isAutoScrolling) ||
      isResizing,
    config: {
      round: gpuTier < 2 ? 1 : undefined,
      ...animationSpringConfig,
    },
    onRest: onAnimationEnd,
  }));

  useEffect(() => {
    spring.start(() => ({
      containerOpacity: 1,
      containerFilter: gpuTier < 2 ? 'blur(0rem)' : `blur(${backgroundBlur})`,
      containerBackgroundColor: `rgba(0,0,0,${1 - backgroundDarkness})`,

      lightPath: finalRectangularPath,
      circularLightPath: circularPath,

      annotationTransform: `translate(${rect.x}px, ${rect.y}px) translate(0%, -100%)`, // TODO: change second translate to make different attach positions

      topBlurWidth: windowWidth,
      topBlurHeight: Math.max(rect.y - 1, 0),

      bottomBlurY: rect.bottom,
      bottomBlurWidth: windowWidth,
      bottomBlurHeight: windowHeight - rect.bottom - 1,

      leftBlurY: rect.y,
      leftBlurWidth: rect.x,
      leftBlurHeight: rect.height + 2,

      rightBlurY: rect.y,
      rightBlurWidth: windowWidth - rect.right - padding - 4,
      rightBlurHeight: rect.height + 2,

      onRest: onAnimationEnd,
      immediate:
        !animateTargetChanges ||
        prefersReducedMotion ||
        (isScrolling && !isAutoScrolling) ||
        isResizing,
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
    scrollY,
    isAutoScrolling,
    isResizing,
    spring,
    finalRectangularPath,
    circularPath,
    rect.x,
    rect.y,
    rect.bottom,
    rect.height,
    rect.right,
    animateTargetChanges,
    onAnimationEnd,
    gpuTier,
    prefersReducedMotion,
  ]);

  /* Click */

  const handleClick = (evt: MouseEvent) => {
    // TODO: Rename to onClickOutside?
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
        ref={mergeRefs<HTMLElement>([annotationRef, internalAnnotationRef])}
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
