import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { name, address, company, commerce } from 'faker';

import Table, { ExpansionIconColumnName } from './Table';
import Checkbox, { CheckboxTypes } from '../Checkbox/Checkbox';
import { columnTypes, ExpansionIconProps } from './types';

type SampleDataType = {
  name?: string;
  title?: string;
  address?: string;
  notes?: string;
  isGroupLabel?: boolean;
  selected?: boolean;
};

// Custom icon used for overriding the default collapse/expand icons
const expansionIconOverride = ({ isCollapsed, onClick }: ExpansionIconProps) => (
  <Checkbox
    checked={!isCollapsed}
    onClick={onClick}
    checkboxType={CheckboxTypes.check}
    inputProps={{ onChange: () => {} }}
  />
);

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

const sampleData = generateSampleData(10);
const sampleGroupData = generateSampleGroups();

interface DefaultProps {
  'Selection width': string;
  'Name width': string;
  'Title width': string;
  'Address width': string;
  'Notes width': string;
  'Action width': string;
}

export const Default: Story<DefaultProps> = ({
  'Selection width': selectionWidth,
  'Name width': nameWidth,
  'Title width': titleWidth,
  'Address width': addressWidth,
  'Notes width': notesWidth,
  'Action width': actionWidth,
}: DefaultProps) => {
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

  const selectAll = (event: React.MouseEvent) => {
    const target = event.target as HTMLInputElement;
    const currentlyChecked = target.checked;
    const newRows = rows.map((row: SampleDataType) => ({ ...row, selected: currentlyChecked }));
    setRows(newRows);
  };

  const SelectAllCell = () => {
    const checkRowForSelection = (row: SampleDataType) =>
      Object.prototype.hasOwnProperty.call(row, 'selected') && row.selected;

    // TODO: don't use pointer-events to control if a column is sortable - it should be checked
    // within the sorting listeners so that `sortable` doesn't need to be passed here just to give
    // it pointer-events
    return (
      <Table.HeaderCell sortable>
        <Checkbox
          checkboxType={
            rows.filter(checkRowForSelection).length === rows.length
              ? CheckboxTypes.check
              : CheckboxTypes.neutral
          }
          checked={Boolean(rows.filter(checkRowForSelection).length)}
          onClick={e => selectAll(e)}
          inputProps={{ onChange: () => {} }}
        />
      </Table.HeaderCell>
    );
  };

  const SelectionCell = ({
    index,
    selected,
    reachedMinWidth = false,
  }: {
    index: number;
    selected: boolean;
    // eslint-disable-next-line react/require-default-props
    reachedMinWidth?: boolean;
  }) => (
    <Table.Cell>
      <Checkbox
        onClick={() => onSelect(index, selected)}
        checkboxType={CheckboxTypes.check}
        checked={selected}
        inputProps={{ onChange: () => {} }}
      >
        {reachedMinWidth ? 'Select for download' : ''}
      </Checkbox>
    </Table.Cell>
  );

  const NotesCell = ({ notes }: { notes: string }) => (
    <Table.Cell>
      <NoteField onChange={() => {}} rows={3} value={notes} />
    </Table.Cell>
  );

  const ActionCell = ({ index, reachedMinWidth }: { index: number; reachedMinWidth: boolean }) => (
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
      width: selectionWidth,
      cellComponent: SelectionCell,
      sortable: false,
      footerContent: '',
    },
    name: {
      name: 'Name',
      width: nameWidth,
      footerContent: 'NameFooter',
    },
    title: {
      name: 'Title',
      width: titleWidth,
      footerContent: 'TitleFooter',
    },
    address: {
      name: 'Address',
      width: addressWidth,
      footerContent: 'AddressFooter',
    },
    notes: {
      name: 'Notes',
      width: notesWidth,
      cellComponent: NotesCell,
      minTableWidth: 800,
      sortFunction: (a: string, b: string) => (a.length > b.length ? -1 : 1),
      footerContent: 'NotesFooter',
    },
    action: {
      name: '',
      sortable: false,
      width: actionWidth,
      cellComponent: ActionCell,
      footerContent: '',
    },
  };

  return <Table columns={sampleColumns} data={rows as columnTypes[]} />;
};
Default.args = {
  'Selection width': '2rem',
  'Name width': '1fr',
  'Title width': '1fr',
  'Address width': '1fr',
  'Notes width': '12rem',
  'Action width': '1rem',
};

interface GroupsProps extends DefaultProps {
  'Use default expansion column': boolean;
  'Expansion Icon width': string;
  groupLabelPosition: 'above' | 'below' | undefined;
  useCustomLabel: boolean;
  sortGroups: boolean;
  areGroupsCollapsible: boolean;
}

export const Groups: Story<GroupsProps> = ({
  'Selection width': selectionWidth,
  'Name width': nameWidth,
  'Title width': titleWidth,
  'Address width': addressWidth,
  'Notes width': notesWidth,
  'Use default expansion column': useDefaultExpansionColumn,
  groupLabelPosition,
  sortGroups,
  areGroupsCollapsible,
  useCustomLabel,
  ...args
}: GroupsProps) => {
  const [rows, setRows] = useState(sampleGroupData);

  const onSelect = (index = 0, groupIndex = 0, selected: boolean) => {
    const newRows: SampleDataType[][] = [];
    rows.forEach(grp => {
      newRows.push([...grp]);
    });

    newRows[groupIndex][index].selected = !selected;
    setRows(newRows);
  };

  const selectAll = (event: React.MouseEvent) => {
    const target = event.target as HTMLInputElement;
    const currentlyChecked = target.checked;
    const newRows: SampleDataType[][] = [];
    rows.forEach(group => {
      newRows.push(
        group.map(row => {
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
      groupRows.forEach(row => {
        if (row.isGroupLabel) return;
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
          inputProps={{ onChange: () => {} }}
        />
      </Table.HeaderCell>
    );
  };

  const SelectionCell = ({
    index = 0,
    selected,
    reachedMinWidth = false,
    groupIndex = 0,
  }: {
    // eslint-disable-next-line react/require-default-props
    index?: number;
    selected: boolean;
    // eslint-disable-next-line react/require-default-props
    reachedMinWidth?: boolean;
    // eslint-disable-next-line react/require-default-props
    groupIndex?: number;
  }) => (
    <Table.Cell>
      <Checkbox
        onClick={() => onSelect(index, groupIndex, selected)}
        checkboxType={CheckboxTypes.check}
        checked={selected}
        inputProps={{ onChange: () => {} }}
      >
        {reachedMinWidth ? 'Select for download' : ''}
      </Checkbox>
    </Table.Cell>
  );

  const EmptyCell = () => <Table.Cell />;

  const NotesCell = ({ notes }: { notes: string }) => (
    <Table.Cell>
      <NoteField onChange={() => {}} rows={3} value={notes} />
    </Table.Cell>
  );

  const sampleColumns: { [index: string]: any } = {
    selection: {
      name: '',
      headerCellComponent: SelectAllCell,
      width: selectionWidth,
      cellComponent: SelectionCell,
      sortable: false,
      groupCellComponent: EmptyCell,
      footerContent: '',
    },
    name: {
      name: 'Name',
      width: nameWidth,
      // footerContent: 'NameFooter',
    },
    title: {
      name: 'Title',
      width: titleWidth,
      // footerContent: 'TitleFooter',
    },
    address: {
      name: 'Address',
      width: addressWidth,
      // footerContent: 'AddressFooter',
    },
    notes: {
      name: 'Notes',
      width: notesWidth,
      cellComponent: NotesCell,
      minTableWidth: 800,
      sortFunction: (a: string, b: string) => (a.length > b.length ? -1 : 1),
      groupCellComponent: EmptyCell,
      // footerContent: 'NotesFooter',
    },
  };

  if (!useDefaultExpansionColumn) {
    sampleColumns[ExpansionIconColumnName] = {
      name: '',
      sortable: false,
      width: args['Expansion Icon width'],
    };
  }

  const position = groupLabelPosition;

  return (
    <Table
      columns={sampleColumns}
      data={rows as columnTypes[][]}
      sortGroups={sortGroups}
      groupHeaderPosition={position}
      areGroupsCollapsible={areGroupsCollapsible}
      expansionIconComponent={useCustomLabel ? expansionIconOverride : undefined}
    />
  );
};
Groups.args = {
  ...Default.args,
  'Use default expansion column': false,
  'Expansion Icon width': '1rem',
  groupLabelPosition: 'above',
  useCustomLabel: false,
  sortGroups: false,
  areGroupsCollapsible: false,
};

export default {
  title: 'Table',
  argTypes: {
    groupLabelPosition: {
      options: ['above', 'below'],
      control: {
        type: 'radio',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A86',
    },
  },
} as Meta;
