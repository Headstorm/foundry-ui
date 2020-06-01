import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Button from '../Button';

describe('Button', () => {
  it('fires click handler when clicked', () => {
    const clickSpy = jest.fn();
    const { getByText } = render(<Button onClick={clickSpy}>Click me</Button>);

    fireEvent.click(getByText('Click me'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows loading text when provided', async () => {
    const { container, getByText } = render(
      <Button isLoading={{ children: 'Loading...', icon: '⌛' }} onClick={() => {}} />,
    );

    await waitFor(() => getByText(/Loading.../));

    expect(container).toMatchSnapshot();
  });

  it('keeps the container the same when switching between isLoading and not isLoading', async () => {
    const onClick = jest.fn();
    const { getByText, rerender, asFragment } = render(
      <Button isLoading={{ children: 'Loading...', icon: '⌛' }} onClick={onClick} />,
    );

    await waitFor(() => getByText(/Loading.../));
    const loadingFragment = asFragment();

    rerender(<Button onClick={onClick}>Submit</Button>);
    await waitFor(() => getByText(/Submit/));
    const loadedFragment = asFragment();

    // TODO: Use toMatchDiffSnapshot() between the fragments once we can figure out
    //  how to make it use the jest-styled-components plugin
    expect(loadingFragment.firstChild).toMatchSnapshot();
    expect(loadedFragment.firstChild).toMatchSnapshot();
  });
});
