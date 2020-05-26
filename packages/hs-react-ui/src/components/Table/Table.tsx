import React, { useState, useEffect } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import Icon from '@mdi/react';
import { mdiArrowDown } from '@mdi/js';

import colors from '../../enums/colors';

export interface columnTypes {
  [index: string]: {
    name?: string;
    width?: string;
    minTableWidth?: number;
    sortable?: boolean;
    sortFunction?: Function;

    cellComponent?: any;
    rowComponent?: any;
    headerCellComponent?: any;
  };
}

export type TableProps = {
  columnGap?: string;
  defaultSort?: [string, boolean]; // key, direction
  data?: columnTypes[];
  columns: columnTypes;

  minWidthBreakpoint?: number;

  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledHeaderCell?: string & StyledComponentBase<any, {}>;
  StyledRow?: string & StyledComponentBase<any, {}>;
  StyledCell?: string & StyledComponentBase<any, {}>;
};

export type RowProps = {
  columnGap: string;
  columnWidths: string;
  rowNum?: number;
  reachedMinWidth?: boolean;
};

export const TableContainer = styled.table`
  ${({ reachedMinWidth }: { reachedMinWidth?: boolean }) => `
    width: ${reachedMinWidth ? '100%' : 'auto'};
    font-family: Montserrat;
    background-color: ${colors.background};
    border-collapse: collapse;

    border-radius: 8px;
    overflow: hidden;
  `}
`;

export const Header = styled.th`
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

export const HeaderCell = styled.td`
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
  ${({ columnGap, columnWidths, reachedMinWidth }: RowProps) => `
    display: grid;
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

// TODO: Add the table width observer to a container which fills the area, so the table can grow
//   once there is enough room for it to do so (if the table itself isn't full width)
// TODO: Add window media query

export default ({
  columnGap = '1rem',
  defaultSort = ['', false], // key, direction
  data = [],
  columns,

  minWidthBreakpoint = 640,

  StyledContainer = TableContainer,
  StyledHeader = Header,
  StyledHeaderCell = HeaderCell,
  StyledRow = Row,
  StyledCell = Cell,
}: TableProps) => {
  const [sortedData, sortData] = useState(data);
  const [sortMethod, setSortMethod] = useState(defaultSort);

  const { ref, width = Infinity } = useResizeObserver();

  // this builds the string from the columns
  const columnWidths = Object.values(columns)
    .map((col: columnTypes) => {
      if (col.minTableWidth && width <= col.minTableWidth) {
        return '0px';
      }
      return col.width || '1fr';
    })
    .join(' ');

  const onSort = (key: string, newDirection: boolean) => {
    sortData(
      data.sort((a: any, b: any) => {
        if (columns[key] && Object.prototype.hasOwnProperty.call(columns[key], 'sortFunction')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore Cannot invoke an object which is possibly 'undefined'.ts(2722)
          return columns[key].sortFunction(a[key], b[key]) ? -1 : 1;
        }
        const comparison = newDirection ? a[key] < b[key] : a[key] > b[key];
        return comparison ? -1 : 1;
      }),
    );
    setSortMethod([key, newDirection]);
  };

  useEffect(() => {
    onSort(sortMethod[0], sortMethod[1]);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer ref={ref} reachedMinWidth={width < minWidthBreakpoint}>
      {width > minWidthBreakpoint && (
        <StyledHeader columnGap={columnGap} columnWidths={columnWidths}>
          {Object.keys(columns).map((headerColumnKey: string) => {
            const RenderedHeaderCell =
              columns[headerColumnKey].headerCellComponent || StyledHeaderCell;
            return (
              (!columns[headerColumnKey].minTableWidth ||
                width > columns[headerColumnKey].minTableWidth) && (
                <RenderedHeaderCell
                  key={headerColumnKey}
                  onClick={() => {
                    onSort(
                      headerColumnKey,
                      headerColumnKey === sortMethod[0] ? !sortMethod[1] : true,
                    );
                  }}
                  sortable={columns[headerColumnKey].sortable !== false}
                >
                  {columns[headerColumnKey].name}
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
      {sortedData.map((row: columnTypes, index: number) => {
        // map over the rows
        const RenderedRow = row.rowComponent || StyledRow;
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
            {Object.keys(columns).map(headerColumnKey => {
              const RenderedCell = columns[headerColumnKey].cellComponent || StyledCell;
              return (
                (!columns[headerColumnKey].minTableWidth ||
                  width > columns[headerColumnKey].minTableWidth) && (
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
                        sortable={columns[headerColumnKey].sortable !== false}
                      >
                        {columns[headerColumnKey].name}
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
    </StyledContainer>
  );
};
