import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { mdiArrowDown, mdiChevronDown, mdiChevronRight, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import {
  StyledBaseDiv,
  StyledBaseSpan,
  StyledBaseTable,
  StyledBaseTD,
  StyledBaseTH,
  StyledBaseTR,
} from '../../htmlElements';
import {
  CellOptions,
  Column,
  InternalExpansionIconProps,
  RowEntry,
  RowProps,
  SortDirection,
  SortState,
  TableProps,
} from './types';
import { useAnalytics, useTheme } from '../../context';
import { mergeRefs } from '../../utils/refs';

/** Start of styled components */

const StyledExpansionIconSpan = styled(StyledBaseSpan)`
  cursor: pointer;
`;

export const TableContainer = styled(StyledBaseTable)`
  ${({ reachedMinWidth }: { reachedMinWidth?: boolean }) => {
    const { colors } = useTheme();
    return css`
      width: ${reachedMinWidth ? '100%' : 'auto'};
      background-color: ${colors.background};
      border-collapse: collapse;

      border-radius: 8px;
      overflow: hidden;
    `;
  }}
`;

export const Header = styled(StyledBaseTR)`
  ${({ columnGap, columnWidths }: RowProps) => {
    const { colors } = useTheme();
    return css`
      display: grid;
      grid-template-columns: ${columnWidths};
      padding: 0em 2em;
      column-gap: ${columnGap};
      user-select: none;

      background-color: ${colors.primary};
      color: white;
    `;
  }}
`;

export const HeaderCell = styled(StyledBaseTH)`
  ${({ sortable }: { sortable: boolean }) => css`
    display: flex;
    flex-flow: row;
    cursor: pointer;
    padding: 1em 0em 1em 1em;
    margin-left: -1em;

    transition: background-color 0.5s;

    ${sortable ? '' : 'pointer-events: none;'}

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `}
`;

export const Footer = styled(StyledBaseTR)`
  ${({ columnGap, columnWidths }: RowProps) => {
    const { colors } = useTheme();
    return css`
      display: grid;
      grid-template-columns: ${columnWidths};
      padding: 0em 2em;
      column-gap: ${columnGap};
      user-select: none;

      background-color: ${colors.grayXlight};
      color: ${colors.black};
    `;
  }}
`;

export const FooterCell = styled(StyledBaseTH)`
  display: flex;
  flex-flow: row;
  cursor: pointer;
  padding: 1em 0em 1em 1em;
  margin-left: -1em;

  transition: background-color 0.5s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const ResponsiveHeaderCell = styled(StyledBaseSpan)`
  ${({ sortable }: { sortable: boolean }) => {
    const { colors } = useTheme();
    return css`
      display: block;
      word-break: break-word;
      hyphens: auto;
      color: ${colors.primary};
      user-select: none;
      padding: 0.5em;
      cursor: pointer;
      margin-right: 0.5em;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      ${sortable ? '' : 'pointer-events: none;'}
    `;
  }}
`;

export const Row = styled(StyledBaseTR)`
  ${({ columnGap, columnWidths, reachedMinWidth, isCollapsed = false }: RowProps) => {
    const { colors } = useTheme();
    return css`
      display: grid;
      grid-template-columns: ${reachedMinWidth ? '100%' : columnWidths};
      padding: ${reachedMinWidth ? '1em' : '0em'} 2em;
      row-gap: 0.5em;
      column-gap: ${columnGap};
      position: relative;
      background-color: ${colors.background};
      ${isCollapsed ? 'height: 0px;' : ''}

      &:not(:last-child) {
        border-bottom: 1px solid rgb(211, 214, 215);
      }

      &:before {
        content: '';
        z-index: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s;

        pointer-events: none;
      }
      &:hover:before {
        opacity: 0.3;
      }
    `;
  }}
`;

export const GroupRow = styled(Row)`
  ${() => {
    const { colors } = useTheme();
    return `
      background-color: ${colors.grayXlight};
    `;
  }}
`;

export const Cell = styled(StyledBaseTD)`
  display: block;
  word-break: break-word;
  hyphens: auto;
  width: unset;
  padding: 0.5em 0;
`;

/** Accepts the `$direction` prop of type `SortDirection` */
export const SortIcon = styled(Icon)`
  ${({ $direction }: { $direction?: SortDirection | boolean | null }) => {
    if (typeof $direction === 'boolean') {
      // eslint-disable-next-line no-console
      console.warn(
        'From FoundryUI Table: Passing a boolean to the `direction` prop on `SortIcon` is deprecated. Use the `Table.SortDirection` enum instead.',
      );
    }
    return css`
      margin-left: 1em;
      fill: white;
      width: 1em;
      transition: transform 0.2s, opacity 0.5s;
      opacity: ${$direction === null || $direction === SortDirection.noSort ? 0 : 1};
      transform: rotate(
        ${$direction === true || $direction === SortDirection.ascending ? 0 : 180}deg
      );
    `;
  }};
`;

const CellContainer = styled(StyledBaseDiv)`
  display: flex;
  padding: 0.5em 0;
`;

/** Start of variables */

const defaultCollapsed: Record<string, string> = {};

// Default expansion column added if there isn't one
const collapsedExpandedIconColumn = {
  name: '',
  sortable: false,
  width: '1em',
};

// Keyboard listener required for a11y on the clickable span
const onKeyPress = (evt: React.KeyboardEvent<HTMLSpanElement>) => {
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault();
    (evt.target as any).click();
  }
};

// Supporting component used for the collapse icon by default in the Table
const ExpansionIcon: React.FunctionComponent<InternalExpansionIconProps> = ({
  isCollapsed,
  groupHeaderPosition,
  onClick,
}: InternalExpansionIconProps) => {
  const expanded = groupHeaderPosition === 'above' ? mdiChevronDown : mdiChevronUp;
  const path = isCollapsed ? mdiChevronRight : expanded;

  const handleEventWithAnalytics = useAnalytics();

  const handleClick = (e: any) =>
    handleEventWithAnalytics('ExpansionIcon', onClick, isCollapsed ? 'expand' : 'collapse', e, {
      name: 'ExpansionIcon',
    });

  return (
    <StyledExpansionIconSpan
      tabIndex={0}
      onClick={handleClick}
      role="button"
      onKeyPress={onKeyPress}
    >
      <Icon path={path} size="1em" />
    </StyledExpansionIconSpan>
  );
};

export const ExpansionIconColumnName = '__EXPANSION_COLUMN__';

// TODO: Add the table width observer to a container which fills the area, so the table can grow
// once there is enough room for it to do so (if the table itself isn't full width)
// TODO: Add window width media query to complement the table width media query API

const Table = ({
  columnGap = '1em',
  columns,
  areGroupsCollapsible = false,
  data = [],
  defaultSort = { sortedColumnKey: undefined, direction: SortDirection.noSort },
  groupHeaderPosition = 'above',
  expansionIconComponent,
  minWidthBreakpoint = 640,
  sortGroups = false,

  StyledCell = Cell,
  StyledContainer = TableContainer,
  StyledGroupLabelRow = GroupRow,
  StyledHeader = Header,
  StyledHeaderCell = HeaderCell,
  StyledResponsiveHeaderCell = ResponsiveHeaderCell,
  StyledRow = Row,
  StyledFooter = Footer,
  StyledFooterCell = FooterCell,
  StyledCellContainer = CellContainer,

  cellProps = {},
  containerProps = {},
  groupLabelRowProps = {},
  headerProps = {},
  headerCellProps = {},
  responsiveHeaderCellProps = {},
  rowProps = {},

  containerRef,
  groupLabelRowRef,
  headerRef,
}: TableProps): JSX.Element => {
  // Convert defaultSort argument if provided in the deprecated form [key, bool]
  if (Array.isArray(defaultSort)) {
    // eslint-disable-next-line no-console
    console.warn(
      'From FoundryUI Table: Passing `defaultSort` prop as type [string, boolean] is deprecated. Instead, pass an argument of type `Table.SortState`.',
    );
    let direction: SortDirection;

    if (defaultSort[0] === '') {
      direction = SortDirection.noSort;
    } else {
      direction = defaultSort[1] ? SortDirection.ascending : SortDirection.descending;
    }
    defaultSort = {
      direction,
      sortedColumnKey: defaultSort[0],
    };
  }

  const [sortedData, setSortedData] = useState(data);
  const [sortState, setSortState] = useState<SortState>(defaultSort);
  const [collapsedGroups, setCollapsedGroups] = useState(defaultCollapsed);
  const { ref, width = Infinity } = useResizeObserver({ box: 'border-box' });

  const usingGroups: boolean = data && data.length > 0 && Array.isArray(data[0]);
  const copiedColumns = { ...columns }; // Shallow copy so not to manipulate props
  if (areGroupsCollapsible && !copiedColumns[ExpansionIconColumnName]) {
    copiedColumns[ExpansionIconColumnName] = collapsedExpandedIconColumn;
  }

  // this builds the string from the columns
  const columnWidths = Object.values(copiedColumns)
    .map((col: Column) => {
      if (col.minTableWidth && width <= col.minTableWidth) {
        return '0px';
      }
      return col.width || '1fr';
    })
    .join(' ');

  /**
   * Toggles a group's collapse state
   * @param key
   */
  const toggleGroupCollapse = (key: string) => {
    const group = collapsedGroups[key];

    // Make a copy of the dictionary-like object. Because this object
    // doesn't have nested objects, a shallow copy is fine
    const temp = { ...collapsedGroups };
    if (group) {
      delete temp[key];
    } else {
      temp[key] = key;
    }

    setCollapsedGroups(temp);
  };

  /**
   * A compare function that returns a comparison integer (1 or -1).
   * Used to compare the values at one column key across two different rows when sorting.
   */
  const compareEntries = (
    entry1: any,
    entry2: any,
    column: Column,
    sortDirection: SortDirection,
  ) => {
    // If this column has a sort custom sort function, use it.
    if (column && Object.prototype.hasOwnProperty.call(column, 'sortFunction')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
      const customComparison = column.sortFunction(entry1, entry2);
      if (sortDirection === SortDirection.ascending) {
        return customComparison ? -1 : 1;
      }
      return customComparison ? 1 : -1;
    }

    // No sort function, use default comparison operator.
    if (typeof entry1 === 'string' && typeof entry2 === 'string') {
      const comparison =
        sortDirection === SortDirection.ascending
          ? entry1.toLocaleLowerCase() < entry2.toLocaleLowerCase()
          : entry1.toLocaleLowerCase() > entry2.toLocaleLowerCase();
      return comparison ? -1 : 1;
    }

    const comparison =
      sortDirection === SortDirection.ascending ? entry1 < entry2 : entry1 > entry2;
    return comparison ? -1 : 1;
  };

  /**
   * Sorts the data in the table. If the table is using groups, group contents are sorted.
   * If the group order is chosen to be sorted as well, the group contents are sorted, followed
   * by the sorting of the groups based on the first element in the group
   * @param key
   * @param newDirection
   */
  const onSort = ({ sortedColumnKey: key, direction: newDirection }: SortState) => {
    setSortState({ sortedColumnKey: key, direction: newDirection });
    setCollapsedGroups(defaultCollapsed);

    // no sort, reset data to passed-in data prop
    if (key === undefined || newDirection === SortDirection.noSort) {
      setSortedData(data);
      return;
    }

    // Shallow copy the data to keep `data` prop un-mutated.
    const localData = [...data];

    // If the first element of the data is not an array, then we do not have groups
    if (!Array.isArray(localData[0])) {
      // No groups, sort all data
      localData.sort((row1: any, row2: any) =>
        compareEntries(row1[key], row2[key], copiedColumns[key], newDirection),
      );
    } else {
      // Shallow copy each group
      for (let groupIndex = 0; groupIndex < localData.length; groupIndex++) {
        localData[groupIndex] = [...(localData[groupIndex] as RowEntry[])];
      }

      // Sort the content of each group
      (localData as Array<Array<RowEntry>>).forEach(group => {
        group.sort((row1: any, row2: any) =>
          compareEntries(row1[key], row2[key], copiedColumns[key], newDirection),
        );
      });

      // Sort the groups
      if (sortGroups) {
        (localData as Array<Array<RowEntry>>).sort(
          (group1: Array<RowEntry>, group2: Array<RowEntry>) =>
            compareEntries(group1[0][key], group2[0][key], copiedColumns[key], newDirection),
        );
      }
    }

    setSortedData(localData);
  };

  const handleEventWithAnalytics = useAnalytics();
  const handleOnSort = (sort: SortState) =>
    handleEventWithAnalytics('Table', () => onSort(sort), 'onSort', sort, { containerProps });

  useEffect(() => {
    handleOnSort(sortState);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const getNewSortState = (key: string): SortState => ({
    sortedColumnKey: key,
    // If we're changing sort state of an already-sorted column, cycle through direction. Otherwise, start at ascending.
    direction:
      sortState.sortedColumnKey === key ? (sortState.direction + 1) % 3 : SortDirection.ascending,
  });

  /**
   * Creates a cell to render
   * @param {CellOptions} options - The options used when building a cell
   * @param {any} options.RenderedCell - The component used as the cell
   * @param {string} options.headerColumnKey - The header column key for the cell
   * @param {boolean} options.breakPointHit - If the breakpoint has been hit for width
   * @param {RowEntry} options.row - the data for the row, each cell should be able to the row's data
   * @param {number} options.index - The index of the cell in the row
   * @param {number} options.indexModifier - Used only when creating cells in a group. Used to account for group labels
   * @param {any} options.CollapseExpandedIcon - Component to be used for the collapse icon. Only used for collapsible group label cells
   * @param {number} options.groupIndex - The index of the group. Used only when creating cells as part of a group
   * @param {boolean} options.isCollapsed - Used when creating cells with a CollapseExpandedIcon
   * @param {string} options.groupLabelDataString - The stringified version of the group label row
   * @param {any} options.cellProps - Props to pass through to RenderedCell
   */
  const createCell = ({
    RenderedCell,
    headerColumnKey,
    breakPointHit,
    row,
    index,
    indexModifier = 0,
    CollapseExpandedIcon,
    groupIndex,
    isCollapsed = false,
    groupLabelDataString,
    cellProps: cellPropsInput,
  }: CellOptions): JSX.Element | false => {
    return (
      (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) && (
        <StyledCellContainer>
          {columns[headerColumnKey].name !== '' &&
            width < minWidthBreakpoint &&
            !groupLabelDataString && (
              <StyledResponsiveHeaderCell
                onClick={() => {
                  handleOnSort(getNewSortState(headerColumnKey));
                }}
                sortable={copiedColumns[headerColumnKey].sortable}
                isSorted={
                  sortState.sortedColumnKey === headerColumnKey &&
                  sortState.direction !== SortDirection.noSort
                }
                {...responsiveHeaderCellProps}
              >
                {copiedColumns[headerColumnKey].name}
                <SortIcon
                  $direction={
                    sortState.sortedColumnKey && sortState.sortedColumnKey === headerColumnKey
                      ? sortState.direction
                      : SortDirection.noSort
                  }
                  path={mdiArrowDown}
                />
              </StyledResponsiveHeaderCell>
            )}

          <RenderedCell
            // all cells should have full access to all the data in the row
            {...row}
            index={index}
            groupIndex={groupIndex}
            reachedMinWidth={width < minWidthBreakpoint}
            key={`${headerColumnKey}${index + indexModifier}`}
            {...cellPropsInput}
          >
            {row && row[headerColumnKey]}
            {CollapseExpandedIcon &&
            usingGroups &&
            areGroupsCollapsible &&
            headerColumnKey === ExpansionIconColumnName ? (
              <CollapseExpandedIcon
                isCollapsed={isCollapsed}
                groupHeaderPosition={groupHeaderPosition}
                onClick={() => {
                  toggleGroupCollapse((groupLabelDataString || JSON.stringify(row)) + groupIndex);
                }}
              />
            ) : null}
          </RenderedCell>
        </StyledCellContainer>
      )
    );
  };

  /**
   * Creates groups to be rendered within the Table.
   */
  const createGroups = () => {
    // Generate groupings - Note that we are making shallow copies of the arrays so that we do not
    // modify the props directly since this is an Array of Arrays.
    return [...(sortedData as Array<Array<RowEntry>>)].map(
      (group: Array<RowEntry>, idx: number) => {
        const groupLabelIndex: number = group.findIndex(grp => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return grp.isGroupLabel === true;
        });

        // Copy to avoid manipulating props directly
        const groupCopy = [...group];

        // Get the group label data. This is to be used to generate the group 'header'
        const groupLabelData = groupLabelIndex >= 0 ? groupCopy[groupLabelIndex] : undefined;

        // Stringify the object one time to save cpu cycles later.
        const groupLabelDataString = JSON.stringify(groupLabelData);

        // Get index modifier for creating the rows of the data. Everything group element's index
        // should be increased by 1 for all labels that are above the group
        const indexModifier = groupHeaderPosition === 'above' ? 1 : 0;
        const isCollapsed = !!collapsedGroups[groupLabelDataString + idx];

        // Generate the rows for this group
        const rows = groupCopy.map((row: RowEntry, index: number) => {
          const RenderedRow = row.rowComponent || StyledRow;
          if (index === groupLabelIndex) return null;

          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - TS2604: JSX element type does not have any construct or call signatures
            <RenderedRow
              columnGap={columnGap}
              columnWidths={columnWidths}
              rowNum={index + indexModifier}
              key={`row${JSON.stringify(row) + index}`}
              reachedMinWidth={width < minWidthBreakpoint}
              isCollapsed={areGroupsCollapsible && isCollapsed}
              {...row}
              {...rowProps}
            >
              {Object.keys(copiedColumns).map(headerColumnKey => {
                const RenderedCell = copiedColumns[headerColumnKey].cellComponent || StyledCell;
                const breakPointHit =
                  width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);

                const options: CellOptions = {
                  RenderedCell,
                  headerColumnKey,
                  breakPointHit,
                  row,
                  index,
                  indexModifier,
                  groupIndex: idx,
                  isCollapsed,
                };
                // Declaring each cell of the row
                return (
                  (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) &&
                  createCell(options)
                );
              })}
            </RenderedRow>
          );
        });

        // Remove the null entered for group label if it exists
        if (groupLabelIndex >= 0) {
          rows.splice(groupLabelIndex, 1);
        }

        // Check to see if a group label should be created and inserted into the row
        if (groupLabelData) {
          const index = indexModifier === 0 ? rows.length : 0;
          const RenderedRow = groupLabelData.rowComponent || StyledGroupLabelRow;
          const CollapseExpandedIcon = expansionIconComponent || ExpansionIcon;
          const label = (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - TS2604: JSX element type does not have any construct or call signatures
            <RenderedRow
              columnGap={columnGap}
              columnWidths={columnWidths}
              rowNum={index}
              key={`row${groupLabelDataString}`}
              reachedMinWidth={width < minWidthBreakpoint}
              ref={groupLabelRowRef}
              {...groupLabelData}
              {...groupLabelRowProps}
            >
              {Object.keys(copiedColumns).map(headerColumnKey => {
                const RenderedCell = usingGroups
                  ? copiedColumns[headerColumnKey].groupCellComponent ||
                    copiedColumns[headerColumnKey].cellComponent ||
                    StyledCell
                  : copiedColumns[headerColumnKey].cellComponent || StyledCell;
                const breakPointHit =
                  width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);

                const options = {
                  breakPointHit,
                  RenderedCell,
                  headerColumnKey,
                  row: groupLabelData,
                  groupLabelDataString,
                  index,
                  groupIndex: idx,
                  CollapseExpandedIcon,
                  isCollapsed,
                  cellProps,
                };
                // Create each cell for the row
                return (
                  (!copiedColumns[headerColumnKey].minTableWidth || breakPointHit) &&
                  createCell(options)
                );
              })}
            </RenderedRow>
          );

          // Place the group label at the appropriate index to get rendered
          if (index === 0) {
            rows.splice(0, 0, label);
          } else {
            rows.push(label);
          }
        }

        return <tbody key={`group${idx}`}>{rows}</tbody>;
      },
    );
  };

  /**
   * Generates the rows that appear in the Table
   */
  const createRows = () => {
    // If there are groups, create the groups using special logic
    if (usingGroups) {
      return createGroups();
    }

    return (
      <tbody>
        {(sortedData as Array<RowEntry>).map((row: RowEntry, index: number) => {
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
              {...row}
              {...rowProps}
            >
              {Object.keys(copiedColumns).map(headerColumnKey => {
                const RenderedCell = copiedColumns[headerColumnKey].cellComponent || StyledCell;
                const breakPointHit =
                  width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
                // Create each cell of the row
                return createCell({ RenderedCell, headerColumnKey, breakPointHit, row, index });
              })}
            </RenderedRow>
          );
        })}
      </tbody>
    );
  };

  const hasFooter = Object.values(copiedColumns)
    // this table has a footer if any of the columns have footerContent
    .some(col => {
      return (
        Object.prototype.hasOwnProperty.call(col, 'footerContent') &&
        col.footerContent !== null && // isn't null
        col.footerContent !== undefined &&
        col.footerContent !== ''
      );
    });

  // Table return
  return (
    <StyledContainer
      ref={mergeRefs<HTMLTableElement>([ref, containerRef])}
      reachedMinWidth={width < minWidthBreakpoint}
      {...containerProps}
    >
      <thead>
        {width > minWidthBreakpoint && (
          <StyledHeader
            columnGap={columnGap}
            columnWidths={columnWidths}
            ref={headerRef}
            {...headerProps}
          >
            {Object.keys(copiedColumns).map((headerColumnKey: string) => {
              const RenderedHeaderCell =
                copiedColumns[headerColumnKey].headerCellComponent || StyledHeaderCell;
              const breakpointHit =
                width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);

              // columns.map return
              return (
                (!copiedColumns[headerColumnKey].minTableWidth || breakpointHit) && (
                  <RenderedHeaderCell
                    key={headerColumnKey}
                    onClick={() => handleOnSort(getNewSortState(headerColumnKey))}
                    sortable={copiedColumns[headerColumnKey].sortable}
                    isSorted={
                      sortState.sortedColumnKey === headerColumnKey &&
                      sortState.direction !== SortDirection.noSort
                    }
                    {...headerCellProps}
                  >
                    {copiedColumns[headerColumnKey].name}
                    <SortIcon
                      $direction={
                        sortState.sortedColumnKey && sortState.sortedColumnKey === headerColumnKey
                          ? sortState.direction
                          : SortDirection.noSort
                      }
                      path={mdiArrowDown}
                    />
                  </RenderedHeaderCell>
                )
              );
            })}
          </StyledHeader>
        )}
      </thead>
      {createRows()}
      <tfoot>
        {width > minWidthBreakpoint && hasFooter && (
          <StyledFooter columnGap={columnGap} columnWidths={columnWidths}>
            {Object.keys(copiedColumns).map((headerColumnKey: string, index: number) => {
              const RenderedFooterCell = StyledFooterCell;
              const breakpointHit =
                width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);
              return (
                (!copiedColumns[headerColumnKey].minTableWidth || breakpointHit) && (
                  <RenderedFooterCell key={`f${index}`}>
                    {copiedColumns[headerColumnKey].footerContent}
                  </RenderedFooterCell>
                )
              );
            })}
          </StyledFooter>
        )}
      </tfoot>
    </StyledContainer>
  );
};

Table.Container = TableContainer;
Table.Header = Header;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.GroupRow = GroupRow;
Table.Cell = Cell;
/**
 * @deprecated use Table.ResponsiveTitle
 */
Table.Title = ResponsiveHeaderCell;
Table.ResponsiveHeaderCell = ResponsiveHeaderCell;
Table.CellContainer = CellContainer;
Table.ExpansionIconColumnName = ExpansionIconColumnName;
Table.SortDirection = SortDirection;

export default Table;
