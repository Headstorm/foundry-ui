import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import Icon from '@mdi/react';
import Text from '../Text';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'hsui-Text';

describe('Text', () => {
  it('matches snapshot', async () => {
    const { container, getByTestId } = render(<Text />);
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with isLoading', async () => {
    const { container, getByTestId } = render(<Text isLoading />);
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with isProcessing', async () => {
    const { container, getByTestId } = render(<Text isProcessing />);
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with icon strings', async () => {
    const { container, getByTestId } = render(
      <Text iconPrefix="mdiComment" iconSuffix="mdiComment" />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with icons', async () => {
    const { container, getByTestId } = render(
      <Text iconPrefix={<Icon path={'mdiComment'} />} iconSuffix={<Icon path={'mdiComment'} />} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Text></Text>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const testId = 'hsui-Text';
      const containerProps = { 'data-test-id': testId };
      const ref = React.createRef<HTMLSpanElement>();
      const { getByTestId } = render(
        <Text containerRef={ref} containerProps={containerProps}>
          test
        </Text>,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLSpanElement).toBeTruthy();
    });
    it('iconPrefixContainerRef.current should exist', async () => {
      const testId = 'hsui-Text';
      const containerProps = { 'data-test-id': testId };
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Text
          iconPrefixContainerRef={ref}
          iconPrefix={<div>prefix</div>}
          containerProps={containerProps}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
    it('iconSuffixContainerRef.current should exist', async () => {
      const testId = 'hsui-Text';
      const containerProps = { 'data-test-id': testId };
      const ref = React.createRef<HTMLElement>();
      const { getByTestId } = render(
        <Text
          iconSuffixContainerRef={ref}
          iconSuffix={<div>prefix</div>}
          containerProps={containerProps}
        />,
      );
      await waitFor(() => getByTestId(testId));
      expect(ref.current instanceof HTMLElement).toBeTruthy();
    });
  });
});
