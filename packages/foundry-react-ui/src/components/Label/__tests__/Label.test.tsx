import React from 'react';
import { render } from '@testing-library/react';
import Label from '../Label';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Label', () => {
  it('should have text be colorInvalid if given a isValid prop of false', () => {
    const { container } = render(
      <Label labelText="Test text" colorInvalid={'#9400D3'} isRequired={true} isValid={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should have text be colorValid and a check icon if given a isValid prop of true', () => {
    const { container } = render(
      <Label labelText="Test text" colorValid={'#0000FF'} isRequired={true} isValid={true} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should have default color text if not given a isValid', () => {
    const container = render(<Label color={'#FF4500'} labelText="Test text" />);

    expect(container).toMatchSnapshot();
  });

  it('should have asterisk icon if isRequired is true', () => {
    const container = render(<Label labelText="Test text" isRequired={true} />);

    expect(container).toMatchSnapshot();
  });
  describe('Accessibility Tests', () => {
    it('Should pass accessibility test with default props', async () => {
      const component = <Label></Label>;
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
