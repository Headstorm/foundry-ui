import React from 'react';
import styled from 'styled-components';
import { render, configure } from '@testing-library/react';
import InteractionFeedback from '../InteractionFeedback';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-interaction-feedback';

describe('InteractionFeedback', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <InteractionFeedback></InteractionFeedback>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
