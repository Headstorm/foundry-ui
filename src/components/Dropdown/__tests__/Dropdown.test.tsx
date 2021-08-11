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

// const mockRect = {
//   bottom: 0,
//   top: 0,
//   left: 0,
//   right: 0,
//   height: 0,
//   width: 0,
//   x: 0,
//   y: 0,
//   toJSON: () => {},
// };
// const entries: IntersectionObserverEntry[] = [
//   {
//     boundingClientRect: mockRect,
//     intersectionRatio: 0.2,
//     intersectionRect: mockRect,
//     isIntersecting: true,
//     rootBounds: null,
//     // @ts-ignore
//     target: {},
//     time: 0,
//   },
//   {
//     boundingClientRect: mockRect,
//     intersectionRatio: 0.8,
//     intersectionRect: mockRect,
//     isIntersecting: true,
//     rootBounds: null,
//     // @ts-ignore
//     target: {},
//     time: 0,
//   },
// ];

// // const observe = jest.fn();
// const unobserve = jest.fn();
// const disconnect = jest.fn();
// const takeRecords = jest.fn();

// // IntersectionObserver needs to be mocked b/c it does not exist in node testing env
// beforeEach(() => {
//   global.IntersectionObserver = jest.fn((callback, options = {}) => {
//     const instance: IntersectionObserver = {
//       thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
//       root: options.root ?? null,
//       rootMargin: options.rootMargin ?? '',
//       observe: jest.fn((target: Element) => {
//         callback(entries, instance);
//       }),
//       unobserve,
//       disconnect,
//       takeRecords,
//     };

//     return instance;
//   });
// });

// afterEach(() => {
//   // @ts-ignore
//   global.IntersectionObserver.mockClear();
// });

const observe = jest.fn(() => {});

beforeEach(() => {
  function setupIntersectionObserverMock({
    root = null,
    rootMargin = '',
    thresholds = [],
    disconnect = () => null,
    observe = () => null,
    takeRecords = () => [],
    unobserve = () => null,
  } = {}): void {
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = root;
      readonly rootMargin: string = rootMargin;
      readonly thresholds: ReadonlyArray<number> = thresholds;
      disconnect: () => void = disconnect;
      observe: (target: Element) => void = observe;
      takeRecords: () => IntersectionObserverEntry[] = takeRecords;
      unobserve: (target: Element) => void = unobserve;
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });

    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
  }

  setupIntersectionObserverMock({ observe });
});

// type Item = {
//   callback: IntersectionObserverCallback;
//   elements: Set<Element>;
//   created: number;
// };

// const observers = new Map<IntersectionObserver, Item>();

// beforeEach(() => {
//   /**
//    * Create a custom IntersectionObserver mock, allowing us to intercept the observe and unobserve calls.
//    * We keep track of the elements being observed, so when `mockAllIsIntersecting` is triggered it will
//    * know which elements to trigger the event on.
//    */
//   global.IntersectionObserver = jest.fn((cb, options = {}) => {
//     const item = {
//       callback: cb,
//       elements: new Set<Element>(),
//       created: Date.now(),
//     };
//     const instance: IntersectionObserver = {
//       thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
//       root: options.root ?? null,
//       rootMargin: options.rootMargin ?? '',
//       observe: jest.fn((element: Element) => {
//         item.elements.add(element);
//       }),
//       unobserve: jest.fn((element: Element) => {
//         item.elements.delete(element);
//       }),
//       disconnect: jest.fn(() => {
//         observers.delete(instance);
//       }),
//       takeRecords: jest.fn(),
//     };

//     observers.set(instance, item);

//     return instance;
//   });
// });

// afterEach(() => {
//   // @ts-ignore
//   global.IntersectionObserver.mockClear();
//   observers.clear();
// });

// const triggerIntersection = (
//   elements: Element[],
//   trigger: boolean | number,
//   observer: IntersectionObserver,
//   item: Item,
// ) => {
//   const entries: IntersectionObserverEntry[] = [];

//   const isIntersecting =
//     typeof trigger === 'number'
//       ? observer.thresholds.some(threshold => trigger >= threshold)
//       : trigger;

//   const ratio =
//     typeof trigger === 'number'
//       ? observer.thresholds.find(threshold => trigger >= threshold) ?? 0
//       : trigger
//       ? 1
//       : 0;

//   elements.forEach(element => {
//     entries.push({
//       boundingClientRect: element.getBoundingClientRect(),
//       intersectionRatio: ratio,
//       intersectionRect: isIntersecting
//         ? element.getBoundingClientRect()
//         : {
//             bottom: 0,
//             height: 0,
//             left: 0,
//             right: 0,
//             top: 0,
//             width: 0,
//             x: 0,
//             y: 0,
//             toJSON(): any {},
//           },
//       isIntersecting,
//       rootBounds: null,
//       target: element,
//       time: Date.now() - item.created,
//     });
//   });

//   // Trigger the IntersectionObserver callback with all the entries
//   if (act) act(() => item.callback(entries, observer));
//   else item.callback(entries, observer);
// };

// /**
//  * Set the `isIntersecting` on all current IntersectionObserver instances
//  * @param isIntersecting {boolean | number}
//  */
// const mockAllIsIntersecting = (isIntersecting: boolean | number) => {
//   for (let [observer, item] of observers) {
//     triggerIntersection(Array.from(item.elements), isIntersecting, observer, item);
//   }
// };

// /**
//  * Set the `isIntersecting` for the IntersectionObserver of a specific element.
//  *
//  * @param element {Element}
//  * @param isIntersecting {boolean | number}
//  */
// const mockIsIntersecting = (element: Element, isIntersecting: boolean | number) => {
//   const observer = intersectionMockInstance(element);
//   if (!observer) {
//     throw new Error(
//       'No IntersectionObserver instance found for element. Is it still mounted in the DOM?',
//     );
//   }
//   const item = observers.get(observer);
//   if (item) {
//     triggerIntersection([element], isIntersecting, observer, item);
//   }
// };

// /**
//  * Call the `intersectionMockInstance` method with an element, to get the (mocked)
//  * `IntersectionObserver` instance. You can use this to spy on the `observe` and
//  * `unobserve` methods.
//  * @param element {Element}
//  * @return IntersectionObserver
//  */
// const intersectionMockInstance = (element: Element): IntersectionObserver => {
//   for (let [observer, item] of observers) {
//     if (item.elements.has(element)) {
//       return observer;
//     }
//   }

//   throw new Error('Failed to find IntersectionObserver for element. Is it being observed?');
// };

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

    it('hiddenOptionsContainerRef.current should exist', async () => {
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

  describe('IntersectionObserver tests', () => {
    it('Check if intersection observer is called when dropdown is clicked', () => {
      const { container } = render(
        <Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      // const IO = intersectionMockInstance(container);
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      //expect observer to be called once for options container and once for hidden options container
      expect(observe).toHaveBeenCalledTimes(2);
    });

    it('Make sure hidden options container is not rendered when shouldStayInView prop is false', () => {
      const { container } = render(
        <Dropdown shouldStayInView={false} onSelect={mockedSelectHandler} options={pokeOptions} />,
      );
      // const IO = intersectionMockInstance(container);
      act(() => {
        fireEvent.focus(screen.getByRole('button'));
      });
      expect(container).toMatchSnapshot();
      //observe should only be called once as hidden options container does not exist
      expect(observe).toHaveBeenCalledTimes(1);
    });

    it('Make sure dropdown faces direction with most viewport room when both containers are intersecting', () => {
      const container = render(<Dropdown onSelect={mockedSelectHandler} options={pokeOptions} />);
    });
  });
});
