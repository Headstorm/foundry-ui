import React, { ReactNode, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { mdiClose } from '@mdi/js';
import { useSpring } from '@react-spring/web';
import { Portal } from 'react-portal';

import variants from '../../enums/variants';
import Button from '../Button/Button';
import { AnimatedDiv } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAccessibilityPreferences, useAnalytics, useTheme } from '../../context';

const Underlay = styled(AnimatedDiv)<{ backgroundBlur: string; backgroundDarkness: number }>`
  ${() => `
    height: 100%;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;

    z-index: 1000;
  `}
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

  containerRef?: React.RefObject<HTMLDivElement>;
  closeButtonContainerRef?: React.RefObject<HTMLDivElement>;
  underlayRef?: React.RefObject<HTMLDivElement>;

  animationSpringConfig?: Record<string, unknown>;

  children: ReactNode;

  onClickOutside?: () => void;
  onClose?: () => void;

  closeButtonAttachment?: string;
  backgroundBlur?: string;
  backgroundDarkness?: number;
  style?: Record<string, unknown>;
}

const Modal = ({
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

  onClickOutside = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function

  closeButtonAttachment = 'inside',
  backgroundBlur = '0.5rem',
  backgroundDarkness = 0.2,
}: ModalProps): JSX.Element => {
  const { colors } = useTheme();
  const { prefersReducedMotion } = useAccessibilityPreferences();

  const { styles: containerStyles }: { styles?: Record<string, unknown> } = containerProps;
  const { styles: underlayStyles }: { styles?: Record<string, unknown> } = underlayProps;

  const handleEventWithAnalytics = useAnalytics();
  const handleClickOutside = (e: any) =>
    handleEventWithAnalytics('Modal', onClickOutside, 'onClickOutside', e, containerProps);
  const handleEsc = useCallback(
    (e: any) => handleEventWithAnalytics('Modal', onClickOutside, 'onEsc', e, containerProps),
    [containerProps, handleEventWithAnalytics, onClickOutside],
  );
  const handleClose = (e: any) =>
    handleEventWithAnalytics('Modal', onClose, 'onClose', e, containerProps);

  const { containerTransform, containerOpacity, underlayBackdropFilter } = useSpring({
    from: {
      containerTransform: 'translate(-50%, -25%)',
      containerOpacity: 0,
      underlayBackdropFilter: 'blur(0rem) brightness(1)',
    },
    to: {
      containerTransform: 'translate(-50%, -50%)',
      containerOpacity: 1,
      underlayBackdropFilter: `blur(${backgroundBlur}) brightness(${1 - backgroundDarkness})`,
    },
    immediate: prefersReducedMotion,
    friction: 75,
    tension: 550,
    mass: 5,
    ...animationSpringConfig,
  });

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        handleEsc(event);
      }
    },
    [handleEsc],
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
          onClick={handleClose}
          {...closeButtonProps}
        />
      )}
      <StyledContainer
        ref={containerRef}
        {...containerProps}
        style={{
          transform: containerTransform,
          opacity: containerOpacity,
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
            onClick={handleClose}
            {...closeButtonProps}
          />
        )}
      </StyledContainer>
      <StyledUnderlay
        backgroundBlur={backgroundBlur}
        backgroundDarkness={backgroundDarkness}
        onClick={handleClickOutside}
        ref={underlayRef}
        {...underlayProps}
        style={{
          backdropFilter: underlayBackdropFilter,
          ...underlayStyles,
        }}
      />
    </Portal>
  );
};

Modal.Underlay = Underlay;
Modal.CloseButtonContainer = CloseButtonContainer;
Modal.Container = Container;
export default Modal;
