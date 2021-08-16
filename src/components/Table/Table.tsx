import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { mdiArrowDown, mdiChevronDown, mdiChevronRight, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import { Span, Table as TableElement, TD, TH, TR } from '../../htmlElements';
import {
  CellOptions,
  columnTypes,
  InternalExpansionIconProps,
  RowProps,
  TableProps,
} from './types';
import { useTheme } from '../../context';
import { mergeRefs } from '../../utils/refs';

type collapsedState = Record<string, string>;

/** Start of styled components */

const StyledExpansionIconSpan = styled(Span)`
  cursor: pointer;
`;

export const TableContainer = styled(TableElement)`
  ${({ reachedMinWidth }: { reachedMinWidth?: boolean }) => {
    const { colors } = useTheme();
    return `
      width: ${reachedMinWidth ? '100%' : 'auto'};
      background-color: ${colors.background};
      border-collapse: collapse;

      border-radius: 8px;
      overflow: hidden;
    `;
  }}
`;

export const Header = styled(TR)`
  ${({ columnGap, columnWidths }: RowProps) => {
    const { colors } = useTheme();
    return `
      display: grid;
      grid-template-columns: ${columnWidths};
      padding: 0rem 2rem;
      column-gap: ${columnGap};
      user-select: none;

      background-color: ${colors.primary};
      color: white;
    `;
  }}
`;

export const HeaderCell = styled(TH)`
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

export const Footer = styled(TR)`
  ${({ columnGap, columnWidths }: RowProps) => {
    const { colors } = useTheme();
    return `
      display: grid;
      grid-template-columns: ${columnWidths};
      padding: 0rem 2rem;
      column-gap: ${columnGap};
      user-select: none;

      background-color: ${colors.grayXlight};
      color: ${colors.black};
    `;
  }}
`;

export const FooterCell = styled(TH)`
  display: flex;
  flex-flow: row;
  cursor: pointer;
  padding: 1rem 0rem 1rem 1rem;
  margin-left: -1rem;

  transition: background-color 0.5s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const ResponsiveTitle = styled(Span)`
  ${({ sortable }: { sortable: boolean }) => {
    const { colors } = useTheme();
    return `
      color: ${colors.primary};
      padding: 0.5rem;
      user-select: none;
      cursor: pointer;
      margin-right: .5rem;
      background-color: rgba(0,0,0,0.05);
      border-radius: .5rem;
      ${sortable ? '' : 'pointer-events: none;'}
    `;
  }}
`;

export const Row = styled(TR)`
  ${({ columnGap, columnWidths, reachedMinWidth, isCollapsed = false }: RowProps) => {
    const { colors } = useTheme();
    return `
      display: grid;
      grid-template-columns: ${reachedMinWidth ? '100%' : columnWidths};
      padding: ${reachedMinWidth ? '1rem' : '0rem'} 2rem;
      row-gap: .5rem;
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

export const Cell = styled(TD)`
  display: block;
  padding: 1rem 0;
  word-break: break-word;
  hyphens: auto;
  width: unset;
`;

export const SortIcon = styled(Icon)`
  ${({ direction }: { direction?: boolean | null }) => `
    margin-left: 1rem;
    fill: white;
    width: 1rem;
    transition: transform .2s, opacity .5s;
    opacity: ${direction === null ? 0 : 1};
    transform: rotate(${direction ? 0 : 180}deg);
  `}
`;

/** Start of variables */

const defaultCollapsed: collapsedState = {};

// Default expansion column added if there isn't one
const collapsedExpandedIconColumn = {
  name: '',
  sortable: false,
  width: '1rem',
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
  return (
    <StyledExpansionIconSpan tabIndex={0} onClick={onClick} role="button" onKeyPress={onKeyPress}>
      <Icon path={path} size="1rem" />
    </StyledExpansionIconSpan>
  );
};

export const ExpansionIconColumnName = '__EXPANSION_COLUMN__';

// TODO: Add the table width observer to a container which fills the area, so the table can grow
// once there is enough room for it to do so (if the table itself isn't full width)
// TODO: Add window width media query to complement the table width media query API

const Table = ({
  columnGap = '1rem',
  columns,
  areGroupsCollapsible = false,
  data = [],
  defaultSort = ['', false], // key, direction
  groupHeaderPosition = 'above',
  expansionIconComponent,
  minWidthBreakpoint = 640,
  sortGroups = false,

  StyledCell = Cell,
  StyledContainer = TableContainer,
  StyledGroupLabelRow = GroupRow,
  StyledHeader = Header,
  StyledHeaderCell = HeaderCell,
  StyledRow = Row,
  StyledFooter = Footer,
  StyledFooterCell = FooterCell,
  cellProps = {},
  containerProps = {},
  groupLabelRowProps = {},
  headerProps = {},
  headerCellProps = {},
  rowProps = {},

  containerRef,
  groupLabelRowRef,
  headerRef,
  headerCellRef,
}: TableProps) => {
  const [sortedData, sortData] = useState(data);
  const [sortMethod, setSortMethod] = useState(defaultSort);
  const [collapsedGroups, setCollapsedGroups] = useState(defaultCollapsed);
  const { ref, width = Infinity } = useResizeObserver();

  const usingGroups: boolean = data && data.length > 0 && Array.isArray(data[0]);
  const copiedColumns = { ...columns }; // Shallow copy so not to manipulate props
  if (areGroupsCollapsible && !copiedColumns[ExpansionIconColumnName]) {
    copiedColumns[ExpansionIconColumnName] = collapsedExpandedIconColumn;
  }

  // this builds the string from the columns
  const columnWidths = Object.values(copiedColumns)
    .map((col: columnTypes[0]) => {
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
    const temp: collapsedState = { ...collapsedGroups };
    if (group) {
      delete temp[key];
    } else {
      temp[key] = key;
    }

    setCollapsedGroups(temp);
  };

  /**
   * Sorts the data in the table. If the table is using groups, group contents are sorted.
   * If the group order is chosen to be sorted as well, the group contents are sorted, followed
   * by the sorting of the groups based on the first element in the group
   * @param key
   * @param newDirection
   */
  const onSort = (key: string, newDirection: boolean) => {
    // If the first element of the data is not an array, then we do not have groups
    if (!Array.isArray(data[0])) {
      data.sort((a: any, b: any) => {
        if (
          copiedColumns[key] &&
          Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
          return copiedColumns[key].sortFunction(a[key], b[key]) ? -1 : 1;
        }
        const comparison = newDirection ? a[key] < b[key] : a[key] > b[key];
        return comparison ? -1 : 1;
      });
    } else {
      // Cast data to the appropariate type and iterate over each group, sorting their content
      (data as Array<Array<columnTypes>>).forEach(group => {
        group.sort((a: any, b: any) => {
          if (
            copiedColumns[key] &&
            Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')
          ) {
            if (a.isGroupLabel || b.isGroupLabel) return 0;
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
          if (
            copiedColumns[key] &&
            Object.prototype.hasOwnProperty.call(copiedColumns[key], 'sortFunction')
          ) {
            if (a.isGroupLabel || b.isGroupLabel) return 0;
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

  /**
   * Creates a cell to render
   * @param {CellOptions} options - The options used when building a cell
   * @param {any} options.RenderedCell - The component used as the cell
   * @param {string} options.headerColumnKey - The header column key for the cell
   * @param {boolean} options.breakPointHit - If the breakpoint has been hit for width
   * @param {columnTypes} options.row - the data for the row, each cell should be able to the row's data
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
        <RenderedCell
          // all cells should have full access to all the data in the row
          {...row}
          index={index}
          groupIndex={groupIndex}
          reachedMinWidth={width < minWidthBreakpoint}
          key={`${headerColumnKey}${index + indexModifier}`}
          {...cellPropsInput}
        >
          {width < minWidthBreakpoint && (
            <ResponsiveTitle
              onClick={() => {
                onSort(headerColumnKey, headerColumnKey === sortMethod[0] ? !sortMethod[1] : true);
              }}
              sortable={copiedColumns[headerColumnKey].sortable}
            >
              {copiedColumns[headerColumnKey].name}
              <SortIcon
                direction={sortMethod[0] === headerColumnKey ? sortMethod[1] : null}
                path={mdiArrowDown}
              />
            </ResponsiveTitle>
          )}
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
      )
    );
  };

  /**
   * Creates groups to be rendered within the Table.
   */
  const createGroups = () => {
    // Generate groupings - Note that we are making shallow copies of the arrays so that we do not
    // modify the props directly since this is an Array of Arrays.
    return [...(sortedData as Array<Array<columnTypes>>)].map(
      (group: Array<columnTypes>, idx: number) => {
        const groupLabelIndex: number = group.findIndex(grp => {
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
        const rows = groupCopy.map((row: columnTypes, index: number) => {
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
              {...rowProps}
            >
              {Object.keys(copiedColumns).map(headerColumnKey => {
                const RenderedCell = copiedColumns[headerColumnKey].cellComponent || StyledCell;
                const breakPointHit =
                  width > (copiedColumns[headerColumnKey].minTableWidth || Infinity);

                const options = {
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

  // hasFooter
  const hasFooter = Object.values(copiedColumns) // get the values of each column object
    .some(col => {
      // if any item here returns true for the below conditional
      return (
        Object.prototype.hasOwnProperty.call(col, 'footerContent') && // has footerContent attribute
        col.footerContent !== null && // isn't null
        col.footerContent !== undefined && // isn't undefined
        col.footerContent !== ''
      ); // isn't empty string
    });

  // Table return
  return (
    <StyledContainer
      ref={mergeRefs([ref, containerRef])}
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
                    onClick={() => {
                      onSort(
                        headerColumnKey,
                        headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                      );
                    }}
                    sortable={copiedColumns[headerColumnKey].sortable}
                    ref={headerCellRef}
                    {...headerCellProps}
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
      {createRows()}
      {(
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
      )}
    </StyledContainer>
  );
};

Table.Container = TableContainer;
Table.Header = Header;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.GroupRow = GroupRow;
Table.Cell = Cell;
Table.Title = ResponsiveTitle;
Table.ExpansionIconColumnName = ExpansionIconColumnName;

export default Table;
