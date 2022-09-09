import React, {
  forwardRef,
  RefObject,
  ReactNode,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import styled from 'styled-components';
import { mdiClose } from '@mdi/js';
import { useSpring } from '@react-spring/web';
import { Portal } from 'react-portal';
import { transparentize } from 'polished';

import variants from '../../enums/variants';
import Button from '../Button/Button';
import { AnimatedDiv } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAnalytics, useTheme } from '../../context';

const Underlay = styled(AnimatedDiv)`
  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  left: 0;

  z-index: 1000;
`;

const Container = styled(AnimatedDiv)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 1010;
`;

// Just so that the types can match a styled component
const CloseButton = styled(Button)``;

const CloseButtonContainer = styled(Button.Container)`
  ${({ closeButtonAttachment }: { closeButtonAttachment: string }) => {
    let distance;
    let position;
    let display = 'inline-flex'; // default display type

    switch (closeButtonAttachment) {
      case 'inside':
        distance = '.5rem';
        position = 'absolute';
        break;
      case 'outside':
        distance = '-2rem';
        position = 'absolute';
        break;
      case 'corner':
        distance = '1rem';
        position = 'fixed';
        break;
      case 'none':
        distance = '0rem';
        position = 'absolute';
        display = 'none';
        break;
      default:
        distance = '0rem';
        position = 'absolute';
        break;
    }

    return `
      position: ${position};
      top: ${distance};
      right: ${distance};
      z-index: 1011;
      border-radius: 50%;
      padding: .5rem;
      display: ${display};
    `;
  }}
`;

export interface ModalProps {
  // TODO: Make string & StyledComponentBase<> its own type, also see about not using `any`
  StyledContainer?: StyledSubcomponentType;
  StyledUnderlay?: StyledSubcomponentType;
  StyledCloseButton?: StyledSubcomponentType;
  StyledCloseButtonContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  underlayProps?: SubcomponentPropsType;
  closeButtonProps?: SubcomponentPropsType;
  closeButtonContainerProps?: SubcomponentPropsType;

  containerRef?: RefObject<HTMLDivElement>;
  closeButtonContainerRef?: RefObject<HTMLDivElement>;
  underlayRef?: RefObject<HTMLDivElement>;

  animationSpringConfig?: Record<string, unknown>;

  children: ReactNode;

  onClickOutside?: (e: MouseEvent) => void;
  onClose?: (e: MouseEvent) => void;

  closeButtonAttachment?: string;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  style?: Record<string, unknown>;
}

export type ModalApi = {
  close: (evt?: any) => void;
};

const Modal = forwardRef<ModalApi, ModalProps>(
  (
    {
      StyledContainer = Container,
      StyledUnderlay = Underlay,
      StyledCloseButton = CloseButton,
      StyledCloseButtonContainer = CloseButtonContainer,

      containerProps = {},
      underlayProps = {},
      closeButtonProps = {},
      closeButtonContainerProps = {},

      containerRef,
      closeButtonContainerRef,
      underlayRef,

      animationSpringConfig = {},

      children,

      onClickOutside,
      onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function

      closeButtonAttachment = 'inside',
      backgroundBlur = '0.5rem',
      backgroundDarkness = 0.2,
    }: ModalProps,
    forwardedRef,
  ): JSX.Element => {
    const {
      colors,
      accessibilityPreferences: { prefersReducedMotion },
      performanceInfo: { tier: gpuTier },
    } = useTheme();

    const { styles: containerStyles }: { styles?: Record<string, unknown> } = containerProps;
    const { styles: underlayStyles }: { styles?: Record<string, unknown> } = underlayProps;

    const handleEventWithAnalytics = useAnalytics();
    const handleClickOutside = (e: MouseEvent) => {
      if (onClickOutside) {
        handleEventWithAnalytics('Modal', onClickOutside, 'onClickOutside', e, containerProps);
      }
    };
    const handleEsc = useCallback(
      (e: KeyboardEvent) =>
        handleEventWithAnalytics('Modal', onClickOutside, 'onEsc', e, containerProps),
      [containerProps, handleEventWithAnalytics, onClickOutside],
    );
    const handleClose = (e: MouseEvent) =>
      handleEventWithAnalytics('Modal', onClose, 'onClose', e, containerProps);

    const animationPrecision = gpuTier < 2 ? 0.2 : undefined;

    const [springStyles, spring] = useSpring(() => ({
      containerTransform: 'translate(-50%, -25%)',
      containerOpacity: 0,
      underlayBackgroundColor: 'rgba(0,0,0, 0)',
      underlayBackdropFilter: 'blur(0rem)',
      config: {
        immediate: prefersReducedMotion,
        friction: 75,
        tension: 550,
        mass: 5,
        round: animationPrecision,
        clamp: false,
        ...animationSpringConfig,
      },
    }));

    useEffect(() => {
      spring.start({
        config: {
          round: animationPrecision,
        },
      });
    }, [animationPrecision, spring]);

    useEffect(() => {
      spring.start({
        containerTransform: 'translate(-50%, -50%)',
        containerOpacity: 1,
        underlayBackgroundColor: transparentize(1 - backgroundDarkness, colors.black),
        underlayBackdropFilter: gpuTier < 2 ? 'blur(0rem)' : `blur(${backgroundBlur})`,
      });
    }, [backgroundBlur, backgroundDarkness, colors.black, gpuTier, spring]);

    const animateClose = useCallback(
      (
        restFunction: typeof handleClose | typeof handleClickOutside | typeof handleEsc,
        e?: any,
      ) => {
        spring.start({
          containerTransform: 'translate(-50%, -25%)',
          containerOpacity: 0,
          underlayBackgroundColor: 'rgba(0,0,0, 0)',
          underlayBackdropFilter: 'blur(0rem)',
          config: { friction: 50, clamp: true },
          onRest: () => restFunction(e),
        });
      },
      [spring],
    );

    useImperativeHandle(forwardedRef, () => ({
      close: evt => animateClose(handleClose, evt),
    }));

    const escFunction = useCallback(
      (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
          animateClose(handleEsc, event);
        }
      },
      [animateClose, handleEsc],
    );

    useEffect(() => {
      document.addEventListener('keydown', escFunction, false);

      return () => {
        document.removeEventListener('keydown', escFunction, false);
      };
    }, [escFunction]);

    return (
      <Portal>
        {closeButtonAttachment === 'corner' && (
          <StyledCloseButton
            StyledContainer={StyledCloseButtonContainer}
            containerProps={{
              closeButtonAttachment,
              ...closeButtonContainerProps,
            }}
            iconPrefix={mdiClose}
            color={colors.background}
            elevation={1}
            variant={variants.text}
            onClick={(e: MouseEvent) => animateClose(handleClose, e)}
            {...closeButtonProps}
          />
        )}
        <StyledContainer
          ref={containerRef}
          {...containerProps}
          style={{
            transform: springStyles.containerTransform,
            opacity: springStyles.containerOpacity,
            ...containerStyles,
          }}
        >
          {children}
          {closeButtonAttachment !== 'corner' && (
            <StyledCloseButton
              StyledContainer={StyledCloseButtonContainer}
              ref={closeButtonContainerRef}
              containerProps={{
                closeButtonAttachment,
                ...closeButtonContainerProps,
              }}
              iconPrefix={mdiClose}
              color={closeButtonAttachment === 'inside' ? colors.grayDark : colors.background}
              elevation={closeButtonAttachment === 'inside' ? 0 : 1}
              variant={variants.text}
              onClick={(e: MouseEvent) => animateClose(handleClose, e)}
              {...closeButtonProps}
            />
          )}
        </StyledContainer>
        <StyledUnderlay
          colors={colors}
          onClick={(e: MouseEvent) => {
            if (onClickOutside) {
              animateClose(handleClickOutside, e);
            }
          }}
          ref={underlayRef}
          {...underlayProps}
          style={{
            backdropFilter: springStyles.underlayBackdropFilter,
            backgroundColor: springStyles.underlayBackgroundColor,
            ...underlayStyles,
          }}
        />
      </Portal>
    );
  },
);

// Typescript doesn't like adding properties to React Forward Ref, but it still works

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Modal.Underlay = Underlay;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Modal.CloseButtonContainer = CloseButtonContainer;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Modal.Container = Container;

export default Modal;
