import React from 'react';
import Avatar from '../Avatar';
import { render, waitFor, configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });
const testId = 'foundry-test';

describe('Avatar', () => {
  it('matches snapshot', async () => {
    // const { container, getByTestId } = render(<Avatar />);
    // await waitFor(() => getByTestId(testId));
    // expect(container).toMatchSnapshot();
  });

  it('', async () => {});

  it('', () => {});

  it('', () => {});

  it('', () => {});
});
