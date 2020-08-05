import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TextInput from '../TextInput';
import { getValueAndUnit } from 'polished';

const setup = (props: Record<string, unknown> | null = null) => {
  const label = 'test-input';
  const utils = render(<TextInput ariaLabel={label} {...props} />);
  const input = utils.getByLabelText(label);
  return {
    input,
    ...utils,
  };
};

describe('TextInput', () => {
  describe('Supported Input Type', () => {
    it('Input value supports string type', () => {
      const { input } = setup();
      fireEvent.change(input, { target: { value: '123' } });
      expect(typeof input.value).toBe('string');
    });
    it('Input value treats numbers as string type', () => {
      const { input } = setup();
      fireEvent.change(input, { target: { value: 123 } });
      expect(typeof input.value).toBe('string');
    });
    it('Input value treats numbers as number type', () => {
      const { input } = setup({type: 'number'});
      fireEvent.change(input, { target: { value: 123 } });
      console.log(input.value);
      expect(typeof input.value).toBe('number');
    });
  });
});
