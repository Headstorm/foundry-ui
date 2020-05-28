import React, { useState, useEffect } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import Icon from '@mdi/react';
import { mdiArrowDown, mdiChevronRight, mdiChevronDown } from '@mdi/js';

import colors from '../../enums/colors';
import fonts from '../../enums/fonts';

export interface columnTypes {
  [index: string]: {
    name?: string;
    width?: string;
    minTableWidth?: number;
    sortable?: boolean;
    sortFunction?: Function;
    isGroupLabel?: boolean;
    cellComponent?: any;
    rowComponent?: any;
    headerCellComponent?: any;
  };
}

export type TableProps = {
  isCollapsable?: boolean;
  columnGap?: string;
  columns: columnTypes;
  data?: columnTypes[] | Array<Array<columnTypes>>;
  defaultSort?: [string, boolean]; // key, direction
  groupHeaderPosition?: 'above' | 'below';
  collapsedCell?: string & StyledComponentBase<any, {}>;
  collapsedIcon?: string | React.Component<ExpansionIconProps>;
  expandedIcon?: string | React.Component<ExpansionIconProps>
  minWidthBreakpoint?: number;
  sortGroups?: boolean;
  StyledCell?: string & StyledComponentBase<any, {}>;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledGroupLabelRow?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledHeaderCell?: string & StyledComponentBase<any, {}>;
  StyledRow?: string & StyledComponentBase<any, {}>;
};

export type RowProps = {
  columnGap: string;
  columnWidths: string;
  rowNum?: number;
  reachedMinWidth?: boolean;
  isCollapsed?: boolean;
};

export type ExpansionIconProps = {
  collapsedIcon?: string;
  expandedIcon?: string;
  isCollapsed: boolean;
};

export const TableContainer = styled.table`
  ${({ reachedMinWidth }: { reachedMinWidth?: boolean }) => `
    width: ${reachedMinWidth ? '100%' : 'auto'};
    ${fonts.body}
    background-color: ${colors.background};
    border-collapse: collapse;

    border-radius: 8px;
    overflow: hidden;
  `}
`;

export const Header = styled.tr`
  ${({ columnGap, columnWidths }: RowProps) => `
    display: grid;
    grid-template-columns: ${columnWidths};
    padding: 0rem 2rem;
    column-gap: ${columnGap};
    user-select: none;

    background-color: ${colors.primary};
    color: white;
  `}
`;

export const HeaderCell = styled.th`
  ${({ sortable }: { sortable: boolean }) => `
    display: flex;
    flex-flow: row;
    cursor: pointer;
    padding: 1rem 0rem 1rem 1rem;
    margin-left: -1rem;

    transition: background-color 0.5s;

    ${sortable ? '' : 'pointer-events: none;'}

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `}
`;

export const ResponsiveTitle = styled.span`
  ${({ sortable }: { sortable: boolean }) => `
    color: ${colors.primary};
    padding: 0.5rem;
    user-select: none;
    cursor: pointer;
    margin-right: .5rem;
    background-color: rgba(0,0,0,0.05);
    border-radius: .5rem;
    ${sortable ? '' : 'pointer-events: none;'}
  `}
`;

export const Row = styled.tr`
  ${({ columnGap, columnWidths, reachedMinWidth, isCollapsed = false }: RowProps) => `
    display: ${isCollapsed ? 'none' : 'grid'};
    grid-template-columns: ${reachedMinWidth ? '100%' : columnWidths};
    padding: ${reachedMinWidth ? '1rem' : '0rem'} 2rem;
    row-gap: .5rem;
    column-gap: ${columnGap};
    position: relative;
    background-color: white;

    &:not(:last-child) {
      border-bottom: 1px solid rgb(211, 214, 215);
    }

    &:before {
      content: '';
      z-index: 0;
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity .3s;

      pointer-events: none;
    }
    &:hover:before {
      opacity: .3;
    }
  `}
`;

export const GroupRow = styled(Row)`
    background-color: #e75b2770;
`;

export const Cell = styled.td`
  display: block;
  padding: 1rem 0rem;
  word-break: break-word;
  hyphens: auto;
  width: unset;
`;

const SortIcon = styled(Icon)`
  ${({ direction }: { direction?: boolean | null }) => `
    margin-left: 1rem;
    fill: white;
    width: 1rem;
    transition: transform .2s, opacity .5s;
    opacity: ${direction === null ? 0 : 1};
    transform: rotate(${direction ? 0 : 180}deg);
  `}
`;

type collapsedState = {[key: string]: string};
const defaultCollapsed: collapsedState = {};
const collapseIconColumn = {
  name: '',
  sortable: false,
  width: '1rem',
}

const expansionKey = '__EXPANSION_COLUMN__';
const ExpansionIcon = ({
  collapsedIcon = mdiChevronRight,
  expandedIcon = mdiChevronDown,
  isCollapsed,
}: ExpansionIconProps) => {
  const path = isCollapsed ? collapsedIcon : expandedIcon;
  return (
      <Icon path={path} size={'1rem'}/>
  );
}

// TODO: Add the table width observer to a container which fills the area, so the table can grow
// once there is enough room for it to do so (if the table itself isn't full width)
// TODO: Add window width media query to compliment the table width media query API

const Table = ({
  columnGap = '1rem',
  columns,
  isCollapsable = false,
  data = [],
  defaultSort = ['', false], // key, direction
  groupHeaderPosition = 'above',
  collapsedCell = Cell,
  collapsedIcon,
  expandedIcon,
  minWidthBreakpoint = 640,
  sortGroups = false,
  StyledCell = Cell,
  StyledContainer = TableContainer,
  StyledGroupLabelRow = GroupRow,
  StyledHeader = Header,
  StyledHeaderCell = HeaderCell,
  StyledRow = Row,
}: TableProps) => {
  const [sortedData, sortData] = useState(data);
  const [sortMethod, setSortMethod] = useState(defaultSort);
  const [collapsedGroups, setCollapsedGroups] = useState(defaultCollapsed)
  const { ref, width = Infinity } = useResizeObserver();

  const usingGroups: boolean = data && data.length > 0 && Array.isArray(data[0]);
  const copiedColumns = Object.assign({}, columns); // Shallow copy so not to manipulate props
  copiedColumns[expansionKey] = collapseIconColumn;

  // this builds the string from the columns
  const columnWidths = Object.values(copiedColumns)
    .map((col: columnTypes[0]) => {
      if (col.minTableWidth && width <= col.minTableWidth) {
        return '0px';
      }
      return col.width || '1fr';
    })
    .join(' ');

  // Toggles the collapsed
  const toggleGroupCollapse = (key: string) => {
    const group = collapsedGroups[key];

    // Make a copy of the dictionary-like object. Because this object
    // doesn't have nested objects, a shallow copy is fine
    const temp: collapsedState = Object.assign({}, collapsedGroups);
    if (group) {
      delete temp[key];
    } else {
      temp[key] = key;
    }

    setCollapsedGroups(temp);
  }

  const isGroupCollapsed = (group: string): boolean => {
    return !!collapsedGroups[group];
  };

  const onSort = (key: string, newDirection: boolean) => {
    if (key === expansionKey) return;
    // If the first element of the data is not an array, then we do not have groups
    if(!Array.isArray(data[0])) {
      data.sort((a: any, b: any) => {
        if (copiedColumns[key] && Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
          return copiedColumns[key].sortFunction(a[key], b[key]) ? -1 : 1;
        }
        const comparison = newDirection ? a[key] < b[key] : a[key] > b[key];
        return comparison ? -1 : 1;
      });
    } else {
      // Cast data to the correct type and iterate over each group, sorting them
      (data as Array<Array<columnTypes>>).forEach((group) => {
        group.sort((a: any, b: any) => {
          if (copiedColumns[key] && Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
            return copiedColumns[key].sortFunction(a[key], b[key]) ? -1 : 1;
          }
          const comparison = newDirection ? a[key] < b[key] : a[key] > b[key];
          return comparison ? -1 : 1;
        });
      });
      // Sort the groups only if sortGroups is supplied as true
      if (sortGroups) {
        (data as Array<Array<columnTypes>>).sort((a: any, b: any) => {
          if (copiedColumns[key] && Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
            return copiedColumns[key].sortFunction(a[0][key], b[0][key]) ? -1 : 1;
          }
          const comparison = newDirection ? a[0][key] < b[0][key] : a[0][key] > b[0][key];
          return comparison ? -1 : 1;
        });
      }
    }

    sortData(data);
    setSortMethod([key, newDirection]);
    setCollapsedGroups(defaultCollapsed);
  };

  useEffect(() => {
    onSort(sortMethod[0], sortMethod[1]);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Table return
  return (
    <StyledContainer ref={ref} reachedMinWidth={width < minWidthBreakpoint}>
      <thead>
        {width > minWidthBreakpoint && (
          <StyledHeader columnGap={columnGap} columnWidths={columnWidths}>
            {Object.keys(copiedColumns).map((headerColumnKey: string) => {
              const RenderedHeaderCell =
                copiedColumns[headerColumnKey].headerCellComponent || StyledHeaderCell;
              const breakpointHit = width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
              // columns.map return
              return (
                (!copiedColumns[headerColumnKey].minTableWidth || breakpointHit) && (
                  <RenderedHeaderCell
                    key={headerColumnKey}
                    onClick={() => {
                      onSort(
                        headerColumnKey,
                        headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                      );
                    }}
                    sortable={copiedColumns[headerColumnKey].sortable !== false}
                  >
                    {copiedColumns[headerColumnKey].name}
                    <SortIcon
                      direction={sortMethod[0] === headerColumnKey ? sortMethod[1] : null}
                      path={mdiArrowDown}
                    />
                  </RenderedHeaderCell>
                )
              );
            })}
          </StyledHeader>
        )}
      </thead>
      {usingGroups ?
        // Generate groupings - Note that we are making shallow copies of the arrays so that we do not
        // modify the props directly since this is an Array of Arrays and is accessed by reference.
        [...sortedData as Array<Array<columnTypes>>].map((group: Array<columnTypes>, idx: number) => {
          const groupLabelIndex: number = group.findIndex((grp) => {
            return grp.isGroupLabel === true;
          });
          const groupCopy = [...group];

          // Get the group label data
          const groupLabelData = groupLabelIndex >= 0 ? groupCopy.splice(groupLabelIndex, 1)[0] : undefined;

          const groupLabelDataString = JSON.stringify(groupLabelData);
          // Get index modifier for creating the rows of the data. Everything group element's index
          // should be increased by 1 for all labels that are above the group
          const indexModifier = groupHeaderPosition === 'above' ? 1 : 0;
          const isCollapsed = isGroupCollapsed(groupLabelDataString);
          // Generate the rows for this group
          const rows = groupCopy.map((row: columnTypes, index: number) => {
            let RenderedRow = row.rowComponent || StyledRow;

            // Rows.map return
            return (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore - TS2604: JSX element type does not have any construct or call signatures
              <RenderedRow
                columnGap={columnGap}
                columnWidths={columnWidths}
                rowNum={index + indexModifier}
                key={`row${JSON.stringify(row)}`}
                reachedMinWidth={width < minWidthBreakpoint}
                isCollapsed={isCollapsable && isCollapsed}
              >
                {Object.keys(copiedColumns).map(headerColumnKey => {
                  const RenderedCell = copiedColumns[headerColumnKey].cellComponent || StyledCell;
                  const breakPointHit = width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
                  // Declaring each cell of the row
                  return (
                    (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) && (
                      <RenderedCell
                        // all cells should have full access to all the data in the row
                        {...row} // eslint-disable-line react/jsx-props-no-spreading
                        index={index + indexModifier}
                        reachedMinWidth={width < minWidthBreakpoint}
                        key={`${headerColumnKey}${index + indexModifier}`}
                      >
                        {width < minWidthBreakpoint && (
                          <ResponsiveTitle
                            onClick={() => {
                              onSort(
                                headerColumnKey,
                                headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                              );
                            }}
                            sortable={copiedColumns[headerColumnKey].sortable !== false}
                          >
                            {copiedColumns[headerColumnKey].name}
                            <SortIcon
                              direction={sortMethod[0] === headerColumnKey ? sortMethod[1] : null}
                              path={mdiArrowDown}
                            />
                          </ResponsiveTitle>
                        )}
                        {row[headerColumnKey]}
                      </RenderedCell>
                    )
                  );
                })}
              </RenderedRow>
            );
          });

          if (groupLabelData) {
            const index = indexModifier === 0 ? rows.length : 0;
            const RenderedRow = groupLabelData.rowComponent || StyledGroupLabelRow;
            const label = (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore - TS2604: JSX element type does not have any construct or call signatures
              <RenderedRow
                columnGap={columnGap}
                columnWidths={columnWidths}
                rowNum={index}
                key={`row${groupLabelDataString}`}
                reachedMinWidth={width < minWidthBreakpoint}
                onClick={() => { toggleGroupCollapse(groupLabelDataString) }}
              >
                {Object.keys(copiedColumns).map(headerColumnKey => {
                  const RenderedCell =  usingGroups && headerColumnKey === expansionKey ?
                    collapsedCell || StyledCell :
                    copiedColumns[headerColumnKey].cellComponent || StyledCell;
                  const breakPointHit = width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
                  // Declaring each column cell of the row
                  return (
                    (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) && (
                      <RenderedCell
                        // all cells should have full access to all the data in the row
                        {...groupLabelData} // eslint-disable-line react/jsx-props-no-spreading
                        index={index}
                        reachedMinWidth={width < minWidthBreakpoint}
                        key={`${headerColumnKey}${index}`}
                      >
                        {width < minWidthBreakpoint && (
                          <ResponsiveTitle
                            onClick={() => {
                              onSort(
                                headerColumnKey,
                                headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                              );
                            }}
                            sortable={copiedColumns[headerColumnKey].sortable !== false}
                          >
                            {copiedColumns[headerColumnKey].name}
                            <SortIcon
                              direction={sortMethod[0] === headerColumnKey ? sortMethod[1] : null}
                              path={mdiArrowDown}
                            />
                          </ResponsiveTitle>
                        )}
                        {groupLabelData[headerColumnKey]}
                        {isCollapsable && headerColumnKey === expansionKey ? <ExpansionIcon isCollapsed={isCollapsed} /> : null}
                      </RenderedCell>
                    )
                  );
                })}
              </RenderedRow>
            );
            index === 0 ? rows.splice(0, 0, label) : rows.push(label);
          }

          return <tbody key={`group${idx}`}>
            {rows}
          </tbody>
        })
        // End of group generation
        :
        // Generate non-grouped table data
        <tbody>
          {(sortedData as Array<columnTypes>).map((row: columnTypes, index: number) => {
            // map over the rows
            const RenderedRow = row.rowComponent || StyledRow;
            // Rows.map return
            return (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore - TS2604: JSX element type does not have any construct or call signatures
              <RenderedRow
                columnGap={columnGap}
                columnWidths={columnWidths}
                rowNum={index}
                key={`row${JSON.stringify(row)}`}
                reachedMinWidth={width < minWidthBreakpoint}
              >
                {Object.keys(copiedColumns).map(headerColumnKey => {
                  const RenderedCell = copiedColumns[headerColumnKey].cellComponent || StyledCell;
                  const breakPointHit = width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
                  // Declaring each cell of the row
                  return (
                    (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) && (
                      <RenderedCell
                        // all cells should have full access to all the data in the row
                        {...row} // eslint-disable-line react/jsx-props-no-spreading
                        index={index}
                        reachedMinWidth={width < minWidthBreakpoint}
                        key={`${headerColumnKey}${index}`}
                      >
                        {width < minWidthBreakpoint && (
                          <ResponsiveTitle
                            onClick={() => {
                              onSort(
                                headerColumnKey,
                                headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                              );
                            }}
                            sortable={copiedColumns[headerColumnKey].sortable !== false}
                          >
                            {copiedColumns[headerColumnKey].name}
                            <SortIcon
                              direction={sortMethod[0] === headerColumnKey ? sortMethod[1] : null}
                              path={mdiArrowDown}
                            />
                          </ResponsiveTitle>
                        )}
                        {row[headerColumnKey]}
                      </RenderedCell>
                    )
                  );
                })}
              </RenderedRow>
            );
          })}
        </tbody>
      }
    </StyledContainer>
  );
};

Table.Container = TableContainer;
Table.Header = Header;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.GroupHeader = GroupRow;
Table.Cell = Cell;
Table.Title = ResponsiveTitle;
export default Table;
