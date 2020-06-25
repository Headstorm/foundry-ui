import React, { ReactNode } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import { mdiClose } from '@mdi/js';

import colors from '../../enums/colors';
import Button from '../Button/Button';
import { Div } from '../../htmlElements';

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
  position: absolute;
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
  closeButtonProps?: object;
  StyledCloseButtonContainer?: string & StyledComponentBase<any, {}>;
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
  closeButtonProps = {},
  children,
  onClickOutside = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onClose = () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  closeButtonAttachment = 'inside',
  backgroundBlur = '0.5rem',
  backgroundDarkness = 0.2,
}: ModalProps) => (
  <>
    {closeButtonAttachment === 'corner' && (
      <StyledCloseButton
        StyledContainer={StyledCloseButtonContainer}
        containerProps={{
          closeButtonAttachment,
        }}
        iconPrefix={mdiClose}
        color={colors.background}
        elevation={1}
        variant="text"
        onClick={onClose}
        {...closeButtonProps} // eslint-disable-line react/jsx-props-no-spreading
      />
    )}
    <StyledContainer>
      {children}
      {closeButtonAttachment !== 'corner' && (
        <StyledCloseButton
          StyledContainer={StyledCloseButtonContainer}
          containerProps={{
            closeButtonAttachment,
          }}
          iconPrefix={mdiClose}
          color={closeButtonAttachment === 'inside' ? colors.grayDark : colors.background}
          elevation={closeButtonAttachment === 'inside' ? 0 : 1}
          variant="text"
          onClick={onClose}
          {...closeButtonProps} // eslint-disable-line react/jsx-props-no-spreading
        />
      )}
    </StyledContainer>
    <StyledUnderlay
      backgroundBlur={backgroundBlur}
      backgroundDarkness={backgroundDarkness}
      onClick={onClickOutside}
    />
  </>
);

Modal.Underlay = Underlay;
Modal.CloseButtonContainer = CloseButtonContainer;
Modal.Container = Container;
export default Modal;
