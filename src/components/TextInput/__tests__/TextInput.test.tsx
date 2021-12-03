import React from 'react';
import { render, screen, configure, waitFor, act, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';
import { axe, toHaveNoViolations } from 'jest-axe';
import variants from '../../../enums/variants';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-text-input';
const containerProps = { 'data-test-id': testId };

describe('TextInput', () => {
  describe('Rendering tests', () => {
    it('Shows TextInput with default props', async () => {
      const { container, getByTestId } = render(<TextInput containerProps={containerProps} />);
      await waitFor(() => getByTestId(testId));
      expect(container).toMatchSnapshot();
    });
    it('Shows TextInput with fill variant', async () => {
      const { container, getByTestId } = render(
        <TextInput variant={variants.fill} containerProps={containerProps} />,
      );
      await waitFor(() => getByTestId(testId));
      expect(container).toMatchSnapshot();
    });
    it('Shows TextInput with text variant', async () => {
      const { container, getByTestId } = render(
        <TextInput variant={variants.text} containerProps={containerProps} />,
      );
      await waitFor(() => getByTestId(testId));
      expect(container).toMatchSnapshot();
    });
  });
  describe('Event tests', () => {
    it('Fires onChange when input is typed in', async () => {
      const changeFn = jest.fn();
      const { getByRole } = render(<TextInput onChange={changeFn} />);
      await waitFor(() => getByRole('textbox'));

      act(() => {
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: 'test' },
        });
      });

      expect(changeFn).toBeCalledTimes(1);
    });
    it('Fires onDebouncedChange when input is typed in', async () => {
      const debouncedChangeFn = jest.fn();
      const { getByRole } = render(<TextInput debouncedOnChange={debouncedChangeFn} />);
      await waitFor(() => getByRole('textbox'));

      act(() => {
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: 'test' },
        });
      });

      waitFor(() => expect(debouncedChangeFn).toBeCalledTimes(1));
    });
    it("Doesn't fire onClear when clearable is true but no value exists (uncontrolled)", async () => {
      const onClearFn = jest.fn();
      const { getByRole } = render(<TextInput clearable onClear={onClearFn} />);
      await waitFor(() => getByRole('button'));

      act(() => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(onClearFn).toBeCalledTimes(0);
    });
    it('Fires onClear when clearable is true and value exists (uncontrolled)', async () => {
      const onClearFn = jest.fn();
      const onChangeFn = jest.fn();
      const { getByRole } = render(
        <TextInput clearable onChange={onChangeFn} onClear={onClearFn} />,
      );
      await waitFor(() => getByRole('button'));

      act(() => {
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: 'test' },
        });
      });

      await waitFor(() => expect(onChangeFn).toBeCalledTimes(1));
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toEqual('test');

      act(() => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(onClearFn).toBeCalledTimes(1);
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toEqual('');
    });
    it('Fires onClear when clearable is true and value exists (controlled)', async () => {
      const onClearFn = jest.fn();
      const { getByRole } = render(<TextInput value="test" clearable onClear={onClearFn} />);
      await waitFor(() => getByRole('button'));

      act(() => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(onClearFn).toBeCalledTimes(1);
    });
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <TextInput aria-label="text-input"></TextInput>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <TextInput containerRef={ref} containerProps={containerProps} />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('inputRef.current should exist', async () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getByTestId } = render(<TextInput inputRef={ref} containerProps={containerProps} />);
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLInputElement).toBeTruthy();
    });
    it('errorContainerRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <TextInput
          errorContainerRef={ref}
          isValid={false}
          errorMessage={'error!'}
          containerProps={containerProps}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('characterCountRef.current should exist', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <TextInput
          showCharacterCount
          maxLength={20}
          characterCountRef={ref}
          containerProps={containerProps}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
