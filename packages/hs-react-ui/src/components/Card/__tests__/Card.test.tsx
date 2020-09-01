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
});
