import React, { useCallback, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import styled, { StyledComponentBase } from 'styled-components';
import shortid from 'shortid';
import colors from '../../enums/colors';
import useResizeObserver from 'use-resize-observer/polyfilled';

const Circle = styled.svg`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const Container = styled(animated.div)`
  position: relative;
`;

enum feedbackTypes {
  splash = 'splash',
}
type Animation = { cx: string; cy: string; id: string };
type Transition = { r: string } & Animation;
type InteractionFeedbackProps = {
  StyledContainer?: string & StyledComponentBase<any, {}>;

  children: React.ReactNode;
  interpolationFunctions?: Record<string, (val: any) => any>;
  transitionProps: any;
  type?: feedbackTypes;
};

const InteractionFeedback = ({
  StyledContainer = Container,

  children,
  interpolationFunctions = {},
  transitionProps,
}: InteractionFeedbackProps) => {
  const { ref, width, height } = useResizeObserver();
  const [animations, setAnimations] = useState<Array<Animation>>([]);

  const transitions = useTransition<Animation, Animation>(animations, {
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
    return (
      <animated.circle
        cx={style.cx}
        cy={style.cy}
        {...circleProps}
      />
    );
  });

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent) => {
      if (ref && ref.current) {
        e.persist();
        const boundingRect = ref.current.getBoundingClientRect();
        const { clientX, clientY } = e;
        const percentX = (100 * (clientX - boundingRect.left)) / boundingRect.width;
        const percentY = (100 * (clientY - boundingRect.top)) / boundingRect.height;

        setAnimations(a => [...a, { cx: `${percentX}%`, cy: `${percentY}%`, fillColor: colors.primary, id: shortid() }]);
      }
    },
    [ref],
  );

  return (
    <StyledContainer ref={ref} onMouseDown={mouseDownHandler}>
      {children}
      <Circle
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {fragment}
      </Circle>
    </StyledContainer>
  );
};

InteractionFeedback.feedbackTypes = feedbackTypes;

export default InteractionFeedback;
