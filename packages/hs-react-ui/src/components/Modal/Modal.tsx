import React, {FunctionComponent, ReactNode} from 'react';
import Card from '../Card';
import styled, {StyledComponentBase} from 'styled-components';

export interface ModalProps {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledOverlay?: String & StyledComponentBase<any, {}>,

  onClickOutside?: () => void
  onClose?: () => void
  // todo consider making type for card parts so we can use the same type

  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode

  backgroundBlur?: number
  backgroundDarkness?: number
}

const ModalOverlay = styled.div`
  height: 100%;
  width: 100%;
  
  position: fixed;
  top: 0;
  left: 0;
  
  z-index: 1000;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);


`

const Modal: FunctionComponent<ModalProps> = ({
  StyledContainer = ModalContainer,
  StyledOverlay = ModalOverlay,

  onClickOutside,
  onClose,

  header,
  body,
  footer,

  backgroundBlur,
  backgroundDarkness
}) => {
  return (
    <>
      <StyledContainer>
        <Card
          header={header}
          footer={footer}
        >
          {body}
        </Card>
      </StyledContainer>
      <StyledOverlay />
    </>
  );
}

export default Modal;