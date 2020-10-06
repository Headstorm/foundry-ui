import React from 'react';
import { render, configure, waitFor } from '@testing-library/react';
import Rating from '../Rating';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-rating';

describe('Rating', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      //
      const component = (
        <Rating onClick={() => {}} containerProps={{ 'aria-label': 'aria-label-test' }}></Rating>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  it('shows Rating with default props', async () => {
    const { container, getByTestId } = render(
      <Rating onClick={() => {}} containerProps={{ 'data-test-id': testId }} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  it('containerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Rating onClick={() => {}} containerProps={{ 'data-test-id': testId }} containerRef={ref} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current instanceof HTMLDivElement).toBeTruthy();
  });
});
