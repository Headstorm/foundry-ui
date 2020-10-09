import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import Divider from '../Divider';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'hsui-Divider';

describe('Divider', () => {
  it('matches snapshot', async () => {
    const { container, getByTestId } = render(<Divider />);
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with props', async () => {
    const { container, getByTestId } = render(<Divider width="50%" height="2rem" />);
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Divider />;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
