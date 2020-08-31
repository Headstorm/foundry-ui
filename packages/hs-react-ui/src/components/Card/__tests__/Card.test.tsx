import React from 'react';
import styled from 'styled-components';
import { render, configure } from '@testing-library/react';
import Card, { Body } from '../Card';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-card';

describe('Card', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Card onClick={() => {}} aria-label="aria-label-test"></Card>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
