import React from 'react';
import styled from 'styled-components';
import { render, waitFor, configure } from '@testing-library/react';
import Card, { Body } from '../Card';
import FeedbackTypes from '../../../enums/feedbackTypes';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-card';

describe('Card', () => {
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Card onClick={() => {}} aria-label="aria-label-test" />;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('shows Card with default props', async () => {
    const { container, getByTestId } = render(
      <Card onClick={() => {}} containerProps={{ 'data-test-id': testId }} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with non-default elevation', async () => {
    const { container, getByTestId } = render(
      <Card onClick={() => {}} containerProps={{ 'data-test-id': testId }} elevation={3} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with default feedback', async () => {
    const { container, getByTestId } = render(
      <Card onClick={() => {}} containerProps={{ 'data-test-id': testId }} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with simple feedback and no onClick', async () => {
    const { container, getByTestId } = render(
      <Card containerProps={{ 'data-test-id': testId }} feedbackType={FeedbackTypes.simple} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with ripple feedback and no onClick', async () => {
    const { container, getByTestId } = render(
      <Card containerProps={{ 'data-test-id': testId }} feedbackType={FeedbackTypes.ripple} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with simple feedback with onClick', async () => {
    const { container, getByTestId } = render(
      <Card
        onClick={() => null}
        containerProps={{ 'data-test-id': testId }}
        feedbackType={FeedbackTypes.simple}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('shows Card with ripple feedback with onClick', async () => {
    const { container, getByTestId } = render(
      <Card
        onClick={() => null}
        containerProps={{ 'data-test-id': testId }}
        feedbackType={FeedbackTypes.ripple}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  it('containerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Card containerRef={ref} containerProps={{ 'data-test-id': testId }} />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('headerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Card
        headerRef={ref}
        header={<div>Test Header</div>}
        containerProps={{ 'data-test-id': testId }}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('bodyRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Card
        bodyRef={ref}
        children={<div>Test body</div>}
        containerProps={{ 'data-test-id': testId }}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });
  it('footerRef.current should exist', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Card
        footerRef={ref}
        footer={<div>Test footer</div>}
        containerProps={{ 'data-test-id': testId }}
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(ref.current).toBeTruthy();
  });

  it('header bottom padding should be 1.5rem without body and footer', async () => {
    const { container, getByTestId } = render(
      <Card onClick={() => null} containerProps={{ 'data-test-id': testId }} header="Header" />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  it('header bottom padding should be 0rem when body is present', async () => {
    const { container, getByTestId } = render(
      <Card onClick={() => null} containerProps={{ 'data-test-id': testId }} header="Header">
        Body
      </Card>,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
  it('header bottom padding should be 0rem when footer is present', async () => {
    const { container, getByTestId } = render(
      <Card
        onClick={() => null}
        containerProps={{ 'data-test-id': testId }}
        header="Header"
        footer="Footer"
      />,
    );
    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
});
