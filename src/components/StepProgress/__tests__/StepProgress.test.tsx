import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import StepProgress from '../StepProgress';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'hs-ui-step-progress-unit-test';

describe('RangeSlider', () => {
  it('renders', async () => {
    const { container, getByTestId } = render(
      <StepProgress
        index={1}
        labels={['0', '1', '2']}
        containerProps={{ 'data-test-id': testId }}
      />,
    );

    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('renders', async () => {
    const { container, getByTestId } = render(
      <StepProgress
        index={1}
        labels={['0', '1', '2']}
        containerProps={{ 'data-test-id': testId }}
      />,
    );

    await waitFor(() => getByTestId(testId));
    fireEvent.mouseDown(getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = (
        <StepProgress
          index={1}
          labels={['0', '1', '2']}
          containerProps={{ 'data-test-id': testId }}
        />
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
        <StepProgress
          containerRef={ref}
          index={1}
          labels={['0', '1', '2']}
          containerProps={{ 'data-test-id': testId }}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
