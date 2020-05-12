import React, {FunctionComponent, ReactNode} from 'react';
import Card from '../Card';

export interface ModalProps {
  onClickOutside?: () => void
  onClose?: () => void
  // todo consider making type for card parts so we can use the same type

  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode

  backgroundBlur?: number
  backgroundDarkness?: number
}
const Modal: FunctionComponent<ModalProps> = ({
  onClickOutside,
  onClose,

  header,
  body,
  footer,

  backgroundBlur,
  backgroundDarkness
}) => (
  <Card
    header={header}
    footer={footer}
  >
    {body}
  </Card>
);

export default Modal;