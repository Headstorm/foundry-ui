import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Button from '.';
import { ButtonContainer } from './ButtonContainers';

test('matches snapshot', async () => {
    const wrapper = render(<Button StyledContainer={ButtonContainer}
      onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot()
});