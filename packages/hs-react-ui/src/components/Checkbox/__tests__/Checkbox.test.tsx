import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';

import Checkbox, { CheckboxTypes } from '../Checkbox';

configure({ testIdAttribute: 'data-test-id' });

const testId = 'hsui-Checkbox';

describe('Checkbox', () => {
  it('fires click handler when clicked', () => {
    const clickSpy = jest.fn();
    const { getByTestId } = render(
      <Checkbox checked onClick={clickSpy}>
        Click me
      </Checkbox>,
    );

    fireEvent.click(getByTestId(`${testId}-Input`));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows checkbox is checked', async () => {
    let checkedSpy = false;
    const clickSpy = jest.fn().mockImplementation(() => {
      checkedSpy = !checkedSpy;
    });
    const { rerender, getByTestId } = render(<Checkbox checked={checkedSpy} onClick={clickSpy} />);

    fireEvent.click(getByTestId(`${testId}-Input`));
    rerender(<Checkbox checked={checkedSpy} onClick={clickSpy} />);
    await waitFor(() => getByTestId(`${testId}-Icon`));

    expect(getByTestId(`${testId}-Icon`)).toBeDefined();
  });

  it('shows checkbox is unchecked', async () => {
    const { queryByTestId } = render(<Checkbox onClick={() => {}} />);

    expect(queryByTestId(`${testId}-Icon`)).toBeNull();
  });
});
