import React from 'react';
import styled from 'styled-components';
import { render, configure, waitFor } from '@testing-library/react';
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
