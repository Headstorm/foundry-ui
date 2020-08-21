import React, { ReactNode } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import { mdiClose } from '@mdi/js';

import variants from '../../enums/variants';
import Button from '../Button/Button';
import { Div } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';

const Underlay = styled(Div)<{ backgroundBlur: string; backgroundDarkness: number }>`
  ${({ backgroundBlur, backgroundDarkness }) => `
    height: 100%;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;

    z-index: 1000;

    transition: backdrop-filter .2s;
    backdrop-filter: blur(${backgroundBlur}) brightness(${1 - backgroundDarkness});
  `}
`;

const Container = styled(Div)`
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
    `;
  }}
`;

export interface ModalProps {
  // TODO: Make string & StyledComponentBase<> its own type, also see about not using `any`
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledUnderlay?: string & StyledComponentBase<any, {}>;
  StyledCloseButton?: string & StyledComponentBase<any, {}>;
  StyledCloseButtonContainer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  underlayProps?: SubcomponentPropsType;
  closeButtonProps?: SubcomponentPropsType;
  closeButtonContainerProps?: SubcomponentPropsType;

  children: ReactNode;

  onClickOutside?: () => void;
  onClose?: () => void;

  closeButtonAttachment?: string;
  backgroundBlur?: string;
  backgroundDarkness?: number;
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

  children,
  onClickOutside = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  closeButtonAttachment = 'inside',
  backgroundBlur = '0.5rem',
  backgroundDarkness = 0.2,
}: ModalProps) => {
  const { colors } = useTheme();
  return (
    <>
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
          onClick={onClose}
          {...closeButtonProps}
        />
      )}
      <StyledContainer {...containerProps}>
        {children}
        {closeButtonAttachment !== 'corner' && (
          <StyledCloseButton
            StyledContainer={StyledCloseButtonContainer}
            containerProps={{
              closeButtonAttachment,
              ...closeButtonContainerProps,
            }}
            iconPrefix={mdiClose}
            color={closeButtonAttachment === 'inside' ? colors.grayDark : colors.background}
            elevation={closeButtonAttachment === 'inside' ? 0 : 1}
            variant={variants.text}
            onClick={onClose}
            {...closeButtonProps}
          />
        )}
      </StyledContainer>
      <StyledUnderlay
        backgroundBlur={backgroundBlur}
        backgroundDarkness={backgroundDarkness}
        onClick={onClickOutside}
        {...underlayProps}
      />
    </>
  );
};

Modal.Underlay = Underlay;
Modal.CloseButtonContainer = CloseButtonContainer;
Modal.Container = Container;
export default Modal;
