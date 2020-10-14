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
        columns={['Fruit', 'Colors', 'Numbers']}
        data={[
          ['Apple', 'Red', '1'],
          ['Kiwi', 'Brown', '2'],
          ['Banana', 'Yellow', '3'],
        ]}
        sortGroups={false}
        groupHeaderPosition="above"
        areGroupsCollapsible={false}
      />,
    );
    await waitFor(() => getByTestId(testId));
    fireEvent.keyPress(getByTestId(testId));
    expect(container).toMatchSnapshot();
  });
});
