import React, { useState } from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import styled from 'styled-components';
import { text } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { name, address, company } from 'faker';

import Table, { Cell } from './Table';
import Checkbox from '../Checkbox';

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/u6xQ3W5NYB1d2zLeRCYwva/ARM?node-id=322%3A8318',
};

const ActionCellContainer = styled(Cell)`
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  &:hover {
    color: red;
  }
`;

const NoteField = styled.textarea`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  resize: none;
`;

const generateSampleData = (rows: number) => {
  const finalData = [];

  for (let i = 0; i < rows; i += 1) {
    finalData.push({
      key: Math.random() * 10,
      name: name.findName(),
      title: name.title(),
      address: address.streetAddress(),
      notes: company.catchPhrase(),
    });
  }

  return finalData;
};

const sampleData = generateSampleData(10);

storiesOf('Table', module).add(
  'Default',
  () => {
    const [rows, setRows] = useState(sampleData);

    const onDelete = (index: number) => {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    };

    const SelectionCell = ({ index, selected, reachedMinWidth }) => (
      <Cell
        onClick={() => {
          const newRows = [...rows];
          newRows[index].selected = !selected;
          setRows(newRows);
        }}
      >
        <Checkbox checked={selected}>{reachedMinWidth ? 'Select for download' : ''}</Checkbox>
      </Cell>
    );

    const NotesCell = ({ notes }: { notes: string }) => {
      console.log(notes);

      return (
        <Cell>
          <NoteField rows="3" value={notes} />
        </Cell>
      );
    };

    const ActionCell = ({ index, reachedMinWidth }) => (
      <ActionCellContainer
        onClick={() => {
          onDelete(index);
        }}
      >
        <Icon size="1rem" path={mdiClose} />
        &nbsp;&nbsp;
        {reachedMinWidth ? 'Delete user' : ''}
      </ActionCellContainer>
    );

    const sampleColumns = {
      selection: {
        name: <Checkbox />,
        width: text('Selection width', '2rem'),
        cellComponent: SelectionCell,
        sortable: false,
      },
      name: {
        name: 'Name',
        width: text('Name width', '1fr'),
      },
      title: {
        name: 'Title',
        width: text('Title width', '1fr'),
      },
      address: {
        name: 'Address',
        width: text('Address width', '1fr'),
      },
      notes: {
        name: 'Notes',
        width: text('Notes width', '12rem'),
        cellComponent: NotesCell,
        // minTableWidth: 800,
        sortFunction: (a, b) => a.length > b.length,
      },
      action: {
        name: '',
        sortable: false,
        width: text('Action width', '1rem'),
        cellComponent: ActionCell,
      },
    };

    return <Table columns={sampleColumns} data={rows} />;
  },
  { design },
);
