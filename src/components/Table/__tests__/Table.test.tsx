import React from 'react';
import styled from 'styled-components';
import { fireEvent, render, waitFor, configure } from '@testing-library/react';
import Table from '../Table';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
configure({ testIdAttribute: 'data-test-id' });

const testId = 'foundry-table';

describe('Table', () => {
  it('Shows Table with default props', async () => {
    const { container, getByTestId } = render(
      <Table
        containerProps={{ 'data-test-id': testId }}
        columns={{
          fruit: { name: 'Fruit' },
          colors: { name: 'Colors' },
          numbers: { name: 'Numbers' },
        }}
        defaultSort={['numbers', true]}
        data={[
          { fruit: 'Apple', colors: 'Red', numbers: '1' },
          { fruit: 'Kiwi', colors: 'Brown', numbers: '2' },
          { fruit: 'Banana', colors: 'Yellow', numbers: '3' },
        ]}
      />,
    );
    await waitFor(() => getByTestId(testId));
    fireEvent.keyPress(getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
});
