import React from 'react';
import styled from 'styled-components';


import { TextInputTypes } from '../../enums/TextInputTypes';

const TextInputContainer = styled.input`
border-radius: 0.25em;
border: 2 px;
`;

const TextInputContainers = {
  [TextInputTypes.default]: TextInputContainer,
};

export type TextInputProps = {
  textInputType: TextInputTypes,
  children: string | Node,
}

const TextInput = ({
  textInputType,
  children,
}: TextInputProps) => {
  const Container = TextInputContainers[textInputType]

  return (
    <Container>
      <div>{children}</div>
    </Container>
  )
}

export default TextInput;