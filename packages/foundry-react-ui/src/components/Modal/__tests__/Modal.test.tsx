import React from 'react';
import styled from 'styled-components';
import { render, configure, waitFor } from '@testing-library/react';
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
        <Modal
          children={<div>Test Child</div>}
          closeButtonContainerProps={{ 'aria-label': 'aria-label-test' }}
        ></Modal>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <Modal
          children={<div>Test Child</div>}
          containerRef={ref}
          containerProps={{ 'data-test-id': testId }}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('underlayRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <Modal
          children={<div>Test Child</div>}
          underlayRef={ref}
          containerProps={{ 'data-test-id': testId }}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
