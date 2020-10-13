import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import Checkbox from '../Checkbox';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
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
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = (
        <Checkbox onClick={() => {}} inputProps={{ 'aria-label': 'test' }}></Checkbox>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref Tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(<Checkbox containerRef={ref} onClick={() => {}} />);
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('boxRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(<Checkbox boxRef={ref} onClick={() => {}} />);
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('labelRef.current should exist', async () => {
      const ref = React.createRef<HTMLLabelElement>();
      const { getByTestId } = render(<Checkbox labelRef={ref} onClick={() => {}} />);
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLLabelElement).toBeTruthy();
    });
    it('inputRef.current should exist', async () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getByTestId } = render(<Checkbox inputRef={ref} onClick={() => {}} />);
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLInputElement).toBeTruthy();
    });
  });
});
