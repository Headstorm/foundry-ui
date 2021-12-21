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

const mockRect = {
  bottom: 160,
  top: 160,
  left: 160,
  right: 160,
  height: 160,
  width: 160,
  x: 160,
  y: 160,
  toJSON: () => {},
};

// Mock the implementation once for each test since observe gets called
// twice on init (once for hidden container and once for options container)
// for the IntersectionObserver tests, callback only needs to get called once
const observe = jest.fn();
beforeEach(() => {
  observe.mockImplementationOnce(
    (
      callback: IntersectionObserverCallback,
      entries: IntersectionObserverEntry[],
      instance: IntersectionObserver,
    ) => {
      callback(entries, instance);
    },
  );
});

// IntersectionObserver needs to be mocked b/c it does not exist in node testing env
const generateIntersectionObserver = (entries: IntersectionObserverEntry[]) => {
  window.IntersectionObserver = jest.fn((callback, options = {}) => {
    const instance: IntersectionObserver = {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '',
      thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
      observe: jest.fn(() => observe(callback, entries, instance)),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
    };
    return instance;
  });
  global.IntersectionObserver = window.IntersectionObserver;
  return window.IntersectionObserver;
};

afterEach(() => {
  // @ts-ignore
  window.IntersectionObserver.mockClear();
  // @ts-ignore
  global.IntersectionObserver.mockClear();
});

describe('Dropdown', () => {
  it('does not display options on initial render', () => {
    generateIntersectionObserver([]);
    const { container } = render(<Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />);

    expect(container).toMatchSnapshot();
  });

  it('displays placeholder value on initial render', () => {
    generateIntersectionObserver([]);
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
    generateIntersectionObserver([]);
    const { container } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} values={['bulbasaur']} />,
    );

    expect(container).toMatchSnapshot();
  });

  // this happens when multi is false - whether this is the ideal case or not is up for discussion
  it('renders two values when given matching option ids through props', () => {
    generateIntersectionObserver([]);
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
    generateIntersectionObserver([]);
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
    generateIntersectionObserver([]);
    const { container } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} values={['pickandchew']} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders one value when given two values but only one matches an option id', () => {
    generateIntersectionObserver([]);
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
    generateIntersectionObserver([]);
    const { container } = render(<Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />);
    act(() => {
      fireEvent.focus(screen.getByRole('button'));
    });
    expect(container).toMatchSnapshot();
  });

  it('can focus dropdown and select option', async () => {
    generateIntersectionObserver([]);
    const { container, getByText } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} virtualizeOptions={false} />,
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
    generateIntersectionObserver([]);
    const { getByText, queryByText } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        multi
        options={pokeOptions}
        virtualizeOptions={false}
      />,
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
    generateIntersectionObserver([]);
    const { container, getByText } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        multi
        options={pokeOptions}
        virtualizeOptions={false}
      />,
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
    generateIntersectionObserver([]);
    const { queryByText, asFragment } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
    );

    screen.getByRole('button').focus();
    // need to wait for observer to be called (for hidden options container and options container)
    // before the dropdown is rendered correctly
    await waitFor(() => expect(observe).toHaveBeenCalledTimes(2));
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
    generateIntersectionObserver([]);
    const { queryByText } = render(
      <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} virtualizeOptions={false} />,
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
      fireEvent.keyDown(document.activeElement, {
        key: 'Enter',
        code: 'Enter',
      });
    });

    await waitFor(() => expect(mockedSelectHandler).toHaveBeenCalledWith(['charmander']));
  });

  it('can use arrow keys and enter to navigate options when searchable is true', async () => {
    generateIntersectionObserver([]);
    const { queryByText } = render(
      <Dropdown
        onSelect={mockedSelectHandler}
        searchable
        options={pokeOptions}
        virtualizeOptions={false}
      />,
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
      fireEvent.keyDown(document.activeElement, {
        key: 'Enter',
        code: 'Enter',
      });
    });

    await waitFor(() => expect(mockedSelectHandler).toHaveBeenCalledWith(['charmander']));
  });

  it('selects options from values prop', () => {
    generateIntersectionObserver([]);
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
      generateIntersectionObserver([]);
      const component = (
        <Dropdown onSelect={() => {}} placeholder="hello" options={pokeOptions}></Dropdown>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Undefined Options Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      generateIntersectionObserver([]);
      const component = (
          <Dropdown onSelect={() => {}} placeholder="hello" options={undefined}></Dropdown>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      const { container } = render(
        <Dropdown onSelect={() => {}} options={pokeOptions} containerRef={ref} />,
      );
      await waitFor(() => container);
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });

    it('optionsContainerRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      render(<Dropdown options={pokeOptions} onSelect={() => {}} optionsContainerRef={ref} />);
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });

    it('hiddenOptionsContainerRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      render(
        <Dropdown options={pokeOptions} onSelect={() => {}} hiddenOptionsContainerRef={ref} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });

    it('optionItemRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      render(
        <Dropdown
          options={pokeOptions}
          onSelect={() => {}}
          optionItemRef={ref}
          virtualizeOptions={false}
        />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });

    it('valueContainerRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLButtonElement>();
      render(<Dropdown options={pokeOptions} onSelect={() => {}} valueContainerRef={ref} />);
      await waitFor(() => screen.getByRole(`button`));
      expect(ref.current instanceof HTMLButtonElement).toBeTruthy();
    });

    it('valueItemRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Dropdown name={testId} options={pokeOptions} onSelect={() => {}} valueItemRef={ref} />,
      );
      await waitFor(() => getByTestId(`${testId}-value-item`));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });

    it('placeholderRef.current should exist', async () => {
      generateIntersectionObserver([]);
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Dropdown name={testId} options={pokeOptions} onSelect={() => {}} placeholderRef={ref} />,
      );
      await waitFor(() => getByTestId(`${testId}-placeholder`));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
  });

  describe('IntersectionObserver tests', () => {
    it('Check if intersection observer is called when dropdown is clicked', async () => {
      generateIntersectionObserver([]);
      const { container } = render(
        <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      // expect observer to be called once for options container and once for hidden options container
      await waitFor(() => expect(observe).toHaveBeenCalledTimes(2));
      expect(container).toMatchSnapshot();
    });

    it('Make sure observer is not called when shouldStayInView prop is false', async () => {
      generateIntersectionObserver([]);
      const { container } = render(
        <Dropdown shouldStayInView={false} onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      // observe should not be called
      expect(observe).toHaveBeenCalledTimes(0);
    });

    it('Both containers are fully in viewport', async () => {
      const entriesOptionsInView: IntersectionObserverEntry[] = [
        {
          boundingClientRect: mockRect,
          intersectionRatio: 1,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
        {
          boundingClientRect: mockRect,
          intersectionRatio: 1,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
      ];
      generateIntersectionObserver(entriesOptionsInView);

      const { container } = render(
        <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      await waitFor(() => expect(observe).toHaveBeenCalledTimes(2));
      expect(container).toMatchSnapshot();
    });

    it('Options container is in view and hidden options container is not', async () => {
      const entriesOptionsInView: IntersectionObserverEntry[] = [
        {
          boundingClientRect: mockRect,
          intersectionRatio: 1,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
        {
          boundingClientRect: mockRect,
          intersectionRatio: 0.2,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
      ];
      generateIntersectionObserver(entriesOptionsInView);

      const { container } = render(
        <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      await waitFor(() => expect(observe).toHaveBeenCalledTimes(2));
      expect(container).toMatchSnapshot();
    });

    it('Hidden options container is in view and options container is not', async () => {
      const entriesHiddenOptionsInView: IntersectionObserverEntry[] = [
        {
          boundingClientRect: mockRect,
          intersectionRatio: 0.2,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
        {
          boundingClientRect: mockRect,
          intersectionRatio: 1,
          intersectionRect: mockRect,
          isIntersecting: true,
          rootBounds: null,
          // @ts-ignore
          target: {},
          time: 0,
        },
      ];
      generateIntersectionObserver(entriesHiddenOptionsInView);

      const { container } = render(
        <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      await waitFor(() => expect(observe).toHaveBeenCalledTimes(2));
      expect(container).toMatchSnapshot();
    });
  });
});
