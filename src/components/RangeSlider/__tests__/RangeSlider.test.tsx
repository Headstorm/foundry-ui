import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import RangeSlider from '../RangeSlider';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'hs-ui-range-slider-unit-test';

describe('RangeSlider', () => {
  it('renders', async () => {
    const { container, getByTestId } = render(<RangeSlider min={0} max={10} testId="unit-test" />);

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('renders', async () => {
    const { container, getByTestId } = render(
      <RangeSlider values={[3]} markers={[3]} min={0} max={10} testId="unit-test" />,
    );

    await waitFor(() => getByTestId(testId));
    fireEvent.mouseDown(getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  // it('Fire handler on click event ', async () => {
  //   const spy = jest.fn();
  //   const { getByTestId } = render(<RangeSlider slideRailProps={{onMouseDown: spy}} min={0} max={10} testId="unit-test" />);
  //   await waitFor(() => getByTestId(testId));
  //   fireEvent.mouseDown(getByTestId(testId));
  //   expect(spy).toHaveBeenCalled();
  // });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <RangeSlider min={0} max={10} testId={testId} />;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <RangeSlider min={0} max={10} containerRef={ref} testId="unit-test" />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
