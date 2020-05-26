import React from 'react';
import styled from 'styled-components';

const Centered = styled.div`
  margin: auto auto;
`;

export default (story: any) => (
  <Centered>{story()}</Centered>
);
