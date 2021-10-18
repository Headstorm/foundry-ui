import React from 'react';
import { render, fireEvent, waitFor, configure } from '@testing-library/react';
import MainNavigation from '../MainNavigation';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'hs-ui-main-navigation-unit-test';

describe('MainNavigation', () => {
  it('renders', async () => {
    const { container, getByTestId } = render(
      <MainNavigation containerProps={{ 'data-test-id': testId }} />,
    );

    await waitFor(() => getByTestId(testId));
    expect(container).toMatchSnapshot();
  });

  it('nav button clicks', async () => {
    const { container, getByTestId } = render(
      <MainNavigation
        navButtons={[
          {
            label: 'Test link',
            onClick: () => {},
          },
        ]}
        navButtonProps={[{ 'data-test-id': testId + '-click' }]}
      />,
    );

    await waitFor(() => getByTestId(testId + '-click'));
    fireEvent.mouseDown(getByTestId(testId + '-click'));
    expect(container).toMatchSnapshot();
  });

  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <MainNavigation />;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('Ref tests', () => {
    it('containerRef.current should exist', async () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <MainNavigation
          containerRef={containerRef}
          containerProps={{ 'data-test-id': testId + '-container-ref' }}
        />,
      );
      await waitFor(() => getByTestId(testId + '-container-ref'));
      expect(containerRef.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('headerRef.current should exist', async () => {
      const headerRef = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <MainNavigation
          headerRef={headerRef}
          header={<div></div>}
          headerProps={{ 'data-test-id': testId + '-header-ref' }}
        />,
      );
      await waitFor(() => getByTestId(testId + '-header-ref'));
      expect(headerRef.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('bodyRef.current should exist', async () => {
      const bodyRef = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <MainNavigation
          bodyRef={bodyRef}
          body={<div></div>}
          bodyProps={{ 'data-test-id': testId + '-body-ref' }}
        />,
      );
      await waitFor(() => getByTestId(testId + '-body-ref'));
      expect(bodyRef.current instanceof HTMLDivElement).toBeTruthy();
    });
    it('footerRef.current should exist', async () => {
      const footerRef = React.createRef<HTMLDivElement>();
      const { getByTestId } = render(
        <MainNavigation
          footerRef={footerRef}
          footer={<div></div>}
          footerProps={{ 'data-test-id': testId + '-footer-ref' }}
        />,
      );
      await waitFor(() => getByTestId(testId + '-footer-ref'));
      expect(footerRef.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
