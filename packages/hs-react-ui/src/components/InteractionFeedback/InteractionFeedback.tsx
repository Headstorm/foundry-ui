import React, { useCallback, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import styled, { StyledComponentBase } from 'styled-components';
import shortid from 'shortid';
import useResizeObserver from 'use-resize-observer/polyfilled';
import colors from '../../enums/colors';
import { SubcomponentPropsType } from '../commonTypes';

const SVGContainer = styled.svg`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const Container = styled(animated.div)`
  position: relative;
`;

type Animation = { cx: string; cy: string; id: string };
type Transition = { r: string } & Animation;
export type InteractionFeedbackProps = {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledSVGContainer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  svgContainerProps?: SubcomponentPropsType;

  children: React.ReactNode;
  color?: string;
  interpolationFunctions?: Record<string, (val: any) => any>;
  // TODO add proper type from react-spring
  transitionProps?: any;
};

const defaultInterpolationFunctions = {
  r: (r: any) => r.to((val: string) => `${Math.abs(parseFloat(val))}`),
};
const defaultTransitionProps = {
  from: {
    r: 0,
    opacity: 0.5,
  },
  enter: {
    r: 100,
    opacity: 0,
  },
  config: {
    mass: 10,
    tension: 500,
    friction: 35,
    clamp: true,
  },
};
const InteractionFeedback = ({
  StyledContainer = Container,
  StyledSVGContainer = SVGContainer,
  containerProps = {},
  svgContainerProps = {},
  color = colors.primary,

  children,
  interpolationFunctions = defaultInterpolationFunctions,
  transitionProps = { ...defaultTransitionProps },
}: InteractionFeedbackProps) => {
  const { ref, width = 0, height = 0 } = useResizeObserver();
  const [animations, setAnimations] = useState<Array<Animation>>([]);

  const transitions = useTransition<Animation, Record<string, unknown>>(animations, {
    keys: (item: Animation) => item.id,
    onRest: (item: Transition) => setAnimations(a => a.filter(ani => ani.id === item.id)),
    ...transitionProps,
  });
  const fragment = transitions((style, item) => {
    const circleProps = Object.entries(style).reduce((acc, [key, val]) => {
      return {
        ...acc,
        [key]: interpolationFunctions[key] ? interpolationFunctions[key](val) : val,
      };
    }, {});
    return <animated.circle cx={item.cx} cy={item.cy} fill={color} {...circleProps} />;
  });

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent) => {
      if (ref && ref.current) {
        e.persist();
        const boundingRect = ref.current.getBoundingClientRect();
        const { clientX, clientY } = e;
        const percentX = (100 * (clientX - boundingRect.left)) / boundingRect.width;
        const percentY = (100 * (clientY - boundingRect.top)) / boundingRect.height;

        setAnimations(a => [...a, { cx: `${percentX}%`, cy: `${percentY}%`, id: shortid() }]);
      }
    },
    [ref],
  );

  return (
    <StyledContainer ref={ref} onMouseDown={mouseDownHandler} {...containerProps}>
      {children}
      <StyledSVGContainer
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        {...svgContainerProps}
      >
        {fragment}
      </StyledSVGContainer>
    </StyledContainer>
  );
};

InteractionFeedback.Container = Container;
InteractionFeedback.SVGContainer = SVGContainer;
InteractionFeedback.defaultTransitionProps = defaultTransitionProps;
InteractionFeedback.defaultInterpolationFunctions = defaultInterpolationFunctions;

export default InteractionFeedback;
