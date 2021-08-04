import React from 'react';
import { render, fireEvent, waitFor, configure, screen } from '@testing-library/react';
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
    const { getByTestId } = render(<Button onClick={clickSpy}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows loading text when provided', async () => {
    const { container, getByTestId } = render(<Button isLoading={true} onClick={() => {}} />);

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer with nondefault props variant and color', async () => {
    const { container, getByTestId } = render(
      <Button color={colors.black} elevation={2} variant={variants.outline} onClick={() => {}} />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.text', async () => {
    const { container, getByTestId } = render(
      <Button variant={variants.text} onClick={() => {}} />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.fill', async () => {
    const { container, getByTestId } = render(
      <Button variant={variants.fill} onClick={() => {}} />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows ButtonContainer ButtonVariant.outline', async () => {
    const { container, getByTestId } = render(
      <Button variant={variants.outline} onClick={() => {}} />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows LeftIconContainer when isProcessing', async () => {
    const { container, getByTestId } = render(<Button isProcessing onClick={() => {}} />);

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows icons with type string', async () => {
    const { container, getByTestId } = render(
      <Button iconSuffix="mdiComment" iconPrefix="mdiComment" onClick={() => {}} />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('shows icons', async () => {
    const { container, getByTestId } = render(
      <Button
        iconSuffix={<Icon path={'mdiComment'} />}
        iconPrefix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );

    await waitFor(() => screen.getByRole('button'));

    expect(container).toMatchSnapshot();
  });

  it('keeps the container the same when switching between isLoading and not isLoading', async () => {
    const onClick = jest.fn();
    const { getByTestId, rerender, asFragment } = render(
      <Button isLoading={true} onClick={onClick} />,
    );

    await waitFor(() => screen.getByRole('button'));
    const loadingFragment = asFragment();

    rerender(<Button onClick={onClick}>Submit</Button>);
    await waitFor(() => screen.getByRole('button'));
    const loadedFragment = asFragment();

    // TODO: Use toMatchDiffSnapshot() between the fragments once we can figure out
    //  how to make it use the jest-styled-components plugin
    expect(loadingFragment.firstChild).toMatchSnapshot();
    expect(loadedFragment.firstChild).toMatchSnapshot();
  });
  it('containerRef.current should exist', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { getByTestId } = render(<Button containerRef={ref} onClick={() => {}} />);
    await waitFor(() => screen.getByRole('button'));
    expect(ref.current).toBeTruthy();
  });
  it('leftIconCntainerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Button
        leftIconContainerRef={ref}
        iconPrefix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );
    await waitFor(() => screen.getByRole('button'));
    expect(ref.current).toBeTruthy();
  });
  it('rightIconContainerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Button
        rightIconContainerRef={ref}
        iconSuffix={<Icon path={'mdiComment'} />}
        onClick={() => {}}
      />,
    );
    await waitFor(() => screen.getByRole('button'));
    expect(ref.current).toBeTruthy();
  });
  it('loadingBarRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(<Button loadingBarRef={ref} isLoading onClick={() => {}} />);
    await waitFor(() => screen.getByRole('button'));
    expect(ref.current).toBeTruthy();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Button onClick={() => {}}>Enter</Button>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
