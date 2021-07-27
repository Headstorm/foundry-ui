import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import Icon from '@mdi/react';
import colors from '../../../enums/colors';
import variants from '../../../enums/variants';
import Button from '../Button';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-test';

describe('Button', () => {
  it('fires click handler when clicked', () => {
    const clickSpy = jest.fn();
    const { getByTestId } = render(
      <Button dataTestId={testId} onClick={clickSpy}>
        Click me
      </Button>,
    );

    fireEvent.click(getByTestId(testId));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows loading text when provided', async () => {
    const { container, getByTestId } = render(
      <Button dataTestId={testId} isLoading={true} onClick={() => {}} />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer with nondefault props variant and color', async () => {
    const { container, getByTestId } = render(
      <Button
        dataTestId={testId}
        color={colors.black}
        elevation={2}
        variant={variants.outline}
        onClick={() => {}}
      />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.text', async () => {
    const { container, getByTestId } = render(
      <Button dataTestId={testId} variant={variants.text} onClick={() => {}} />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.fill', async () => {
    const { container, getByTestId } = render(
      <Button dataTestId={testId} variant={variants.fill} onClick={() => {}} />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.outline', async () => {
    const { container, getByTestId } = render(
      <Button dataTestId={testId} variant={variants.outline} onClick={() => {}} />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows LeftIconContainer when isProcessing', async () => {
    const { container, getByTestId } = render(
      <Button dataTestId={testId} isProcessing onClick={() => {}} />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows icons with type string', async () => {
    const { container, getByTestId } = render(
      <Button
        dataTestId={testId}
        iconSuffix="mdiComment"
        iconPrefix="mdiComment"
        onClick={() => {}}
      />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('shows icons', async () => {
    const { container, getByTestId } = render(
      <Button
        dataTestId={testId}
        iconSuffix={<Icon path={'mdiComment'} />}
        iconPrefix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );

    await waitFor(() => getByTestId(testId));

    expect(container).toMatchSnapshot();
  });

  it('keeps the container the same when switching between isLoading and not isLoading', async () => {
    const onClick = jest.fn();
    const { getByTestId, rerender, asFragment } = render(
      <Button dataTestId={testId} isLoading={true} onClick={onClick} />,
    );

    await waitFor(() => getByTestId(testId));
    const loadingFragment = asFragment();

    rerender(
      <Button dataTestId={testId} onClick={onClick}>
        Submit
      </Button>,
    );
    await waitFor(() => getByTestId(testId));
    const loadedFragment = asFragment();

    // TODO: Use toMatchDiffSnapshot() between the fragments once we can figure out
    //  how to make it use the jest-styled-components plugin
    expect(loadingFragment.firstChild).toMatchSnapshot();
    expect(loadedFragment.firstChild).toMatchSnapshot();
  });
  it('containerRef.current should exist', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { getByTestId } = render(
      <Button dataTestId={testId} containerRef={ref} onClick={() => {}} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('leftIconCntainerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Button
        dataTestId={testId}
        leftIconContainerRef={ref}
        iconPrefix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('rightIconContainerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Button
        dataTestId={testId}
        rightIconContainerRef={ref}
        iconSuffix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('loadingBarRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Button dataTestId={testId} loadingBarRef={ref} isLoading onClick={() => {}} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = (
        <Button dataTestId={testId} onClick={() => {}}>
          Enter
        </Button>
      );
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
