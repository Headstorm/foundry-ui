import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import styled, { StyledComponentBase } from 'styled-components';
import shortid from 'shortid';
import colors from '../../enums/colors';

// TODO Reduce amount of any/ts-ignore done here

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
  const ref = useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = useState({
    height: '0',
    width: '0',
  });
  const [animations, setAnimations] = useState<Array<Animation>>([]);

  useEffect(() => {
    if (ref && ref.current) {
      const boundingRect = ref.current.getBoundingClientRect();
      setDimensions({
        height: `${boundingRect.height}`,
        width: `${boundingRect.width}`,
      });
    }
  }, [ref]);

  const transitions: any = useTransition<Animation, any>(animations, (item: Animation) => item.id, {
    ...transitionProps,
    onRest: (item: Transition) => setAnimations(animations.filter(ani => ani.id !== item.id)),
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
    <StyledContainer ref={ref as any} onMouseDown={mouseDownHandler}>
      {children}
      <Circle
        width={`${dimensions.width}px`}
        height={`${dimensions.height}px`}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {transitions.map(({ item, props }: { item: Transition; props: any }) => {
          const circleProps = Object.entries(props).reduce((acc, [key, val]) => {
            return {
              ...acc,
              [key]: interpolationFunctions[key] ? interpolationFunctions[key](val) : val,
            };
          }, {});

          return (
            <animated.circle
              key={item.id}
              fill={colors.primary}
              cx={item.cx}
              cy={item.cy}
              {
                ...circleProps // eslint-disable-line react/jsx-props-no-spreading
              }
            />
          );
        })}
      </Circle>
    </StyledContainer>
  );
};

InteractionFeedback.feedbackTypes = feedbackTypes;

export default InteractionFeedback;
