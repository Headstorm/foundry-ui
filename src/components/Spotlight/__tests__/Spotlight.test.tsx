import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Button, Spotlight } from '../../../index';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Spotlight', () => {
  it('Should pass accessibility test with default props', async () => {
    const component = <Spotlight />;
    const { container } = render(component);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('Should match previous snapshot with default props', async () => {
    const component = <Spotlight />;
    const { container } = render(component, { container: document.body });
    expect(container).toMatchSnapshot();
  });
  it('Should match previous snapshot with a targetElement', async () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const component = (
      <Spotlight targetElement={buttonRef.current}>
        <Button containerRef={buttonRef}>Test</Button>
      </Spotlight>
    );
    const { container } = render(component, { container: document.body });
    await waitFor(() => buttonRef.current);
    expect(container).toMatchSnapshot();
  });
});
