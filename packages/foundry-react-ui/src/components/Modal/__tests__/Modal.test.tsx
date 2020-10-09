import React from 'react';
import styled from 'styled-components';
import { render, configure } from '@testing-library/react';
import Modal from '../Modal';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-modal';

describe('Modal', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      //
      const component = (
        <Modal closeButtonContainerProps={{ 'aria-label': 'aria-label-test' }}></Modal>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
