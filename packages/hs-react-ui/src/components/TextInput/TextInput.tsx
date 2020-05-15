import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/colors';


import { TextInputTypes } from '../../enums/TextInputTypes';

const TextInputContainer = styled.input`
border-radius: 0.5em;
border: 2 px;
width: 12em;
height: 2em;

font-family: Gothic;
font-size: 1em;
placeholder="PlaceHolder"
`;

const ClearableInputContainer = styled(TextInputContainer)`
  color: ${colors.background};
  background-color: ${colors.primary};
  border-color: black
`;

const PlaceholderInputContainer = styled(TextInputContainer)`
    placeHolder="PlaceHolder"
    maxlength=4
`

const ErrorInputContainer = styled(TextInputContainer)`
    placeHolder="PlaceHolder"
    maxlength=4
`

const IconInputContainer = styled(TextInputContainer)`
    placeHolder="PlaceHolder"
    maxlength=4
`

const MultiLneInputContainer = styled(TextInputContainer)`
    placeHolder="PlaceHolder"
    maxlength=4
`


const TextInputContainers = {
  [TextInputTypes.default]: TextInputContainer,
  [TextInputTypes.clearable]: ClearableInputContainer,
  [TextInputTypes.placeHolder]: PlaceholderInputContainer,
  [TextInputContainer.error]: ErrorInputContainer,
  [TextInputContainer.icon]: IconInputContainer,
  [TextInputContainer.multiLine]: MultiLneInputContainer
};
export type TextInputProps = {
  textInputType: TextInputTypes,
  children: string | Node,
}

const TextInput = ({
  textInputType,
}: TextInputProps) => {
  const Container = TextInputContainers[textInputType]

  return (
    <Container>

    </Container>
  )
}

export default TextInput;