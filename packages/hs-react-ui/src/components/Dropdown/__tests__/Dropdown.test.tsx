import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Dropdown from '../Dropdown';

describe('Dropdown', () => {
  it('does not display options on initial render', () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container } = render(<Dropdown name="choosePokemon" options={options} />);

    expect(container).toMatchSnapshot();
  });

  it('displays all options when focused', () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText } = render(
      <Dropdown name="choosePokemon" options={options} />,
    );
    fireEvent.focus(getByTestId('choosePokemon-valueContainer'));
    expect(container).toMatchSnapshot();
  });

  it('can focus dropdown and select option', async () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText } = render(
      <Dropdown name="choosePokemon" options={options} />,
    );

    // TODO - Don't use data-testid, see if we can use a more semantically meaningful element
    fireEvent.focus(getByTestId('choosePokemon-valueContainer'));
    await waitFor(() => getByText('Charmander'));
    fireEvent.click(getByText('Charmander'));
    expect(container).toMatchSnapshot();
  });

  it('selects multiple options when dropdown is multi', async () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText, queryByText } = render(
      <Dropdown multi name="choosePokemon" options={options} />,
    );

    getByTestId('choosePokemon-valueContainer').focus();
    fireEvent.click(getByText('Charmander'));
    fireEvent.click(getByText('Squirtle'));
    fireEvent.blur(getByTestId('choosePokemon-valueContainer'));
    await waitFor(() => queryByText(/Bulbasaur/) === null);

    expect(container).toMatchSnapshot();
  });

  it('deselects option when clicking on them twice when dropdown is multi', async () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText, getAllByText } = render(
      <Dropdown multi name="choosePokemon" options={options} />,
    );

    fireEvent.focus(getByTestId('choosePokemon-valueContainer'));
    fireEvent.click(getByText('Charmander'));
    fireEvent.click(getAllByText(/Charmander/)[1]);
    fireEvent.blur(getByTestId('choosePokemon-valueContainer'));
    expect(container).toMatchSnapshot();
  });

  it('closes options when clicking outside', async () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText, queryByText, asFragment } = render(
      <Dropdown name="choosePokemon" options={options} />,
    );

    getByTestId('choosePokemon-valueContainer').focus();
    await waitFor(() => queryByText('Squirtle') !== null);
    const optionsOutFrag = asFragment();
    expect(optionsOutFrag).toMatchSnapshot();
    fireEvent.blur(getByTestId('choosePokemon-valueContainer'));
    // getByTestId('choosePokemon-valueContainer').blur();
    await waitFor(() => expect(queryByText('Squirtle')).toBeNull());
    expect(queryByText('Squirtle')).toBeNull();
    const optionsClosedFrag = asFragment();
    expect(optionsClosedFrag).toMatchSnapshot();
  });

  it('can use arrow keys and enter to navigate options', async () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container, getByTestId, getByText, queryByText, rerender } = render(
      <Dropdown name="choosePokemon" options={options} />,
    );
    getByTestId('choosePokemon-valueContainer').focus();
    await waitFor(() => queryByText('Bulbasaur') !== null);
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', code: 'ArrowUp' });
    act(() => {
      fireEvent.keyDown(document.activeElement, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => expect(queryByText('Squirtle')).toBeNull());
    expect(getByText('Charmander')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('selects options from values prop', () => {
    const options = ['Bulbasaur', 'Charmander', 'Squirtle'];
    const { container } = render(
      <Dropdown
        multi
        name="choosePokemon"
        options={options}
        values={['Bulbasaur', 'Charmander']}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
