import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Toggle from '../Toggle';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Toggle', () => {
  it('fires toggle handler when clicked', () => {
    const clickSpy = jest.fn();
    const { getByRole } = render(<Toggle checked onToggle={clickSpy} />);

    act(() => {
      fireEvent.click(getByRole('switch'));
    });

    expect(clickSpy).toHaveBeenCalled();
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Toggle onToggle={() => {}} inputProps={{ 'aria-label': 'test' }}></Toggle>;
      const { container } = render(component);
      const results = await axe(container);
      expect(container).toMatchSnapshot();
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref Tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLLabelElement>();
      const { getByRole } = render(<Toggle containerRef={ref} onToggle={() => {}} />);
      await waitFor(() => getByRole('switch'));
      expect(ref.current instanceof HTMLLabelElement).toBeTruthy();
    });
    it('handleRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByRole } = render(<Toggle handleRef={ref} onToggle={() => {}} />);
      await waitFor(() => getByRole('switch'));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });

    it('inputRef.current should exist', async () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getByRole } = render(<Toggle inputRef={ref} onToggle={() => {}} />);
      await waitFor(() => getByRole('switch'));
      expect(ref.current instanceof HTMLInputElement).toBeTruthy();
    });
  });
});
