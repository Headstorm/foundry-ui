import React, { SyntheticEvent, useState } from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import styled from 'styled-components';
import { text } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { name, address, company } from 'faker';

import Table, { Cell, RowProps, columnTypes } from './Table';
import Checkbox, { CheckboxTypes } from '../Checkbox/Checkbox';

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
      name: name.findName(),
      title: name.title(),
      address: address.streetAddress(),
      notes: company.catchPhrase(),
    });
  }

  return finalData;
};

const sampleData: any[] = generateSampleData(10);

storiesOf('Table', module).add(
  'Default',
  () => {
    const [rows, setRows] = useState(sampleData);

    const onDelete = (index: number) => {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    };

    const onSelect = (index: number, selected: boolean) => {
      const newRows = [...rows];
      newRows[index].selected = !selected;
      setRows(newRows);
    };

    const selectAll = (evt: SyntheticEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const currentlyChecked = evt.target.checked;
      const newRows = rows.map((row: RowProps) => ({ ...row, selected: currentlyChecked }));
      setRows(newRows);
    };

    const SelectAllCell = () => {
      const checkRowForSelection = (row: columnTypes) =>
        Object.prototype.hasOwnProperty.call(row, 'selected') && row.selected;

      return (
        <Checkbox
          checkboxType={
            rows.filter((row: columnTypes) => checkRowForSelection(row)).length === rows.length
              ? CheckboxTypes.check
              : CheckboxTypes.neutral
          }
          checked={Boolean(rows.filter((row: columnTypes) => checkRowForSelection(row)).length)}
          onClick={selectAll}
        />
      );
    };

    const SelectionCell = ({
      index,
      selected,
      reachedMinWidth,
    }: {
      index: number;
      selected: boolean;
      reachedMinWidth: boolean;
    }) => (
      <Cell>
        <Checkbox
          onClick={() => onSelect(index, selected)}
          checkboxType={CheckboxTypes.check}
          checked={selected}
        >
          {reachedMinWidth ? 'Select for download' : ''}
        </Checkbox>
      </Cell>
    );

    const NotesCell = ({ notes }: { notes: string }) => (
      <Cell>
        <NoteField rows={3} value={notes} />
      </Cell>
    );

    const ActionCell = ({
      index,
      reachedMinWidth,
    }: {
      index: number;
      reachedMinWidth: boolean;
    }) => (
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

    const sampleColumns: { [index: string]: any } = {
      selection: {
        name: '',
        headerCellComponent: SelectAllCell,
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
        minTableWidth: 800,
        sortFunction: (a: string, b: string) => (a.length > b.length ? -1 : 1),
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
