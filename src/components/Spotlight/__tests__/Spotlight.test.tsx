import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button, Spotlight } from '../../../index';

expect.extend(toHaveNoViolations);

describe('Spotlight', () => {
  it('Should pass accessibility test with default props', async () => {
    const component = <Spotlight />;
    const { container } = render(component, { container: document.body });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('Should match previous snapshot with default props', async () => {
    const onEnd = jest.fn();
    const component = <Spotlight onAnimationEnd={onEnd} />;
    const { container } = render(component, { container: document.body });
    await waitFor(() => expect(onEnd).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });

  // TODO: waitFor onEnd is a slightly flakey test.
  it('Should match previous snapshot with a targetElement', async () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const onEnd = jest.fn();
    const component = (
      <Spotlight onAnimationEnd={onEnd} targetElement={buttonRef.current}>
        <Button containerRef={buttonRef}>Test</Button>
      </Spotlight>
    );
    const { container } = render(component, { container: document.body });
    await waitFor(() => buttonRef.current);
    await waitFor(() => expect(onEnd).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });
});
