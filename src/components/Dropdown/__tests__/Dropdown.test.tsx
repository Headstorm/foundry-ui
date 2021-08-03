import React from 'react';
import { render, fireEvent, waitFor, act, configure, screen } from '@testing-library/react';
import Dropdown from '../Dropdown';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'id' });
const testId = 'foundry-test';

const pokeOptions = [
  { id: 'bulbasaur', optionValue: 'Bulbasaur' },
  { id: 'charmander', optionValue: 'Charmander' },
  { id: 'squirtle', optionValue: 'Squirtle' },
];

const mockedSelectHandler = jest.fn();

describe('Dropdown', () => {
  it('does not display options on initial render', () => {
    const { container } = render(<Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />);

    expect(container).toMatchSnapshot();
  });

  it('displays placeholder value on initial render', () => {
    const { container, getByText } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        options={pokeOptions}
        placeholder="Choose a pokemon"
      />,
    );
    const placeholder = getByText('Choose a pokemon');
    expect(placeholder).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('renders a value when given a matching option id through props', () => {
    const { container } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} values={['bulbasaur']} />,
    );

    expect(container).toMatchSnapshot();
  });

  // this happens when multi is false - whether this is the ideal case or not is up for discussion
  it('renders two values when given matching option ids through props', () => {
    const { container } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        options={pokeOptions}
        values={['bulbasaur', 'charmander']}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders two values when given matching option ids through props when multi is set to true', () => {
    const { container } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        options={pokeOptions}
        multi
        values={['bulbasaur', 'charmander']}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders no value when given a value that doesn't match any option id", () => {
    const { container } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} values={['pickandchew']} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders one value when given two values but only one matches an option id', () => {
    const { container } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        options={pokeOptions}
        values={['pickandchew', 'bulbasaur']}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('displays all options when focused', () => {
    const { container } = render(<Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />);
    act(() => {
      fireEvent.focus(screen.getByRole('button'));
    });
    expect(container).toMatchSnapshot();
  });

  it('can focus dropdown and select option', async () => {
    const { container, getByText } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
    );

    // TODO - Don't use id, see if we can use a more semantically meaningful element
    fireEvent.focus(screen.getByRole('button'));
    await waitFor(() => getByText('Charmander'));
    act(() => {
      fireEvent.click(getByText('Charmander'));
    });
    expect(container).toMatchSnapshot();
    expect(mockedSelectHandler).toHaveBeenCalled();
  });

  it('selects multiple options when dropdown is multi', async () => {
    const { getByText, queryByText } = render(
      <Dropdown onSelect={mockedSelectHandler} multi options={pokeOptions} />,
    );

    screen.getByRole('button').focus();
    act(() => {
      fireEvent.click(getByText('Charmander'));
      fireEvent.click(getByText('Squirtle'));
      fireEvent.blur(screen.getByRole('button'));
    });
    await waitFor(() => queryByText(/Bulbasaur/) === null);

    expect(mockedSelectHandler).toHaveBeenCalledTimes(2);
  });

  it('deselects option when clicking on them twice when dropdown is multi', async () => {
    const { container, getByText } = render(
      <Dropdown onSelect={mockedSelectHandler} multi options={pokeOptions} />,
    );

    act(() => {
      fireEvent.focus(screen.getByRole('button'));
    });
    const charOption = getByText('Charmander');
    act(() => {
      fireEvent.click(charOption);
      fireEvent.click(charOption);
      fireEvent.blur(screen.getByRole('button'));
    });
    expect(container).toMatchSnapshot();
    expect(mockedSelectHandler).toHaveBeenCalledTimes(2);
  });

  it('closes options when clicking outside', async () => {
    const { queryByText, asFragment } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
    );

    screen.getByRole('button').focus();
    await waitFor(() => queryByText('Squirtle') !== null);
    const optionsOutFrag = asFragment();
    expect(optionsOutFrag).toMatchSnapshot();

    act(() => {
      fireEvent.blur(screen.getByRole('button'));
    });
    await waitFor(() => queryByText('Squirtle') === null);
    expect(queryByText('Squirtle')).toBeNull();

    const optionsClosedFrag = asFragment();
    expect(optionsClosedFrag).toMatchSnapshot();
  });

  it('can use arrow keys and enter to navigate options', async () => {
    const { queryByText } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
    );
    act(() => {
      screen.getByRole('button').focus();
    });
    await waitFor(() => expect(queryByText('Squirtle')).toBeTruthy());
    act(() => {
      fireEvent.keyDown(document.activeElement, {
        key: 'ArrowDown',
        code: 'ArrowDown',
      });
      fireEvent.keyDown(document.activeElement, {
        key: 'ArrowDown',
        code: 'ArrowDown',
      });
      fireEvent.keyDown(document.activeElement, {
        key: 'ArrowDown',
        code: 'ArrowDown',
      });
      fireEvent.keyDown(document.activeElement, {
        key: 'ArrowDown',
        code: 'ArrowDown',
      });
      fireEvent.keyDown(document.activeElement, {
        key: 'ArrowUp',
        code: 'ArrowUp',
      });
      fireEvent.keyDown(document.activeElement, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => expect(mockedSelectHandler).toHaveBeenCalledWith(['charmander']));
  });

  it('selects options from values prop', () => {
    const { container } = render(
      <Dropdown
        multi
        options={pokeOptions}
        values={['bulbasaur', 'charmander']}
        onSelect={mockedSelectHandler}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = (
        <Dropdown onSelect={() => {}} placeholder="hello" options={pokeOptions}></Dropdown>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLElement>();
      const { container } = render(<Dropdown onSelect={() => {}} containerRef={ref} />);
      await waitFor(() => container);
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
    it('optionsContainerRef.current should exist', async () => {
      const ref = React.createRef<HTMLElement>();
      render(<Dropdown options={pokeOptions} onSelect={() => {}} optionsContainerRef={ref} />);
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
    it('optionItemRef.current should exist', async () => {
      const ref = React.createRef<HTMLElement>();
      render(<Dropdown options={pokeOptions} onSelect={() => {}} optionItemRef={ref} />);
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
    it('valueContainerRef.current should exist', async () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Dropdown onSelect={() => {}} valueContainerRef={ref} />);
      await waitFor(() => screen.getByRole(`button`));
      expect(ref.current instanceof HTMLButtonElement).toBeTruthy();
    });
    it('valueItemRef.current should exist', async () => {
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Dropdown name={testId} onSelect={() => {}} valueItemRef={ref} />,
      );
      await waitFor(() => getByTestId(`${testId}-value-item`));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
    it('placeholderRef.current should exist', async () => {
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Dropdown name={testId} onSelect={() => {}} placeholderRef={ref} />,
      );
      await waitFor(() => getByTestId(`${testId}-placeholder`));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
  });
});
