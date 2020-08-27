import React from 'react';
import styled from 'styled-components';
import { render, configure } from '@testing-library/react';
import TextInput from '../TextInput';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-text-input';

describe('TextInput', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <TextInput aria-label="text-input"></TextInput>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
