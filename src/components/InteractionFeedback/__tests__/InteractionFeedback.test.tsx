import React from 'react';
import styled from 'styled-components';
import { fireEvent, render, waitFor, configure } from '@testing-library/react';
import InteractionFeedback from '../InteractionFeedback';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-interaction-feedback';

const transitionProps = {
  from: {
    r: 1,
    opacity: 0.5,
  },
  enter: {
    r: 10,
    opacity: 0,
  },
  config: {
    mass: 10,
    tension: 100,
    friction: 10,
    clamp: true,
  },
};

describe('InteractionFeedback', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = (
        <InteractionFeedback>
          <div>test</div>
        </InteractionFeedback>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('Shows InteractionFeedback with default props', async () => {
    const { container, getByTestId } = render(
      <InteractionFeedback containerProps={{ 'data-test-id': testId }}>
        <div>test</div>
      </InteractionFeedback>,
    );
    await waitFor(() => getByTestId(testId));
    fireEvent.mouseDown(getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('onMousedown handler is called on click event ', async () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <InteractionFeedback
        transitionProps={transitionProps}
        containerProps={{ 'data-test-id': testId, onMouseDown: spy }}
      >
        <div>test</div>
      </InteractionFeedback>,
    );
    await waitFor(() => getByTestId(testId));
    fireEvent.mouseDown(getByTestId(testId));
    expect(spy).toHaveBeenCalled();
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <InteractionFeedback containerRef={ref} containerProps={{ 'data-test-id': testId }} />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('SVGcontainerRef.current should exist', async () => {
      const ref = React.createRef<SVGElement>();
      const { getByTestId } = render(
        <InteractionFeedback SVGContainerRef={ref} containerProps={{ 'data-test-id': testId }} />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof SVGElement).toBeTruthy();
    });
  });
});
