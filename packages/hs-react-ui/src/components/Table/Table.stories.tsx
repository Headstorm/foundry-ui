import React, { SyntheticEvent, useState } from 'react';
import { storiesOf } from '@storybook/react';

import styled from 'styled-components';
import { text, boolean, select } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { name, address, company, commerce } from 'faker';

import Table, { ExpansionIconColumnName } from './Table';
import Checkbox, { CheckboxTypes } from '../Checkbox/Checkbox';
import { columnTypes, ExpansionIconProps, RowProps } from './types';

type SampleDataType = {
  name?: string;
  title?: string;
  address?: string;
  notes?: string;
  isGroupLabel?: boolean;
};

type SampleSelectionCellType = {
  index: number;
  selected: boolean;
  reachedMinWidth?: boolean;
  groupIndex?: number;
};

// Custom icon used for overriding the default collapse/expand icons
const expansionIconOverride = ({ isCollapsed, onClick }: ExpansionIconProps) => (
  <Checkbox checked={!isCollapsed} onClick={onClick} checkboxType={CheckboxTypes.check} />
);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A86',
};

const ActionCellContainer = styled(Table.Cell)`
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

const groupLabelPositionOptions: { above: 'above'; below: 'below' } = {
  above: 'above',
  below: 'below',
};

const generateSampleData = (rows: number): SampleDataType[] => {
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

const generateSampleGroups = (numberOfGroups = 5, groupSize = 5): Array<SampleDataType[]> => {
  const groupData = [];
  for (let i = 0; i < numberOfGroups; i++) {
    const groupRows = generateSampleData(groupSize);
    groupRows.push({
      title: `${commerce.department()} Department`,
      isGroupLabel: true,
    });

    groupData.push(groupRows);
  }
  return groupData;
};

const sampleData: any[] = generateSampleData(10);
const sampleGroupData: any[] = generateSampleGroups();

storiesOf('Table', module)
  .addParameters({ component: Table })
  .add(
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

        // TODO: don't use pointer-events to control if a column is sortable - it should be checked
        // within the sorting listeners so that `sortable` doesn't need to be passed here just to give
        // it pointer-events
        return (
          <Table.HeaderCell sortable>
            <Checkbox
              checkboxType={
                rows.filter((row: columnTypes) => checkRowForSelection(row)).length === rows.length
                  ? CheckboxTypes.check
                  : CheckboxTypes.neutral
              }
              checked={Boolean(rows.filter((row: columnTypes) => checkRowForSelection(row)).length)}
              onClick={selectAll}
            />
          </Table.HeaderCell>
        );
      };

      const SelectionCell = ({
        index,
        selected,
        reachedMinWidth,
      }: {
        index: number;
        selected: boolean;
        reachedMinWidth?: boolean;
      }) => (
        <Table.Cell>
          <Checkbox
            onClick={() => onSelect(index, selected)}
            checkboxType={CheckboxTypes.check}
            checked={selected}
          >
            {reachedMinWidth ? 'Select for download' : ''}
          </Checkbox>
        </Table.Cell>
      );

      const NotesCell = ({ notes }: { notes: string }) => (
        <Table.Cell>
          <NoteField onChange={() => console.log()} rows={3} value={notes} />
        </Table.Cell>
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
  )
  .add(
    'Groups',
    () => {
      const [rows, setRows] = useState(sampleGroupData);

      const onSelect = (index: number, groupIndex = 0, selected: boolean) => {
        const newRows: Array<SampleSelectionCellType[]> = [];
        rows.forEach((grp: SampleSelectionCellType[]) => {
          newRows.push([...grp]);
        });

        newRows[groupIndex][index].selected = !selected;
        setRows(newRows);
      };

      const selectAll = (evt: SyntheticEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const currentlyChecked = evt.target.checked;
        const newRows: Array<Array<RowProps>> = [];
        rows.forEach((group: Array<RowProps>) => {
          newRows.push(
            group.map((row: RowProps) => {
              return { ...row, selected: currentlyChecked };
            }),
          );
        });
        setRows(newRows);
      };

      const SelectAllCell = () => {
        let totalSelected = 0;
        let totalCheckboxesAccumulator = 0;
        rows.forEach(groupRows => {
          groupRows.forEach((row: columnTypes) => {
            if (groupRows.isGroupLabel) return;
            if (row.selected) totalSelected++;
            totalCheckboxesAccumulator++;
          });
        });
        const allChecked = totalSelected === totalCheckboxesAccumulator;

        // TODO: don't use pointer-events to control if a column is sortable - it should be checked
        // within the sorting listeners so that `sortable` doesn't need to be passed here just to give
        // it pointer-events
        return (
          <Table.HeaderCell sortable>
            <Checkbox
              checkboxType={allChecked ? CheckboxTypes.check : CheckboxTypes.neutral}
              checked={Boolean(totalSelected)}
              onClick={selectAll}
            />
          </Table.HeaderCell>
        );
      };

      const SelectionCell = ({
        index,
        selected,
        reachedMinWidth,
        groupIndex,
      }: {
        index: number;
        selected: boolean;
        reachedMinWidth?: boolean;
        groupIndex?: number;
      }) => (
        <Table.Cell>
          <Checkbox
            onClick={() => onSelect(index, groupIndex, selected)}
            checkboxType={CheckboxTypes.check}
            checked={selected}
          >
            {reachedMinWidth ? 'Select for download' : ''}
          </Checkbox>
        </Table.Cell>
      );

      const EmptyCell = () => <Table.Cell />;

      const NotesCell = ({ notes }: { notes: string }) => (
        <Table.Cell>
          <NoteField onChange={() => console.log()} rows={3} value={notes} />
        </Table.Cell>
      );

      const sampleColumns: { [index: string]: any } = {
        selection: {
          name: '',
          headerCellComponent: SelectAllCell,
          width: text('Selection width', '2rem'),
          cellComponent: SelectionCell,
          sortable: false,
          groupCellComponent: EmptyCell,
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
          groupCellComponent: EmptyCell,
        },
      };

      if (!boolean('Use default expansion column', false)) {
        sampleColumns[ExpansionIconColumnName] = {
          name: '',
          sortable: false,
          width: text('Expansion Icon width', '1rem'),
        };
      }

      const position = select('groupLabelPosition', groupLabelPositionOptions, 'above');

      const useCustomLabel = boolean('useCustomLabel', false);
      return (
        <Table
          columns={sampleColumns}
          data={rows}
          sortGroups={boolean('sortGroups', false)}
          groupHeaderPosition={position}
          areGroupsCollapsible={boolean('areGroupsCollapsible', false)}
          expansionIconComponent={useCustomLabel ? expansionIconOverride : undefined}
        />
      );
    },
    { design },
  );
