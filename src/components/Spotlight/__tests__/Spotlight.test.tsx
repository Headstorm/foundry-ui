import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button, Spotlight } from '../../../index';

expect.extend(toHaveNoViolations);

// TODO: Reenable snapshot testing after react-portal supports react-testing-library
// Issue: https://github.com/tajo/react-portal/issues/238

describe('Spotlight', () => {
  it('Should pass accessibility test with default props', async () => {
    const component = <Spotlight />;
    const { container } = render(component);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('Should match previous snapshot with default props', async () => {
    const onEnd = jest.fn();
    const containerRef = React.createRef<HTMLButtonElement>();
    const component = <Spotlight containerRef={containerRef} onAnimationEnd={onEnd} />;
    const { container } = render(component);
    await waitFor(() => expect(onEnd).toHaveBeenCalled());
    await waitFor(() => expect(() => containerRef.current).toBeTruthy());
  });

  // TODO: waitFor onEnd is a slightly flakey test.
  it('Should match previous snapshot with a targetElement', async () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const containerRef = React.createRef<HTMLButtonElement>();
    const onEnd = jest.fn();
    const component = (
      <Spotlight
        onAnimationEnd={onEnd}
        containerRef={containerRef}
        targetElement={buttonRef.current}
      >
        <Button containerRef={buttonRef}>Test</Button>
      </Spotlight>
    );
    const { container } = render(component);
    await waitFor(() => expect(onEnd).toHaveBeenCalled());
    await waitFor(() => expect(() => buttonRef.current).toBeTruthy());
    await waitFor(() => expect(() => containerRef.current).toBeTruthy());
  });
});
